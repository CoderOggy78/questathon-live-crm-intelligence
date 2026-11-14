"use client";

import React from "react";
import {
  CheckSquare,
  Clock,
  User,
  ArrowRight,
  ExternalLink,
  Target,
  AlertCircle
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
  const acc = data?.accounts?.[selectedAccount];
  if (!acc) return null;

  const actions = acc.questions.q3_next_actions.actions || [];

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
        {actions.map((act: any) => (
          <div
            key={act.rank}
            className="panel p-6 bg-white space-y-4 hover:shadow-retroLg transition-all"
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
          </div>
        ))}
      </div>
    </div>
  );
}
