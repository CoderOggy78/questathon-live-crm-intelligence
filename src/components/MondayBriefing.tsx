"use client";

import React, { useState } from "react";
import {
  FileText,
  Printer,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Factory,
  ArrowRight,
  UserCheck,
  Send,
  Building2,
  Calendar,
  Zap
} from "lucide-react";

import AudioBriefingPlayer from "./AudioBriefingPlayer";

interface MondayBriefingProps {
  data: any;
  setTab: (tab: string) => void;
  openNoteModal: () => void;
  onOpenBattlePlan?: () => void;
}

export default function MondayBriefing({
  data,
  setTab,
  openNoteModal,
  onOpenBattlePlan,
}: MondayBriefingProps) {
  const [copied, setCopied] = useState(false);

  if (!data?.accounts) return null;

  const accA = data.accounts.A;
  const accB = data.accounts.B;
  const portfolio = data.portfolio || {};

  const briefingText = `================================================================================
EXECUTIVE CS HANDOVER MEMO: THE MONDAY MORNING ACCOUNT AUDIT
Prepared for: VP of Customer Success & CRO
Date: Monday 16 November 2026
Portfolio: 2 Enterprise Accounts | £490,000 Base Recurring Revenue | 49 Docks
================================================================================

1. EXECUTIVE SITUATION SUMMARY
--------------------------------------------------------------------------------
Both customer accounts report "everything is great" on the surface, but a rigorous
primary-source audit reveals severe operational and commercial vulnerabilities 
requiring immediate executive intervention within the next 72 hours.

TOTAL PORTFOLIO AT RISK: £490,000 ARR (Non-automatic renewals)
- Account A: Eastern Counties Police Alliance (£350,000 / yr, Renews 28 Feb 2027)
- Account B: Aldermoor Industrial Group (€140,000 / yr, Renews 31 Jan 2027)

--------------------------------------------------------------------------------
2. ACCOUNT A: EASTERN COUNTIES POLICE ALLIANCE (£350k ACV)
--------------------------------------------------------------------------------
[STATUS: HIGH VULNERABILITY - BLOCKED EXPANSION & LEADERSHIP CLIFF]

• The Commercial Reality vs The Official Story:
  - Official Story: 4 forces, 35 docks flying, 300-dock tender incoming.
  - Primary Evidence: Only Westmere (Karen Mbeki) flies operational missions. 
    Tarn Valley and Norwold are frozen due to a 4-month unanswered DPIA ticket 
    (FB-10492) sitting unassigned in the FlytBase support queue.
  - Budget Truth: Ewan Brooks (Finance Partner, Metro Central) confirmed there is 
    NO pooled alliance budget. Each force CFO signs off independently.
  - Leadership Cliff: Champion Rhys Calder departs the alliance in January 2027.

• 72-Hour Fire Drill:
  1. Reply to Insp. Karen Mbeki's urgent ticket (FB-11206) for 5 Dec public event.
     Guarantee dock uptime SLA and dispatch a backup airframe.
  2. Have SRV (Engineering) finalize the Tarn Valley DPIA data-flow pack 
     (AWS eu-west-2, 30-day retention, encryption specs) and deliver to Fatima Osei.
  3. Engage Metro Central CFO Ewan Brooks before Rhys Calder's January departure.

--------------------------------------------------------------------------------
3. ACCOUNT B: ALDERMOOR INDUSTRIAL GROUP (€140k ACV)
--------------------------------------------------------------------------------
[STATUS: CRITICAL ANOMALY - UNBOOKED SAVINGS & RESIGNING ROLLOUT LEAD]

• The Commercial Reality vs The Official Story:
  - Official Story: 13 of 15 plants flying, €1.2M annual savings proven.
  - Primary Evidence: Stefan Roy's €1.2M savings is a personal spreadsheet of 
    prospective guard replacement. Third-party guard contracts were NEVER amended 
    to respond to drone alerts. Group Finance booked €0 savings.
  - Finance Friction: Group Finance (shared mailbox) requested plant-by-plant cost 
    breakdowns on 8 Oct and questioned the ROI before the 31 Jan 2027 renewal.
  - Operational Blackout: Telemetry confirms Docks AD-02, AD-05, and AD-10 suddenly 
    dropped from 7 flights/wk to ZERO flights in November while reporting online.
  - Knowledge Loss: Stefan's deputy, who personally configured all 14 docks, is 
    resigning imminently with zero written rollout procedures.

• 72-Hour Fire Drill:
  1. Deliver plant cost reconciliation memo to Group Finance before the 31 Jan renewal.
  2. Intercept resigning deputy and document standard dock deployment SOPs.
  3. Investigate telemetry blackout on Docks AD-02, AD-05, AD-10 with engineering.

--------------------------------------------------------------------------------
4. REVENUE WATERFALL AUDIT
--------------------------------------------------------------------------------
• Verified Recurring Base (Agreed & Invoiced):
  - Police Alliance Base: £350,000 / yr (4 quarterly invoices paid)
  - Aldermoor Group Base: €140,000 / yr (1 annual invoice paid)

• Qualified Expansion Pipeline (Achievable with intervention):
  - Tarn Valley & Norwold Go-Live: £200,000 (Blocked solely by DPIA)
  - Aldermoor Inactive Plants: €180,000 (Requires guard protocol alignment)

• Quarantined Speculative Value (Zero evidence / Disputed):
  - £3,300,000 300-dock framework tender (Quarantined: No pooled budget)
  - €1,200,000 Annual Savings Claim (Quarantined: Unbooked in finance)
================================================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(briefingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Audio Briefing Player */}
      <AudioBriefingPlayer />

      {/* Top Banner */}
      <div className="panel p-6 bg-parchmentDark border-[3px] border-ink shadow-retroLg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-4">
          <div>
            <div className="inline-block bg-pixelYellow text-ink px-2.5 py-0.5 text-xs font-mono font-bold border border-ink mb-1.5">
              MONDAY MORNING EXECUTIVE HANDOVER
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              CS HANDOVER BRIEFING: PORTFOLIO AUDIT & 72-HR ACTION PLAN
            </h2>
            <p className="text-xs text-zinc-700 font-mono">
              The exact decision-support dossier you hand your VP of Customer Success or Chief Revenue Officer on Monday at 09:00.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenBattlePlan && (
              <button
                onClick={onOpenBattlePlan}
                className="px-3.5 py-1.5 bg-pixelYellow hover:bg-yellow-400 text-ink border-2 border-ink shadow-retro font-mono font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-ink animate-pulse" />
                <span>DEPLOY BATTLE PLAN</span>
              </button>
            )}
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-bold font-mono bg-white text-ink border-2 border-ink hover:bg-pixelYellow shadow-sm flex items-center gap-1.5"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "COPIED" : "COPY TEXT"}</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn-pixel text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT / PDF</span>
            </button>
          </div>
        </div>

        {/* High-level status scorecard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 bg-white border-2 border-ink shadow-sm space-y-1">
            <span className="text-zinc-500 block text-[11px]">PORTFOLIO ARR AT STAKE</span>
            <strong className="text-xl text-ink block">£350,000 + €140,000</strong>
            <span className="text-[10px] text-riskRed font-bold block flex items-center gap-1">
              <Clock className="w-3 h-3" /> Renewals: 31 Jan & 28 Feb 2027
            </span>
          </div>

          <div className="p-3 bg-red-50 border-2 border-riskRed shadow-sm space-y-1">
            <span className="text-riskRed font-bold block text-[11px]">IMMEDIATE FIRE DRILLS</span>
            <strong className="text-xl text-riskRed block">3 URGENT ESCALATIONS</strong>
            <span className="text-[10px] text-red-900 block">
              Karen Mbeki 5 Dec SLA • Tarn DPIA • AD Telemetry Drop
            </span>
          </div>

          <div className="p-3 bg-emerald-50 border-2 border-emerald-700 shadow-sm space-y-1">
            <span className="text-emerald-800 font-bold block text-[11px]">UNLOCKABLE EXPANSION</span>
            <strong className="text-xl text-emerald-700 block">£200,000 + €180,000</strong>
            <span className="text-[10px] text-emerald-800 block">
              Tarn/Norwold Go-Live + Remaining Plants
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Account Dossier */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Account A Executive Card */}
        <div className="panel p-6 bg-white border-[3px] border-ink space-y-4 shadow-retro">
          <div className="flex items-center justify-between border-b-2 border-ink pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-electricBlue text-white border border-ink">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase block">
                  ACCOUNT A • £350k ACV
                </span>
                <h3 className="font-extrabold text-base text-ink">
                  Eastern Counties Police Alliance
                </h3>
              </div>
            </div>
            <span className="badge-tag badge-red">RENEWAL 28 FEB 2027</span>
          </div>

          {/* Core Findings */}
          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 bg-red-50 border border-red-200 space-y-1">
              <strong className="text-riskRed block flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> 1. UNANSWERED DPIA TICKET (FB-10492)
              </strong>
              <p className="text-zinc-800 leading-relaxed text-[11px]">
                Tarn Valley DPO Fatima Osei logged a ticket 4 months ago requesting data-flow diagrams, encryption protocols, and retention periods. It has sat unassigned. Norwold is waiting to copy Tarn Valley's assessment. <strong>£200,000 expansion is frozen solely by this ticket.</strong>
              </p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-300 space-y-1">
              <strong className="text-amber-900 block flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> 2. CHAMPION DEPARTURE CLIFF
              </strong>
              <p className="text-zinc-800 leading-relaxed text-[11px]">
                Rhys Calder exits in January 2027. There is <strong>no pooled budget</strong>; each force CFO must sign off individually. We must establish relationships with Metro Central CFO Ewan Brooks immediately.
              </p>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-300 space-y-1">
              <strong className="text-zinc-900 block flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-accentOrange" /> 3. INSP. KAREN MBEKI URGENT TICKET (FB-11206)
              </strong>
              <p className="text-zinc-800 leading-relaxed text-[11px]">
                Westmere is flying 1,497 flights. Karen Mbeki logged ticket FB-11206 requesting SLA guarantees and a spare drone dock for a major 5 Dec public event. No response logged yet.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-ink/20 flex items-center justify-between">
            <button
              onClick={() => setTab("account-a")}
              className="text-xs font-mono font-bold text-electricBlue hover:underline flex items-center gap-1"
            >
              <span>Open Complete Account A Intelligence</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={openNoteModal}
              className="btn-pixel text-[11px] py-1 px-2.5"
            >
              Log Action to MCP
            </button>
          </div>
        </div>

        {/* Account B Executive Card */}
        <div className="panel p-6 bg-white border-[3px] border-ink space-y-4 shadow-retro">
          <div className="flex items-center justify-between border-b-2 border-ink pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-accentOrange text-white border border-ink">
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase block">
                  ACCOUNT B • €140k ACV
                </span>
                <h3 className="font-extrabold text-base text-ink">
                  Aldermoor Industrial Group
                </h3>
              </div>
            </div>
            <span className="badge-tag badge-red">RENEWAL 31 JAN 2027</span>
          </div>

          {/* Core Findings */}
          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 bg-red-50 border border-red-200 space-y-1">
              <strong className="text-riskRed block flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> 1. €1.2M PHANTOM SAVINGS DISPUTE
              </strong>
              <p className="text-zinc-800 leading-relaxed text-[11px]">
                Stefan Roy claimed €1.2M annual savings. Primary evidence from <code>roi_spreadsheet.csv</code> proves this was a personal estimate of unreduced guard hours. <strong>Group Finance booked €0 savings and questioned the renewal quote on 8 Oct.</strong>
              </p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-300 space-y-1">
              <strong className="text-amber-900 block flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> 2. TELEMETRY DROPOUT (AD-02, 05, 10)
              </strong>
              <p className="text-zinc-800 leading-relaxed text-[11px]">
                Docks AD-02, AD-05, and AD-10 ceased flights entirely in November despite reporting 7 days online. Plant managers do not act on alerts because third-party guard contracts do not cover drone response.
              </p>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-300 space-y-1">
              <strong className="text-zinc-900 block flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-accentOrange" /> 3. ROLLOUT DEPUTY RESIGNATION
              </strong>
              <p className="text-zinc-800 leading-relaxed text-[11px]">
                Stefan's deputy personally set up all 14 docks and holds all operational know-how. He is leaving imminently with zero written documentation.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-ink/20 flex items-center justify-between">
            <button
              onClick={() => setTab("account-b")}
              className="text-xs font-mono font-bold text-accentOrange hover:underline flex items-center gap-1"
            >
              <span>Open Complete Account B Intelligence</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={openNoteModal}
              className="btn-pixel text-[11px] py-1 px-2.5"
            >
              Log Action to MCP
            </button>
          </div>
        </div>
      </div>

      {/* Raw Formatted Memo Box */}
      <div className="panel p-6 bg-white border-[3px] border-ink space-y-3">
        <div className="flex items-center justify-between border-b-2 border-ink pb-3">
          <h3 className="font-mono font-bold text-sm text-ink flex items-center gap-2">
            <FileText className="w-4 h-4 text-ink" />
            FULL EXECUTIVE MEMORANDUM (MONOSPACE DOSSIER)
          </h3>
          <span className="text-[11px] font-mono text-zinc-500">
            Formatted for terminal output, board packets, or text export
          </span>
        </div>

        <pre className="p-4 bg-zinc-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border-2 border-ink">
          {briefingText}
        </pre>
      </div>
    </div>
  );
}
