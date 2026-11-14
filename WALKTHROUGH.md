# Three-Minute Video Demonstration Script & Walkthrough Guide

> **Questathon Customer Success Challenge**  
> Target Duration: 3 Minutes (180 Seconds)  
> Audience: Judging Panel & Executive Leadership

---

### Segment 1: Executive Overview & The 30-Second Handover (0:00 - 0:45)
- **Visual:** Open [http://localhost:3000](http://localhost:3000) on the Executive Overview screen.
- **Narrative:**
  - *"Good morning. This is the Questathon Live CRM—the system you would confidently hand your manager on Monday morning.
  On the surface, both accounts appear healthy: Eastern Counties Police Alliance has 35 docks under contract for £350,000, and Aldermoor Industrial Group has 14 docks for €140,000.
  However, our CRM immediately exposes hidden critical blockers:
  In Account A, the alliance champion Rhys Calder leaves in January, while a 4-month unassigned support ticket blocks two forces from flying.
  In Account B, three core docks unexpectedly flatlined to zero flights over the last two weeks, while the rollout lead departs imminently."*

---

### Segment 2: Answering the Five Critical Questions (0:45 - 1:30)
- **Visual:** Switch through the 5 Question tabs for Account A (Police Alliance):
  1. **Q1: Deal Value:** Show the separation between Identified (£3.55M), Qualified (£200k for Tarn Valley/Norwold), and Agreed (£0). Highlight that Rhys Calder's 300-dock tender claim is quarantined as unverified.
  2. **Q2: Power Map:** Highlight the shift from departing champion Rhys Calder to the real economic buyer, Ewan Brooks (Finance Partner, Metro Central), who confirms each force funds call-offs independently.
  3. **Q3: Next Actions:** Show the ranked P0 action: *Resolve Ticket FB-11206 with Insp. Karen Mbeki in writing by Friday ahead of the 5 December public policing event.*
  4. **Q4: Risk Radar:** Review the RED risk of unanswered event SLAs and AMBER risk of decentralized funding.
  5. **Q5: Blind Spot Finder:** Demonstrate the 6-point matrix explaining the missing Schedule 2 force billing split.

---

### Segment 3: Evidence Traceability in Action (1:30 - 2:00)
- **Visual:** Click `[View source]` next to the £200,000 Tarn Valley Qualified Expansion deal.
- **Narrative:**
  - *"Every number and claim in this CRM has an immutable evidence trail.
  When I click '[View source]' on the £200,000 expansion deal, the system opens our Evidence Modal, displaying the exact source excerpt from DPO Fatima Osei stating she cannot sign the DPIA without the data-flow documents requested four months ago.
  We see the exact file path (`tickets.json`), the date recorded, and the verification status ('TOLD'). Zero hallucination; 100% auditability."*

---

### Segment 4: Live Event Intelligence & Telemetry Adaptation (2:00 - 2:30)
- **Visual:** Navigate to the **Live Signals** tab.
- **Narrative:**
  - *"Our system continuously monitors live signals via the official MCP server.
  Notice the three incoming signals:
  First, Rhys Calder's departure notice received on 17 November.
  Second, Insp. Karen Mbeki's urgent ticket FB-11206 logged on 18 November for the 5 December event.
  Third, the usage anomaly at Aldermoor showing docks AD-02, 05, and 10 dropping from 7 flights to 0 flights in weekly telemetry.
  The CRM dynamically recalculates account health, elevates risk levels to RED, and re-orders the Next Best Actions."*

---

### Segment 5: Architecture, Token Security & MCP Write-Back (2:30 - 3:00)
- **Visual:** Navigate to **Sync & System Status** tab; open the **Write Note** modal.
- **Narrative:**
  - *"Behind the scenes, our Next.js application strictly complies with the 1-call-per-minute MCP rate limit using a persistent server-side caching architecture.
  The API token is never exposed to the browser or logs.
  Finally, when a CSM needs to record an action, clicking 'Write MCP Note' presents an explicit review and confirmation guard before transmitting the note back to the live MCP endpoint via `write_note`.
  This is a complete, resilient, production-ready system ready for deployment."*
