# **INVARIANT COVERAGE**

## **Purpose**

This document maps each NESAm Invariant to its enforcement points across the system.  
Its purpose is to:

* Ensure invariants are not only written but actively enforced  
* Prevent false confidence caused by partial enforcement  
* Guide developers, reviewers, and AI IDEs on where and how rules are guarded

An invariant that is not enforced at least once in the system is considered theoretically defined but practically unsafe.

## **Scope**

This document covers enforcement across:

* **Database** (constraints, schema, immutability)  
* **Backend Services** (validation, guards, workflows)  
* **Admin Interfaces** (manual controls, overrides)  
* **Member Interfaces** (UI restrictions, visibility)

## **Enforcement Layers (Legend)**

* **DB:** Database-level constraints or immutability  
* **API:** Backend service validation / workflow logic  
* **ADMIN UI:** Admin portal behavior / permissions  
* **MEMBER UI:** Member-facing app behavior  
* **PROCESS:** Human or committee-driven enforcement

## **1\. PROGRAM ACTIVATION INVARIANTS**

### **INV-PA-01: Program Activation Threshold**

| Layer | Enforcement |
| :---- | :---- |
| **DB** | system\_parameters.program\_active \= false until threshold met |
| **API** | Claim creation blocked if program\_active \= false |
| **ADMIN UI** | Activation status visible, manual trigger disabled |
| **MEMBER UI** | Claim option hidden |
| **PROCESS** | Committee verification of member count |

### **INV-PA-02: Pre-Activation Refund Rule**

| Layer | Enforcement |
| :---- | :---- |
| **DB** | Refund transactions recorded as CREDIT reversals |
| **API** | Bulk refund workflow only available pre-activation |
| **ADMIN UI** | Refund trigger enabled only before activation |
| **MEMBER UI** | Refund status visible |
| **PROCESS** | Treasurer approval |

## **2\. ELIGIBILITY & ENROLLMENT INVARIANTS**

### **INV-EL-01: Parent Association Eligibility**

| Layer | Enforcement |
| :---- | :---- |
| **DB** | user\_profiles.irttaa\_id required |
| **API** | Eligibility check against Parent DB |
| **ADMIN UI** | Verification status required for approval |
| **MEMBER UI** | Application blocked if not eligible |
| **PROCESS** | Manual document verification |

### **INV-EL-02: Age at Entry Constraint**

| Layer | Enforcement |
| :---- | :---- |
| **DB** | DOB stored, age derived |
| **API** | Age \< 60 validated at payment |
| **ADMIN UI** | Override disabled |
| **MEMBER UI** | Registration blocked |
| **PROCESS** | None (hard rule) |

### **INV-EL-03: Individual Enrollment Rule**

| Layer | Enforcement |
| :---- | :---- |
| **DB** | Unique membership per user per lifecycle |
| **API** | Duplicate active application blocked |
| **ADMIN UI** | Warning on duplicates |
| **MEMBER UI** | No family/group signup |
| **PROCESS** | Review during approval |

## **3\. MEMBERSHIP LIFECYCLE INVARIANTS**

### **INV-ML-01: Membership Instance Separation**

| Layer | Enforcement |
| :---- | :---- |
| **DB** | Separate user\_profiles and memberships tables |
| **API** | No direct status mutation on user |
| **ADMIN UI** | Membership-centric actions |
| **MEMBER UI** | Displays membership, not user state |
| **PROCESS** | None |

### **INV-ML-02: Single Active Membership Rule**

| Layer | Enforcement |
| :---- | :---- |
| **DB** | Partial unique index on ACTIVE / NOTICE\_PERIOD |
| **API** | Pre-activation check |
| **ADMIN UI** | Block approval if conflict |
| **MEMBER UI** | New application disabled |
| **PROCESS** | Approval checklist |

### **INV-ML-03: Allowed Membership Statuses**

| Layer | Enforcement |
| :---- | :---- |
| **DB** | Enum membership\_status |
| **API** | Status transition map |
| **ADMIN UI** | Dropdown restricted |
| **MEMBER UI** | Read-only display |
| **PROCESS** | None |

### **INV-ML-04: Lapsed Membership Finality**

| Layer | Enforcement |
| :---- | :---- |
| **DB** | Status immutable once LAPSED |
| **API** | Reactivation endpoint forbidden |
| **ADMIN UI** | Reactivate button absent |
| **MEMBER UI** | Reapply flow only |
| **PROCESS** | Fresh application required |

## **4\. FINANCIAL & DEPOSIT INVARIANTS**

### **INV-FN-01: Membership Fee Non-Refundability**

| Layer | Enforcement |
| :---- | :---- |
| **DB** | Fee transactions marked non-reversible |
| **API** | Refund endpoint disabled post-activation |
| **ADMIN UI** | Refund option hidden |
| **MEMBER UI** | Refund not shown |
| **PROCESS** | Treasurer enforcement |

### **INV-FN-02: Advance DFC Isolation**

| Layer | Enforcement |
| :---- | :---- |
| **DB** | Separate balance column security\_deposit\_balance |
| **API** | No debit during routine DFC |
| **ADMIN UI** | Deposit read-only |
| **MEMBER UI** | Informational only |
| **PROCESS** | Audit review |

### **INV-FN-03: Permitted Use of Advance DFC**

| Layer | Enforcement |
| :---- | :---- |
| **DB** | Adjustments logged as separate ledger entries |
| **API** | Adjustment endpoints restricted |
| **ADMIN UI** | Adjustment requires confirmation |
| **MEMBER UI** | Adjustment visible |
| **PROCESS** | Committee approval |

### **INV-FN-04: DFC Calculation Basis**

| Layer | Enforcement |
| :---- | :---- |
| **DB** | Age computed at demise date |
| **API** | DFC slab resolved at claim creation |
| **ADMIN UI** | Slab preview locked |
| **MEMBER UI** | No slab editing |
| **PROCESS** | None |

## **5\. PAYMENT DEFAULT & LAPSING INVARIANTS**

### **INV-LP-01 to INV-LP-04 (Payment → Lapsing)**

| Layer | Enforcement |
| :---- | :---- |
| **DB** | Due dates stored immutably |
| **API** | Scheduler-driven transitions |
| **ADMIN UI** | Status timeline visible |
| **MEMBER UI** | Dues alerts shown |
| **PROCESS** | Exception review |

## **6\. CLAIM & SETTLEMENT INVARIANTS**

### **INV-CL-01 to INV-CL-04**

| Layer | Enforcement |
| :---- | :---- |
| **DB** | Settlement snapshot immutability |
| **API** | Claim workflow guards |
| **ADMIN UI** | Settlement approval steps |
| **MEMBER UI** | Claim visibility |
| **PROCESS** | Committee verification |

## **7\. NOMINEE INVARIANTS**

### **INV-NM-01 & INV-NM-02**

| Layer | Enforcement |
| :---- | :---- |
| **DB** | Percentage sum constraint |
| **API** | Nominee validation |
| **ADMIN UI** | Validation warnings |
| **MEMBER UI** | Total must equal 100% |
| **PROCESS** | Legal verification |

## **8\. AI GOVERNANCE INVARIANTS**

### **INV-AI-01 & INV-AI-02**

| Layer | Enforcement |
| :---- | :---- |
| **DB** | Governance files read-only |
| **API** | No runtime mutation |
| **ADMIN UI** | Governance view-only |
| **MEMBER UI** | Not exposed |
| **PROCESS** | Vibe Coding Guide review |

## **Final Rule**

If an invariant is enforced only in one layer, it is considered fragile. Critical invariants must be enforced in at least two independent layers.  
**Last Reviewed:** 2026-01-15 **Owner:** Kish