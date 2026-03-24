# **INVARIANTS**

## **Purpose**

This document defines the non-negotiable rules of the NESAm program that must never be violated by humans, software, or AI-assisted development.  
Its purpose is to:

* Preserve legal, financial, and ethical correctness of NESAm  
* Prevent silent rule erosion during refactors or AI-assisted changes  
* Act as the final authority when documents, code, or AI outputs conflict

If any behavior contradicts an invariant defined here, the behavior is invalid by definition, even if it appears to work technically.

## **Scope & Authority**

Derived strictly from:

* NESAm Byelaws v1.0  
* NESAm FAQs  
* NESAm SRS v1.19  
* NESAm ER v1.5  
* Database Schema v1.5

These invariants apply across:

* Mobile App  
* Admin Web Portal  
* Backend Services  
* Database & Batch Jobs

**Invariants override convenience, performance, and UX optimizations.**

## **1\. PROGRAM ACTIVATION INVARIANTS**

### **INV-PA-01: Program Activation Threshold**

NESAm must not process any claim until the program is activated. Activation occurs only when **Registered Member Count ≥ 100** within the allowed window.  
**Source:** Byelaws §8.1, FAQs

### **INV-PA-02: Pre-Activation Refund Rule**

If activation threshold is not met within the allowed duration:

* All collected Membership Fees and Advance DFC must be refunded in full.  
* No deductions are allowed.

**Source:** Byelaws §8.6.1

## **2\. ELIGIBILITY & ENROLLMENT INVARIANTS**

### **INV-EL-01: Parent Association Eligibility**

Only Life Members or Patron Members of IRTTAA are eligible to apply. NESAm must not infer or override IRTTAA status.  
**Source:** Byelaws §8.2, SRS FR-MA-01

### **INV-EL-02: Age at Entry Constraint**

A person must be below 60 years of age on the date of membership fee payment. No overrides are allowed.  
**Source:** Byelaws §8.2, FAQs

### **INV-EL-03: Individual Enrollment Rule**

Each alumnus must register individually, irrespective of marital or family relationship.  
**Source:** Byelaws §8.2, FAQs

## **3\. MEMBERSHIP IDENTITY & LIFECYCLE INVARIANTS**

### **INV-ML-01: Membership Instance Separation**

* A User (user\_uuid) may have multiple NESAm Memberships over time.  
* A Membership (nesam\_id) represents exactly one lifecycle instance.

**Source:** SRS §7.2, DB Schema

### **INV-ML-02: Single Active Membership Rule**

A User may have only one membership in either:

* **ACTIVE** or  
* **NOTICE\_PERIOD**

Concurrent active memberships are forbidden.  
**Source:** SRS FR-MA-20

### **INV-ML-03: Allowed Membership Statuses**

Valid statuses are strictly limited to:

* **PENDING**  
* **ACTIVE**  
* **NOTICE\_PERIOD**  
* **LAPSED**  
* **DECEASED**

No additional statuses may be introduced.  
**Source:** DB Enum, SRS

### **INV-ML-04: Lapsed Membership Finality**

A **LAPSED** membership cannot be reactivated. Rejoining requires fresh application, new fee, and new nesam\_id.  
**Source:** Byelaws §11.1.9, SRS FR-MA-20

## **4\. FINANCIAL & DEPOSIT INVARIANTS**

### **INV-FN-01: Membership Fee Non-Refundability (Post-Activation)**

Once the program is activated, Membership Fee is non-refundable under all circumstances.  
**Source:** Byelaws §10, FAQs

### **INV-FN-02: Advance DFC (Security Deposit) Isolation**

Advance DFC is a locked security deposit. It must not be used for routine DFC payments.  
**Source:** SRS §1.3, FR-MA-12

### **INV-FN-03: Permitted Use of Advance DFC**

Advance DFC may be adjusted only during:

* Membership Lapsing (dues adjustment)  
* Claim Settlement (outstanding dues deduction)

No other usage is allowed.  
**Source:** Byelaws §11.1.7, SRS FR-WEB-09

### **INV-FN-04: DFC Calculation Basis**

DFC amount is determined by the contributor’s age on the date of demise, not enrollment age.  
**Source:** Byelaws §11.4, FAQs

### **INV-FN-05: DFC Contribution Cutoff**

* Members above 70 years do not contribute DFC.  
* Founding Members stop contributing at age 65 or 20 years, whichever is earlier.

**Source:** Byelaws §11.5, FAQs

## **5\. PAYMENT DEFAULT & LAPSING INVARIANTS**

### **INV-LP-01: DFC Payment Window**

DFC must be paid within 30 days of notification.  
**Source:** Byelaws §11.3

### **INV-LP-02: Notice Period Duration**

Non-payment triggers a 1-year Notice Period. Membership remains **ACTIVE** during this period.  
**Source:** Byelaws §11.1.3

### **INV-LP-03: Grace Period Enforcement**

After Notice Period, a 15-day Grace Period is mandatory before lapsing.  
**Source:** Byelaws §11.1.5

### **INV-LP-04: Automatic Lapsing**

Failure to clear dues after Grace Period results in automatic **LAPSED** status.  
**Source:** Byelaws §11.1.6

## **6\. CLAIM ELIGIBILITY & SETTLEMENT INVARIANTS**

### **INV-CL-01: Cause of Claim**

Claims are processed only for death of a NESAm Member.  
**Source:** Byelaws §12.2

### **INV-CL-02: Dormant Period Enforcement**

Claims are not eligible during Dormant Period (default 3 months). Exceptions require explicit committee approval.  
**Source:** Byelaws §12.3, SRS FR-WEB-11

### **INV-CL-03: Membership Status at Death**

Claims are valid only if membership was:

* **ACTIVE** or  
* **NOTICE\_PERIOD**

**LAPSED** memberships are ineligible.  
**Source:** Byelaws §12.4

### **INV-CL-04: Outstanding Dues Deduction**

Any pending DFC dues must be deducted from the settlement amount.  
**Source:** Byelaws §11.1.11, SRS FR-WEB-12

## **7\. NOMINEE & BENEFICIARY INVARIANTS**

### **INV-NM-01: Nominee Percentage Integrity**

Nominee percentage shares must sum to exactly 100%.  
**Source:** Byelaws §9.3, DB Constraint

### **INV-NM-02: Beneficiary Priority**

* Nominees have absolute priority over Legal Heirs.  
* Legal Heirs are considered only if all nominees are deceased.

**Source:** Byelaws §12.2

## **8\. ADMIN & OVERRIDE INVARIANTS**

### **INV-AD-01: Humanitarian Exception Authority**

NESAm Committee may honor a claim even after lapsing only under documented humanitarian grounds.  
Such decisions are:

* Exceptional  
* Final  
* Must be logged

**Source:** Byelaws §11.12, FAQs

## **9\. DATA & AUDIT INVARIANTS**

### **INV-AU-01: Ledger Immutability**

Financial transaction records are append-only. No deletion or overwrite is permitted.  
**Source:** SRS §7.7, NFR-05

### **INV-AU-02: Settlement Snapshot Finality**

Settlement Records are immutable once created.  
**Source:** SRS §7.9

## **10\. AI & SYSTEM GOVERNANCE INVARIANTS**

### **INV-AI-01: AI Authority Boundary**

AI must not modify:

* Invariants  
* Fee slabs  
* DFC rates  
* Lifecycle rules

**Source:** AI Governance Manual v2.2

### **INV-AI-02: Ambiguity Stop Rule**

If an invariant appears ambiguous or contradictory, implementation must stop until clarified.

## **Enforcement Rule**

Any code, configuration, or AI output violating these invariants is invalid, regardless of tests or approvals.  
**Last Reviewed:** 2026-01-15 **Owner:** Kish