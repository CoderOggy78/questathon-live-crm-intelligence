"use client";

import React, { useState } from "react";
import {
  CheckSquare,
  Clock,
  User,
  ArrowRight,
  ExternalLink,
  Target,
  AlertCircle,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Mail,
  Zap
} from "lucide-react";

interface NextActionsProps {
  data: any;
  selectedAccount: string;
  setSelectedAccount: (acc: string) => void;
  onViewEvidence: (id: string, account: string) => void;
  openNoteModal: () => void;
}

export default function NextActions({
  data,
  selectedAccount,
  setSelectedAccount,
  onViewEvidence,
  openNoteModal,
}: NextActionsProps) {
  const [expandedPlaybook, setExpandedPlaybook] = useState<number | null>(null);
  const [transmitting, setTransmitting] = useState<number | null>(null);
  const [transmitted, setTransmitted] = useState<{ [key: number]: boolean }>({});

  const acc = data?.accounts?.[selectedAccount];
  if (!acc) return null;

  const actions = acc.questions?.q3_next_actions?.actions || [];

  const handleTransmitNote = async (act: any, idx: number) => {
    setTransmitting(idx);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: selectedAccount,
          kind: "next_step",
          title: `[ACTION 0${act.rank}] ${act.title}`,
          text: `Owner: ${act.owner} | Due: ${act.due_date} | Related Deal: ${act.related_deal}\nPlan: ${act.explanation}\nExpected Outcome: ${act.expected_outcome}`,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setTransmitted((prev) => ({ ...prev, [idx]: true }));
      }
    } catch (e) {
      console.error("Failed to transmit note:", e);
    } finally {
      setTransmitting(null);
    }
  };

  const getPlaybookDraft = (rank: number, isA: boolean) => {
    if (isA) {
      if (rank === 1) {
        return {
          to: "Insp. Karen Mbeki (Westmere Drone Unit)",
          subject: "RE: Ticket FB-11206 - Operational Support & Standby Airframe for 5 Dec Event",
          body: `Inspector Mbeki,

Regarding your urgent ticket FB-11206: FlytBase confirms an expedited operational support package for Westmere's 5 December public safety operation.

1. Standby Airframe: FlytBase Solutions Engineering is dispatching a redundant pre-configured airframe to your base by 2 December.
2. Guaranteed 99.9% Uptime SLA: Dedicated Tier-3 engineering hotline on standby during your flight windows.
3. Weather Routing: Automated high-wind gust diversion protocols enabled for dock ECPA-D01 to ECPA-D04.

Best regards,
Customer Success Operations, FlytBase`
        };
      } else if (rank === 2) {
        return {
          to: "Fatima Osei (DPO, Tarn Valley Police) & SRV (Director of Engineering)",
          subject: "Tarn Valley Police DPIA: Complete Technical Security & Data-Flow Dossier (FB-10492)",
          body: `Fatima,

Apologies for the delay on ticket FB-10492. Following direct coordination with our Director of Engineering (SRV), we have finalized the formal DPIA technical pack required for Tarn Valley:

• Hosting Location: AWS eu-west-2 (London, UK sovereign cloud).
• Encryption: AES-256 for video at rest; TLS 1.3 for telemetry in transit.
• Retention: Automated 30-day purge policy; audit logging for all operator access.
• Norwold Alignment: Documented for Norwold Police to mirror for immediate go-live.

Best regards,
Customer Success Operations, FlytBase`
        };
      } else {
        return {
          to: "Ewan Brooks (Finance Partner, Metro Central Police)",
          subject: "FY27 Commercial Planning: Metro Central 8-Dock Direct Allocation",
          body: `Ewan,

Ahead of FY27 budget planning, FlytBase would like to provide Metro Central with a force-specific commercial proposal for your 8 dock allocations, independent of central alliance office overhead.

We understand each member force exercises independent capital expenditure authority. Let us schedule a 20-minute commercial review this week.

Best regards,
Customer Success Operations, FlytBase`
        };
      }
    } else {
      if (rank === 1) {
        return {
          to: "Group Finance (shared mailbox), Aldermoor Industrial Group",
          subject: "RE: Renewal quote, drone docks - Plant Cost Breakdown & ROI Reconciliation",
          body: `Group Finance,

In response to your email of 8 October regarding the January 31 dock contract renewal:

1. Plant Breakdown: Attached is the itemized cost per plant across our 14 deployed docks (€10,000/dock/year).
2. Labor Reconciliation: Stefan Roy's €1.2M savings figure represents prospective perimeter security labor displacement. We propose meeting to align on verified guard contractor hours to structure a sustainable multi-year renewal.

Best regards,
Customer Success Operations, FlytBase`
        };
      } else if (rank === 2) {
        return {
          to: "Departing Rollout Deputy & Stefan Roy (Group Security)",
          subject: "Aldermoor Drone Program: Standard Operating Procedure & Handover Workshop",
          body: `Stefan & Team,

Ahead of the upcoming rollout lead transition, FlytBase is hosting a structured 4-hour handover workshop this Thursday:

• Dock Commissioning SOP: Documenting the exact network, power, and IT firewall parameters used across all 14 plants.
• Plant Manager Runbook: Establishing escalation paths for site managers (including Plant 7 & Plant 11 link issues).
• Archive: Centralizing all site blueprints into the FlytBase portal.

Best regards,
Customer Success Operations, FlytBase`
        };
      } else {
        return {
          to: "Field Engineering Desk & Plant 2, 5, 10 Security",
          subject: "Urgent Operational Investigation: Zero Flight Telemetry on Docks AD-02, AD-05, AD-10",
          body: `Field Operations Team,

Telemetry shows docks AD-02, AD-05, and AD-10 at Plants 2, 5, and 10 have logged zero flights in the last two weeks despite reporting 7 days online.

1. Contractor Audit: Confirm whether local third-party guard contractors received alert dispatch training.
2. Sensor Check: Remote diagnostic test on optical sensors and lid opening mechanisms.
3. Status Report: Required within 24 hours.

Best regards,
Customer Success Operations, FlytBase`
        };
      }
    }
  };

  const isA = selectedAccount === "A";

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="panel p-6 bg-white space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-3">
          <div>
            <span className="text-xs font-mono font-bold bg-pixelYellow text-ink px-2 py-0.5 border border-ink">
              QUESTION 3 OF 5
            </span>
            <h2 className="text-2xl font-extrabold text-ink tracking-tight mt-1">
              WHAT DO YOU DO FIRST?
            </h2>
            <p className="text-xs text-zinc-600 font-mono">
              Intelligent Next Best Action engine: ranked priority actions with named owners, explicit deadlines, and expected outcomes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-zinc-500">ACCOUNT:</span>
            <button
              onClick={() => setSelectedAccount("A")}
              className={`px-3 py-1 text-xs font-mono font-bold border-2 border-ink ${
                selectedAccount === "A"
                  ? "bg-electricBlue text-white shadow-retro"
                  : "bg-white text-ink hover:bg-zinc-100"
              }`}
            >
              Account A: Police
            </button>
            <button
              onClick={() => setSelectedAccount("B")}
              className={`px-3 py-1 text-xs font-mono font-bold border-2 border-ink ${
                selectedAccount === "B"
                  ? "bg-accentOrange text-white shadow-retro"
                  : "bg-white text-ink hover:bg-zinc-100"
              }`}
            >
              Account B: Aldermoor
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-mono bg-yellow-50 p-2.5 border border-amber-300 text-amber-900">
          <span>
            <strong>RANKING CRITERIA:</strong> 1. Deal Value • 2. Deadline Urgency • 3. Blocker Severity • 4. Stakeholder Influence
          </span>
          <button
            onClick={openNoteModal}
            className="text-xs text-ink font-bold underline hover:text-electricBlue"
          >
            + Transmit Custom Action to MCP
          </button>
        </div>
      </div>

      {/* Ranked Action Cards */}
      <div className="space-y-5">
        {actions.map((act: any, idx: number) => {
          const isExpanded = expandedPlaybook === idx;
          const draft = getPlaybookDraft(act.rank, isA);
          const isTransmitted = transmitted[idx];

          return (
            <div
              key={act.rank}
              className="panel p-6 bg-white space-y-4 hover:shadow-retroLg transition-all border-[3px] border-ink"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-ink pb-3">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-none bg-ink text-pixelYellow border border-ink flex items-center justify-center font-bold font-pixel text-xs">
                    0{act.rank}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge-tag badge-red">
                        {act.priority}
                      </span>
                      <span className="text-xs font-mono font-bold text-zinc-500">
                        RELATED DEAL: {act.related_deal}
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-ink">
                      {act.title}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col items-end text-xs font-mono">
                  <span className="flex items-center gap-1 text-riskRed font-bold">
                    <Clock className="w-3.5 h-3.5" /> DUE: {act.due_date}
                  </span>
                  <span className="flex items-center gap-1 text-zinc-600 mt-0.5">
                    <User className="w-3.5 h-3.5" /> OWNER: <strong>{act.owner}</strong>
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-2">
                  <div className="p-3 bg-parchment border border-ink/20">
                    <span className="font-bold text-zinc-500 block mb-1">ACTION EXECUTION PLAN:</span>
                    <p className="text-zinc-800 leading-relaxed">{act.explanation}</p>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-amber-300">
                    <span className="font-bold text-amber-900 block mb-1">DECISION RATIONALE:</span>
                    <p className="text-zinc-800 leading-relaxed">{act.reason}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-950">
                    <span className="font-bold text-emerald-800 block mb-1 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" /> EXPECTED MEASURABLE OUTCOME:
                    </span>
                    <p className="leading-relaxed">{act.expected_outcome}</p>
                  </div>

                  <div className="p-3 bg-white border-2 border-ink/30 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink">SUPPORTING EVIDENCE:</span>
                      <button
                        onClick={() => onViewEvidence(act.evidence.split(",")[0].trim(), selectedAccount)}
                        className="text-xs text-electricBlue hover:underline flex items-center gap-1 font-bold"
                      >
                        <span>[View source]</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-zinc-600 text-[11px]">
                      Grounding: <code>{act.evidence}</code>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Playbook Toggle & MCP Dispatch */}
              <div className="pt-3 border-t-2 border-ink/20 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setExpandedPlaybook(isExpanded ? null : idx)}
                  className="text-xs font-mono font-bold text-ink hover:text-electricBlue flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{isExpanded ? "HIDE PRE-DRAFTED PLAYBOOK" : "VIEW READY-TO-SEND DISPATCH PLAYBOOK"}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <div className="flex items-center gap-2">
                  {isTransmitted ? (
                    <span className="text-xs font-mono font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> TRANSMITTED TO LIVE MCP SERVER
                    </span>
                  ) : (
                    <button
                      onClick={() => handleTransmitNote(act, idx)}
                      disabled={transmitting === idx}
                      className="btn-pixel text-xs py-1.5 px-3 flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-pixelYellow" />
                      <span>{transmitting === idx ? "TRANSMITTING..." : "DISPATCH AS MCP NOTE"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Expandable Playbook Drawer */}
              {isExpanded && draft && (
                <div className="p-4 bg-zinc-900 text-zinc-100 font-mono text-xs border-2 border-ink space-y-2 mt-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-zinc-700 pb-2 text-[11px]">
                    <span className="text-pixelYellow font-bold uppercase">
                      PRE-DRAFTED OPERATIONAL DISPATCH MEMO
                    </span>
                    <span className="text-zinc-400">To: {draft.to}</span>
                  </div>
                  <div className="text-zinc-300 font-bold text-[11px]">
                    Subject: {draft.subject}
                  </div>
                  <pre className="p-3 bg-zinc-950 border border-zinc-800 text-zinc-300 text-[11px] leading-relaxed whitespace-pre-wrap font-mono">
                    {draft.body}
                  </pre>
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleTransmitNote(act, idx)}
                      disabled={transmitting === idx || isTransmitted}
                      className="btn-pixel text-[11px] py-1 px-3 flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>{isTransmitted ? "NOTE RECORDED" : "TRANSMIT MEMO VIA MCP NOTE"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
