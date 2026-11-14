# Thinking Doc: AI Account Intelligence & Revenue Operations Platform
**Questathon Customer Success Challenge**  
**Author:** Vishwanath Barve (`barvevishwanath9@gmail.com` / GitHub: `@CoderOggy78`)  
**Project:** Questathon Live CRM Intelligence Platform  
**Target Accounts:** Eastern Counties Police Alliance (£350k ACV) & Aldermoor Industrial Group (€140k ACV)

---

## 1. What It Does and For Whom

### The Target Persona
Built specifically for a **VP of Customer Success, Chief Revenue Officer (CRO), or incoming Enterprise CSM** taking over accounts on Monday morning at 09:00 who needs an immediate, unvarnished, and actionable truth of their portfolio.

### The Core Problem Solved
Traditional CRMs are passive data repositories filled with unverified sales optimism and stale status fields. When an enterprise account is in jeopardy, a manager cannot distinguish between what a customer *claims* and what the contract and telemetry *prove*. 

This platform transforms raw customer communications, support queues, invoices, and flight telemetry into an **intelligent, evidence-backed decision-support system**. It ingests live data across two complex enterprise accounts via the Model Context Protocol (MCP), reconciles £490,000 in baseline recurring revenue, answers the **Five Critical Business Questions**, and arms leadership with battle-ready playbooks:
- **Account A (Eastern Counties Police Alliance — £350k ACV):** Exposes that only Westmere is flying operational missions; uncovers that Tarn Valley & Norwold expansion (£200k) is paralyzed by a 4-month unassigned DPIA ticket (`FB-10492`); and reveals that no pooled alliance budget exists before champion Rhys Calder exits in January 2027.
- **Account B (Aldermoor Industrial Group — €140k ACV):** Audits and quarantines Stefan Roy's €1.2M savings claim (booked as €0 in finance); detects an active telemetry blackout where 3 docks (`AD-02`, `05`, `10`) halted flights in November while reporting online; and flags a departing deputy holding unwritten rollout SOPs.

---

## 2. How It Decides (The Reasoning & Audit Engine)

The platform operates on a deterministic **4-Layer Decision Framework**:

1. **Strict Rate-Limit Aware Data Pipeline (Layer 1):**  
   Adheres to the official 1-call-per-minute constraint via a persistent daemon queue with a 62-second cooldown window. Responses from all 14 MCP tools are cached in a local normalized store (`crm_db.json`). Frontend navigation and analytical queries execute against this database in under 5ms without ever making redundant MCP calls.
2. **Epistemic Statement Classification (Layer 2):**  
   Every claim and fact in the account history is categorized into an explicit verification tier:
   - `VERIFIED`: Confirmed by primary financial or operational records (e.g., Paid invoices `INV-2026-001/004`, 1,497 flights in telemetry).
   - `TOLD`: Stated by a customer during discovery but uncorroborated by secondary records.
   - `CLAIM / SPECULATIVE`: Assertions contradicted by evidence (e.g., Stefan’s €1.2M savings refuted by Finance on 8 Oct; Rhys’s 300-dock tender refuted by CFO Ewan Brooks).
3. **Audited Commercial Waterfall (Layer 3):**  
   Strictly separates verified baseline recurring revenue (£490k) and qualified achievable expansion (£380k) from quarantined speculative figures (£4.5M). It never books pipeline without resolved blockers.
4. **Impact-Ranked Prioritization (Layer 4):**  
   Next actions are ranked by contractual deadline urgency and churn risk. For example, Inspector Karen Mbeki’s ticket (`FB-11206`) for a 5 Dec public policing event is assigned P0 priority because a failure destroys operational trust immediately prior to the February non-automatic renewal.

---

## 3. What It Does Not Do Yet (Current Limitations & Roadmap)

To maintain enterprise integrity, the platform maintains clear boundaries:

- **Autonomous External Execution (Human-in-the-Loop):** While the system drafts P0 SLA confirmations, engineering escalation memos, and posts structured notes back via MCP (`write_note`), it does not autonomously send external emails or close ticketing systems without explicit CSM sign-off.
- **Real-Time High-Frequency Drone Telemetry Ingestion:** Telemetry is analyzed at the weekly and mission level from ingested CSV flight records. It does not ingest sub-second raw LiDAR, motor RPM, or battery cell voltage streams directly from drone hardware in flight.
- **Predictive ML Churn Probability Modeling:** Risk scores are calculated deterministically based on rule-weighted evidence (e.g., champion departure + blocked DPIA + unbooked savings). It does not yet train black-box deep learning models on multi-year longitudinal CRM data.
- **Multi-Tenant Enterprise RBAC:** Currently designed as an executive single-operator cockpit. Granular role-based access control (e.g., restricting Tier-1 support agents from viewing executive margin models) is slated for v3.0.

---

## 4. How We Used AI

AI was applied deliberately as an **intelligence amplifier and truth reconciliation engine**, rather than for cosmetic text generation:

- **Evidence-Grounded Account Copilot (`/api/copilot`):** We built a deterministic retrieval and reasoning engine that maps natural language queries to primary MCP files (`tickets.json`, `calls.json`, `usage_weekly.csv`, `roi_spreadsheet.csv`). When asked questions like *"Why did AD-02 stop flying?"* or *"Is the €1.2M savings real?"*, the AI extracts root causes and returns precise citations with zero hallucination.
- **Cross-Record Epistemic Auditing:** AI agents cross-referenced discovery call transcripts against ticketing logs, emails, and financial ledgers to automatically detect contradictions—such as identifying that Stefan Roy’s savings spreadsheet contradicted Group Finance's 8 October mailbox memo.
- **Executive Voice Synthesis & Teleprompter:** Integrated the Web Speech API with real-time animated waveform equalization to convert dense text dossiers into an interactive 3-minute Monday morning audio digest for commuting managers, dynamically highlighting sentences as they are spoken.
- **Dynamic Scenario Simulation:** AI models commercial consequences across 3 discrete futures—*Inaction* (-£490k churn), *Defensive Retention* (£490k base protected), and *Full Unblock* (£870k total ARR)—linking each outcome to specific operational levers.
