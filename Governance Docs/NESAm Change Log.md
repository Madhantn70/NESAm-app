# **CHANGE\_LOG.md**

## **Purpose**

This document records authoritative decisions, rule changes, clarifications, and exceptions made in the NESAm program.  
Its purpose is to:

* Preserve decision memory beyond chats, meetings, and individuals  
* Prevent repeated debates on already-settled rules  
* Allow humans and AI to understand why the system is the way it is

If a rule, invariant, or behavior exists without an entry here, it is considered unjustified and unsafe.

## **Scope & Authority**

Applies to:

* Program rules  
* Membership lifecycle logic  
* Financial handling  
* Claim eligibility  
* Governance & AI usage

This log is append-only.

* Past entries must never be edited or deleted.  
* Later entries may supersede earlier ones, but must explicitly reference them.

## **Change Entry Format (MANDATORY)**

**CHG-XXX**

* **Date:**  
* **Category:** (Program | Membership | Finance | Claim | Governance | AI)  
* **Decision:**  
* **Reason:**  
* **Impacted Invariants:**  
* **Effective From:**  
* **Approved By:**  
* **Notes:**

## **INITIAL BASELINE ENTRIES**

### **CHG-001**

* **Date:** 2026-01-15  
* **Category:** Program  
* **Decision:** NESAm will remain inactive until a minimum of 100 registered members is achieved.  
* **Reason:** To ensure financial viability of claim settlements and prevent early insolvency.  
* **Impacted Invariants:**  
  * INV-PA-01  
* **Effective From:** Program Launch  
* **Approved By:** IRTTAA / NESAm Committee  
* **Notes:** Baseline rule from Byelaws §8.1

### **CHG-002**

* **Date:** 2026-01-15  
* **Category:** Finance  
* **Decision:** Membership fee is one-time and non-refundable after program activation.  
* **Reason:** Administrative and operational costs are incurred immediately upon enrollment.  
* **Impacted Invariants:**  
  * INV-FN-01  
* **Effective From:** Program Activation  
* **Approved By:** IRTTAA / NESAm Committee  
* **Notes:** Clarified in FAQs

### **CHG-003**

* **Date:** 2026-01-15  
* **Category:** Membership  
* **Decision:** A lapsed membership cannot be reactivated under any circumstance; reapplication is mandatory.  
* **Reason:** To maintain fairness and discourage delayed compliance.  
* **Impacted Invariants:**  
  * INV-ML-04  
* **Effective From:** Immediate  
* **Approved By:** NESAm Committee  
* **Notes:** Byelaws §11.1.9

### **CHG-004**

* **Date:** 2026-01-15  
* **Category:** Claim  
* **Decision:** Claims are not eligible during the Dormant Period except under explicitly approved exceptions.  
* **Reason:** To protect the fund during early membership phase and prevent misuse.  
* **Impacted Invariants:**  
  * INV-CL-02  
* **Effective From:** Immediate  
* **Approved By:** NESAm Committee  
* **Notes:** Dormant period default set to 3 months

### **CHG-005**

* **Date:** 2026-01-15  
* **Category:** Finance  
* **Decision:** Advance DFC (security deposit) shall not be used for routine DFC payments.  
* **Reason:** Advance DFC is intended as risk coverage, not contribution replacement.  
* **Impacted Invariants:**  
  * INV-FN-02  
  * INV-FN-03  
* **Effective From:** Immediate  
* **Approved By:** IRTTAA / NESAm Committee  
* **Notes:** Reflected in DB schema security\_deposit\_balance

### **CHG-006**

* **Date:** 2026-01-15  
* **Category:** AI  
* **Decision:** AI tools (including AI IDEs) are prohibited from modifying governance documents, invariants, or fee structures.  
* **Reason:** To prevent silent rule drift and loss of institutional intent.  
* **Impacted Invariants:**  
  * INV-AI-01  
  * INV-AI-02  
* **Effective From:** Immediate  
* **Approved By:** NESAm Governance  
* **Notes:** Aligned with AI Governance Manual v2.2

## **HOW TO USE THIS LOG**

1. Before implementing a rule → check if it exists here  
2. Before changing a rule → add a new entry  
3. When AI asks "why" → point to a CHG ID

## **ENFORCEMENT RULE**

Any behavior not traceable to a **DOMAIN\_CANON** term, an **INVARIANT**, and a **CHANGE\_LOG** entry is considered invalid.  
**Last Reviewed:** 2026-01-15 **Owner:** NESAm Governance / IRTTAA