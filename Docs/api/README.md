# NESAm Registration API

**NIT Erode Students Alumni Members — Backend Registration Flow**

This document covers the complete backend API for the NESAm member registration wizard. It describes what each endpoint does, why it exists, what data it reads and writes, and how all seven endpoints connect to form a complete, secure registration flow.

---

## Contents

1. [Project overview](#1-project-overview)
2. [System architecture](#2-system-architecture)
3. [Database reference](#3-database-reference)
4. [Authentication model](#4-authentication-model)
5. [The eligibility decision tree](#5-the-eligibility-decision-tree)
6. [API reference](#6-api-reference)
   - [API 1 — Initiate](#api-1--post-apiv1publicregistrationinitiate)
   - [API 2 — Send OTP](#api-2--post-apiv1publicregistrationsend-otp)
   - [API 3 — Verify OTP](#api-3--post-apiv1publicregistrationverify-otp)
   - [API 4 — Prefill](#api-4--get-apiv1publicregistrationprefill)
   - [API 5 — Fee Preview](#api-5--get-apiv1publicregistrationfee-preview)
   - [API 6 — Save Details](#api-6--patch-apiv1publicregistrationdetails)
   - [API 7 — Submit](#api-7--post-apiv1publicregistrationsubmit)
7. [Fee calculation logic](#7-fee-calculation-logic)
8. [Schema changes (v2.1 migration)](#8-schema-changes-v21-migration)
9. [Error handling](#9-error-handling)
10. [Running locally](#10-running-locally)
11. [Testing](#11-testing)
12. [Security notes](#12-security-notes)
13. [Frontend integration guide](#13-frontend-integration-guide)

---

## 1. Project Overview

NESAm is the membership management system for the NIT Erode alumni association. Before a member can access the member portal, they must complete a registration wizard that:

- Verifies they are a current LIFE or PATRON member of the alumni association
- Confirms their email via OTP
- Collects their contact details, date of birth, and nominee information
- Calculates their membership fee and advance DFC deposit
- Creates their user account, membership record, and payment record in a single atomic transaction

The backend for this flow is a **Spring Boot 3 + PostgreSQL** application. The frontend wizard is a React + Vite application at `http://localhost:5173/register`.

---

## 2. System Architecture

```
Frontend (React, localhost:5173)
    │
    │  REST/JSON over HTTP
    ▼
Backend (Spring Boot, localhost:8080)
    │
    ├── Spring Security (JWT filter + OneTimeToken service)
    ├── Registration Controller  ──► Registration Service
    │                                     │
    │                                     ├── Fee Calculation Service
    │                                     ├── OTP Service (OTT wrapper)
    │                                     └── JWT Service
    │
    └── PostgreSQL (schema v2.1)
```

### Key external integrations

| Integration | Dev environment | Production |
|-------------|----------------|------------|
| OTP delivery | `ConsoleOttHandler` — logs OTT UUID to stdout | Twilio / AWS SES |
| Payment | Mock — `paymentReference = "MOCK-PAY-001"` always succeeds | Razorpay or similar |
| Alumni master | Read-only — no writes to `aa_alumni_master` | Synced from AA system |

---

## 3. Database Reference

The registration flow touches the following tables. The alumni master (`aa_alumni_master`) is treated as **read-only** — no registration API writes to it.

| Table | Role in registration |
|-------|---------------------|
| `aa_alumni_master` | Source of truth — eligibility check, identity, membership type |
| `nesam_applications` | One row per registration attempt; tracks status (STARTED → COMPLETED) |
| `nesam_application_details` | 1:1 with applications; stores partial and complete form data |
| `nesam_application_payments` | Payment record linked to the application |
| `nesam_users` | Created at final submit; the member's login identity |
| `nesam_user_addresses` | Correspondence address for the user |
| `nesam_members` | The membership record; membership number, tier, status |
| `nesam_member_nominees` | One or more nominees per membership with percentage shares |
| `master_membership_fee_slabs` | Age-based membership fee lookup |
| `master_dfc_rate_slabs` | Age-based DFC rate lookup |
| `system_parameters` | Configuration values (discount percentages, founding window, DFC multiplier) |

### System parameters used in this flow

| Key | Purpose | Default |
|-----|---------|---------|
| `PROGRAM_LAUNCH_DATE` | Start of the founding member window | — |
| `FOUNDING_WINDOW_DAYS` | How many days after launch the founding window lasts | 90 |
| `ADVANCE_DFC_MULTIPLIER` | How many advance DFC events are collected at registration | 5 |
| `PATRON_DISCOUNT_PERCENT` | Fee discount for PATRON members | 0 |
| `FOUNDING_DISCOUNT_PERCENT` | Fee discount for FOUNDING members | 0 |
| `FOUNDING_PATRON_DISCOUNT_PERCENT` | Fee discount for FOUNDING + PATRON members | 0 |

---

## 4. Authentication Model

The registration flow uses two distinct token mechanisms:

### OneTimeToken (OTT) — for OTP verification

Spring Security's `OneTimeTokenService` generates a UUID token. In development this is printed to the console by `ConsoleOttHandler`. The frontend receives a 6-digit code (derived from the token) and the user types it in. When the user submits, the raw UUID is sent to `POST /verify-otp` as plain text.

OTTs are:
- Valid for **10 minutes**
- Single-use — consumed on first successful verification
- Automatically invalidated when a new one is generated for the same email

### REGISTRATION JWT — for wizard steps

After successful OTP verification, a signed JWT is issued with:

```json
{
  "sub": "member@example.com",
  "scope": "REGISTRATION",
  "iat": 1712345678,
  "exp": 1712432078
}
```

Note that `sub` is the **email address**, not a `nesam_user_id`. The user record does not exist until the final submit step.

This JWT is valid for **24 hours** and must be sent as:
```
Authorization: Bearer <token>
```

**Spring Security enforces scope:** A REGISTRATION JWT cannot call member endpoints. A MEMBER JWT (scope = MEMBER, issued by the login endpoint) cannot call registration endpoints.

---

## 5. The Eligibility Decision Tree

This is the most important logic in the entire registration flow. It runs in `POST /initiate` and determines whether an OTP is sent at all.

```
Email received
│
├─ 1. Query nesam_applications
│     WHERE email_id = :email AND status = 'STARTED'
│     │
│     ├─ FOUND ──────────────────────────────────────► PENDING_APPLICATION
│     │          (Do NOT check alumni table.             (Ask user to resume
│     │           Show resume modal immediately.)         or start fresh.)
│     │
│     └─ NOT FOUND
│           │
│           └─ 2. Query aa_alumni_master
│                 WHERE email_id = :email
│                 │
│                 ├─ NOT FOUND ───────────────────────► NOT_FOUND
│                 │              (Show "Alumni Record      (No OTP)
│                 │               Not Found" message.)
│                 │
│                 ├─ FOUND, membership_type = REGISTERED ► NOT_A_MEMBER
│                 │                    (Show "Association   (No OTP)
│                 │                     Membership         
│                 │                     Required" message.)
│                 │
│                 └─ FOUND, membership_type IN (LIFE, PATRON) ► ELIGIBLE
│                                       (Call POST /send-otp    (Send OTP)
│                                        immediately.)
```

**Why this order matters:**

The application table is checked first because an alumni record is never deleted (it is the system of record). A pending application always takes precedence — even if the alumni record has since been updated, the user should be able to resume their existing application.

The response is always HTTP 200 regardless of outcome. Returning 404 or 403 from this endpoint would allow an attacker to enumerate which email addresses exist in the alumni master.

---

## 6. API Reference

### Base URL

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:8080/api/v1` |
| Production | `https://api.nesam.org/api/v1` |

### Summary table

| # | Method | Path | Auth | Reads | Writes |
|---|--------|------|------|-------|--------|
| 1 | POST | `/public/registration/initiate` | None | `nesam_applications`, `aa_alumni_master` | — |
| 2 | POST | `/public/registration/send-otp` | None | — | — (OTT in-memory) |
| 3 | POST | `/public/registration/verify-otp` | None → issues JWT | OTT service | — |
| 4 | GET | `/public/registration/prefill` | JWT | `nesam_application_details`, `aa_alumni_master`, `system_parameters` | — |
| 5 | GET | `/public/registration/fee-preview` | JWT | `master_membership_fee_slabs`, `master_dfc_rate_slabs`, `system_parameters` | — |
| 6 | PATCH | `/public/registration/details` | JWT | `nesam_applications` | `nesam_applications`, `nesam_application_details` |
| 7 | POST | `/public/registration/submit` | JWT | All above | `nesam_users`, `nesam_user_addresses`, `nesam_application_payments`, `nesam_members`, `nesam_member_nominees` |

---

### API 1 — `POST /api/v1/public/registration/initiate`

**The registration gate.** Checks eligibility and returns a status code. Does not send an OTP.

#### Request

```http
POST /api/v1/public/registration/initiate
Content-Type: application/json

{
  "email": "kish.arumugam@example.com"
}
```

#### Response — always HTTP 200

```json
{
  "status": "ELIGIBLE",
  "pendingApplicationId": null,
  "pendingApplicationStartedAt": null,
  "message": "You are eligible. A verification code will be sent to your email."
}
```

#### Status values

| Status | Meaning | OTP sent? | Frontend action |
|--------|---------|-----------|----------------|
| `ELIGIBLE` | LIFE or PATRON member, no pending application | Call `/send-otp` next | Proceed to OTP entry screen |
| `NOT_FOUND` | Email not in alumni master | No | Show "Alumni Record Not Found" message |
| `NOT_A_MEMBER` | Found but membership_type = REGISTERED | No | Show "Association Membership Required" message |
| `PENDING_APPLICATION` | Existing STARTED application found | Call `/send-otp` next | Show resume modal, then proceed to OTP entry |

#### Errors

| Status | Condition |
|--------|-----------|
| 422 | Email field missing or not a valid email address |

---

### API 2 — `POST /api/v1/public/registration/send-otp`

**Sends (or resends) the OTP.** Called after `ELIGIBLE` or `PENDING_APPLICATION` from API 1. Also called when the user clicks "Resend OTP" — same endpoint, same logic.

#### Request

```http
POST /api/v1/public/registration/send-otp
Content-Type: application/json

{
  "email": "kish.arumugam@example.com"
}
```

#### Response

```json
{
  "success": true,
  "maskedEmail": "ki***@example.com",
  "expiresInSeconds": 600
}
```

#### Notes

- The previous OTP (if any) is automatically invalidated when a new one is generated
- `expiresInSeconds` (600 = 10 minutes) drives the countdown timer on the frontend
- **Rate limited:** Maximum 3 calls per email address per 10 minutes. Returns HTTP 429 if exceeded
- In development, check the Spring Boot console output for the OTT UUID

#### Errors

| Status | Condition |
|--------|-----------|
| 422 | Email field missing or invalid |
| 429 | Rate limit exceeded |

---

### API 3 — `POST /api/v1/public/registration/verify-otp`

**Validates the OTP and issues a REGISTRATION JWT.** This is the authentication gate for all subsequent wizard steps.

#### Request

```http
POST /api/v1/public/registration/verify-otp
Content-Type: text/plain

ea11a3b1-abc1-1234-5678-abcdef012345
```

The body is the raw OTT UUID (the 6-digit code shown to the user maps to this token internally).

#### Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "kish.arumugam@example.com",
  "applicationStatus": "NEW",
  "pendingApplicationId": null
}
```

The `token` must be stored by the frontend and sent as `Authorization: Bearer <token>` on all subsequent calls.

`applicationStatus` tells the frontend how to interpret the prefill data:
- `NEW` — fresh start, prefill from alumni master
- `PENDING_APPLICATION` — resume flow, prefill from saved application details

#### Errors

| Status | Condition |
|--------|-----------|
| 422 | OTP invalid, expired (>10 min), or already used |

---

### API 4 — `GET /api/v1/public/registration/prefill`

**Pre-populates the wizard with known data.** Called immediately after OTP verification. Reduces how much the user has to type.

#### Request

```http
GET /api/v1/public/registration/prefill
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response

```json
{
  "source": "ALUMNI_MASTER",
  "applicationId": null,
  "alumni": {
    "fullName": "Kish Arumugam",
    "email": "kish.arumugam@example.com",
    "graduatingYear": 2012,
    "department": "Mechanical Engineering",
    "isPatron": false,
    "isFounding": true
  },
  "savedContact": {
    "mobile": "9876543210",
    "line1": "42 Main Street",
    "line2": "Flat 3B",
    "city": "Erode",
    "state": "Tamil Nadu",
    "postalCode": "638316",
    "country": "India"
  },
  "savedDateOfBirth": "1990-05-15",
  "savedGender": "MALE",
  "savedNominee": null
}
```

#### Fields explained

| Field | Source (fresh) | Source (resume) |
|-------|---------------|-----------------|
| `alumni.fullName` | `aa_alumni_master.full_name` | Same |
| `alumni.isPatron` | `aa_alumni_master.membership_type = PATRON` | Same |
| `alumni.isFounding` | Computed from `system_parameters` | Same |
| `savedContact.*` | `aa_alumni_master.corress_*` fields | `nesam_application_details` |
| `savedDateOfBirth` | `aa_alumni_master.date_of_birth` | `nesam_application_details.date_of_birth` |
| `savedGender` | `aa_alumni_master.gender` | `nesam_application_details.gender` |
| `savedNominee.*` | null | `nesam_application_details.nominee_*` |

#### Errors

| Status | Condition |
|--------|-----------|
| 401 | JWT missing or malformed |
| 403 | JWT does not have REGISTRATION scope |

---

### API 5 — `GET /api/v1/public/registration/fee-preview`

**Calculates the exact amount the member will pay.** Called when the user enters or confirms their date of birth. All fee logic runs on the backend.

#### Request

```http
GET /api/v1/public/registration/fee-preview?dateOfBirth=1990-05-15
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response

```json
{
  "completedAge": 35,
  "ageSlab": "31 - 35 Years",
  "baseMembershipFee": 5000.00,
  "discountPercent": 10.00,
  "discountAmount": 500.00,
  "finalMembershipFee": 4500.00,
  "dfcPerEvent": 400.00,
  "advanceDfcMultiplier": 5,
  "advanceDfc": 2000.00,
  "totalPayable": 6500.00,
  "tierApplied": "FOUNDING",
  "slabSource": "AGE"
}
```

#### What `totalPayable` covers

| Component | Formula |
|-----------|---------|
| Final membership fee | `baseMembershipFee × (1 − discountPercent/100)` |
| Advance DFC | `dfcPerEvent × advanceDfcMultiplier` |
| **Total payable** | **`finalMembershipFee + advanceDfc`** |

The advance DFC is a security deposit held against future DFC events. It is not a recurring charge.

#### Errors

| Status | Condition |
|--------|-----------|
| 401 | JWT missing or malformed |
| 403 | JWT does not have REGISTRATION scope |
| 422 | Applicant is 60 or older, or no active fee slab exists for the computed age |

---

### API 6 — `PATCH /api/v1/public/registration/details`

**Auto-saves wizard form data after each step.** Partial update — only fields in the request body are written.

#### Request — first call (no applicationId yet)

```http
PATCH /api/v1/public/registration/details
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "applicationId": null,
  "mobile": "9876543210",
  "line1": "42 Main Street",
  "city": "Erode",
  "state": "Tamil Nadu",
  "postalCode": "638316",
  "country": "India"
}
```

#### Response

```json
{
  "applicationId": "123e4567-e89b-12d3-a456-426614174000",
  "status": "STARTED",
  "savedAt": "2026-03-15T10:30:00Z"
}
```

The frontend **must store `applicationId`** from this first response and include it in all subsequent PATCH calls.

#### Request — subsequent call (adding date of birth)

```json
{
  "applicationId": "123e4567-e89b-12d3-a456-426614174000",
  "dateOfBirth": "1990-05-15",
  "gender": "MALE"
}
```

#### Request — subsequent call (adding nominee)

```json
{
  "applicationId": "123e4567-e89b-12d3-a456-426614174000",
  "nomineeName": "Priya K",
  "nomineeRelationship": "SPOUSE",
  "nomineeEmail": "priya@example.com",
  "nomineeMobile": "9876500000"
}
```

#### How partial updates work

Only fields present in the JSON body are written to the database. A field that is omitted is not touched, even if it currently has a value in the database. This means the frontend can safely send only what changed on each step without risk of accidentally blanking previous steps' data.

#### Errors

| Status | Condition |
|--------|-----------|
| 401 | JWT missing or malformed |
| 403 | JWT lacks REGISTRATION scope, or `applicationId` belongs to a different user's email |

---

### API 7 — `POST /api/v1/public/registration/submit`

**The final step. Creates the membership in a single atomic transaction.**

If any step in the transaction fails (e.g. the nominee insert throws), the entire transaction rolls back — no partial state is committed to the database.

#### Request

```http
POST /api/v1/public/registration/submit
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "applicationId": "123e4567-e89b-12d3-a456-426614174000",
  "selfDeclarationAccepted": true,
  "nominees": [
    {
      "name": "Priya K",
      "relationship": "SPOUSE",
      "percentageShare": 100.00,
      "email": "priya@example.com",
      "mobile": "9876500000"
    }
  ],
  "paymentReference": "MOCK-PAY-001"
}
```

#### Response — HTTP 201

```json
{
  "success": true,
  "membershipNumber": "NES-2026-001",
  "membershipStatus": "ACTIVE",
  "nesamTier": "FOUNDING",
  "totalPaid": 6500.00,
  "message": "Welcome to NESAm! Your membership NES-2026-001 is now active."
}
```

#### What happens inside the transaction

```
1.  Validate: selfDeclarationAccepted = true
2.  Validate: nominees not empty, shares sum to 100%
3.  Validate: age < 60 (from saved date_of_birth)
4.  Validate: all required fields present in nesam_application_details
5.  CREATE nesam_users (or find existing by email)
6.  CREATE nesam_user_addresses (type = CORRESPONDENCE)
7.  UPDATE nesam_applications SET status = 'COMPLETED', completed_at = now()
8.  Re-calculate fee (FeeCalculationService)
9.  INSERT nesam_application_payments (status = SUCCESS, gateway = MOCK)
10. Compute membership tier
11. Generate membership number (NES-YYYY-NNN, sequential per year)
12. INSERT nesam_members (status = ACTIVE, enrollment_date = today)
13. INSERT nesam_member_nominees (one row per nominee)
```

#### After success

The frontend redirects the user to `/login`. The REGISTRATION JWT cannot be reused and should be cleared from `localStorage`. The user logs in normally to obtain a MEMBER-scoped JWT for the member portal.

#### Membership number format

`NES-{YYYY}-{NNN}` where:
- `YYYY` = the enrollment year (current year)
- `NNN` = zero-padded sequential count of members enrolled in that year (001, 002, …)

Example: The first member enrolled in 2026 gets `NES-2026-001`.

#### Nominee share validation

All nominee `percentageShare` values must sum to exactly `100.00`. A tolerance of ±0.01 is allowed for floating-point rounding. If two nominees each have 33.33%, the sum is 66.66% — this will fail validation. The frontend should enforce this in the UI before the user reaches the summary screen.

#### Errors

| Status | Condition |
|--------|-----------|
| 401 | JWT missing or malformed |
| 403 | JWT lacks REGISTRATION scope, or application belongs to a different user |
| 409 | Application already submitted, or user already has an active membership |
| 422 | selfDeclaration not accepted, nominees empty, shares ≠ 100%, age ≥ 60, or required fields missing |

---

## 7. Fee Calculation Logic

Fee calculation is implemented in `FeeCalculationService` and is the same logic used by both API 5 (preview) and API 7 (final submit). The two calls must always produce the same result — there should be no discrepancy between what the user saw on the preview screen and what is recorded in `nesam_application_payments`.

### Calculation steps

```
1. age = years between dateOfBirth and today (completed years, not rounded)

2. If age >= 60 → reject with 422

3. baseFee = master_membership_fee_slabs
       WHERE min_age <= age AND max_age >= age
         AND (valid_to IS NULL OR valid_to >= today)
         AND is_active = true

4. dfcPerEvent = master_dfc_rate_slabs
       WHERE min_age <= age AND max_age >= age
         AND (valid_to IS NULL OR valid_to >= today)
         AND is_active = true

5. multiplier = system_parameters['ADVANCE_DFC_MULTIPLIER'] (default 5)

6. isPatron  = alumni.membership_type = PATRON
   isFounding = today <= (PROGRAM_LAUNCH_DATE + FOUNDING_WINDOW_DAYS)

7. tier + discountPercent:
   FOUNDING_PATRON (both) → FOUNDING_PATRON_DISCOUNT_PERCENT
   FOUNDING (only)        → FOUNDING_DISCOUNT_PERCENT
   PATRON (only)          → PATRON_DISCOUNT_PERCENT
   REGULAR (neither)      → 0%

8. For PATRON or FOUNDING_PATRON:
   gradYearFee = slab matching graduation year (if exists)
   baseFee = min(baseFee, gradYearFee)     ← business rule FR-MA-05

9. discountAmount = baseFee × (discountPercent / 100)
   finalMembershipFee = baseFee − discountAmount

10. advanceDfc = dfcPerEvent × multiplier

11. totalPayable = finalMembershipFee + advanceDfc
```

### Example walkthrough

Member: FOUNDING tier (not patron), age 35, fee slab "31–35 years" = ₹5,000, DFC slab = ₹400/event, founding discount = 10%, multiplier = 5.

```
baseFee           = 5000.00
discountPercent   = 10%
discountAmount    = 500.00
finalMembershipFee = 4500.00
dfcPerEvent       = 400.00
advanceDfc        = 400 × 5 = 2000.00
totalPayable      = 4500 + 2000 = 6500.00
```

---

## 8. Schema Changes (v2.1 Migration)

Apply the following as a Flyway migration `V3__registration_schema_fixes.sql` before running the application:

```sql
-- Required for storing gender in the application details
ALTER TABLE nesam_application_details
    ADD COLUMN IF NOT EXISTS gender VARCHAR(10);

-- Required for nominee share in MVP (single nominee)
ALTER TABLE nesam_application_details
    ADD COLUMN IF NOT EXISTS nominee_percent_share NUMERIC(5,2) DEFAULT 100.00;

-- Performance: fast email lookup on applications
CREATE INDEX IF NOT EXISTS idx_applications_email
    ON nesam_applications(email_id);

-- Performance: fast email lookup on alumni master
CREATE INDEX IF NOT EXISTS idx_alumni_email
    ON aa_alumni_master(email_id);
```

These are additive changes only. No existing columns are modified or dropped.

---

## 9. Error Handling

All error responses follow **RFC 7807 Problem Details** format with `Content-Type: application/problem+json`.

### Error response structure

```json
{
  "type": "https://nesam.org/problems/validation-error",
  "title": "Validation Error",
  "status": 422,
  "detail": "Nominee percentage shares must sum to 100. Current total is 80.00.",
  "instance": "/api/v1/public/registration/submit"
}
```

### Error types used in this flow

| Type URI | Status | Meaning |
|----------|--------|---------|
| `.../validation-error` | 422 | Request body fails validation |
| `.../otp-invalid` | 422 | OTP is wrong, expired, or already used |
| `.../age-ineligible` | 422 | Applicant is 60 or older |
| `.../rate-limit-exceeded` | 429 | Too many OTP requests |
| `.../already-submitted` | 409 | Application already COMPLETED |
| `.../unauthorized` | 401 | JWT missing or malformed |
| `.../forbidden` | 403 | JWT lacks required scope |

---

## 10. Running Locally

### Prerequisites

- Java 21
- Maven 3.9+
- PostgreSQL 15 running locally with a `nesam` database
- The `nesam` schema already applied (schema v2.1 SQL + V3 migration)

### Start the backend

```bash
cd nesam-backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The backend starts on `http://localhost:8080`.

### Swagger UI

Open `http://localhost:8080/swagger-ui.html` in a browser.

To test authenticated endpoints:
1. Call `POST /registration/initiate` with a valid alumni email → status should be `ELIGIBLE`
2. Call `POST /registration/send-otp` → check console output for the OTT UUID
3. Call `POST /registration/verify-otp` with the UUID → copy the `token` from the response
4. Click "Authorize" in Swagger UI and paste `Bearer <token>`
5. All JWT-protected endpoints (APIs 4–7) are now unlocked in the UI

### Start the frontend

```bash
cd nesam-frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:5173`. Navigate to `/register` to test the full wizard.

---

## 11. Testing

Integration tests are in `src/test/java/com/nesam/backend/registration/`.

```bash
mvn test -pl nesam-backend -Dtest=RegistrationControllerIntegrationTest
```

Tests use `@Testcontainers` with a PostgreSQL Docker container — no local database needed.

### Key test cases

| Test | What it verifies |
|------|-----------------|
| `testInitiate_pendingApplication` | Application table is checked before alumni table |
| `testInitiate_registeredMember` | REGISTERED members are blocked (NOT_A_MEMBER) |
| `testInitiate_alwaysReturns200` | Never returns 404/403 regardless of email |
| `testVerifyOtp_tokenConsumed` | Used OTT cannot be reused |
| `testFeePreview_patronLowerFee` | Graduation-year slab used when lower than age slab (FR-MA-05) |
| `testSubmit_transactionRollback` | If nominee insert fails, no user or membership is created |
| `testSubmit_nomineeShares` | Shares not summing to 100 are rejected |
| `testSaveDetails_wrongUser` | Application belonging to another email is rejected with 403 |

---

## 12. Security Notes

### Why the initiate endpoint always returns 200

Returning HTTP 404 when an email is not found, or HTTP 403 when a member is not eligible, would allow an attacker to use this endpoint as an oracle to enumerate which emails are in the system. By always returning HTTP 200 with a `status` field, the endpoint reveals nothing about existence through the HTTP layer.

### Why OTP eligibility is not re-checked in send-otp

`POST /send-otp` does not re-run the eligibility check. An attacker who calls it directly (without going through `/initiate`) can generate an OTT for any email. However, an OTT alone is useless — it cannot grant access to any resource. Only after the OTT is consumed and a REGISTRATION JWT is issued can the subsequent endpoints be called, and those endpoints derive the email from the JWT (not from user input).

### Why the REGISTRATION JWT uses email as sub (not a user ID)

The `nesam_user_id` does not exist until API 7 completes. The email is the only stable identifier we have during the wizard. The REGISTRATION scope prevents this JWT from being misused — it can only call the 4 wizard endpoints.

### Application ownership check in APIs 6 and 7

APIs 6 and 7 verify that the `applicationId` in the request belongs to the email in the JWT. This prevents one member from submitting or modifying another member's application even if they somehow obtained a valid REGISTRATION JWT.

---

## 13. Frontend Integration Guide

This section describes how the React frontend at `http://localhost:5173/register` should call these APIs.

### State the frontend must track

| State variable | Set by | Used in |
|---------------|--------|---------|
| `email` | User input | APIs 1, 2 |
| `registrationStatus` | API 1 response | Routing to next screen |
| `pendingApplicationId` | API 1 or API 3 | Display in resume modal |
| `jwtToken` | API 3 response | Authorization header for APIs 4–7 |
| `applicationId` | API 6 first response | Sent in all subsequent API 6 and API 7 calls |
| `feePreview` | API 5 response | Display on fee and summary screens |

### Recommended call sequence

```
User types email + clicks Verify
    │
    └─► POST /initiate
          │
          ├─ ELIGIBLE ─────────────────────────────────────────────► POST /send-otp
          │                                                                │
          ├─ PENDING_APPLICATION ─► show resume modal ──────────────► POST /send-otp
          │                          (if user clicks resume)
          │                          (if user clicks fresh: call POST /send-otp anyway,
          │                           but ignore pendingApplicationId on subsequent calls)
          │
          ├─ NOT_FOUND ────────────────────────────────────────────► show error, stop
          └─ NOT_A_MEMBER ─────────────────────────────────────────► show error, stop

User enters OTP + clicks Verify
    └─► POST /verify-otp (body = raw OTT UUID)
          └─► store token in localStorage
                │
                └─► GET /prefill (with Bearer token)
                      └─► populate wizard form with response data

Wizard Step 3 — Contact details saved
    └─► PATCH /details (applicationId: null first time)
          └─► store returned applicationId

Wizard Step 4 — Date of birth entered
    └─► GET /fee-preview?dateOfBirth=YYYY-MM-DD
          └─► display fee breakdown to user
    └─► PATCH /details (applicationId, dateOfBirth, gender)

Wizard Step 5 — Nominee details entered
    └─► PATCH /details (applicationId, nomineeName, nomineeRelationship, ...)

Wizard Step 6 — Summary screen shown
    └─► (no API call — use fee data already loaded in state)

User clicks Confirm and Pay
    └─► POST /submit
          └─► on success: clear localStorage, redirect to /login
```

### Resend OTP

```javascript
// Countdown timer reaches 0 or user clicks "Resend OTP"
await fetch('/api/v1/public/registration/send-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: storedEmail })
});
// Restart countdown timer with 600 seconds
```

### Handling partial saves

Each wizard step should call `PATCH /details` before the user navigates to the next step. If navigation fails or the browser closes, the data is safe. On return, the user re-enters their email, goes through OTP again, and `GET /prefill` restores their progress.

---

*Last updated: March 2026 | Schema version: v2.1 | API version: 2.1.0*
