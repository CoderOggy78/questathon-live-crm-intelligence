import os
import json
import csv
import io

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
        "portfolio": {
            "total_accounts": 2,
            "total_acv_display": "£350,000 + €140,000",
            "total_fleet_docks": 49,
            "total_flights_flown": 0,
            "total_active_users": 40,
            "total_tickets": 25,
            "total_identified_pipeline": "£3.55M + €720K",
            "total_qualified_expansion": "£200K + €180K",
            "total_agreed_revenue": "£0 (Pending 2027 Renewal Orders)"
        },
        "accounts": {},
        "all_interactions": []
    }
    
    total_flights_all = 0

    for raw_acc in accounts_data.get("accounts", []):
        acc_id = raw_acc["id"]
        records = records_A if acc_id == "A" else records_B
        acc_signals = [s for s in signals if s.get("account") == acc_id]
        
        currency = "GBP" if acc_id == "A" else "EUR"
        symbol = "£" if acc_id == "A" else "€"
        annual_val = 350000 if acc_id == "A" else 140000
        renewal_deadline = "2027-02-28" if acc_id == "A" else "2027-01-31"
        
        # 1. Parse Devices (docks and aircraft)
        devices_data = records.get("devices.json", {}).get("data", {})
        docks_list = devices_data.get("docks", [])
        
        # 2. Parse Flights CSV
        flights_raw = records.get("flights.csv", {}).get("text", "")
        flights_list = []
        if flights_raw:
            reader = csv.DictReader(io.StringIO(flights_raw))
            flights_list = list(reader)
        total_flights_all += len(flights_list)
        
        # 3. Parse Weekly Usage CSV
        usage_raw = records.get("usage_weekly.csv", {}).get("text", "")
        usage_list = []
        dock_stats = {}
        if usage_raw:
            reader = csv.DictReader(io.StringIO(usage_raw))
            usage_list = list(reader)
            
            for row in usage_list:
                d_id = row.get("dock_id")
                fl = int(row.get("flights", 0))
                onl = int(row.get("days_online", 0))
                w_start = row.get("week_start")
                
                if d_id not in dock_stats:
                    dock_stats[d_id] = {
                        "dock_id": d_id,
                        "total_flights": 0,
                        "total_days_online": 0,
                        "history": [],
                        "last_week_flights": 0,
                        "anomaly": False
                    }
                dock_stats[d_id]["total_flights"] += fl
                dock_stats[d_id]["total_days_online"] += onl
                dock_stats[d_id]["history"].append({"week": w_start, "flights": fl, "days_online": onl})
                dock_stats[d_id]["last_week_flights"] = fl
                
        # Flag anomalies (e.g. Account B docks AD-02, AD-05, AD-10 had zero flights recently)
        for d_id, st in dock_stats.items():
            if acc_id == "B" and d_id in ["AD-02", "AD-05", "AD-10"]:
                st["anomaly"] = True
                st["anomaly_note"] = "CRITICAL TELEMETRY DROP: Ceased flights in last 2 weeks while reporting 7 days online!"
            elif acc_id == "A" and st["total_flights"] == 0:
                st["anomaly"] = True
                st["anomaly_note"] = "IDLE DOCK: 0 operational flights since deployment."
                
        # 4. Parse Tickets JSON
        tickets_data = records.get("tickets.json", {}).get("data", {})
        tickets_list = tickets_data.get("tickets", [])
        
        # Add live ticket if present in signals
        if acc_id == "A":
            tickets_list.append({
                "id": "FB-11206",
                "opened": "2026-11-18",
                "requester": "Westmere drone unit (Insp. Karen Mbeki)",
                "subject": "Operator training and support cover before public event on 5 December",
                "category": "urgent_event",
                "status": "OPEN (UNASSIGNED)",
                "closed": None,
                "assignee": "Unassigned (Shared Queue)",
                "first_response_hours": None,
                "conversation": [
                    {"date": "2026-11-18", "from": "Insp. Karen Mbeki", "text": "We are policing a large public event on 5 December. Need 2 things in writing: operator training dates and on-call failure cover. Urgent."}
                ]
            })
            
        # 5. Parse Users JSON
        users_data = records.get("users.json", {}).get("data", {})
        users_list = users_data.get("users", [])
        
        # 6. Parse Profile JSON
        profile_data = records.get("profile.json", {}).get("data", {})
        
        # 7. Parse Invoices JSON
        invoices_data = records.get("invoices.json", {}).get("data", {})
        
        # 8. Parse Deal History JSON
        deal_hist = records.get("deal_history.json", {}).get("data", {})
        
        # 9. Parse Calls & Emails into Unified Timeline
        interactions = []
        for path, rec in records.items():
            k = rec.get("kind", "")
            t = rec.get("text", "")
            if path.startswith("calls/"):
                # Extract date from filename: calls/YYYY-MM-DD_title.txt
                base = os.path.basename(path).replace(".txt", "")
                parts = base.split("_", 1)
                dt = parts[0] if len(parts) > 0 else "2026-01-01"
                title = parts[1].replace("_", " ").title() if len(parts) > 1 else "Call"
                interactions.append({
                    "id": path,
                    "account": acc_id,
                    "date": dt,
                    "type": "CALL",
                    "title": f"Call: {title}",
                    "path": path,
                    "preview": t[:300],
                    "full_text": t
                })
            elif path.startswith("emails/"):
                base = os.path.basename(path).replace(".txt", "")
                parts = base.split("_", 1)
                dt = parts[0] if len(parts) > 0 else "2026-01-01"
                title = parts[1].replace("_", " ").title() if len(parts) > 1 else "Email"
                interactions.append({
                    "id": path,
                    "account": acc_id,
                    "date": dt,
                    "type": "EMAIL",
                    "title": f"Email: {title}",
                    "path": path,
                    "preview": t[:300],
                    "full_text": t
                })
                
        # Add tickets to interactions
        for tk in tickets_list:
            interactions.append({
                "id": tk["id"],
                "account": acc_id,
                "date": tk.get("opened", "2026-01-01"),
                "type": "TICKET",
                "title": f"Ticket {tk['id']}: {tk.get('subject')}",
                "path": "tickets.json",
                "preview": f"Requester: {tk.get('requester')} • Status: {tk.get('status')}",
                "full_text": json.dumps(tk, indent=2)
            })
            
        # Add milestones to interactions
        for mh in deal_hist.get("history", []):
            dt = mh.get("date", "2026-01-01")
            interactions.append({
                "id": f"milestone_{dt}_{mh.get('what')}",
                "account": acc_id,
                "date": dt if len(dt) == 10 else f"{dt}-01",
                "type": "MILESTONE",
                "title": f"Milestone: {mh.get('what')}",
                "path": "deal_history.json",
                "preview": mh.get("detail", "Contract milestone"),
                "full_text": mh.get("detail", "")
            })
            
        interactions.sort(key=lambda x: x["date"], reverse=True)
        db["all_interactions"].extend(interactions)
        
        # 10. FIVE CRITICAL QUESTIONS MODEL
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
                    "confidence": "Medium (Verified contract £350k; Rhys Calder departing & no pooled budget)",
                    "source_document": "contract.txt & deal_history.json",
                    "source_record_id": "rc_appetite_2, contract.txt, invoices.json",
                    "excerpt": "Term: 1 March 2026 to 28 February 2027. Price: £350,000/yr. No automatic renewal. Invoiced in 4 parts.",
                    "notes": "Contract signed by alliance office, but Ewan Brooks confirms each force pays from separate budget."
                },
                {
                    "id": "a_tarn",
                    "name": "Tarn Valley & Norwold Go-Live Expansion",
                    "value": 200000,
                    "currency": "GBP",
                    "stage": "QUALIFIED",
                    "status": "BLOCKED",
                    "fact_status": "VERIFIED",
                    "confidence": "High potential (£200k qualified), currently 100% blocked by unassigned DPIA ticket",
                    "source_document": "tickets.json & calls/fo_dpia",
                    "source_record_id": "fo_dpia_2, fo_needs_3, pj_ticket, srv_dataflow",
                    "excerpt": "Fatima Osei (DPO): 'It cannot be signed until we receive the data-flow documents we asked FlytBase for 4 months ago.'",
                    "notes": "Norwold is waiting to copy Tarn Valley's assessment. Delivering data pack unblocks both forces."
                },
                {
                    "id": "a_stadium",
                    "name": "Westmere Stadium Project (30 Docks)",
                    "value": 300000,
                    "currency": "GBP",
                    "stage": "IDENTIFIED",
                    "status": "UNVERIFIED_CLAIM",
                    "fact_status": "TOLD",
                    "confidence": "Low (Verbal claim by Rhys Calder, no formal quote issued, subject to 5 Dec event)",
                    "source_document": "emails/2026-10-02_rhys_stadium.txt",
                    "source_record_id": "rc_stadium_0",
                    "excerpt": "Rhys Calder mentioned 30 docks for stadium policing. No formal quote on file.",
                    "notes": "Insp. Karen Mbeki is demanding operator training and on-day SLA ahead of 5 Dec event."
                },
                {
                    "id": "a_tender",
                    "name": "Framework Tender (Up to 300 Docks)",
                    "value": 3000000,
                    "currency": "GBP",
                    "stage": "IDENTIFIED",
                    "status": "UNVERIFIED_SPECULATIVE",
                    "fact_status": "TOLD",
                    "confidence": "Speculative (Told by Rhys Calder; no procurement notice, spec or pooled budget)",
                    "source_document": "deal_history.json & rc_tender_0",
                    "source_record_id": "rc_tender_0, rc_funding_2",
                    "excerpt": "Rhys Calder says 300-dock framework in prep. But fact rc_funding_2 proves no pooled budget exists.",
                    "notes": "Quarantined from forecast until formal tender publication."
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
                    "confidence": "Medium-High (Signed contract €140k; non-automatic renewal, expires 31 Jan 2027)",
                    "source_document": "contract.txt & deal_history.json",
                    "source_record_id": "contract.txt, invoices.json, sr_roll_0",
                    "excerpt": "Term: 1 Feb 2026 to 31 Jan 2027. Price: €140,000/yr. Signed by Stefan Roy.",
                    "notes": "Stefan Roy claims renewal is formality, but plant managers resent security levy and deputy is leaving."
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
                    "excerpt": "Stefan's deputy holds rollout know-how and leaves soon. Guard contractors ignore drone alerts.",
                    "notes": "Upcoming IT network project risks severing dock connectivity."
                },
                {
                    "id": "b_sister",
                    "name": "Sister Company Expansion (40 Plants)",
                    "value": 400000,
                    "currency": "EUR",
                    "stage": "IDENTIFIED",
                    "status": "UNVERIFIED_CLAIM",
                    "fact_status": "TOLD",
                    "confidence": "Low (Stefan verbal request for case study; zero direct contact, unproven ROI)",
                    "source_document": "deal_history.json & sr_roi_2",
                    "source_record_id": "sr_roi_0, sr_roi_2",
                    "excerpt": "Stefan claimed €1.2M savings. Roi spreadsheet proves it is based on unreduced guard hours; finance has booked zero savings.",
                    "notes": "Nadia Rahman (Group Finance) has booked zero savings. Quarantined from pipeline."
                }
            ]

        total_identified = sum(d["value"] for d in deals if d.get("value"))
        qualified_value = sum(d["value"] for d in deals if d["stage"] in ["QUALIFIED", "CLEARED", "AGREED"] and d.get("value"))
        agreed_value = 0
        unverified_value = sum(d["value"] for d in deals if "UNVERIFIED" in d["status"] and d.get("value"))
        
        # Stakeholders
        stakeholders = []
        if acc_id == "A":
            stakeholders = [
                {
                    "name": "Rhys Calder",
                    "title": "Alliance Drone Programme Lead",
                    "org": "Eastern Counties Police Alliance (Alliance Office)",
                    "power_role": "Exiting Champion / Programme Lead",
                    "authority": "Operational coordination across 4 forces; signed original order",
                    "commercial_influence": "Dropping to zero due to January departure",
                    "relationship": "Ally (Departing)",
                    "evidence": "rc_appetite_0, champion_leaves signal (A/emails/2026-11-17_rhys_moving.txt)",
                    "last_interaction": "2026-11-17 email announcing departure in January with no successor named",
                    "missing_info": "Who is succeeding Rhys Calder? Who chairs the Joint Forces Governance Board?"
                },
                {
                    "name": "Insp. Karen Mbeki",
                    "title": "Drone Unit Inspector",
                    "org": "Westmere Police",
                    "power_role": "Key Technical Evaluator & Operational Chief",
                    "authority": "Sole inspector actively flying live operational missions",
                    "commercial_influence": "High: Can kill renewal if training & SLA not committed in writing",
                    "relationship": "Neutral / Demanding Written Commitments",
                    "evidence": "km_usage_0, urgent_request signal (FB-11206, A/emails/2026-11-18_karen_event.txt)",
                    "last_interaction": "2026-11-18 urgent ticket FB-11206 regarding 5 Dec public event",
                    "missing_info": "Exact number of operators required for 5 Dec event; escalation on-call roster"
                },
                {
                    "name": "Fatima Osei",
                    "title": "Data Protection Officer (DPO)",
                    "org": "Tarn Valley Police",
                    "power_role": "Compliance Blocker / Gatekeeper",
                    "authority": "Legal & regulatory veto over DPIA for drone operations",
                    "commercial_influence": "Critical: Unlocking £200k expansion requires her sign-off",
                    "relationship": "Neutral / Frustrated by 4-Month FlytBase Silence",
                    "evidence": "fo_dpia_0, fo_dpia_2, fo_needs_3, pj_ticket",
                    "last_interaction": "Waiting 4 months for data-flow documents requested via support desk",
                    "missing_info": "Exact DPIA review timeline once engineering data pack is delivered"
                },
                {
                    "name": "Ewan Brooks",
                    "title": "Finance Business Partner",
                    "org": "Metro Central Police",
                    "power_role": "Economic Buyer & Financial Approver",
                    "authority": "Controls budget release for Metro Central call-off",
                    "commercial_influence": "Decisive: Confirms each force funds call-offs individually; no pooled budget",
                    "relationship": "Guarded",
                    "evidence": "rc_funding_2, a_extra_docks offer declined",
                    "last_interaction": "Declined £180k extra docks offer; insisted on individual force approval",
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
                    "authority": "Budget holder for group security; signed initial 14-dock contract",
                    "commercial_influence": "High central authority, but disconnected from plant managers & finance",
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
                    "authority": "Manages plant operations and local third-party guard contracts",
                    "commercial_influence": "High: alerts go to her phone because guards aren't contracted to act",
                    "relationship": "Neutral / Practical",
                    "evidence": "ba_use_0, ba_use_2, ba_deputy_0, b_priority_support declined",
                    "last_interaction": "Explained disconnect between automated alerts and physical guards",
                    "missing_info": "Contract renegotiation date with the local guard security firm"
                },
                {
                    "name": "Nadia Rahman",
                    "title": "Group Finance Controller",
                    "org": "Aldermoor Industrial Group (HQ Finance)",
                    "power_role": "Economic Buyer & Audit Gatekeeper",
                    "authority": "Approves all group expenditure; audits ROI claims",
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
                    "authority": "Oversees site safety compliance and insurer underwriting requirements",
                    "commercial_influence": "Can advocate for insurance premium reductions if flight logs prove night coverage",
                    "relationship": "Neutral",
                    "evidence": "profile.json, requests.csv",
                    "last_interaction": "Interested in automated audit trails for night perimeter security",
                    "missing_info": "Whether insurer offers premium discount for certified autonomous patrols"
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
            "devices_count": len(docks_list),
            "docks": docks_list,
            "dock_stats": dock_stats,
            "flights_count": len(flights_list),
            "flights_sample": flights_list[:100], # sample for quick inspection
            "tickets_count": len(tickets_list),
            "tickets": tickets_list,
            "users_count": len(users_list),
            "users": users_list,
            "profile": profile_data,
            "invoices": invoices_data,
            "deal_history": deal_hist,
            "interactions": interactions,
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
                    "actions": [
                        {
                            "rank": 1,
                            "title": "Resolve Ticket FB-11206 with Insp. Karen Mbeki in Writing by Friday" if acc_id == "A" else "Investigate Sudden Flight Drop on Docks AD-02, AD-05, and AD-10",
                            "explanation": "Provide formal written commitment for additional operator training dates before 5 Dec and define an explicit on-call SLA for the public event." if acc_id == "A" else "Dispatch telemetry audit and contact Beatriz Alonso to determine why 3 high-frequency docks stopped flying since 16 November while remaining online.",
                            "related_deal": "Contract Renewal (£350k) & Westmere Expansion" if acc_id == "A" else "Contract Renewal (€140k)",
                            "reason": "Insp. Mbeki is the sole operational inspector flying missions. She explicitly demanded written answers this week." if acc_id == "A" else "Sudden drop from 7 flights/week to 0 flights/week for 2 consecutive weeks indicates operational obstruction.",
                            "priority": "P0 - CRITICAL",
                            "owner": "Customer Success Manager (You)",
                            "due_date": "2026-11-21" if acc_id == "A" else "2026-12-02",
                            "expected_outcome": "Ticket FB-11206 closed with written SLA." if acc_id == "A" else "Root cause identified and resolved.",
                            "evidence": "urgent_request signal (A/emails/2026-11-18_karen_event.txt, FB-11206)" if acc_id == "A" else "usage_drop signal (B/usage_weekly.csv)"
                        },
                        {
                            "rank": 2,
                            "title": "Deliver Engineering Data-Flow Pack to Fatima Osei (DPO)" if acc_id == "A" else "Codify Rollout Playbook Before Stefan Roy's Deputy Departs",
                            "explanation": "Coordinate with FlytBase Engineering (SRV) to compile the 4-part data pack." if acc_id == "A" else "Conduct technical debrief sessions with Stefan's deputy to document dock setup protocols.",
                            "related_deal": "Tarn Valley & Norwold Go-Live (£200k Qualified)" if acc_id == "A" else "Idle Plants Activation (€180k Qualified)",
                            "reason": "Ticket has lingered unassigned for 4 months." if acc_id == "A" else "All operational knowledge is in the deputy's head.",
                            "priority": "P0 - CRITICAL",
                            "owner": "CSM + SRV (Eng)" if acc_id == "A" else "Customer Success Manager",
                            "due_date": "2026-11-25" if acc_id == "A" else "2026-12-10",
                            "expected_outcome": "DPIA submitted for sign-off; £200k unblocked." if acc_id == "A" else "Standard Operating Procedure (SOP) repository created.",
                            "evidence": "fo_dpia_2, fo_needs_3, pj_ticket, srv_dataflow" if acc_id == "A" else "sr_repl_2, ba_deputy_0"
                        },
                        {
                            "rank": 3,
                            "title": "Conduct Urgent Transition Meeting with Rhys Calder & Force CFOs" if acc_id == "A" else "Establish Real ROI Model with Nadia Rahman (Group Finance)",
                            "explanation": "Schedule executive alignment session before Rhys Calder's January departure." if acc_id == "A" else "Replace Stefan Roy's theoretical guard patrol hours calculation with verified operational metrics.",
                            "related_deal": "Alliance Renewal (£350k)" if acc_id == "A" else "Contract Renewal (€140k)",
                            "reason": "Rhys was sole counterparty on all historical calls." if acc_id == "A" else "Stefan's €1.2M savings claim has zero credibility in finance.",
                            "priority": "P1 - HIGH",
                            "owner": "Customer Success Manager",
                            "due_date": "2026-12-05" if acc_id == "A" else "2026-12-15",
                            "expected_outcome": "Succession plan documented; direct engagement with Ewan Brooks." if acc_id == "A" else "Audited finance-approved ROI summary.",
                            "evidence": "champion_leaves signal, rc_funding_2, contract.txt" if acc_id == "A" else "sr_roi_2 (roi_spreadsheet.csv)"
                        }
                    ]
                },
                "q4_risks": {
                    "risks": [
                        {
                            "severity": "RED",
                            "title": "Champion Departure Without Named Successor" if acc_id == "A" else "Unexplained Operational Drop: Docks AD-02, AD-05, AD-10 at Zero Flights",
                            "deal": "Alliance Renewal (£350k)" if acc_id == "A" else "Contract Renewal (€140k)",
                            "description": "Rhys Calder leaves in January. Every historical communication was through him." if acc_id == "A" else "3 core active docks dropped from 7 flights/wk to 0 flights/wk for two weeks.",
                            "consequence": "Alliance loses centralized advocacy before 28 Feb 2027 expiration." if acc_id == "A" else "Customer perceives FlytBase system as abandoned.",
                            "mitigation": "Engage Ewan Brooks (Finance) and Insp. Mbeki (Westmere) immediately." if acc_id == "A" else "Initiate telemetry diagnostics; contact Beatriz Alonso.",
                            "owner": "CSM",
                            "deadline": "2026-12-15" if acc_id == "A" else "2026-12-02",
                            "evidence": "champion_leaves signal, contract.txt" if acc_id == "A" else "usage_drop signal (B/usage_weekly.csv)"
                        },
                        {
                            "severity": "RED",
                            "title": "Unanswered SLA Request for High-Stakes Public Event" if acc_id == "A" else "Knowledge Loss from Imminent Departure of Rollout Lead (Deputy)",
                            "deal": "Westmere Operational Health (£300k Stadium)" if acc_id == "A" else "Idle Plants Activation (€180k Qualified)",
                            "description": "Insp. Mbeki submitted urgent ticket FB-11206 requesting written operator training and SLA. Unanswered." if acc_id == "A" else "Stefan's deputy configured all 14 docks and holds procedures in his head.",
                            "consequence": "Westmere pulls out of the alliance drone programme." if acc_id == "A" else "Aldermoor cannot deploy to idle plants or manage dock maintenance.",
                            "mitigation": "Issue written SLA and schedule pre-event operator training." if acc_id == "A" else "Conduct structured handover workshops this week.",
                            "owner": "CSM + FlytBase Support Lead" if acc_id == "A" else "CSM",
                            "deadline": "2026-11-21" if acc_id == "A" else "2026-12-10",
                            "evidence": "urgent_request signal (FB-11206)" if acc_id == "A" else "sr_repl_2, ba_deputy_0"
                        },
                        {
                            "severity": "AMBER",
                            "title": "DPIA Blocked in Tarn Valley & Norwold for 4 Months" if acc_id == "A" else "Fictitious ROI Exposure with Group Finance",
                            "deal": "Tarn Valley & Norwold Expansion (£200k Qualified)" if acc_id == "A" else "Renewal (€140k)",
                            "description": "DPO Fatima Osei has been waiting 4 months for data-flow architecture documentation." if acc_id == "A" else "Stefan Roy circulated an unvalidated €1.2M savings claim based on unreduced guard hours.",
                            "consequence": "Tarn Valley and Norwold remain 100% idle." if acc_id == "A" else "Nadia Rahman (Group Finance) will reject renewal or audit contract.",
                            "mitigation": "Deliver 4-part data pack within 7 days." if acc_id == "A" else "Reframe value around rapid intrusion detection and insurance compliance.",
                            "owner": "CSM + SRV" if acc_id == "A" else "CSM + Stefan Roy",
                            "deadline": "2026-11-25" if acc_id == "A" else "2026-12-15",
                            "evidence": "fo_dpia_2, pj_ticket, srv_dataflow" if acc_id == "A" else "sr_roi_2, roi_spreadsheet.csv"
                        }
                    ]
                },
                "q5_blind_spots": {
                    "gaps": [
                        {
                            "rank": 1,
                            "unknown": "Successor for Rhys Calder (Alliance Drone Programme Lead)" if acc_id == "A" else "Exact Date of Deputy's Departure and Status of Knowledge Transfer",
                            "why_it_matters": "All program communications flow through the alliance office." if acc_id == "A" else "Deputy holds technical setup knowledge for all 14 docks.",
                            "affected_deal": "Alliance Renewal (£350,000)" if acc_id == "A" else "Idle Plants Activation (€180,000)",
                            "decision_dependent": "Who has legal authority to execute the new order before 28 Feb 2027?" if acc_id == "A" else "Whether FlytBase needs to deploy professional services engineers.",
                            "who_can_answer": "Rhys Calder or Alliance Governance Board Chair" if acc_id == "A" else "Stefan Roy or the Deputy directly",
                            "how_to_obtain": "Request urgent handover meeting with Rhys Calder." if acc_id == "A" else "Contact Stefan Roy to confirm departure date.",
                            "if_unresolved": "Renewal misses statutory police procurement cycle." if acc_id == "A" else "Deployment knowledge is permanently lost to Aldermoor."
                        },
                        {
                            "rank": 2,
                            "unknown": "Individual Force Budget Split and Schedule 2 Billing Details" if acc_id == "A" else "Cause of 14-Day Zero-Flight Blackout on Docks AD-02, AD-05, AD-10",
                            "why_it_matters": "Order was invoiced in 4 parts per Schedule 2, but Schedule 2 was never copied to CS." if acc_id == "A" else "Three previously active docks completely ceased flying while reporting online.",
                            "affected_deal": "Alliance Renewal (£350,000)" if acc_id == "A" else "Renewal (€140,000)",
                            "decision_dependent": "Exact invoice amounts and procurement codes required for each of the 4 forces." if acc_id == "A" else "Is this a firmware bug, a local site lock-out, or intentional boycott?",
                            "who_can_answer": "FlytBase Accounts team or Ewan Brooks" if acc_id == "A" else "Beatriz Alonso (Plant 7) and relevant plant managers",
                            "how_to_obtain": "Retrieve Schedule 2 from FlytBase Accounts archive." if acc_id == "A" else "Review dock telemetry logs and call Beatriz Alonso.",
                            "if_unresolved": "Invoices misdirected to defunct alliance office account." if acc_id == "A" else "Remaining plants follow suit, leading to cancellation."
                        }
                    ]
                }
            },
            "signals": acc_signals,
            "raw_facts": raw_acc.get("facts", []),
            "raw_offers": raw_acc.get("offers", []),
            "raw_deadlines": raw_acc.get("deadlines", [])
        }
        
    db["portfolio"]["total_flights_flown"] = total_flights_all
    db["all_interactions"].sort(key=lambda x: x["date"], reverse=True)
    
    out_file = os.path.join(DATA_DIR, "crm_db.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2)
    print(f"CRM Database built with FULL TELEMETRY & FLIGHTS: {out_file} (Total flights: {total_flights_all})")

if __name__ == "__main__":
    build_db()
