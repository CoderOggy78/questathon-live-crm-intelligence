# Questathon CRM Intelligence: Strategic Thinking & Decision Architecture

> **"Build a live CRM for your two accounts: the one you would hand your manager on Monday."**  
> Prepared for the Questathon Evaluation Committee and Senior Leadership.

---

### 1. What the CRM Does
The Questathon CRM is an evidence-grounded decision-support system. It transforms raw, fragmented, multi-source telemetry—support tickets, order forms, email logs, call transcripts, weekly flight counts, and live signals—into an actionable commercial intelligence dashboard. It moves beyond passive record-keeping to actively defend **£490,000** in base recurring revenue and de-risk **£380,000** in qualified expansions across two enterprise accounts.

### 2. Who It Is Designed For
It is built specifically for **Customer Success Managers (CSMs)**, **Heads of Customer Success**, and **Executive Account Sponsors**. The interface is designed for two primary operating modes:
- **The 30-Second Executive Glance:** Leadership can instantly discern account vulnerability, renewal countdowns, total qualified pipeline, and impending churn risks.
- **The Operational Tactical Workspace:** The working CSM receives concrete, daily prioritized tasks with owners, deadlines, and source documentation to immediately unblock customer adoption.

### 3. How It Makes Decisions
The platform rejects "black-box" decision making. It uses a **deterministic hybrid architecture**:
1. **Mathematical Hard Bounds:** Pipeline sums, flight counts, contract terms, and invoice values are computed deterministically using audited mathematical functions.
2. **Deterministic Rules Engine:** A deal cannot be marked as "Qualified" unless primary source evidence proves an operational need; it cannot be marked as "Agreed" without an executed order form.
3. **Evidence-Weighted Prioritization:** Actions and risks are ranked by an algorithm that evaluates commercial exposure, deadline proximity, and single-point-of-failure severity.

### 4. How It Calculates Deal Values
To protect commercial integrity, the platform strictly segregates:
- **Identified Value:** All opportunities mentioned during discovery (£3.55M for Alliance A; €720k for Aldermoor B).
- **Qualified Value:** Opportunities backed by operational necessity where blockers are clearly identified (£200k for Tarn Valley/Norwold; €180k for Aldermoor idle plants).
- **Agreed Value:** Only signed, binding contracts for future periods. Since neither account has executed a renewal order form for 2027, Agreed Value is strictly calculated as **£0**.
- **Unverified / Speculative Claims:** Rhys Calder’s verbal 300-dock tender claim and Stefan Roy’s €1.2M theoretical spreadsheet are explicitly quarantined from forecasting.

### 5. How It Identifies Stakeholders
Titles in enterprise accounts are frequently misleading. The CRM identifies stakeholders based on **functional authority extracted from paperwork records**:
- **Economic Buyers:** Verified by financial sign-off power (e.g. Ewan Brooks, who confirms that each force CFO must sign off individually).
- **Technical Evaluators:** Verified by operational control over field missions (Insp. Karen Mbeki, the sole inspector actively flying operations).
- **Gatekeepers / Blockers:** Identified by statutory or audit authority (DPO Fatima Osei, whose unsigned DPIA keeps two forces grounded).
- **Champions:** Identified by historical advocacy, but audited for single-threaded fragility (Rhys Calder, whose impending January departure threatens Alliance continuity).

### 6. How It Ranks Recommended Actions
Next Best Actions are generated using a 4-dimensional scoring model:
$$\text{Priority Score} = \text{Deal Value Weight} + \text{Deadline Urgency} + \text{Blocker Leverage} + \text{Stakeholder Influence}$$
- **P0 Priority (Account A):** Resolving Karen Mbeki’s Ticket FB-11206 in writing before the 5 December event scores highest because failing a live public policing event would cause catastrophic reputational churn.
- **P0 Priority (Account B):** Auditing the 2-week zero-flight blackout on docks AD-02, 05, and 10 scores highest because unexplained telemetry collapse precedes immediate contract termination.

### 7. How It Identifies Risks
The Risk Radar operates on continuous anomaly detection across four domains:
1. **Contractual Deadlines:** Non-automatic renewal dates (31 Jan 2027 and 28 Feb 2027) trigger escalation 90 days out.
2. **Personnel Attrition:** Live signals announcing champion departures (Rhys Calder) or rollout lead exits (Stefan's deputy) automatically elevate account vulnerability to RED.
3. **Operational Inactivity:** Weekly usage logs showing active docks dropping to 0 flights trigger immediate telemetry warnings.
4. **Unanswered Inbound SLA:** Tickets lingering unassigned in support queues (FB-11206 and Tarn Valley DPIA) are flagged as systemic customer neglect.

### 8. What It Does Not Know or Do Yet (Blind Spots)
The system maintains intellectual honesty by refusing to fabricate data where gaps exist:
- It does not assume who will succeed Rhys Calder in January.
- It does not assume Schedule 2 force billing splits without viewing Accounts archives.
- It does not guess why docks AD-02, 05, and 10 stopped flying—it explicitly flags this as an unverified site condition requiring CSM investigation.

### 9. How Evidence Traceability Works
Every factual assertion in the application is linked to an underlying primary source artifact stored in the local MCP cache (`data/raw/`). When a user clicks `[View source]` or any fact tag:
- The system opens an **Evidence Modal** querying `/api/evidence`.
- It displays the full verbatim text excerpt, the path of the original document, the date recorded, and the attribution status (`VERIFIED`, `TOLD`, `UNVERIFIED`).

### 10. How AI Was Used
AI was deployed strictly as an **analytical reasoning layer**, never as a raw data generator:
- **Conversation & Document Synthesis:** AI extracted implicit relationship dynamics, unexpressed frustrations, and commercial blockers from dense call notes and email chains.
- **Hypothesis Formulation:** AI formulated concrete, non-generic operational recommendations grounded in FlytBase product realities.
- **Zero Hallucination Barrier:** All AI outputs were validated against the deterministic Layer 1 schema to ensure that no fictitious numbers, people, or contracts entered the CRM.
