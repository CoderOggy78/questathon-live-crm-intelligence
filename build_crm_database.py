import os
import json
import glob

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
RAW_DIR = os.path.join(DATA_DIR, "raw")

def load_json(filename):
    path = os.path.join(RAW_DIR, filename)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            res = json.load(f)
            if "result" in res and "content" in res["result"] and len(res["result"]["content"]) > 0:
                text = res["result"]["content"][0]["text"]
                return json.loads(text)
    return None

def build_db():
    accounts_data = load_json("get_my_accounts.json")
    signals_data = load_json("get_signals.json") or {"signals": []}
    paperwork_A = load_json("get_all_paperwork_account-A.json") or {"records": []}
    paperwork_B = load_json("get_all_paperwork_account-B.json") or {"records": []}
    
    if not accounts_data:
        print("Waiting for accounts data...")
        return
        
    records_A = {r["path"]: r for r in paperwork_A.get("records", [])}
    records_B = {r["path"]: r for r in paperwork_B.get("records", [])}
    
    signals = signals_data.get("signals", [])
    
    db = {
        "generated_at": accounts_data.get("exported_at"),
        "minute": accounts_data.get("minute", 72),
        "player": accounts_data.get("player"),
        "accounts": {}
    }
    
    for raw_acc in accounts_data.get("accounts", []):
        acc_id = raw_acc["id"]
        records = records_A if acc_id == "A" else records_B
        acc_signals = [s for s in signals if s.get("account") == acc_id]
        
        # Determine currency & baseline values
        currency = "GBP" if acc_id == "A" else "EUR"
        symbol = "£" if acc_id == "A" else "€"
        
        # Parse invoices / contract details
        contract_text = records.get("contract.txt", {}).get("text", "")
        deal_hist = records.get("deal_history.json", {}).get("data", {})
        invoices = records.get("invoices.json", {}).get("data", {})
        
        annual_val = 350000 if acc_id == "A" else 140000
        renewal_deadline = "2027-02-28" if acc_id == "A" else "2027-01-31"
        
        # 1. QUESTION 1: WHAT IS THE BOOK WORTH?
        # Commercial Opportunities breakdown
        deals = []
        if acc_id == "A":
            deals = [
                {
                    "id": "a_renewal",
                    "name": "Contract Renewal (35 Docks Across 4 Forces)",
                    "value": 350000,
                    "currency": "GBP",
                    "stage": "IDENTIFIED",
                    "status": "AT_RISK",
                    "fact_status": "VERIFIED",
                    "confidence": "Medium (Contract verified £350k; but Rhys Calder departing & no pooled budget)",
                    "source_document": "contract.txt & deal_history.json",
                    "source_record_id": "rc_appetite_2, contract.txt, invoices.json",
                    "excerpt": "Term: 1 March 2026 to 28 February 2027. Price: £350,000/yr. No automatic renewal. Invoiced in 4 parts across Westmere, Metro Central, Tarn Valley, Norwold.",
                    "notes": "Contract signed by alliance office, but Ewan Brooks confirms each force pays from separate budget and each CFO must approve call-off."
                },
                {
                    "id": "a_tarn",
                    "name": "Tarn Valley & Norwold Go-Live Expansion",
                    "value": 200000,
                    "currency": "GBP",
                    "stage": "QUALIFIED",
                    "status": "BLOCKED",
                    "fact_status": "VERIFIED",
                    "confidence": "High potential (£200k qualified), currently 100% blocked by unassigned DPIA support ticket",
                    "source_document": "tickets.json & calls/fo_dpia",
                    "source_record_id": "fo_dpia_2, fo_needs_3, pj_ticket, srv_dataflow",
                    "excerpt": "Fatima Osei (DPO): 'It cannot be signed until we receive the data-flow documents we asked FlytBase for 4 months ago.' Ticket sits unassigned. Engineering can deliver in 1 week if CSM drives.",
                    "notes": "Norwold is waiting to copy Tarn Valley's assessment. Once DPIA unblocks, both forces can operationalize live flights."
                },
                {
                    "id": "a_stadium",
                    "name": "Westmere Stadium Project (30 Docks)",
                    "value": 300000,
                    "currency": "GBP",
                    "stage": "IDENTIFIED",
                    "status": "UNVERIFIED_CLAIM",
                    "fact_status": "TOLD",
                    "confidence": "Low (Rhys Calder verbal claim only, no formal quote issued, subject to urgent 5 Dec event)",
                    "source_document": "emails/2026-10-02_rhys_stadium.txt",
                    "source_record_id": "rc_stadium_0",
                    "excerpt": "Rhys Calder mentioned 30 docks for stadium policing. No formal quote on file.",
                    "notes": "Insp. Karen Mbeki is demanding operator training and on-day SLA by this week ahead of 5 Dec event before committing to further expansion."
                },
                {
                    "id": "a_tender",
                    "name": "Framework Tender (Up to 300 Docks)",
                    "value": 3000000,
                    "currency": "GBP",
                    "stage": "IDENTIFIED",
                    "status": "UNVERIFIED_SPECULATIVE",
                    "fact_status": "TOLD",
                    "confidence": "Speculative (Told by Rhys Calder; no procurement notice, spec or pooled alliance budget on file)",
                    "source_document": "deal_history.json & rc_tender_0",
                    "source_record_id": "rc_tender_0, rc_funding_2",
                    "excerpt": "Rhys Calder says 300-dock framework in prep. But fact rc_funding_2 proves no pooled budget exists; each force CFO must sign off individually.",
                    "notes": "Must not be booked in pipeline until published and alliance governance confirmed."
                }
            ]
        else:
            deals = [
                {
                    "id": "b_renewal",
                    "name": "Contract Renewal (14 Docks Across 15 Plants)",
                    "value": 140000,
                    "currency": "EUR",
                    "stage": "IDENTIFIED",
                    "status": "AT_RISK",
                    "fact_status": "VERIFIED",
                    "confidence": "Medium-High (Signed contract €140k; but renewal is non-automatic, expires 31 Jan 2027)",
                    "source_document": "contract.txt & deal_history.json",
                    "source_record_id": "contract.txt, invoices.json, sr_roll_0",
                    "excerpt": "Term: 1 Feb 2026 to 31 Jan 2027. Price: €140,000/yr. Signed by Stefan Roy. One invoice billed to group security.",
                    "notes": "Stefan Roy claims renewal is formality, but Plant managers resent paying security levy and deputy is leaving."
                },
                {
                    "id": "b_idle",
                    "name": "Idle Plants Activation & Adoption Expansion",
                    "value": 180000,
                    "currency": "EUR",
                    "stage": "QUALIFIED",
                    "status": "BLOCKED",
                    "fact_status": "VERIFIED",
                    "confidence": "High potential (€180k qualified), at acute operational risk of IT cutoff & deputy departure",
                    "source_document": "deal_history.json & calls/ba_deputy",
                    "source_record_id": "ba_use_2, sr_plants_2, sr_repl_2, ba_deputy_0",
                    "excerpt": "Stefan's deputy holds the rollout know-how and leaves soon. Plants pay security levy without input. Guard contractors ignore drone alerts.",
                    "notes": "Upcoming IT network project risks severing dock connectivity unless IT coordination occurs."
                },
                {
                    "id": "b_sister",
                    "name": "Sister Company Expansion (40 Plants)",
                    "value": 400000,
                    "currency": "EUR",
                    "stage": "IDENTIFIED",
                    "status": "UNVERIFIED_CLAIM",
                    "fact_status": "TOLD",
                    "confidence": "Low (Stefan verbal request for case study; zero direct contact with sister company, unproven ROI)",
                    "source_document": "deal_history.json & sr_roi_2",
                    "source_record_id": "sr_roi_0, sr_roi_2",
                    "excerpt": "Stefan Roy claimed €1.2M savings to pitch sister company. Roi spreadsheet proves it is based on unreduced guard hours; finance has booked zero savings.",
                    "notes": "Nadia Rahman (Group Finance) has not verified or booked any savings. Pitching sister company before real ROI is validated creates reputational hazard."
                }
            ]

        # Calculate commercial totals
        total_identified = sum(d["value"] for d in deals if d.get("value"))
        qualified_value = sum(d["value"] for d in deals if d["stage"] in ["QUALIFIED", "CLEARED", "AGREED"] and d.get("value"))
        agreed_value = 0 # None yet agreed for future term
        unverified_value = sum(d["value"] for d in deals if "UNVERIFIED" in d["status"] and d.get("value"))
        
        # 2. QUESTION 2: WHO HOLDS THE POWER?
        stakeholders = []
        if acc_id == "A":
            stakeholders = [
                {
                    "name": "Rhys Calder",
                    "title": "Alliance Drone Programme Lead",
                    "org": "Eastern Counties Police Alliance (Alliance Office)",
                    "power_role": "Champion / Exiting Programme Lead",
                    "authority": "Operational coordination across 4 forces; signed original order on behalf of alliance",
                    "commercial_influence": "High historically, but DROPPING TO ZERO due to January departure",
                    "relationship": "Ally (departing)",
                    "evidence": "rc_appetite_0, champion_leaves signal (A/emails/2026-11-17_rhys_moving.txt)",
                    "last_interaction": "2026-11-17 email announcing departure in January with no successor named",
                    "missing_info": "Who is succeeding Rhys Calder? Who chairs the Joint Forces Governance Board?"
                },
                {
                    "name": "Insp. Karen Mbeki",
                    "title": "Drone Unit Inspector",
                    "org": "Westmere Police",
                    "power_role": "Key Technical Evaluator & Operational Gatekeeper",
                    "authority": "Operational control of the active flying force (Westmere flies all operational missions)",
                    "commercial_influence": "High: Can kill the renewal if operator training and SLA are not confirmed in writing",
                    "relationship": "Neutral / Demanding Written Commitments",
                    "evidence": "km_usage_0, urgent_request signal (FB-11206, A/emails/2026-11-18_karen_event.txt)",
                    "last_interaction": "2026-11-18 urgent ticket FB-11206 regarding 5 Dec public event",
                    "missing_info": "Exact number of operators required for 5 Dec event; escalation on-call roster"
                },
                {
                    "name": "Fatima Osei",
                    "title": "Data Protection Officer (DPO)",
                    "org": "Tarn Valley Police",
                    "power_role": "Critical Compliance Blocker / Gatekeeper",
                    "authority": "Legal & regulatory authority over DPIA; holds veto power over live drone operations",
                    "commercial_influence": "Critical: Unlocking £200k Tarn Valley & Norwold expansion requires her sign-off",
                    "relationship": "Neutral / Frustrated by 4-Month FlytBase Silence",
                    "evidence": "fo_dpia_0, fo_dpia_2, fo_needs_3, pj_ticket",
                    "last_interaction": "Awaits data-flow documents requested 4 months ago via unanswered support ticket",
                    "missing_info": "Exact DPIA review timeline once engineering data pack is delivered"
                },
                {
                    "name": "Ewan Brooks",
                    "title": "Finance Business Partner",
                    "org": "Metro Central Police",
                    "power_role": "Economic Buyer & Financial Approver",
                    "authority": "Controls budget release for Metro Central call-off; represents force finance interests",
                    "commercial_influence": "Decisive: Confirms each force funds call-offs individually; no pooled alliance budget",
                    "relationship": "Guarded",
                    "evidence": "rc_funding_2, a_extra_docks offer declined",
                    "last_interaction": "Declined £180k extra docks offer; insisted on individual force financial approval",
                    "missing_info": "Current FY budget envelope for Metro Central drone operations"
                }
            ]
        else:
            stakeholders = [
                {
                    "name": "Stefan Roy",
                    "title": "Group Head of Security",
                    "org": "Aldermoor Industrial Group (HQ)",
                    "power_role": "Internal Champion / Central Sponsor",
                    "authority": "Budget holder for group security; signed initial 14-dock contract (€140k)",
                    "commercial_influence": "High central authority, but disconnect with plant managers & finance",
                    "relationship": "Warm",
                    "evidence": "contract.txt, sr_roi_0, sr_roi_2, sr_repl_2",
                    "last_interaction": "Promised €1.2M savings; requested case study for sister company",
                    "missing_info": "Who will lead dock rollouts once his deputy departs?"
                },
                {
                    "name": "Beatriz Alonso",
                    "title": "Plant Manager",
                    "org": "Plant 7 (Aldermoor)",
                    "power_role": "Plant Operational User & Guard Contractor Manager",
                    "authority": "Manages plant operations and local third-party guard security contracts",
                    "commercial_influence": "High operational influence: alerts go to her phone because guards aren't contracted to act",
                    "relationship": "Neutral / Practical",
                    "evidence": "ba_use_0, ba_use_2, ba_deputy_0, b_priority_support declined",
                    "last_interaction": "Explained disconnect between automated drone alerts and physical guard duties",
                    "missing_info": "Contract renegotiation date with the local guard security firm"
                },
                {
                    "name": "Nadia Rahman",
                    "title": "Group Finance Controller",
                    "org": "Aldermoor Industrial Group (HQ Finance)",
                    "power_role": "Economic Buyer & Audit Gatekeeper",
                    "authority": "Approves all group capital & operating expenditure; audits ROI claims",
                    "commercial_influence": "Veto power over contract renewal and sister-company expansion",
                    "relationship": "Neutral / Skeptical",
                    "evidence": "emails/2026-10-08_finance_mailbox.txt, sr_roi_2",
                    "last_interaction": "Has booked ZERO savings from drones; rejected reporting upsell",
                    "missing_info": "Required audit criteria for finance to recognize drone automation savings"
                },
                {
                    "name": "Julian Tate",
                    "title": "Insurance and Risk Manager",
                    "org": "Aldermoor Industrial Group",
                    "power_role": "Influencer & Risk Evaluator",
                    "authority": "Oversees site safety compliance, insurer underwriting requirements, and operational risk",
                    "commercial_influence": "Can advocate for insurance premium reductions if flight logs prove night coverage",
                    "relationship": "Neutral",
                    "evidence": "profile.json, requests.csv",
                    "last_interaction": "Interested in automated audit trails for night perimeter security",
                    "missing_info": "Whether insurer offers premium discount for certified autonomous patrols"
                }
            ]

        # 3. QUESTION 3: WHAT DO YOU DO FIRST?
        actions = []
        if acc_id == "A":
            actions = [
                {
                    "rank": 1,
                    "title": "Resolve Ticket FB-11206 with Insp. Karen Mbeki in Writing by Friday",
                    "explanation": "Provide formal written commitment for additional operator training dates before 5 Dec and define an explicit on-call SLA for the public event.",
                    "related_deal": "Contract Renewal (£350k) & Westmere Expansion",
                    "reason": "Insp. Mbeki is the sole operational inspector flying missions. She explicitly demanded written answers this week. If neglected, Westmere could ground operations during their highest-profile event.",
                    "priority": "P0 - CRITICAL",
                    "owner": "Customer Success Manager (You)",
                    "due_date": "2026-11-21",
                    "expected_outcome": "Ticket FB-11206 closed with written SLA; Karen Mbeki secured as reference champion for 5 Dec event.",
                    "evidence": "urgent_request signal (A/emails/2026-11-18_karen_event.txt, FB-11206)"
                },
                {
                    "rank": 2,
                    "title": "Deliver Engineering Data-Flow Pack to Fatima Osei (DPO)",
                    "explanation": "Coordinate with FlytBase Engineering (SRV) to compile the 4-part data pack (data flows, retention periods, video storage, access controls) and deliver directly to Fatima Osei.",
                    "related_deal": "Tarn Valley & Norwold Go-Live (£200k Qualified)",
                    "reason": "Ticket has lingered unassigned for 4 months. SRV confirmed engineering can generate the pack in 1 week. Delivering this enables Fatima to sign the DPIA within 3 weeks, unblocking both Tarn Valley and Norwold.",
                    "priority": "P0 - CRITICAL",
                    "owner": "Customer Success Manager + SRV (Eng)",
                    "due_date": "2026-11-25",
                    "expected_outcome": "DPIA submitted for formal sign-off; £200,000 qualified revenue unblocked.",
                    "evidence": "fo_dpia_2, fo_needs_3, pj_ticket, srv_dataflow"
                },
                {
                    "rank": 3,
                    "title": "Conduct Urgent Transition Meeting with Rhys Calder & Force CFOs",
                    "explanation": "Schedule an executive alignment session before Rhys Calder's January departure to identify his interim replacement and engage Ewan Brooks and member force CFOs directly.",
                    "related_deal": "Alliance Renewal (£350k)",
                    "reason": "Rhys was the sole counterparty on all historical calls. With no pooled budget, individual force CFO sign-offs are mandatory for renewal on 28 Feb 2027.",
                    "priority": "P1 - HIGH",
                    "owner": "Customer Success Manager",
                    "due_date": "2026-12-05",
                    "expected_outcome": "Succession plan documented; direct commercial engagement established with Ewan Brooks.",
                    "evidence": "champion_leaves signal, rc_funding_2, contract.txt"
                }
            ]
        else:
            actions = [
                {
                    "rank": 1,
                    "title": "Investigate Sudden Flight Drop on Docks AD-02, AD-05, and AD-10",
                    "explanation": "Dispatch telemetry audit and contact Beatriz Alonso to determine why 3 high-frequency docks stopped flying since 16 November while remaining online.",
                    "related_deal": "Contract Renewal (€140k)",
                    "reason": "Sudden drop from 7 flights/week to 0 flights/week for 2 consecutive weeks indicates either local operational obstruction, guard issues, or pre-emptive network project disconnect.",
                    "priority": "P0 - CRITICAL",
                    "owner": "Customer Success Manager + Support Desk",
                    "due_date": "2026-12-02",
                    "expected_outcome": "Root cause identified (hardware/network/protocol) and resolved before plant managers petition finance to cut budget.",
                    "evidence": "usage_drop signal (B/usage_weekly.csv)"
                },
                {
                    "rank": 2,
                    "title": "Codify Rollout Playbook Before Stefan Roy's Deputy Departs",
                    "explanation": "Conduct technical debrief sessions with Stefan's deputy to document dock setup protocols, IT configurations, and plant onboarding steps.",
                    "related_deal": "Idle Plants Activation (€180k Qualified)",
                    "reason": "All operational knowledge is currently in the deputy's head. When he leaves, Aldermoor loses the capability to activate idle plants or troubleshoot issues.",
                    "priority": "P0 - CRITICAL",
                    "owner": "Customer Success Manager",
                    "due_date": "2026-12-10",
                    "expected_outcome": "Standard Operating Procedure (SOP) repository created; plant onboarding secured.",
                    "evidence": "sr_repl_2, ba_deputy_0, deadline in get_my_accounts"
                },
                {
                    "rank": 3,
                    "title": "Establish Real ROI Model with Nadia Rahman (Group Finance)",
                    "explanation": "Replace Stefan Roy's theoretical guard patrol hours calculation with verified operational metrics co-developed with Nadia Rahman.",
                    "related_deal": "Contract Renewal (€140k) & Sister Company Expansion (€400k)",
                    "reason": "Stefan's €1.2M savings claim has zero credibility in finance. Presenting unverified savings to the 40-plant sister company will backfire unless finance audits and certifies the value.",
                    "priority": "P1 - HIGH",
                    "owner": "Customer Success Manager + Nadia Rahman",
                    "due_date": "2026-12-15",
                    "expected_outcome": "Audited finance-approved ROI summary reflecting true perimeter incident response improvements.",
                    "evidence": "sr_roi_2 (roi_spreadsheet.csv), emails/2026-10-08_finance_mailbox.txt"
                }
            ]

        # 4. QUESTION 4: WHAT IS ABOUT TO GO WRONG?
        risks = []
        if acc_id == "A":
            risks = [
                {
                    "severity": "RED",
                    "title": "Champion Departure Without Named Successor",
                    "deal": "Alliance Renewal (£350k)",
                    "description": "Rhys Calder leaves in January 2026. Every historical communication was conducted exclusively through him.",
                    "consequence": "Alliance loses centralized advocacy; negotiations stall right before the 28 Feb 2027 contract expiration.",
                    "mitigation": "Bypass alliance silo immediately: engage Ewan Brooks (Finance) and Insp. Mbeki (Westmere) to establish direct stakeholder coverage.",
                    "owner": "CSM",
                    "deadline": "2026-12-15",
                    "evidence": "champion_leaves signal, contract.txt"
                },
                {
                    "severity": "RED",
                    "title": "Unanswered SLA Request for High-Stakes Public Event",
                    "deal": "Westmere Operational Health (£300k Stadium Opportunity)",
                    "description": "Insp. Mbeki submitted urgent ticket FB-11206 requesting written operator training and failure-cover SLA for 5 Dec event. Ticket remains unanswered.",
                    "consequence": "If a dock fails during the live event with no support, Westmere will publicly pull out of the alliance drone programme.",
                    "mitigation": "Escalate ticket internally today. Issue written SLA and schedule pre-event operator training.",
                    "owner": "CSM + FlytBase Support Lead",
                    "deadline": "2026-11-21",
                    "evidence": "urgent_request signal (A/emails/2026-11-18_karen_event.txt, FB-11206)"
                },
                {
                    "severity": "AMBER",
                    "title": "DPIA Blocked in Tarn Valley & Norwold for 4 Months",
                    "deal": "Tarn Valley & Norwold Expansion (£200k Qualified)",
                    "description": "DPO Fatima Osei has been waiting 4 months for data-flow architecture documentation. Support ticket sat unassigned.",
                    "consequence": "Tarn Valley and Norwold remain 100% idle; £200,000 qualified expansion cannot progress to contract.",
                    "mitigation": "Enlist SRV (Engineering) to deliver 4-part data pack within 7 days, then coordinate 3-week DPO sign-off review.",
                    "owner": "CSM + SRV",
                    "deadline": "2026-11-25",
                    "evidence": "fo_dpia_2, pj_ticket, srv_dataflow"
                },
                {
                    "severity": "AMBER",
                    "title": "Decentralized Funding Misalignment",
                    "deal": "Alliance Renewal (£350k)",
                    "description": "Rhys Calder claimed alliance has pooled budget; Ewan Brooks revealed each force funds from its own budget and requires separate CFO approval.",
                    "consequence": "Renewal order sent to alliance office will bounce or lack authority across 4 separate forces.",
                    "mitigation": "Request Schedule 2 invoice breakdown from Accounts and issue 4 separate renewal contracts aligned with force fiscal cycles.",
                    "owner": "CSM + FlytBase Legal/Finance",
                    "deadline": "2027-01-10",
                    "evidence": "rc_funding_2, contract.txt (Schedule 2)"
                }
            ]
        else:
            risks = [
                {
                    "severity": "RED",
                    "title": "Unexplained Operational Drop: Docks AD-02, AD-05, AD-10 at Zero Flights",
                    "deal": "Contract Renewal (€140k)",
                    "description": "Weekly usage data from 2-29 Nov reveals 3 core active docks dropped from 7 flights/wk to 0 flights/wk for two weeks.",
                    "consequence": "Customer perceives FlytBase system as abandoned or defective; plant managers will refuse to renew budget allocation.",
                    "mitigation": "Initiate telemetry diagnostics immediately; contact Beatriz Alonso to determine if plant security procedures changed.",
                    "owner": "CSM + Technical Support",
                    "deadline": "2026-12-02",
                    "evidence": "usage_drop signal (B/usage_weekly.csv)"
                },
                {
                    "severity": "RED",
                    "title": "Knowledge Loss from Imminent Departure of Rollout Lead (Stefan's Deputy)",
                    "deal": "Idle Plants Activation (€180k Qualified)",
                    "description": "Stefan's deputy configured all 14 docks and holds all technical rollout procedures in his head. His departure is imminent.",
                    "consequence": "Aldermoor cannot deploy to idle plants or manage dock maintenance without deputy's knowledge.",
                    "mitigation": "Conduct structured handover workshops this week to codify deployment checklists and network prerequisites.",
                    "owner": "CSM",
                    "deadline": "2026-12-10",
                    "evidence": "sr_repl_2, ba_deputy_0, deadlines array"
                },
                {
                    "severity": "AMBER",
                    "title": "Fictitious ROI Exposure with Group Finance",
                    "deal": "Renewal (€140k) & Sister Company Expansion (€400k)",
                    "description": "Stefan Roy circulated an unvalidated €1.2M savings claim based on replaced guard hours, but guard contracts were never reduced and Finance has booked €0.",
                    "consequence": "Nadia Rahman (Group Finance) will reject renewal or audit the contract when asked to approve payment, killing sister company deal.",
                    "mitigation": "Stop citing €1.2M figure. Reframe value around rapid intrusion detection, perimeter safety, and insurance risk compliance with Julian Tate.",
                    "owner": "CSM + Stefan Roy",
                    "deadline": "2026-12-15",
                    "evidence": "sr_roi_2, roi_spreadsheet.csv, emails/2026-10-08_finance_mailbox.txt"
                },
                {
                    "severity": "AMBER",
                    "title": "Guard Contractor Disconnect at Plant Level",
                    "deal": "Operational Value Realization",
                    "description": "Plant 7 guard contractors refuse to act on drone alerts because their vendor contract does not cover drone response; alerts ping Beatriz Alonso's personal phone.",
                    "consequence": "Plant managers experience alert fatigue and consider drone automation a burden rather than a benefit.",
                    "mitigation": "Provide Stefan Roy and plant managers with standard guard contractor SLA addendum integrating automated drone alerts.",
                    "owner": "CSM",
                    "deadline": "2026-12-20",
                    "evidence": "ba_use_2"
                }
            ]

        # 5. QUESTION 5: WHAT DO YOU STILL NOT KNOW?
        gaps = []
        if acc_id == "A":
            gaps = [
                {
                    "rank": 1,
                    "unknown": "Successor for Rhys Calder (Alliance Drone Programme Lead)",
                    "why_it_matters": "All program communications and contracts flow through the alliance office. Without a named successor, renewal negotiations will freeze in January.",
                    "affected_deal": "Alliance Renewal (£350,000)",
                    "decision_dependent": "Who has legal and commercial authority to execute the new order before 28 February 2027?",
                    "who_can_answer": "Rhys Calder or Alliance Governance Board Chair",
                    "how_to_obtain": "Request an urgent handover meeting with Rhys Calder and request introduction to his manager/sponsor.",
                    "if_unresolved": "Renewal misses statutory police procurement cycle and forces are forced to ground docks."
                },
                {
                    "rank": 2,
                    "unknown": "Individual Force Budget Split and Schedule 2 Billing Details",
                    "why_it_matters": "Contract states order was invoiced in 4 parts per Schedule 2, but Schedule 2 was never copied to Customer Success. Since there is no pooled budget, each force must be invoiced separately.",
                    "affected_deal": "Alliance Renewal (£350,000)",
                    "decision_dependent": "Exact invoice amounts and procurement codes required for each of the 4 forces (Westmere, Metro Central, Tarn Valley, Norwold).",
                    "who_can_answer": "FlytBase Accounts team or Ewan Brooks (Finance Partner, Metro Central)",
                    "how_to_obtain": "Retrieve Schedule 2 from FlytBase Accounts archive and cross-check with Ewan Brooks.",
                    "if_unresolved": "Invoices misdirected to defunct alliance office account and delayed past FY budget cutoff."
                },
                {
                    "rank": 3,
                    "unknown": "Technical Specification and Budget for 300-Dock Framework Tender",
                    "why_it_matters": "Tender is cited as multi-million pound opportunity, but no formal specification, procurement notice, or evaluation criteria exists on file.",
                    "affected_deal": "Framework Tender (£3,000,000 speculative)",
                    "decision_dependent": "Whether FlytBase should allocate dedicated bids/tenders resources to respond.",
                    "who_can_answer": "Alliance Procurement Lead / Rhys Calder",
                    "how_to_obtain": "Search UK Police Digital Service / Contracts Finder portal for published Prior Information Notice (PIN).",
                    "if_unresolved": "Over-indexing commercial pipeline on speculative unbacked opportunity."
                }
            ]
        else:
            gaps = [
                {
                    "rank": 1,
                    "unknown": "Exact Date of Deputy's Departure and Status of Knowledge Transfer",
                    "why_it_matters": "Stefan's deputy holds the technical knowledge for 14 docks. Once he leaves, troubleshooting and onboarding cease.",
                    "affected_deal": "Idle Plants Activation (€180,000) & Operational Renewal (€140,000)",
                    "decision_dependent": "Whether FlytBase needs to deploy professional services engineers to re-map dock configurations.",
                    "who_can_answer": "Stefan Roy or the Deputy directly",
                    "how_to_obtain": "Contact Stefan Roy to confirm departure date and schedule 3 technical handover sessions.",
                    "if_unresolved": "Deployment knowledge is permanently lost to Aldermoor; future plant expansions fail."
                },
                {
                    "rank": 2,
                    "unknown": "Cause of 14-Day Zero-Flight Blackout on Docks AD-02, AD-05, AD-10",
                    "why_it_matters": "Three previously active docks completely ceased flying while reporting 'online'.",
                    "affected_deal": "Renewal (€140,000)",
                    "decision_dependent": "Is this a firmware bug, a local site lock-out, or an intentional boycott by plant managers?",
                    "who_can_answer": "Beatriz Alonso (Plant 7) and relevant plant managers",
                    "how_to_obtain": "Review FlytBase dock telemetry logs and call Beatriz Alonso for operational site context.",
                    "if_unresolved": "Remaining plants follow suit, leading to contract cancellation."
                },
                {
                    "rank": 3,
                    "unknown": "Corporate Sponsor and Timeline for 40-Plant Sister Company",
                    "why_it_matters": "Stefan requested a case study for the sister company, but no contact details or corporate entity name exist on file.",
                    "affected_deal": "Sister Company Expansion (€400,000 speculative)",
                    "decision_dependent": "Should marketing and enterprise sales invest time in crafting a bespoke enterprise case study?",
                    "who_can_answer": "Stefan Roy or Aldermoor Group Corporate Development",
                    "how_to_obtain": "Request introductory call with sister company security director before investing in collateral.",
                    "if_unresolved": "Time wasted preparing case study that never reaches decision-makers."
                }
            ]

        # Assemble Account Object
        db["accounts"][acc_id] = {
            "id": acc_id,
            "name": raw_acc["name"],
            "official_story": raw_acc["official_story"],
            "currency": currency,
            "currency_symbol": symbol,
            "annual_contract_value": annual_val,
            "renewal_deadline": renewal_deadline,
            "total_identified_value": total_identified,
            "qualified_value": qualified_value,
            "agreed_value": agreed_value,
            "unverified_value": unverified_value,
            "health_score": 62 if acc_id == "A" else 58,
            "health_status": "Vulnerable (Urgent Actions Required)",
            "questions": {
                "q1_book_worth": {
                    "total_identified": total_identified,
                    "qualified_value": qualified_value,
                    "agreed_value": agreed_value,
                    "unverified_value": unverified_value,
                    "currency": currency,
                    "currency_symbol": symbol,
                    "deals": deals
                },
                "q2_stakeholders": {
                    "stakeholders": stakeholders
                },
                "q3_next_actions": {
                    "actions": actions
                },
                "q4_risks": {
                    "risks": risks
                },
                "q5_blind_spots": {
                    "gaps": gaps
                }
            },
            "signals": acc_signals,
            "paperwork_summary": {
                "total_records": len(records),
                "calls": len([r for r in records.values() if r.get("kind") == "call"]),
                "emails": len([r for r in records.values() if r.get("kind") == "email"]),
                "records_list": [
                    {
                        "path": r["path"],
                        "kind": r.get("kind", "doc"),
                        "preview": (r.get("text") or json.dumps(r.get("data", {})))[:250]
                    }
                    for r in records.values()
                ]
            },
            "raw_facts": raw_acc.get("facts", []),
            "raw_offers": raw_acc.get("offers", []),
            "raw_deadlines": raw_acc.get("deadlines", [])
        }
        
    out_file = os.path.join(DATA_DIR, "crm_db.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2)
    print(f"CRM Database built successfully: {out_file} ({len(db['accounts'])} accounts)")

if __name__ == "__main__":
    build_db()
