# **DOMAIN CANON**

## **Purpose**

This document defines the authoritative vocabulary and meanings for the NESAm program and its software system.  
Its purpose is to:

* Eliminate ambiguity in communication between humans and AI  
* Prevent semantic drift across documents, code, and time  
* Ensure legal, financial, and lifecycle terms are interpreted exactly once and consistently

If a concept, role, state, or financial notion is not defined in this document, it is considered undefined and unusable in the system.  
**Scope:** NESAm Program (Business \+ Software) **Authority:** Derived strictly from NESAm Byelaws v1.0, SRS v1.19, ER v1.5, DB Schema v1.5 **Rule:** No term may be redefined, aliased, or substituted. If a concept is missing here, it is undefined.

## **1\. PROGRAM & ORGANIZATIONAL TERMS**

### **NESAm (Neradi Eliya Samuga Atharavu Karam)**

A community-driven alumni welfare program operated under the IRTT Alumni Association (IRTTAA), designed to provide one-time financial support to the family of a deceased NESAm Member through pooled contributions (DFC).

### **IRTTAA (IRTT Alumni Association)**

The parent legal body governing NESAm. All NESAm rules, disputes, and dissolutions are subject to IRTTAA byelaws and resolutions.

### **NESAm Committee**

A group of office bearers authorized by IRTTAA to:

* Approve or reject NESAm applications  
* Verify documents  
* Trigger demise events  
* Approve settlements

## **2\. PERSON & IDENTITY TERMS**

### **User**

A digital identity in the system represented by a user\_uuid. A User may or may not have an active NESAm Membership.

### **User UUID**

An immutable system-generated identifier for a User. It persists across phone number changes and multiple membership lifecycles.

### **Applicant**

A Life Member or Patron Member of IRTTAA who has applied to join NESAm but whose application is not yet approved.

### **Member (NESAm Member)**

An Applicant whose application is approved by the NESAm Committee and who holds a valid NESAm Membership.

### **Founding Member**

A Member who registered within the Founding Window (configured via system parameters from the Program Launch Date).

### **Life Member (IRTTAA)**

A person who has paid the one-time Life Membership fee to IRTTAA. Prerequisite for NESAm eligibility.

### **Patron Member (IRTTAA)**

A higher-tier IRTTAA member. Patron status:

* Is sourced from the Parent DB  
* Grants fee discounts in NESAm  
* Does NOT alter DFC obligations

## **3\. MEMBERSHIP & LIFECYCLE TERMS**

### **NESAm Membership**

A single lifecycle instance linking a User to the NESAm Program. Identified by nesam\_id.

### **NESAm ID (nesam\_id)**

A human-readable identifier representing one membership instance. A User may have multiple NESAm IDs over time, but only one may be Active or in Notice Period at a time.

### **Enrollment Date**

The date on which an NESAm Membership becomes Active after approval.

### **Membership Status**

The authoritative lifecycle state of a membership. Allowed values:

* **PENDING:** Application submitted, awaiting verification/approval  
* **ACTIVE:** Eligible for benefits and obligations  
* **NOTICE\_PERIOD:** Temporarily active but with unpaid DFC dues  
* **LAPSED:** Membership terminated due to non-payment  
* **DECEASED:** Membership closed due to death of the Member

No other status is valid.

### **Dormant Period**

A waiting period (configured, default 3 months) after enrollment during which death claims are not honored, except for explicitly allowed causes.

### **Notice Period**

A 1-year grace window following non-payment of DFC (after the 30-day payment window), during which dues can still be cleared.

### **Grace Period**

A final 15-day window after the Notice Period before a membership becomes Lapsed.

## **4\. FINANCIAL & CONTRIBUTION TERMS**

### **Membership Fee**

A one-time, non-refundable fee paid during registration. Used to build and sustain the NESAm operational corpus.

### **Death Fraternity Contribution (DFC)**

A variable contribution collected from each contributing Member only when another Member dies. The amount depends on the contributor’s age on the date of demise.

### **DFC Rate**

The slab-defined amount applicable for a specific age band, versioned with validity dates.

### **Advance DFC / Security Deposit**

A refundable deposit collected at registration, calculated as: Advance DFC \= DFC Rate × ADVANCE\_DFC\_MULTIPLIER  
Rules:

* Remains locked during normal operation  
* Used only during Lapsing or Death Settlement adjustments  
* Not used for routine DFC payments

### **DFC Demand**

A system-generated financial obligation raised against Members after a Demise Event.

## **5\. CLAIM & BENEFICIARY TERMS**

### **Demise Event**

A verified record of confirmation that an Active or Notice Period Member has passed away.

### **Claim**

A one-time settlement process initiated only after:

* Program activation  
* Dormant Period completion  
* Demise verification

### **Nominee**

A person designated by the Member to receive claim benefits. Nominees:

* May be multiple  
* Must collectively sum to 100% share  
* Are the primary beneficiaries

### **Legal Heir**

A fallback beneficiary eligible only if all nominees are deceased. Requires legal certification.

### **Beneficiary**

The person(s) who finally receive the settlement amount (Nominee(s) or Legal Heir(s)).

### **Settlement**

The finalized financial disbursement resulting from a Claim.

## **6\. TRANSACTION & ACCOUNTING TERMS**

### **Transaction Ledger**

An immutable audit log of all financial events.

### **Transaction Types**

* **CREDIT:** Money paid into the system  
* **DEMAND:** Money requested from a member  
* **DEBIT / ADJUSTMENT:** System-driven deductions (e.g., deposit adjustment)

### **Settlement Record**

A permanent snapshot of a completed claim, including nominee details, deductions, and payout.

## **7\. SYSTEM & CONFIGURATION TERMS**

### **System Parameters**

Admin-controlled global configuration values (e.g., Founding Window, Discounts, Multipliers). These are runtime law, not constants.

### **Parent Association Database (Parent DB)**

The authoritative dataset from IRTTAA used to validate:

* Life/Patron membership  
* Eligibility

## **8\. CANON ENFORCEMENT RULES**

1. No synonym substitution is allowed (e.g., "Suspended" ≠ "Lapsed").  
2. AI and humans must use only these terms.  
3. If intent cannot be expressed using this canon → STOP.  
4. Any change requires a logged Change Request and approval.

**Last Reviewed:** 2026-01-15 **Owner:** Kish