# NESAm Registration Flow — Backend API Development Prompt
## For use in Antigravity AI IDE

---

## Project Context

You are building the **backend registration API** for **NESAm (NIT Erode Students Alumni Members)** — an alumni membership management system. The project is a **Spring Boot** application using **PostgreSQL** (schema v2.1) with **Spring Security**, **JWT authentication**, and **Spring's OneTimeToken (OTT) mechanism** for OTP delivery.

The frontend is a **React + Vite** application running at `http://localhost:5173`. The registration wizard is at `/register`. The backend runs at `http://localhost:8080`. Swagger UI is available at `http://localhost:8080/swagger-ui.html`.

This task covers **only the registration flow APIs** — 7 endpoints that take a new member from "email entry" through to "membership created." No other parts of the system should be modified.

---

## Technology Stack

- **Language:** Java 21
- **Framework:** Spring Boot 3.x
- **Security:** Spring Security 6 with JWT (custom filter) + Spring Security OneTimeToken (OTT)
- **Database:** PostgreSQL 15+, accessed via Spring Data JPA + Hibernate
- **Build tool:** Maven
- **API docs:** SpringDoc OpenAPI 3 (Swagger UI)
- **OTP delivery:** `ConsoleOttHandler` for dev (logs to stdout), Twilio/SES stub for prod
- **Email masking:** Utility method — mask everything before `@` beyond 2 characters
- **Transaction management:** `@Transactional` on service layer
- **Validation:** Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@Email`, `@Pattern`)
- **Error format:** RFC 7807 Problem Details (`application/problem+json`)

---

## Database Schema Reference (v2.1)

The following tables are involved in the registration flow. **Do not modify any table that is not listed here.** Do not create new tables unless explicitly instructed below.

### Tables used (read or write)

```
aa_alumni_master          — Source of truth for alumni identity and membership eligibility
nesam_applications        — Tracks each registration attempt (status: STARTED, COMPLETED, REJECTED, ABANDONED)
nesam_application_details — Stores partial/complete form data per application (1:1 with nesam_applications)
nesam_application_payments — Records payment intent and result per application
nesam_users               — Created at final submit; the member's login identity
nesam_user_addresses      — Correspondence address linked to nesam_users
nesam_members             — The membership record; links user, application, tier, membership number
nesam_member_nominees     — One or more nominees per membership with percentage shares
master_membership_fee_slabs — Age-based membership fee lookup table
master_dfc_rate_slabs     — Age-based DFC (Death/Family Care) rate lookup table
system_parameters         — Key-value store for config values used in fee calculation
```

### Relevant ENUMs (already defined in schema)

```sql
aa_alumni_membership_type:  REGISTERED | LIFE | PATRON
application_status:         STARTED | COMPLETED | REJECTED | ABANDONED
membership_status:          ACTIVE | IN_NOTICE_PERIOD | IN_GRACE_PERIOD | LAPSED | DECEASED
membership_tier:            REGULAR | PATRON | FOUNDING | FOUNDING_PATRON
nominee_relationship:       SPOUSE | SON | DAUGHTER | FATHER | MOTHER | BROTHER | SISTER | OTHER
payment_status:             INITIATED | PENDING | SUCCESS | FAILED | CANCELLED | EXPIRED
```

### Schema gaps that MUST be fixed before implementation

Apply these ALTER statements via a Flyway migration script (`V3__registration_schema_fixes.sql`):

```sql
-- Fix 1: gender column missing from application details
ALTER TABLE nesam_application_details ADD COLUMN IF NOT EXISTS gender VARCHAR(10);

-- Fix 2: percent_share missing from application details (for single-nominee MVP)
ALTER TABLE nesam_application_details ADD COLUMN IF NOT EXISTS nominee_percent_share NUMERIC(5,2) DEFAULT 100.00;

-- Fix 3: Index for fast email lookup on applications table
CREATE INDEX IF NOT EXISTS idx_applications_email ON nesam_applications(email_id);

-- Fix 4: Index on alumni master email for fast eligibility check
CREATE INDEX IF NOT EXISTS idx_alumni_email ON aa_alumni_master(email_id);
```

---

## Security Architecture

### JWT token structure

There are TWO distinct JWT token types in this system:

**1. REGISTRATION JWT** (issued at OTP verification, used for APIs 4–7)
```
Claims:
  sub   = email address (NOT a nesam_user_id — user does not exist yet)
  scope = REGISTRATION
  exp   = now + 24 hours
  iat   = now
```

**2. MEMBER JWT** (issued at normal login — NOT covered in this task)
```
Claims:
  sub   = nesam_user_id (UUID)
  scope = MEMBER
  exp   = now + 8 hours
```

**Spring Security configuration requirement:**
- Endpoints `/api/v1/public/registration/initiate`, `/send-otp`, `/verify-otp` → permit all, no JWT required
- Endpoints `/api/v1/public/registration/prefill`, `/fee-preview`, `/details`, `/submit` → require JWT with `scope = REGISTRATION`
- A MEMBER-scoped JWT must NOT be able to call registration endpoints
- A REGISTRATION-scoped JWT must NOT be able to call member dashboard or any other endpoints

### OTT (OneTimeToken) flow

Spring Security's `OneTimeTokenService` is already configured in the project. Use it as follows:

```java
// Generate OTT
oneTimeTokenService.generate(new GenerateOneTimeTokenRequest(email, Duration.ofSeconds(600)));

// Consume OTT (in verify-otp endpoint)
// The OTT is a UUID string sent as raw text body
// Spring Security's consume() method validates it has not expired and marks it used
oneTimeTokenService.consume(new OneTimeTokenAuthenticationToken(rawToken));
```

The `ConsoleOttHandler` implementation logs the token to stdout in dev profile. The actual 6-digit OTP shown to the user is the first 6 characters of the UUID token (or a separate short-code mapping — confirm with the team which pattern is already established).

---

## Package Structure

Create all new code under the following package structure. Do not scatter classes into existing packages:

```
com.nesam.backend
└── registration
    ├── controller
    │   └── RegistrationController.java
    ├── service
    │   ├── RegistrationService.java
    │   ├── RegistrationOtpService.java
    │   └── FeeCalculationService.java
    ├── dto
    │   ├── request
    │   │   ├── InitiateRegistrationRequest.java
    │   │   ├── SendOtpRequest.java
    │   │   ├── SaveDetailsRequest.java
    │   │   └── SubmitApplicationRequest.java
    │   └── response
    │       ├── InitiateRegistrationResponse.java
    │       ├── SendOtpResponse.java
    │       ├── VerifyOtpResponse.java
    │       ├── PrefillResponse.java
    │       ├── FeePreviewResponse.java
    │       ├── SaveDetailsResponse.java
    │       └── SubmitResponse.java
    ├── model
    │   └── RegistrationStatus.java   (enum: ELIGIBLE, NOT_FOUND, NOT_A_MEMBER, PENDING_APPLICATION)
    └── exception
        ├── RegistrationException.java
        └── OtpValidationException.java
```

All JPA entities are assumed to already exist in `com.nesam.backend.entity`. Do not create duplicate entity classes.

---

## The 7 APIs — Full Specification

---

### API 1 — `POST /api/v1/public/registration/initiate`

**Controller method:** `initiateRegistration(@Valid @RequestBody InitiateRegistrationRequest request)`

**Purpose:** The only gate before any OTP is sent. Checks two tables in strict order. Never sends OTP itself — that is API 2's responsibility.

**Decision logic (must be in this exact order, no shortcuts):**

```
STEP 1: Query nesam_applications
  WHERE email_id = :email
    AND status = 'STARTED'
  ORDER BY started_at DESC
  LIMIT 1

  → If found:
      return status=PENDING_APPLICATION,
             pendingApplicationId=<uuid>,
             pendingApplicationStartedAt=<timestamp>
      STOP. Do not proceed to alumni check.

STEP 2: Query aa_alumni_master
  WHERE email_id = :email

  → If not found:
      return status=NOT_FOUND
      STOP.

  → If found AND membership_type = 'REGISTERED':
      return status=NOT_A_MEMBER
      STOP.

  → If found AND membership_type IN ('LIFE', 'PATRON'):
      return status=ELIGIBLE
```

**Request DTO:**
```java
public record InitiateRegistrationRequest(
    @NotBlank @Email String email
) {}
```

**Response DTO:**
```java
public record InitiateRegistrationResponse(
    RegistrationStatus status,             // ELIGIBLE | NOT_FOUND | NOT_A_MEMBER | PENDING_APPLICATION
    @Nullable UUID pendingApplicationId,
    @Nullable Instant pendingApplicationStartedAt,
    String message
) {}
```

**HTTP response:** Always `200 OK`. Never `404` or `403` from this endpoint — returning error codes would leak whether an email exists in the system.

**Messages to return:**
- `ELIGIBLE` → `"You are eligible. A verification code will be sent to your email."`
- `NOT_FOUND` → `"Alumni Record Not Found. We could not find your details in the Alumni database. Please register with the Alumni Association first. If you recently updated your details, please try again later or contact support."`
- `NOT_A_MEMBER` → `"Association Membership Required. Your alumni record exists but you are not yet a Life or Patron member of the association. Please contact the Alumni Association to upgrade your membership."`
- `PENDING_APPLICATION` → `"You have an application in progress. You can resume where you left off or start a fresh application."`

**Swagger annotations required:**
```java
@Operation(summary = "Initiate registration — email eligibility check",
    description = "Checks if the given email has a pending application or is an eligible alumni member. " +
                  "Returns a status code that the frontend uses to determine the next screen. " +
                  "Always returns HTTP 200 to avoid leaking information.")
@ApiResponse(responseCode = "200", description = "Eligibility check completed")
@ApiResponse(responseCode = "422", description = "Email missing or invalid format")
```

---

### API 2 — `POST /api/v1/public/registration/send-otp`

**Controller method:** `sendOtp(@Valid @RequestBody SendOtpRequest request)`

**Purpose:** Generates a OneTimeToken and delivers it to the email. Called when API 1 returns `ELIGIBLE` or `PENDING_APPLICATION`. Also called when the user clicks "Resend OTP" (same endpoint, same logic — OTT service handles invalidation of old token).

**Important:** This endpoint does NOT re-run the eligibility check. The check was done in API 1. If someone calls this endpoint directly without going through API 1, they can attempt OTP generation. This is acceptable — the OTP alone is useless without the subsequent JWT, which only issues if the OTT is valid.

**Request DTO:**
```java
public record SendOtpRequest(
    @NotBlank @Email String email
) {}
```

**Service logic:**
```java
// 1. Call OTT service
oneTimeTokenService.generate(new GenerateOneTimeTokenRequest(email, Duration.ofSeconds(600)));

// 2. Mask the email for the response
String masked = maskEmail(email);
// maskEmail("member@example.com") → "me***@example.com"
// maskEmail("ab@example.com")     → "ab***@example.com"
// maskEmail("a@example.com")      → "a***@example.com"

// 3. Return success
```

**Response DTO:**
```java
public record SendOtpResponse(
    boolean success,
    String maskedEmail,
    int expiresInSeconds      // always 600
) {}
```

**Rate limiting:** Apply `@RateLimiter` (Resilience4j) — max 3 requests per email per 10 minutes. Return `429 Too Many Requests` if exceeded.

**Swagger annotations required:**
```java
@Operation(summary = "Send OTP to email",
    description = "Generates a one-time token and sends it to the given email address. " +
                  "Can be called again for resend — the previous token is automatically invalidated. " +
                  "Rate limited to 3 calls per email per 10 minutes.")
@ApiResponse(responseCode = "200", description = "OTP sent successfully")
@ApiResponse(responseCode = "429", description = "Too many OTP requests — wait before retrying")
```

---

### API 3 — `POST /api/v1/public/registration/verify-otp`

**Controller method:** `verifyOtp(@RequestBody String rawToken)`

**Purpose:** Validates the OTT, marks it consumed, and issues a REGISTRATION-scoped JWT. This JWT is the credential for all remaining wizard steps.

**Request body:** Raw UUID string (the OTT), sent as `Content-Type: text/plain`. This mirrors the existing `/users/ott/login` pattern in the project.

```
ea11a3b1-abc1-1234-5678-abcdef012345
```

**Service logic:**
```java
// 1. Consume the OTT — this validates AND marks it used (cannot be reused)
Authentication auth = oneTimeTokenService.consume(new OneTimeTokenAuthenticationToken(rawToken));
String email = auth.getName();  // email is the principal

// 2. Check if there is a pending application for this email
Optional<NesAmApplication> pending = applicationRepository
    .findByEmailIdAndStatus(email, ApplicationStatus.STARTED);

// 3. Build JWT claims
Map<String, Object> claims = Map.of(
    "scope", "REGISTRATION",
    "email", email
);

// 4. Generate JWT (24 hour expiry, sub = email)
String token = jwtService.generateToken(email, claims, Duration.ofHours(24));

// 5. Return token + context
```

**Response DTO:**
```java
public record VerifyOtpResponse(
    String token,
    String email,
    String applicationStatus,     // "PENDING_APPLICATION" or "NEW"
    @Nullable UUID pendingApplicationId
) {}
```

**Error handling:**
- Invalid or expired OTT → `422 Unprocessable Entity` with RFC 7807 body
- OTT already consumed → `422 Unprocessable Entity` (Spring Security handles this automatically on consume())

**Swagger annotations required:**
```java
@Operation(summary = "Verify OTP and obtain REGISTRATION JWT",
    description = "Validates the one-time token submitted by the user. If valid, consumes the token " +
                  "(it cannot be reused) and returns a signed JWT with scope=REGISTRATION. " +
                  "This JWT must be sent as a Bearer token in all subsequent registration endpoints.")
@ApiResponse(responseCode = "200", description = "OTP valid — JWT issued")
@ApiResponse(responseCode = "422", description = "OTP invalid or expired")
```

---

### API 4 — `GET /api/v1/public/registration/prefill`

**Controller method:** `getPrefill(Authentication authentication)`

**Purpose:** Pre-populates the registration wizard with data already known about the user. Reduces re-entry friction. The email is extracted from the JWT claims (not from a request parameter).

**Service logic:**
```java
// 1. Extract email from JWT
String email = authentication.getName();  // sub claim = email

// 2. Check for pending application
Optional<NesAmApplication> app = applicationRepository
    .findByEmailIdAndStatus(email, ApplicationStatus.STARTED);

String source;
NesAmApplicationDetails savedDetails = null;
UUID applicationId = null;

if (app.isPresent()) {
    source = "PENDING_APPLICATION";
    applicationId = app.get().getApplicationId();
    savedDetails = applicationDetailsRepository.findById(applicationId).orElse(null);
}

// 3. Load alumni master data (always, regardless of pending application)
AaAlumniMaster alumni = alumniRepository.findByEmailId(email)
    .orElseThrow(() -> new RegistrationException("Alumni record not found"));

// 4. Compute isFounding
String launchDate = systemParameterRepository.findById("PROGRAM_LAUNCH_DATE")
    .map(SystemParameter::getParamValue).orElse(null);
String windowDays = systemParameterRepository.findById("FOUNDING_WINDOW_DAYS")
    .map(SystemParameter::getParamValue).orElse("90");
boolean isFounding = computeIsFounding(launchDate, Integer.parseInt(windowDays));

// 5. Build response
```

**`isFounding` computation:**
```java
private boolean computeIsFounding(String launchDateStr, int windowDays) {
    if (launchDateStr == null) return false;
    LocalDate launchDate = LocalDate.parse(launchDateStr);
    LocalDate foundingWindowEnd = launchDate.plusDays(windowDays);
    return LocalDate.now().isBefore(foundingWindowEnd) || LocalDate.now().isEqual(foundingWindowEnd);
}
```

**Response DTO:**
```java
public record PrefillResponse(
    String source,                    // "PENDING_APPLICATION" or "ALUMNI_MASTER"
    @Nullable UUID applicationId,
    AlumniInfo alumni,
    @Nullable SavedContact savedContact,
    @Nullable LocalDate savedDateOfBirth,
    @Nullable String savedGender,
    @Nullable SavedNominee savedNominee
) {
    public record AlumniInfo(
        String fullName,
        String email,
        Integer graduatingYear,
        String department,
        boolean isPatron,
        boolean isFounding
    ) {}

    public record SavedContact(
        String mobile,
        String line1, String line2,
        String city, String state,
        String postalCode, String country
    ) {}

    public record SavedNominee(
        String nomineeName,
        String nomineeRelationship,
        String nomineeEmail,
        String nomineeMobile
    ) {}
}
```

**Swagger annotations required:**
```java
@Operation(summary = "Get prefill data for registration wizard",
    description = "Returns all available data to pre-populate the wizard form. " +
                  "If a pending application exists, loads from nesam_application_details. " +
                  "Always loads alumni identity from aa_alumni_master. " +
                  "Computes founding eligibility from system_parameters. " +
                  "Requires REGISTRATION-scoped JWT.",
    security = @SecurityRequirement(name = "bearerAuth"))
@ApiResponse(responseCode = "200", description = "Prefill data returned")
@ApiResponse(responseCode = "401", description = "JWT missing or invalid")
@ApiResponse(responseCode = "403", description = "JWT does not have REGISTRATION scope")
```

---

### API 5 — `GET /api/v1/public/registration/fee-preview`

**Controller method:** `getFeePreview(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateOfBirth, Authentication authentication)`

**Purpose:** Calculates the exact membership fee and advance DFC the user will pay, based on their age, tier (patron/founding), and current fee slabs. All calculation logic must be in `FeeCalculationService`.

**Service logic (FeeCalculationService):**
```java
// 1. Compute completed age (in years, as of today)
int age = Period.between(dateOfBirth, LocalDate.now()).getYears();

// 2. Validate age < 60 (business rule)
if (age >= 60) throw new RegistrationException("Age must be below 60 to register");

// 3. Fetch membership fee slab
MasterMembershipFeeSlab feeSlab = membershipFeeSlabRepository
    .findActiveSlabForAge(age, LocalDate.now())
    .orElseThrow(() -> new RegistrationException("No active fee slab for age: " + age));
// Repository query:
// WHERE min_age <= :age AND max_age >= :age
// AND (valid_to IS NULL OR valid_to >= :today)
// AND is_active = true

// 4. Fetch DFC rate slab
MasterDfcRateSlab dfcSlab = dfcRateSlabRepository
    .findActiveSlabForAge(age, LocalDate.now())
    .orElseThrow(() -> new RegistrationException("No active DFC slab for age: " + age));

// 5. Load system parameters
int multiplier = Integer.parseInt(
    systemParamRepository.findById("ADVANCE_DFC_MULTIPLIER")
        .map(SystemParameter::getParamValue).orElse("5"));

// 6. Determine patron/founding from alumni record (via email from JWT)
String email = authentication.getName();
AaAlumniMaster alumni = alumniRepository.findByEmailId(email).orElseThrow();
boolean isPatron = alumni.getMembershipType() == AaAlumniMembershipType.PATRON;
boolean isFounding = computeIsFounding(...);  // same logic as API 4

// 7. Determine discount
String tierApplied;
BigDecimal discountPercent = BigDecimal.ZERO;

if (isPatron && isFounding) {
    tierApplied = "FOUNDING_PATRON";
    discountPercent = new BigDecimal(
        systemParamRepository.findById("FOUNDING_PATRON_DISCOUNT_PERCENT")
            .map(SystemParameter::getParamValue).orElse("0"));
} else if (isFounding) {
    tierApplied = "FOUNDING";
    discountPercent = new BigDecimal(
        systemParamRepository.findById("FOUNDING_DISCOUNT_PERCENT")
            .map(SystemParameter::getParamValue).orElse("0"));
} else if (isPatron) {
    tierApplied = "PATRON";
    discountPercent = new BigDecimal(
        systemParamRepository.findById("PATRON_DISCOUNT_PERCENT")
            .map(SystemParameter::getParamValue).orElse("0"));
} else {
    tierApplied = "REGULAR";
}

// 8. For PATRON or FOUNDING_PATRON: compare age-based fee vs graduation-year-based fee
//    Apply whichever is LOWER (business rule FR-MA-05)
BigDecimal baseFee = feeSlab.getMembershipFee();
if (isPatron || isFounding) {
    Optional<MasterMembershipFeeSlab> gradYearSlab =
        membershipFeeSlabRepository.findSlabForGraduatingYear(alumni.getGraduatingYear(), LocalDate.now());
    if (gradYearSlab.isPresent()) {
        baseFee = baseFee.min(gradYearSlab.get().getMembershipFee());
    }
}

// 9. Apply discount
BigDecimal discountAmount = baseFee.multiply(discountPercent).divide(BigDecimal.valueOf(100));
BigDecimal finalFee = baseFee.subtract(discountAmount);

// 10. Compute advance DFC
BigDecimal advanceDfc = dfcSlab.getDfcPerEvent().multiply(BigDecimal.valueOf(multiplier));

// 11. Total
BigDecimal total = finalFee.add(advanceDfc);
```

**Response DTO:**
```java
public record FeePreviewResponse(
    int completedAge,
    String ageSlab,                   // e.g. "31 - 35 Years"
    BigDecimal baseMembershipFee,
    BigDecimal discountPercent,
    BigDecimal discountAmount,
    BigDecimal finalMembershipFee,
    BigDecimal dfcPerEvent,
    int advanceDfcMultiplier,
    BigDecimal advanceDfc,
    BigDecimal totalPayable,
    String tierApplied,               // REGULAR | PATRON | FOUNDING | FOUNDING_PATRON
    String slabSource                 // AGE | GRADUATION_YEAR (whichever was applied)
) {}
```

**Swagger annotations required:**
```java
@Operation(summary = "Preview membership fee breakdown",
    description = "Calculates the complete fee breakdown for the member based on their date of birth. " +
                  "Applies age-based fee slabs from master_membership_fee_slabs, DFC rates from " +
                  "master_dfc_rate_slabs, and tier discounts from system_parameters. " +
                  "For Patron and Founding members, compares age-based vs graduation-year-based fee " +
                  "and applies the lower of the two (FR-MA-05). " +
                  "Returns total payable = final membership fee + advance DFC.",
    security = @SecurityRequirement(name = "bearerAuth"))
@ApiResponse(responseCode = "200", description = "Fee breakdown calculated")
@ApiResponse(responseCode = "422", description = "Age >= 60 or no fee slab found for age")
```

---

### API 6 — `PATCH /api/v1/public/registration/details`

**Controller method:** `saveDetails(@Valid @RequestBody SaveDetailsRequest request, Authentication authentication)`

**Purpose:** Saves or updates the in-progress wizard form data. Called after each step. Partial updates — only fields present in the request body are written. This is the auto-save mechanism.

**Service logic:**
```java
// 1. Extract email from JWT
String email = authentication.getName();

// 2. Find or create nesam_applications
NesAmApplication application;
if (request.applicationId() != null) {
    application = applicationRepository.findById(request.applicationId())
        .orElseThrow(() -> new RegistrationException("Application not found"));
    // Security check: verify this application belongs to the JWT email
    if (!application.getEmailId().equals(email)) {
        throw new AccessDeniedException("Application does not belong to authenticated user");
    }
} else {
    // First save — create a new application
    application = new NesAmApplication();
    application.setEmailId(email);
    application.setStatus(ApplicationStatus.STARTED);
    application.setStartedAt(Instant.now());
    // Look up the alumni ID to link it
    alumniRepository.findByEmailId(email)
        .ifPresent(alumni -> application.setAaAlumniId(alumni.getAaAlumniId()));
    application = applicationRepository.save(application);
}

// 3. Upsert nesam_application_details
NesAmApplicationDetails details = applicationDetailsRepository
    .findById(application.getApplicationId())
    .orElse(new NesAmApplicationDetails(application.getApplicationId()));

// Only update non-null fields from request (partial update semantics)
if (request.mobile()               != null) details.setMobile(request.mobile());
if (request.line1()                != null) details.setLine1(request.line1());
if (request.line2()                != null) details.setLine2(request.line2());
if (request.city()                 != null) details.setCity(request.city());
if (request.state()                != null) details.setState(request.state());
if (request.postalCode()           != null) details.setPostalCode(request.postalCode());
if (request.country()              != null) details.setCountry(request.country());
if (request.dateOfBirth()          != null) details.setDateOfBirth(request.dateOfBirth());
if (request.gender()               != null) details.setGender(request.gender());
if (request.nomineeName()          != null) details.setNomineeName(request.nomineeName());
if (request.nomineeRelationship()  != null) details.setNomineeRelationship(request.nomineeRelationship());
if (request.nomineeEmail()         != null) details.setNomineeEmail(request.nomineeEmail());
if (request.nomineeMobile()        != null) details.setNomineeMobile(request.nomineeMobile());

applicationDetailsRepository.save(details);
```

**Request DTO (all fields nullable — partial update):**
```java
public record SaveDetailsRequest(
    @Nullable UUID applicationId,
    @Nullable @Pattern(regexp = "^[6-9]\\d{9}$") String mobile,
    @Nullable String line1,
    @Nullable String line2,
    @Nullable String city,
    @Nullable String state,
    @Nullable String postalCode,
    @Nullable String country,
    @Nullable LocalDate dateOfBirth,
    @Nullable String gender,
    @Nullable String nomineeName,
    @Nullable String nomineeRelationship,
    @Nullable @Email String nomineeEmail,
    @Nullable String nomineeMobile
) {}
```

**Response DTO:**
```java
public record SaveDetailsResponse(
    UUID applicationId,
    String status,        // always "STARTED"
    Instant savedAt
) {}
```

**Swagger annotations required:**
```java
@Operation(summary = "Save or update registration form data",
    description = "Partial update endpoint — only fields included in the request body are written. " +
                  "If applicationId is null (first call), creates a new application record with " +
                  "status=STARTED. All subsequent calls use the returned applicationId. " +
                  "Called after each wizard step to enable resume-on-refresh.",
    security = @SecurityRequirement(name = "bearerAuth"))
@ApiResponse(responseCode = "200", description = "Details saved — applicationId returned")
@ApiResponse(responseCode = "403", description = "Application does not belong to the authenticated user")
```

---

### API 7 — `POST /api/v1/public/registration/submit`

**Controller method:** `submitApplication(@Valid @RequestBody SubmitApplicationRequest request, Authentication authentication)`

**Purpose:** The final step. Validates all data, creates the member, and records payment — all in a single atomic transaction. Nothing is committed unless every step succeeds.

**Pre-submission validations (throw 422 if any fail):**
1. `selfDeclarationAccepted` must be `true`
2. `nominees` list must not be empty
3. Sum of `percentageShare` across all nominees must equal `100.00` (allow ±0.01 tolerance)
4. Age derived from `nesam_application_details.date_of_birth` must be < 60
5. All required fields must be present: `mobile`, `line1`, `city`, `state`, `postalCode`, `country`, `dateOfBirth`, `gender`, `nomineeName`, `nomineeRelationship`

**Transaction sequence (`@Transactional` — all or nothing):**
```java
@Transactional
public SubmitResponse submit(UUID applicationId, SubmitApplicationRequest request, String email) {

    // STEP 1: Load and validate application
    NesAmApplication application = applicationRepository.findById(applicationId)
        .orElseThrow(() -> new RegistrationException("Application not found"));
    if (!application.getEmailId().equals(email))
        throw new AccessDeniedException("Application does not belong to authenticated user");
    if (application.getStatus() == ApplicationStatus.COMPLETED)
        throw new RegistrationException("Application already submitted");

    NesAmApplicationDetails details = applicationDetailsRepository.findById(applicationId)
        .orElseThrow(() -> new RegistrationException("Application details not found"));

    // STEP 2: Validate age < 60
    int age = Period.between(details.getDateOfBirth(), LocalDate.now()).getYears();
    if (age >= 60) throw new RegistrationException("Applicant must be under 60 years old");

    // STEP 3: Create or find nesam_users
    NesAmUser user = userRepository.findByEmail(email).orElseGet(() -> {
        AaAlumniMaster alumni = alumniRepository.findByEmailId(email).orElseThrow();
        NesAmUser newUser = new NesAmUser();
        newUser.setAaAlumniId(alumni.getAaAlumniId());
        newUser.setFullName(alumni.getFullName());
        newUser.setEmail(email);
        newUser.setMobile(details.getMobile());
        newUser.setGraduatingYear(alumni.getGraduatingYear());
        newUser.setDepartment(alumni.getStream()); // or course, confirm mapping
        newUser.setGender(details.getGender());
        newUser.setDateOfBirth(details.getDateOfBirth());
        newUser.setStatus(NesAmUserStatus.ACTIVE);
        return userRepository.save(newUser);
    });

    // STEP 4: Create nesam_user_addresses
    NesAmUserAddress address = new NesAmUserAddress();
    address.setNesAmUserId(user.getNesAmUserId());
    address.setAddressType(AddressType.CORRESPONDENCE);
    address.setLine1(details.getLine1());
    address.setLine2(details.getLine2());
    address.setCity(details.getCity());
    address.setState(details.getState());
    address.setPostalCode(details.getPostalCode());
    address.setCountry(details.getCountry());
    userAddressRepository.save(address);

    // STEP 5: Mark application COMPLETED
    application.setStatus(ApplicationStatus.COMPLETED);
    application.setCompletedAt(Instant.now());
    applicationRepository.save(application);

    // STEP 6: Calculate fee (reuse FeeCalculationService)
    FeePreviewResponse fee = feeCalculationService.calculate(details.getDateOfBirth(), email);

    // STEP 7: Record payment
    NesAmApplicationPayment payment = new NesAmApplicationPayment();
    payment.setApplicationId(applicationId);
    payment.setAmount(fee.totalPayable());
    payment.setStatus(PaymentStatus.SUCCESS);  // MVP: mock payment always succeeds
    payment.setPaymentGateway("MOCK");
    payment.setGatewayReference(request.paymentReference());
    payment.setInitiatedAt(Instant.now());
    payment.setCompletedAt(Instant.now());
    applicationPaymentRepository.save(payment);

    // STEP 8: Determine tier
    MembershipTier tier = determineTier(fee.tierApplied());

    // STEP 9: Generate membership number
    // Format: NES-{YYYY}-{NNN} where NNN is zero-padded sequence for the year
    String membershipNumber = generateMembershipNumber();

    // STEP 10: Create nesam_members
    NesAmMember member = new NesAmMember();
    member.setApplicationId(applicationId);
    member.setNesAmUserId(user.getNesAmUserId());
    member.setMembershipNumber(membershipNumber);
    member.setMembershipStatus(MembershipStatus.ACTIVE);
    member.setNesAmTier(tier);
    member.setEnrollmentDate(LocalDate.now());
    NesAmMember savedMember = memberRepository.save(member);

    // STEP 11: Create nesam_member_nominees
    for (NomineeRequest nomineeReq : request.nominees()) {
        NesAmMemberNominee nominee = new NesAmMemberNominee();
        nominee.setNesAmMembershipId(savedMember.getNesAmMembershipId());
        nominee.setFullName(nomineeReq.name());
        nominee.setRelationship(NomineeRelationship.valueOf(nomineeReq.relationship()));
        nominee.setPercentShare(nomineeReq.percentageShare());
        nominee.setEmail(nomineeReq.email());
        nominee.setMobile(nomineeReq.mobile());
        nominee.setActive(true);
        nomineeRepository.save(nominee);
    }

    return new SubmitResponse(
        true,
        membershipNumber,
        MembershipStatus.ACTIVE.name(),
        tier.name(),
        fee.totalPayable(),
        "Welcome to NESAm! Your membership " + membershipNumber + " is now active."
    );
}
```

**Membership number generation:**
```java
private String generateMembershipNumber() {
    int year = LocalDate.now().getYear();
    // Count existing members for this year to get sequence
    long count = memberRepository.countByEnrollmentYear(year);
    return String.format("NES-%d-%03d", year, count + 1);
}
```

**Request DTO:**
```java
public record SubmitApplicationRequest(
    @NotNull UUID applicationId,
    @AssertTrue boolean selfDeclarationAccepted,
    @NotEmpty @Valid List<NomineeRequest> nominees,
    String paymentReference    // "MOCK-PAY-001" for MVP
) {
    public record NomineeRequest(
        @NotBlank String name,
        @NotBlank String relationship,
        @NotNull @DecimalMin("0.01") @DecimalMax("100.00") BigDecimal percentageShare,
        @Email String email,
        String mobile
    ) {}
}
```

**Response DTO:**
```java
public record SubmitResponse(
    boolean success,
    String membershipNumber,
    String membershipStatus,
    String nesamTier,
    BigDecimal totalPaid,
    String message
) {}
```

**Swagger annotations required:**
```java
@Operation(summary = "Submit registration and create membership",
    description = "Final step of the registration wizard. Validates all data, then in a single atomic " +
                  "transaction: creates nesam_users, nesam_user_addresses, records payment in " +
                  "nesam_application_payments, creates nesam_members with a unique membership number " +
                  "in format NES-YYYY-NNN, and creates nesam_member_nominees. " +
                  "All writes succeed or none do. On success, the frontend should redirect to /login " +
                  "to obtain a full MEMBER-scoped JWT.",
    security = @SecurityRequirement(name = "bearerAuth"))
@ApiResponse(responseCode = "201", description = "Membership created successfully")
@ApiResponse(responseCode = "409", description = "Application already submitted or user already has a membership")
@ApiResponse(responseCode = "422", description = "Validation failed — missing fields, nominee shares != 100%, age >= 60")
```

---

## Global Configuration Requirements

### OpenAPI / Swagger configuration

Create `OpenApiConfig.java`:

```java
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI nesAmOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("NESAm API")
                .description("NIT Erode Students Alumni Members — Backend API. " +
                             "Registration endpoints are public (no auth) up to OTP verification. " +
                             "All subsequent registration steps require a REGISTRATION-scoped JWT. " +
                             "Member endpoints (not covered here) require a MEMBER-scoped JWT.")
                .version("2.1.0")
                .contact(new Contact()
                    .name("NESAm Development Team")
                    .email("dev@nesam.org")))
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
            .components(new Components()
                .addSecuritySchemes("bearerAuth", new SecurityScheme()
                    .name("bearerAuth")
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
                    .description("Enter the REGISTRATION JWT obtained from POST /registration/verify-otp")));
    }
}
```

### Error handling

Create `RegistrationExceptionHandler.java` extending `ResponseEntityExceptionHandler`:

```java
@RestControllerAdvice
public class RegistrationExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(RegistrationException.class)
    public ProblemDetail handleRegistrationException(RegistrationException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.UNPROCESSABLE_ENTITY, ex.getMessage());
        problem.setTitle("Registration Error");
        return problem;
    }

    @ExceptionHandler(OtpValidationException.class)
    public ProblemDetail handleOtpException(OtpValidationException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.UNPROCESSABLE_ENTITY, "Invalid or expired OTP");
        problem.setTitle("OTP Validation Failed");
        return problem;
    }
}
```

### CORS configuration

The backend must allow requests from `http://localhost:5173` (the Vite dev server):

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:5173"));
    config.setAllowedMethods(List.of("GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    // ...
}
```

---

## Testing Requirements

Create integration tests in `src/test/java/com/nesam/backend/registration/`:

### Test cases to cover

```
RegistrationControllerIntegrationTest:
  - testInitiate_withEligibleEmail_returnsELIGIBLE
  - testInitiate_withPendingApplication_returnsPENDING_APPLICATION
  - testInitiate_withUnknownEmail_returnsNOT_FOUND
  - testInitiate_withRegisteredOnlyMember_returnsNOT_A_MEMBER
  - testInitiate_withInvalidEmail_returns422
  - testSendOtp_withValidEmail_returnsSuccess
  - testSendOtp_rateLimitExceeded_returns429
  - testVerifyOtp_withValidToken_returnsJWT
  - testVerifyOtp_withExpiredToken_returns422
  - testVerifyOtp_withAlreadyConsumedToken_returns422
  - testPrefill_withValidJWT_returnsPrefillData
  - testPrefill_withMemberJWT_returns403
  - testFeePreview_withAge35_returnsCorrectBreakdown
  - testFeePreview_withAge60_returns422
  - testSaveDetails_firstCall_createsApplicationAndDetails
  - testSaveDetails_subsequentCall_updatesExistingDetails
  - testSaveDetails_wrongUserJWT_returns403
  - testSubmit_withCompleteData_createsMembership
  - testSubmit_nomineesNot100Percent_returns422
  - testSubmit_alreadySubmitted_returns409
```

Use `@SpringBootTest`, `@Testcontainers` with a PostgreSQL container, and `TestRestTemplate` or `MockMvc`.

---

## Checklist Before Marking Complete
- Make Swagger UI Documentation
- [ ] All 7 endpoints respond correctly on `http://localhost:8080`
- [ ] Swagger UI at `http://localhost:8080/swagger-ui.html` shows all 7 endpoints with full descriptions
- [ ] Swagger UI "Try it out" works for API 1 and API 2 without auth
- [ ] Swagger UI "Authorize" button accepts the REGISTRATION JWT from API 3
- [ ] Swagger UI "Try it out" works for APIs 4–7 after authorization
- [ ] API 1 never returns 4xx regardless of what email is submitted
- [ ] A MEMBER-scoped JWT cannot call API 4, 5, 6, or 7
- [ ] API 7 is fully transactional — if nominee insert fails, no user or membership row is committed
- [ ] Flyway migration `V3__registration_schema_fixes.sql` runs without error on clean DB
- [ ] All integration tests pass
- [ ] No `System.out.println` in production code — use SLF4J logger
- [ ] No hardcoded fee values — all from DB (`system_parameters`, fee slab tables)
