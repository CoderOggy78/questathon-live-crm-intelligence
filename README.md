# Questathon Live CRM Intelligence Platform

> **"The CRM you would hand your manager on Monday morning."**  
> An intelligent, evidence-backed decision-support system built for the Questathon Customer Success Challenge.

---

## 🌟 Executive Summary

Questathon Live CRM is a production-grade intelligence application designed for Customer Success Managers and leadership. Rather than a static mock dashboard, it directly connects to the official Model Context Protocol (MCP) server, ingests real-time business telemetry and communications across **two enterprise accounts**, models their commercial reality, and answers **five critical business questions** with 100% evidence traceability.

### The Two Enterprise Accounts
1. **Account A: Eastern Counties Police Alliance**
   - **Base Contract:** £350,000 / year (35 docks across 4 forces: Westmere, Metro Central, Tarn Valley, Norwold).
   - **Renewal Deadline:** 28 February 2027 (Strictly non-automatic).
   - **Core Blocker:** 4-month unassigned DPIA support ticket blocking £200k Tarn Valley & Norwold expansion.
   - **Critical Vulnerability:** Alliance Lead Rhys Calder leaves in January 2027; no pooled budget exists.
2. **Account B: Aldermoor Industrial Group**
   - **Base Contract:** €140,000 / year (14 docks across 15 plants).
   - **Renewal Deadline:** 31 January 2027 (Strictly non-automatic).
   - **Core Blocker:** Stefan Roy's €1.2M savings claim is unbooked in Finance; third-party guards ignore drone alerts.
   - **Critical Vulnerability:** 3 high-frequency docks (AD-02, AD-05, AD-10) recently suffered a 14-day zero-flight collapse; Stefan's deputy departs soon taking all deployment know-how.

---

## 🏗️ Architecture & 4-Layer Engine

```
┌─────────────────────────────────────────────────────────────┐
│                 LAYER 4: PRESENTATION UI                    │
│   Next.js 15 App Router • Tailwind CSS • Retro HUD Theme    │
│   11 Dedicated Intelligence Workspaces • Traceable Modals   │
└──────────────────────────────▲──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│             LAYER 3: EVIDENCE & AUDIT SYSTEM                │
│   Fact Status Tags: VERIFIED • TOLD • UNVERIFIED • INFERRED │
│   Source Artifact Excerpts • Invoices • Signed Order Forms  │
└──────────────────────────────▲──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│           LAYER 2: REASONING & POWER MAPPING                │
│   Economic Buyers • Technical Evaluators • Champions        │
│   Blockers • Next Best Action Ranking • Blind Spot Finder   │
└──────────────────────────────▲──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│        LAYER 1: DETERMINISTIC DATA & MCP DAEMON             │
│   Rate-Limit Scheduler (62s) • Persistent JSON / DB Cache   │
│   JSON-RPC 2.0 Client • write_note Confirmation Guard       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 MCP Server Integration

The system communicates with the official Questathon MCP server:
- **Endpoint:** `https://questathon.aihackerscollective.com/api/public/mcp`
- **Protocol:** JSON-RPC 2.0 over HTTPS POST
- **Authentication:** `Authorization: Bearer ${AQ_TOKEN}` (Stored strictly server-side)

### Strict 1-Call-Per-Minute Rate Limit Compliance
The official MCP endpoint enforces a strict rate limit of **1 call per minute per token**.
To eliminate 429 errors and guarantee zero quota exhaustion:
1. **Persistent Local Database:** All responses from `whoami`, `get_my_accounts`, `get_all_paperwork`, `get_signals`, `get_flytbase_team`, and `list_notes` are stored in `data/raw/` and indexed in `data/crm_db.json`.
2. **Background Sync Daemon (`sync_mcp.py`):** Automatically schedules sequential requests with a 62-second safety margin.
3. **Write-Back Protection:** The `write_note` modal includes a mandatory review step and explicit confirmation before initiating an MCP call.

---

## 🎯 The Five Critical Questions Answered

### Question 1: What is the Book Worth?
- **Total Identified Value:**
  - Account A: **£3,550,000** (£350k renewal + £200k expansion + £3M speculative tender).
  - Account B: **€720,000** (€140k renewal + €180k idle plants + €400k sister company).
- **Qualified Value:**
  - Account A: **£200,000** (Tarn Valley & Norwold expansion; blocked by DPIA).
  - Account B: **€180,000** (Idle plants regular patrol; blocked by IT network project).
- **Agreed Value:** **£0 / €0** (Both contracts require new order forms before Jan/Feb 2027).
- **Unverified Claims Separated:** Speculative 300-dock tender and unbooked €1.2M savings are quarantined from the qualified pipeline.

### Question 2: Who Holds the Power?
- **Account A (Police):**
  - *Economic Buyer:* Ewan Brooks (Finance Partner, Metro Central). Confirms each force funds call-offs from its own budget.
  - *Technical Evaluator:* Insp. Karen Mbeki (Westmere Drone Unit). Demands written SLA and training dates before 5 Dec public event.
  - *Compliance Gatekeeper:* Fatima Osei (DPO, Tarn Valley). Holds veto power over live operations until data-flow docs arrive.
  - *Departing Champion:* Rhys Calder (Alliance Lead). Exiting in January 2027.
- **Account B (Aldermoor):**
  - *Economic Buyer:* Nadia Rahman (Group Finance). Has booked zero savings from drones and requires audited evidence.
  - *Plant Operational Lead:* Beatriz Alonso (Plant 7). Explains guard contractor disconnect (alerts ping her personal phone).
  - *Central Champion:* Stefan Roy (Head of Security). Strong internal advocate but disconnected from plant-level reality.
  - *Deployment Lead:* Stefan's Deputy. Holds all technical setup know-how and departs imminently.

### Question 3: What Do You Do First? (Next Best Actions)
- **Account A:**
  1. *P0 (Due 2026-11-21):* Close Ticket FB-11206 with Insp. Karen Mbeki in writing with committed training and on-call SLA.
  2. *P0 (Due 2026-11-25):* Deliver FlytBase Engineering data-flow pack to DPO Fatima Osei to unblock £200k expansion.
  3. *P1 (Due 2026-12-05):* Executive transition meeting with Rhys Calder and member force CFOs.
- **Account B:**
  1. *P0 (Due 2026-12-02):* Telemetry audit and outreach to Beatriz Alonso regarding 2-week zero-flight blackout on AD-02, 05, 10.
  2. *P0 (Due 2026-12-10):* Codify deployment playbook with Stefan's deputy before his departure.
  3. *P1 (Due 2026-12-15):* Co-develop audited ROI model with Group Finance Controller Nadia Rahman.

### Question 4: What is About to Go Wrong? (Risk Radar)
- **Account A Risks:**
  - 🔴 **RED:** Champion departure without named successor (Rhys Calder leaving January).
  - 🔴 **RED:** Unanswered ticket FB-11206 ahead of 5 December public policing event.
  - 🟡 **AMBER:** 4-month unassigned support ticket blocking Tarn Valley/Norwold DPIA.
  - 🟡 **AMBER:** Decentralized funding risk (no pooled alliance budget).
- **Account B Risks:**
  - 🔴 **RED:** Sudden 14-day zero-flight collapse across docks AD-02, AD-05, AD-10.
  - 🔴 **RED:** Permanent loss of technical setup know-how when Stefan's deputy leaves.
  - 🟡 **AMBER:** Fictitious €1.2M savings calculation audited by skeptical Group Finance.
  - 🟡 **AMBER:** Guard contractor SLA disconnect causing plant alert fatigue.

### Question 5: What Do You Still Not Know? (Blind Spot Finder)
- **Account A Blind Spots:**
  - Successor for Rhys Calder (Alliance Lead).
  - Schedule 2 force billing split and individual CFO procurement codes.
  - Formal procurement timeline and specification for 300-dock tender.
- **Account B Blind Spots:**
  - Exact departure date for Stefan's deputy and status of handover.
  - Root cause of zero-flight anomaly on docks AD-02, 05, 10.
  - Corporate sponsor and formal contact details at 40-plant sister company.

---

## 💻 Installation & Local Development

### Prerequisites
- Node.js 18+ (Tested on Node 20 & 26)
- Python 3.9+
- An official Questathon Access Token (`AQ_TOKEN`)

### Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/CoderOggy78/questathon-live-crm.git
   cd questathon-live-crm
   ```

2. **Configure Environment Variables:**
   Create a `.env.local` file in the project root:
   ```bash
   AQ_TOKEN=your_token_here
   ```
   *(Ensure `.env.local` is never committed to version control)*

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Run Background MCP Ingestion (Optional - Cached data is already included):**
   ```bash
   python3 sync_mcp.py
   ```

5. **Start the Production Application:**
   ```bash
   npm run build
   npm run start
   ```
   Open [http://localhost:3000](http://localhost:3000) in any browser.

---

## 🔒 Security & Provenance Policy
- **No Token in Browser:** `AQ_TOKEN` is strictly consumed in server-side API routes (`src/app/api/*`). The frontend receives only masked identifiers (`aq1.b2e3...GCry`).
- **Zero Hallucination Guarantee:** Every deal number, quote, and risk is traceable to a primary source document in `data/raw/`. Click any `[View source]` tag in the UI to inspect the exact underlying artifact.
