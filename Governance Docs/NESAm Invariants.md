# 

# **# 📘 \*\*NESAm INVARIANTS v2 (UPDATED)\*\***

# 

# **---**

# 

# **# \*\*1. PROGRAM ACTIVATION INVARIANTS\*\***

# 

# **---**

# 

# **### \*\*INV-PA-01: Activation Threshold\*\***

# 

# **\* Program MUST NOT process claims until:**

# 

# &#x20; **```**

# &#x20; **registered\_members ≥ 100**

# &#x20; **```**

# **\* Activation is irreversible once achieved**

# 

# **✔ Based on byelaws** 

# 

# **---**

# 

# **### \*\*INV-PA-02: Pre-Activation Refund\*\***

# 

# **If program NOT activated:**

# 

# **\* All payments MUST be fully refunded**

# **\* Includes:**

# 

# &#x20; **\* membership fee**

# &#x20; **\* advance DFC**

# 

# **❌ No deductions allowed**

# 

# **---**

# 

# **# \*\*2. IDENTITY INVARIANTS\*\***

# 

# **---**

# 

# **### \*\*INV-ID-01: User Identity Immutability\*\***

# 

# **\* `nesam\_user\_id` is immutable**

# **\* MUST NOT change across:**

# 

# &#x20; **\* email updates**

# &#x20; **\* mobile updates**

# &#x20; **\* re-registration**

# 

# **---**

# 

# **### \*\*INV-ID-02: Alumni Source Integrity\*\***

# 

# **\* `aa\_alumni\_master` is external truth**

# **\* System MUST NOT modify:**

# 

# &#x20; **\* membership\_type**

# &#x20; **\* alumni status**

# 

# **---**

# 

# **### \*\*INV-ID-03: One User ↔ One Alumni Mapping\*\***

# 

# **\* A user can link to only ONE alumni record**

# **\* Alumni record can map to multiple users ONLY if explicitly allowed (rare case)**

# 

# **---**

# 

# **# \*\*3. APPLICATION INVARIANTS\*\***

# 

# **---**

# 

# **### \*\*INV-AP-01: Application is NOT Membership\*\***

# 

# **\* `nesam\_applications` ≠ membership**

# **\* Membership exists ONLY after:**

# 

# &#x20; **```**

# &#x20; **application.status = COMPLETED**

# &#x20; **AND payment.status = SUCCESS**

# &#x20; **AND verification = APPROVED**

# &#x20; **```**

# 

# **---**

# 

# **### \*\*INV-AP-02: Application Immutability\*\***

# 

# **After submission:**

# 

# **\* application details MUST NOT change**

# **\* acts as snapshot**

# 

# **---**

# 

# **### \*\*INV-AP-03: Payment Gate for Membership\*\***

# 

# **Membership creation MUST NOT happen unless:**

# 

# **```**

# **payment.status = SUCCESS**

# **```**

# 

# **---**

# 

# **# \*\*4. MEMBERSHIP INVARIANTS\*\***

# 

# **---**

# 

# **### \*\*INV-ML-01: Membership Lifecycle Integrity\*\***

# 

# **Membership states are STRICT:**

# 

# **```**

# **ACTIVE**

# **NOTICE\_PERIOD**

# **LAPSED**

# **DECEASED**

# **```**

# 

# **❌ `IN\_GRACE\_PERIOD` is NOT a status (time logic only)**

# 

# **---**

# 

# **### \*\*INV-ML-02: Single Active Membership\*\***

# 

# **A user can have ONLY ONE:**

# 

# **```**

# **ACTIVE OR NOTICE\_PERIOD**

# **```**

# 

# **at any time**

# 

# **---**

# 

# **### \*\*INV-ML-03: Lapsed is Terminal\*\***

# 

# **\* LAPSED membership:**

# 

# &#x20; **\* cannot be reactivated**

# &#x20; **\* requires fresh application**

# 

# **✔ Matches governance** 

# 

# **---**

# 

# **### \*\*INV-ML-04: Membership Creation Rule\*\***

# 

# **Membership MUST be created ONLY through:**

# 

# **```**

# **Application → Approval → Activation**

# **```**

# 

# **Direct insertion is forbidden**

# 

# **---**

# 

# **### \*\*INV-ML-05: Membership Identity Separation\*\***

# 

# **\* Membership ≠ User**

# **\* Membership is lifecycle instance**

# 

# **---**

# 

# **# \*\*5. FINANCIAL INVARIANTS\*\***

# 

# **---**

# 

# **### \*\*INV-FN-01: Membership Fee Finality\*\***

# 

# **\* Non-refundable AFTER activation**

# 

# **✔ Byelaws enforced** 

# 

# **---**

# 

# **### \*\*INV-FN-02: Advance DFC Isolation\*\***

# 

# **\* Advance DFC is LOCKED**

# **\* MUST NOT be used for:**

# 

# &#x20; **\* regular DFC payments**

# 

# **---**

# 

# **### \*\*INV-FN-03: Advance DFC Allowed Usage\*\***

# 

# **Allowed ONLY in:**

# 

# **1. Lapsing adjustment**

# **2. Claim settlement**

# 

# **---**

# 

# **### \*\*INV-FN-04: Invoice is Source of Truth\*\***

# 

# **\* All payable amounts MUST be represented as invoice**

# **\* Payments without invoice = invalid (except adhoc allowed explicitly)**

# 

# **---**

# 

# **### \*\*INV-FN-05: Payment Idempotency\*\***

# 

# **\* Same payment MUST NOT be recorded twice**

# **\* Must use:**

# 

# &#x20; **```**

# &#x20; **gateway\_reference UNIQUE**

# &#x20; **```**

# 

# **---**

# 

# **# \*\*6. DFC INVARIANTS (CRITICAL CORE)\*\***

# 

# **---**

# 

# **### \*\*INV-DFC-01: Event-Based Contribution\*\***

# 

# **DFC MUST ONLY exist when:**

# 

# **```**

# **Demise Event exists**

# **```**

# 

# **---**

# 

# **### \*\*INV-DFC-02: Demand Generation Rule\*\***

# 

# **For every demise event:**

# 

# **\* DFC demand MUST be generated for:**

# 

# &#x20; **\* all eligible members**

# 

# **---**

# 

# **### \*\*INV-DFC-03: Age-Based Calculation\*\***

# 

# **DFC amount MUST be:**

# 

# **```**

# **based on contributor age at event date**

# **```**

# 

# **✔ Byelaws rule** 

# 

# **---**

# 

# **### \*\*INV-DFC-04: Contribution Cutoff\*\***

# 

# **\* Age > 70 → no contribution**

# **\* Founding:**

# 

# &#x20; **\* stop at 65 OR 20 years**

# 

# **---**

# 

# **### \*\*INV-DFC-05: Payment Window\*\***

# 

# **\* DFC must be paid within:**

# 

# &#x20; **```**

# &#x20; **30 days**

# &#x20; **```**

# 

# **---**

# 

# **# \*\*7. LAPSING \& TIME INVARIANTS\*\***

# 

# **---**

# 

# **### \*\*INV-LP-01: Notice Period Logic\*\***

# 

# **\* Non-payment → NOTICE\_PERIOD (1 year)**

# 

# **---**

# 

# **### \*\*INV-LP-02: Grace Period Logic\*\***

# 

# **\* After notice period:**

# 

# &#x20; **```**

# &#x20; **15 days grace**

# &#x20; **```**

# **\* NOT a separate status**

# 

# **---**

# 

# **### \*\*INV-LP-03: Automatic Lapsing\*\***

# 

# **If dues not cleared:**

# 

# **```**

# **→ membership = LAPSED**

# **```**

# 

# **---**

# 

# **### \*\*INV-LP-04: Recovery Rule\*\***

# 

# **\* During notice period:**

# 

# &#x20; **\* dues paid → ACTIVE**

# 

# **---**

# 

# **# \*\*8. CLAIM INVARIANTS\*\***

# 

# **---**

# 

# **### \*\*INV-CL-01: Claim Trigger\*\***

# 

# **Claim ONLY triggered by:**

# 

# **```**

# **Demise Event**

# **```**

# 

# **---**

# 

# **### \*\*INV-CL-02: Eligibility Rule\*\***

# 

# **Valid only if:**

# 

# **```**

# **membership ∈ {ACTIVE, NOTICE\_PERIOD}**

# **```**

# 

# **❌ LAPSED → NOT eligible**

# 

# **---**

# 

# **### \*\*INV-CL-03: Dormant Period Rule\*\***

# 

# **\* No claims within:**

# 

# &#x20; **```**

# &#x20; **first 3 months**

# &#x20; **```**

# **\* Exception → committee approval**

# 

# **✔ Byelaws** 

# 

# **---**

# 

# **### \*\*INV-CL-04: Dues Deduction\*\***

# 

# **Final payout:**

# 

# **```**

# **collected\_amount - outstanding\_dues**

# **```**

# 

# **---**

# 

# **### \*\*INV-CL-05: Program Activation Dependency\*\***

# 

# **\* Claim NOT allowed if:**

# 

# &#x20; **```**

# &#x20; **program\_active = false**

# &#x20; **```**

# 

# **---**

# 

# **# \*\*9. NOMINEE INVARIANTS\*\***

# 

# **---**

# 

# **### \*\*INV-NM-01: Minimum Nominee\*\***

# 

# **\* At least 1 nominee required**

# 

# **---**

# 

# **### \*\*INV-NM-02: Share Integrity\*\***

# 

# **```**

# **SUM(percent\_share) = 100%**

# **```**

# 

# **---**

# 

# **### \*\*INV-NM-03: Fallback Rule\*\***

# 

# **If nominees unavailable:**

# 

# **→ Legal heirs**

# 

# **---**

# 

# **# \*\*10. SYSTEM INVARIANTS\*\***

# 

# **---**

# 

# **### \*\*INV-SY-01: System Parameters Authority\*\***

# 

# **\* Business rules MUST come from:**

# 

# &#x20; **```**

# &#x20; **system\_parameters**

# &#x20; **```**

# **\* Hardcoding forbidden**

# 

# **---**

# 

# **### \*\*INV-SY-02: Event-Driven Integrity\*\***

# 

# **System MUST operate via:**

# 

# **```**

# **Demise Event → DFC Demand → Invoice → Payment → Claim**

# **```**

# 

# **---**

# 

# **# \*\*11. DATA INTEGRITY INVARIANTS (DB LEVEL)\*\***

# 

# **---**

# 

# **### \*\*INV-DB-01: Referential Integrity\*\***

# 

# **\* All FK relationships MUST be valid**

# **\* No orphan records**

# 

# **---**

# 

# **### \*\*INV-DB-02: Enum Enforcement\*\***

# 

# **\* Only allowed enum values**

# **\* No dynamic statuses**

# 

# **---**

# 

# **### \*\*INV-DB-03: Timestamp Integrity\*\***

# 

# **\* created\_at immutable**

# **\* modified\_at auto-updated**

# 

# **---**

# 

# **# \*\*12. AI GOVERNANCE INVARIANTS\*\***

# 

# **---**

# 

# **### \*\*INV-AI-01: Canon Supremacy\*\***

# 

# **\* Domain Canon is final authority**

# **\* AI MUST NOT redefine terms**

# 

# **---**

# 

# **### \*\*INV-AI-02: Invariant Protection\*\***

# 

# **\* AI MUST fail if invariant violated**

# 

# **✔ Matches governance** 

# 

# **---**

# 

# 

