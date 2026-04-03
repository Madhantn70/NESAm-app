# 

# **---**

# 

# **# 📘 \*\*NESAm DOMAIN CANON v2 (UPDATED)\*\***

# 

# **---**

# 

# **# \*\*1. PROGRAM CORE\*\***

# 

# **### \*\*NESAm\*\***

# 

# **A contribution-based welfare system where financial support is generated through \*\*event-driven pooled contributions (DFC)\*\* triggered only upon the demise of a member.** 

# 

# **---**

# 

# **# \*\*2. IDENTITY MODEL (FIXED \& FINAL)\*\***

# 

# **### \*\*Alumni (aa\_alumni\_master)\*\***

# 

# **\* External authoritative identity source**

# **\* Managed by IRTTAA**

# **\* Determines eligibility (Life / Patron)**

# 

# **👉 System MUST NOT mutate this.**

# 

# **---**

# 

# **### \*\*User (nesam\_users)\*\***

# 

# **\* Internal system identity**

# **\* Identified by `nesam\_user\_id`**

# **\* Linked to exactly one alumni record (optional but preferred)**

# 

# **👉 \*\*This is the ONLY identity used inside NESAm\*\***

# 

# **---**

# 

# **### \*\*User UUID (System Identity)\*\***

# 

# **\* Immutable**

# **\* Survives:**

# 

# &#x20; **\* email change**

# &#x20; **\* mobile change**

# &#x20; **\* re-registration**

# 

# **✔ Matches invariant expectation** 

# 

# **---**

# 

# **# \*\*3. APPLICATION DOMAIN\*\***

# 

# **### \*\*Application (nesam\_applications)\*\***

# 

# **Represents a \*\*registration attempt\*\*, not a membership.**

# 

# **States:**

# 

# **\* STARTED**

# **\* COMPLETED**

# **\* REJECTED**

# **\* ABANDONED** 

# 

# **---**

# 

# **### \*\*Application Details\*\***

# 

# **\* Snapshot of user data at time of applying**

# **\* Includes:**

# 

# &#x20; **\* contact info**

# &#x20; **\* nominee info**

# 

# **👉 Immutable after submission**

# 

# **---**

# 

# **### \*\*Application Payment\*\***

# 

# **\* Tracks payment lifecycle**

# **\* Includes:**

# 

# &#x20; **\* INITIATED**

# &#x20; **\* SUCCESS**

# &#x20; **\* FAILED**

# &#x20; **\* EXPIRED**

# 

# **👉 Only \*\*SUCCESS + VERIFIED → Membership creation\*\***

# 

# **---**

# 

# **# \*\*4. MEMBERSHIP DOMAIN (CRITICAL FIXED)\*\***

# 

# **### \*\*Membership (nesam\_members)\*\***

# 

# **A \*\*lifecycle instance\*\* linking a User to NESAm.**

# 

# **---**

# 

# **### \*\*Membership Status (UPDATED - CANON)\*\***

# 

# **Allowed states:**

# 

# **```**

# **ACTIVE**

# **NOTICE\_PERIOD**

# **LAPSED**

# **DECEASED**

# **```**

# 

# **❌ Removed:**

# 

# **\* IN\_GRACE\_PERIOD**

# 

# **👉 Grace is \*\*time logic\*\*, not status**

# **✔ Required by invariants** 

# 

# **---**

# 

# **### \*\*Membership Lifecycle\*\***

# 

# **```**

# **APPLICATION → ACTIVE → NOTICE\_PERIOD → LAPSED**

# &#x20;                              **↘**

# &#x20;                               **DECEASED**

# **```**

# 

# **---**

# 

# **### \*\*Key Rules\*\***

# 

# **\* One user → multiple memberships over time**

# **\* Only ONE membership can be:**

# 

# &#x20; **\* ACTIVE OR**

# &#x20; **\* NOTICE\_PERIOD**

# 

# **✔ Enforced invariant** 

# 

# **---**

# 

# **### \*\*Membership Tier\*\***

# 

# **```**

# **REGULAR**

# **PATRON**

# **FOUNDING**

# **FOUNDING\_PATRON**

# **```**

# 

# **👉 Affects:**

# 

# **\* fee calculation**

# **\* discounts**

# **\* DFC duration rules**

# 

# **---**

# 

# **# \*\*5. FINANCIAL DOMAIN (CLEANED \& CORRECTED)\*\***

# 

# **---**

# 

# **## \*\*5.1 Membership Fee\*\***

# 

# **\* One-time payment**

# **\* Non-refundable after activation** 

# 

# **---**

# 

# **## \*\*5.2 Advance DFC (Security Deposit)\*\***

# 

# **### Definition:**

# 

# **```**

# **Advance DFC = DFC Rate × Multiplier**

# **```**

# 

# **### Properties:**

# 

# **\* Stored in membership (logical balance)**

# **\* Locked (not spendable)**

# 

# **---**

# 

# **### \*\*Allowed Usage ONLY\*\***

# 

# **1. During LAPSING (dues adjustment)**

# **2. During DEATH settlement**

# 

# **❌ NOT allowed:**

# 

# **\* regular DFC payments**

# 

# **✔ Matches invariant** 

# 

# **---**

# 

# **## \*\*5.3 Invoice (Financial Instrument)\*\***

# 

# **Represents \*\*payable financial entry\*\***

# 

# **Types:**

# 

# **```**

# **MEMBERSHIP\_FEE**

# **DFC**

# **ADVANCE\_DFC**

# **ADVANCE\_DFC\_TOPUP**

# **```**

# 

# **---**

# 

# **## ⚠️ IMPORTANT CLARIFICATION**

# 

# **👉 Invoice ≠ Demand**

# **👉 Invoice = payable record**

# **👉 Demand = business event obligation**

# 

# **---**

# 

# **# \*\*6. DFC DOMAIN (NEWLY FORMALIZED)\*\***

# 

# **---**

# 

# **## \*\*6.1 Demise Event (MISSING → NOW CANON)\*\***

# 

# **### \*\*Demise Event\*\***

# 

# **A verified record of a member’s death.**

# 

# **Triggers:**

# 

# **\* DFC generation**

# **\* Claim workflow**

# 

# **---**

# 

# **## \*\*6.2 DFC Demand (CORE CONCEPT)\*\***

# 

# **A \*\*per-member financial obligation\*\* created after a Demise Event.**

# 

# **### Characteristics:**

# 

# **\* Generated for ALL eligible members**

# **\* Amount based on:**

# 

# &#x20; **\* contributor’s age at event time**

# 

# **✔ As defined in SRS** 

# 

# **---**

# 

# **## \*\*6.3 DFC Contribution Rules\*\***

# 

# **\* Paid per event**

# **\* Age-based slab**

# **\* Stops at:**

# 

# &#x20; **\* age 70**

# &#x20; **\* founding rule limits**

# 

# **---**

# 

# **## \*\*6.4 Relationship Model\*\***

# 

# **```**

# **Demise Event**

# &#x20;  **↓**

# **DFC Demands (per member)**

# &#x20;  **↓**

# **Invoices**

# &#x20;  **↓**

# **Payments**

# **```**

# 

# **👉 THIS is the correct financial flow.**

# 

# **---**

# 

# **# \*\*7. PAYMENT DOMAIN\*\***

# 

# **### \*\*Payment (payments\_received)\*\***

# 

# **Represents actual money received.**

# 

# **Types:**

# 

# **```**

# **invoice\_payment**

# **adhoc\_payment**

# **```**

# 

# **---**

# 

# **### \*\*Payment Rules\*\***

# 

# **\* Must map to invoice (recommended strict mode)**

# **\* Idempotency required (same payment should not duplicate)**

# 

# **---**

# 

# **# \*\*8. NOMINEE DOMAIN\*\***

# 

# **### \*\*Nominee (nesam\_member\_nominees)\*\***

# 

# **Represents beneficiary mapping.**

# 

# **---**

# 

# **### \*\*Rules\*\***

# 

# **\* Minimum: 1 nominee**

# **\* Maximum: configurable**

# **\* Total share MUST = 100%**

# 

# **✔ Defined in SRS** 

# 

# **---**

# 

# **### \*\*Fallback\*\***

# 

# **If nominees unavailable:**

# **→ Legal Heirs receive equal distribution**

# 

# **---**

# 

# **# \*\*9. CLAIM DOMAIN\*\***

# 

# **### \*\*Claim\*\***

# 

# **A settlement triggered after:**

# 

# **\* valid demise event**

# **\* membership eligibility**

# 

# **---**

# 

# **### \*\*Eligibility\*\***

# 

# **\* ACTIVE → eligible**

# **\* NOTICE\_PERIOD → eligible (after dues deduction)**

# **\* LAPSED → NOT eligible**

# 

# **✔ Matches byelaws** 

# 

# **---**

# 

# **### \*\*Settlement Logic\*\***

# 

# **```**

# **Total DFC Collected**

# &#x20; **- Outstanding dues**

# &#x20; **= Final payout**

# **```**

# 

# **---**

# 

# **# \*\*10. SYSTEM PARAMETERS\*\***

# 

# **### \*\*system\_parameters\*\***

# 

# **Controls:**

# 

# **\* program activation**

# **\* multipliers**

# **\* founding window**

# **\* thresholds**

# 

# **---**

# 

# **### \*\*Program Activation Rule\*\***

# 

# **\* Minimum members = 100**

# **\* Before activation:**

# 

# &#x20; **\* NO claims allowed**

# 

# **✔ Critical invariant** 

# 

# **---**

# 

# **# \*\*11. TIME-BASED LOGIC (IMPORTANT)\*\***

# 

# **### \*\*DFC Payment Window\*\***

# 

# **\* 30 days**

# 

# **### \*\*Notice Period\*\***

# 

# **\* 1 year**

# 

# **### \*\*Grace Period\*\***

# 

# **\* 15 days (implicit, not a status)**

# 

# **---**

# 

# **# \*\*12. EVENT-DRIVEN SYSTEM MODEL\*\***

# 

# **System operates on events:**

# 

# **1. Application Submitted**

# **2. Payment Completed**

# **3. Membership Activated**

# **4. Demise Event Occurs**

# **5. DFC Demand Generated**

# **6. Payments Collected**

# **7. Claim Settled**

# 

# **---**

# 

# **# 🔥 FINAL SUMMARY (READ THIS CAREFULLY)**

# 

# **### What changed from old canon:**

# 

# **✅ Removed invalid status (`IN\_GRACE\_PERIOD`)**

# **✅ Introduced \*\*Demise Event (missing earlier)\*\***

# **✅ Introduced \*\*DFC Demand (CRITICAL FIX)\*\***

# **✅ Clarified \*\*Invoice vs Demand separation\*\***

# **✅ Fixed \*\*Identity model (User vs Alumni)\*\***

# **✅ Formalized \*\*event-driven financial flow\*\***

# 

# **---**

# 

# 



