# **NESAm: AI Vibe-Coding Governance Manual**

**Version:** 2.2 (The "Anti-Drift" Edition) **Context:** AI-Assisted Development (Antigravity IDE / Multi-Branch) **Core Philosophy:** "Chats are disposable. Files are Law. Git is Memory. AI is Labor."

## **1\. THE CORE TRUTH**

To ensure the system works even if you start a **new chat**, switch **AI models**, or return after **6 months**, we must eliminate "Chat State" dependency.

* **Rule 1:** Never rely on "As discussed earlier."  
* **Rule 2:** The repository itself must fully reconstruct the context.  
* **Rule 3:** If anything important lives only in chat, the system is broken.

## **2\. THE 7 PILLARS OF ANTI-DRIFT (The "Law")**

*Non-negotiable rules preventing hallucination and logic decay.*

### **Pillar 1: Single Source of Truth (SSOT)**

AI does not decide meaning; documentation does.

* **Artifact:** governance/DOMAIN\_CANON.md  
* **Rule:** Defines immutable terms (e.g., "DFC is a variable contribution," "Status: Lapsed vs. Inactive").  
* **Enforcement:** AI must reference Canon IDs when implementing logic.

### **Pillar 2: Versioned Contracts**

AI cannot guess API shapes or Database schemas.

* **Artifact:** contracts/api/v1.openapi.yaml & contracts/db/schema.prisma  
* **Rule:** AI is forbidden from adding fields or renaming columns without a pre-approved Change Request (CR).

### **Pillar 3: Invariant Rulebook**

Business rules that must never break.

* **Artifact:** governance/INVARIANTS.md  
* **Examples:**  
  * *INV-01:* A Lapsed member cannot pay Dues; they must Re-register.  
  * *INV-02:* security\_deposit\_balance is touched *only* on Death or Lapsing.

### **Pillar 4: AI Role Constraints**

Forcing AI into a psychological "cage."

* **Artifact:** governance/STEERING\_RULES.md  
* **System Prompt:** "You are a Senior Production Engineer. You are NOT allowed to optimize unless asked. You MUST fail if an Invariant is violated."

### **Pillar 5: Change Control**

AI is a worker, not an architect.

* **Artifact:** governance/CHANGE\_REQUEST.md  
* **Workflow:** No schema change happens in a feature branch without a merged CR in the governance branch first.

### **Pillar 6: Snapshot Testing (The Trap)**

Detecting silent drift in outputs.

* **Mechanism:** scripts/snapshot\_guard.sh  
* **Action:** Hashes critical files (API specs, DB schema). If AI output changes the hash without an explicit version bump, the build fails.

### **Pillar 7: Context Rehydration**

Solving "New Chat" amnesia.

* **Artifact:** governance/CONTEXT\_BOOTSTRAP.md  
* **Rule:** This file is pasted at the start of *every* AI session to realign the AI with the project's current state.

## **3\. THE 12 LAYERS OF STATELESS CONTEXT**

*Ensuring the system survives if you delete all chat history.*

1. **Chat-State Elimination:** All instructions must come from files.  
2. **Self-Describing Codebase:** Every folder has a README.md explaining *why* it exists and *what* AI is allowed to do there.  
3. **Canonical Language Lock:** A GLOSSARY.md stops AI from using synonyms (e.g., "Premium" instead of "Contribution").  
4. **Decision Immutability:** architecture/ADR/ stores "Why we chose Postgres." AI cannot revisit accepted ADRs.  
5. **Agentic Leash:** Reasoning loops limited to "Plan \-\> Check Canon \-\> Implement \-\> Verify." No recursive refactoring.  
6. **Failure-First Design:** FAILURE\_MODES.md mandates defining failure handling (e.g., "Network down") before coding the happy path.  
7. **Schema Freeze:** Cryptographic hashes of contracts prevent accidental edits.  
8. **Prompt Versioning:** ai\_prompts/v1\_backend.md. Prompts are version-controlled code.  
9. **AI Output Validation:** An AI\_REVIEW\_CHECKLIST.md used to audit AI PRs.  
10. **Model Independence:** Logic lives in files, not prompts. Works on GPT-4, Claude, or Gemini.  
11. **Time-Gap Resilience:** Documentation is sufficient for a human to understand the system without AI.  
12. **Mental Model:** "AI is Labor, Git is Judge."

## **4\. STRUCTURAL FACTORS (File Strategy)**

*Organized to separate Law, Labor, and Chaos.*  
`/project-root`  
  `├── governance/           # READ-ONLY for Feature Branches (The Law)`  
  `│   ├── DOMAIN_CANON.md`  
  `│   ├── INVARIANTS.md`  
  `│   ├── SECURITY_MODEL.md`  
  `│   ├── INTENT_INTERPRETATION_PROTOCOL.md # (The Magic Flow)`  
  `│   ├── INTENT_LOG.md`  
  `│   ├── INTENT_VERSIONING_RULE.md         # <-- NEW`  
  `│   ├── INTENT_CONFLICT_MATRIX.md         # <-- NEW`  
  `│   ├── AI_CONFIDENCE_PROTOCOL.md         # <-- NEW`  
  `│   ├── ANTI-FATIGUE_GUARDS.md            # <-- NEW`  
  `│   └── CONTEXT_BOOTSTRAP.md`  
  `├── contracts/            # SINGLE SOURCE OF TRUTH`  
  `│   ├── api/`  
  `│   └── db/`  
  `├── ai_ledger/            # AI MEMORY (Structured Logs)`  
  `│   ├── decisions/        # ADRs (AID-001)`  
  `│   ├── sessions/         # Summarized session logs`  
  `│   └── changes/          # Traceability (CHG-001)`  
  `├── ai_sandbox/           # CHAOS ZONE (Trash Can)`  
  `│   ├── experiments/`  
  `│   └── scripts/`  
  `│   # RULE: Deleted before release. Never imported by src/.`  
  `├── ui_canon/             # UI LAW (Figma Contract)`  
  `│   ├── SCREENS/`  
  `│   ├── COMPONENTS/`  
  `│   └── TOKENS/`  
  `├── src/                  # PRODUCTION CODE`  
  `└── tests/                # REAL TESTS`

## **5\. OPERATIONAL FACTORS (Git & Antigravity)**

*Preventing collapse in parallel development.*

### **Git Operating System**

* **Branches:**  
  * main: Release only (Tagged).  
  * develop: Integration.  
  * feature/\<name\>: AI works here.  
  * ai/\<experiment\>: AI Sandbox.  
* **Rules:**  
  * AI never commits to main or develop.  
  * Squash merges only (one clean commit per feature).  
  * **Commit Message:** feat(auth): add jwt refresh (Conventional Commits).

### **Incident & Rollback Strategy**

* **Tags are Immutable:** Releases (e.g., v1.2.0) are locked.  
* **Rollback Protocol:** If Prod breaks, redeploy previous tag (v1.1.9).  
* **No Hotfixes on Main:** Hotfixes must go through fix/ branch \-\> develop \-\> release \-\> main.

### **Antigravity Protocol (Scope Locking)**

* **Branch-Scoped Prompting:** Every prompt MUST start with:  
  `MODE: Production`  
  `BRANCH: feature/order-workflow`  
  `READ-ONLY: governance/*, contracts/*`  
  `FORBIDDEN: Schema changes, Security relaxation`  
  `TASK: Implement order logic within existing contracts.`

* **Local Context:** Each branch gets a branch\_context.md.  
* **Merge Gating:** PRs blocked if governance/ is modified without a Change Request.

### **Cross-Branch Semantic Safety**

* **Rule:** Before merging to develop, AI must be asked: **"Given all invariants, does this change conflict with any recent merged features?"**  
* **Why:** Prevents Branch A (Order Validation) and Branch B (Payment Rules) from merging individually valid changes that create a shared violation.  
* **Mechanism:** Mandatory AI Semantic Audit Step before Merge.

## **6\. INTEGRATION FACTORS (UI/UX & Figma)**

*AI implements, never interprets.*

### **The UI Canon (ui\_canon/)**

* **Screen Specs:** SCREENS/order\_list.md (Layout order, states, interactions).  
* **Component Specs:** COMPONENTS/button.md (Props, behavior).  
* **Tokens:** TOKENS/colors.json (Hex codes).  
* **Rule:** AI is forbidden from inventing colors or "improving" UX.

### **Workflow**

1. **Figma Update:** UI/UX team updates design & exports to ui\_canon/.  
2. **Version Bump:** ui\_canon version updated.  
3. **Rebase:** Dev team rebases feature branch.  
4. **Implement:** AI implements strictly against ui\_canon.  
5. **Verify:** Ask AI: "Compare implementation with ui\_canon. List deviations."

## **7\. DOCUMENTATION FACTORS (The AI Ledger)**

*Replacing Chat Logs with Structured History.*  
We do not save chat transcripts. We save **decisions**.

### **1\. Session Logs (ai\_ledger/sessions/)**

Summarized record of *what* was done, not said.

* **Template:** Date, Context, Prompts (Summarized), Key Response, Files Modified, Invariants Affected.

### **2\. AI Decision Records (ai\_ledger/decisions/)**

* **AID-001:** "Why we chose DB-level enums over App-level enums."  
* **Status:** ACCEPTED / REJECTED.

### **3\. Change Trace (ai\_ledger/changes/)**

* **CHG-001:** Links Prompt \\to Decision \\to Commit \\to Release.

## **8\. REMAINING FACTORS (Control & Safety)**

### **Security & Privacy (SECURITY\_MODEL.md)**

* **Data Classification:** PUBLIC / INTERNAL / SENSITIVE.  
* **Rules:**  
  * No PII in logs.  
  * No secrets in frontend.  
  * No direct DB access from mobile.

### **Intent Preservation (INTENT\_LOG.md)**

* **Why Registry:** "Why is Status Lifecycle strict?" \-\> "Regulatory Audit."  
* **Rule:** AI cannot refactor logic without referencing an Intent ID.

### **Non-Functional Requirements (NFR.md)**

* **Cost Guards:** No background polling \< 5 min. No N+1 queries.  
* **Performance:** API latency p95 \< 300ms.  
* **Offline:** Writes must succeed without network.

### **Failure Modes (FAILURE\_MATRIX.md)**

* **Rule:** No feature is "done" unless failure modes (Network down, Token expired) are defined and handled.

### **Human Override Gates (HUMAN\_APPROVAL\_GATES.md)**

* **Manual Gates:** Schema changes, Auth logic, Release tagging.  
* **Exit Strategy:** Code and Docs must be understandable without AI.

### **AI Stop Conditions (MANDATORY)**

AI must **STOP** and ask for clarification if:

* A required token is missing.  
* A screen spec is ambiguous.  
* A contract conflicts with UI canon.  
* Two invariants appear contradictory.  
* A change affects security, auth, or schema.

*Why this matters:* Prevents AI from "choosing one interpretation" arbitrarily, which causes parallel branch collapse.

### **Environment Governance**

* **No Secrets in Repo:** .env files are git-ignored.  
* **Documentation:** Env variables are documented in ENV\_TEMPLATE.md, never guessed.  
* **Governance:** AI cannot introduce new env keys without approval (Change Request).

### **Invariants Coverage Strategy**

* **Problem:** Invariants exist in docs but code enforcement is spotty.  
* **New Artifact:** governance/INVARIANT\_COVERAGE.md.  
  * *Example:* INV-01: Enforced at \-\> DB (CHECK), API (OrderGuard), UI (Disabled).  
* **Rule:** An invariant without declared coverage in this file is considered **broken by default**.

### **AI Output Determinism Checks**

* **Rule:** For high-risk changes (Auth, Schema, Invariants), run the exact same prompt twice.  
* **Mechanism:** Compare outputs. If materially different \-\> **STOP** and escalate.  
* **Why:** Non-determinism indicates ambiguity or under-specification.

### **Knowledge Freshness Control**

* **Rule:** Each governance document must contain:  
  * Last Reviewed Date  
  * Review Owner  
* **Trigger:** If review date \> 90 days old, AI must **warn** before relying on it.

### **Prompt-to-Code Blast Radius Declaration**

* **Rule:** Before implementation, AI must declare:  
  * Files Affected  
  * Invariants Touched  
  * Risk Level (Low/Medium/High)  
* **Gate:** If **High**, mandatory human review is triggered before code generation.

### **Intent Drift Over Time (Intent Versioning)**

* **Problem:** Intent definitions evolve, making old canonical intents subtly wrong over time.  
* **Solution:** INTENT\_VERSIONING\_RULE.md.  
  * **Rule:** Every canonical intent must have an ID and version (e.g., INT-ORDER-LOCK v1 vs v2).  
  * **Trigger:** If intent meaning changes, version must increment.  
* **Why:** Prevents time-based semantic drift in long-running projects.

### **Cross-Team Intent Collision Detection**

* **Problem:** Two teams normalize intent correctly but conflictingly (e.g., Team A locks approved orders, Team B allows admin overrides).  
* **Solution:** INTENT\_CONFLICT\_MATRIX.md.  
  * **Rule:** Before merge, list all canonical intents touched and check for conflicts.  
  * **Trigger:** If conflict detected \-\> **STOP** and escalate.  
* **Why:** Ensures intent-level merge safety, not just code-level safety.

### **AI Confidence & Uncertainty Signaling**

* **Problem:** AI sounds confident even when unsure or making assumptions.  
* **Solution:** AI\_CONFIDENCE\_PROTOCOL.md.  
  * **Rule:** AI must declare Confidence Level (High/Medium/Low) before implementation.  
  * **Action:**  
    * **Low:** STOP and ask.  
    * **Medium:** Human review required.  
    * **High:** Proceed.  
* **Why:** Reduces quiet wrong implementations driven by false confidence.

### **Anti-Fatigue Guards (Human Shortcut Protection)**

* **Problem:** Humans skip steps and trust AI blindly after weeks of work.  
* **Solution:** ANTI-FATIGUE\_GUARDS.md.  
  * **Rules:**  
    * No task \> 2 hours without re-reading CONTEXT\_BOOTSTRAP.md.  
    * No merge without AI semantic audit.  
    * No override without ai\_ledger entry.  
* **Why:** Protects the system from human fatigue, which causes more drift than AI hallucination.

## **9\. AI AUTHORITY & LIFECYCLE PROTOCOLS**

*Defining strict boundaries and lifecycle events.*

### **AI Authority Matrix**

| Area | AI Allowed | Human Required |
| :---- | :---- | :---- |
| **UI Implementation** | Yes | No |
| **Business Logic** | Yes | Review |
| **Invariants** | No | **Yes** |
| **Schema Changes** | No | **Yes** |
| **Security/Auth** | No | **Yes** |
| **Release Tagging** | No | **Yes** |

### **New Session / New Developer Boot Sequence**

1. Read CONTEXT\_BOOTSTRAP.md.  
2. Read DOMAIN\_CANON.md.  
3. Read INVARIANTS.md.  
4. Read latest RELEASE\_NOTES.md.  
5. Read relevant AID-xxx decisions.  
6. *Only then start work.*

### **Pre-Release Cleanup (Decommission Phase)**

* **Delete:** rm \-rf ai\_sandbox/  
* **Verify:** Ensure no production code imports from ai\_sandbox.  
* **Freeze:** Lock governance/ and contracts/ for final review.

### **AI–Human Disagreement Protocol**

* **Rule:** If a human disagrees with AI output:  
  * **Human decision wins.**  
  * Rationale must be logged in ai\_ledger/decisions/.  
  * AI must treat it as **final**.  
* **Why:** Avoids silent resentment and undocumented overrides.

## **10\. INTENT INTERPRETATION PROTOCOL (The Magic Flow)**

*The single most important missing artifact. It sits between user prompts and AI execution.*  
**Flow:** Human Prompt \\to Intent Interpretation \\to Canonical Intent Declaration \\to Constraint Check \\to Implementation.

### **1\. Intent Extraction Rules**

* AI must restate user's intent using **ONLY** DOMAIN\_CANON vocabulary.  
* No synonyms. No new concepts.  
* If intent cannot be expressed using Canon terms \-\> **STOP**.

### **2\. Intent Classification**

* **Types:** UI\_IMPLEMENTATION, BUSINESS\_LOGIC, VALIDATION, REFACTOR, PERFORMANCE, SECURITY, SCHEMA.  
* **Authority:** Different intent types have different authority limits (see Authority Matrix).

### **3\. Intent Authority Resolution**

* If Intent Type \\in {SCHEMA, SECURITY, INVARIANTS} \\to **Human Approval Required**.  
* If Intent Type \\in {UI\_IMPLEMENTATION, VALIDATION} \\to **AI May Proceed**.

### **4\. Ambiguity Detection**

* If multiple interpretations exist (e.g., "Close Order" \= Status CLOSED vs Hide from UI?), AI must list them and **STOP**.

### **5\. Canonical Intent Declaration (Freeze Point)**

Before coding, AI must emit and freeze the intent:

* **CANONICAL INTENT:**  
  * Entity: Order  
  * Fields Affected: status  
  * Invariant Touched: INV-05  
  * Scope: API \+ UI  
* **Rule:** No code generation is allowed until intent is normalized and frozen.

## 