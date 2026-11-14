"use client";

import React from "react";
import {
  Users,
  Shield,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  UserCheck,
  UserX
} from "lucide-react";

interface StakeholderMapProps {
  data: any;
  selectedAccount: string;
  setSelectedAccount: (acc: string) => void;
  onViewEvidence: (id: string, account: string) => void;
}

export default function StakeholderMap({
  data,
  selectedAccount,
  setSelectedAccount,
  onViewEvidence,
}: StakeholderMapProps) {
  const acc = data?.accounts?.[selectedAccount];
  if (!acc) return null;

  const stakeholders = acc.questions.q2_stakeholders.stakeholders || [];

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="panel p-6 bg-white space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-3">
          <div>
            <span className="text-xs font-mono font-bold bg-pixelYellow text-ink px-2 py-0.5 border border-ink">
              QUESTION 2 OF 5
            </span>
            <h2 className="text-2xl font-extrabold text-ink tracking-tight mt-1">
              WHO HOLDS THE POWER?
            </h2>
            <p className="text-xs text-zinc-600 font-mono">
              Stakeholder intelligence map: economic buyers, decision-makers, technical evaluators, champions, blockers, and missing power links.
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

        {/* Stakeholder Role Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
          <div className="p-2 bg-emerald-50 border border-emerald-300">
            <strong>ECONOMIC BUYER:</strong> Holds budget & financial release authority.
          </div>
          <div className="p-2 bg-blue-50 border border-blue-300">
            <strong>TECHNICAL EVALUATOR:</strong> Tests operational and system capabilities.
          </div>
          <div className="p-2 bg-red-50 border border-red-300">
            <strong>BLOCKER / GATEKEEPER:</strong> Holds statutory, compliance, or audit veto.
          </div>
          <div className="p-2 bg-amber-50 border border-amber-300">
            <strong>CHAMPION:</strong> Drives internal adoption (verify longevity!).
          </div>
        </div>

        {/* Visual Org Structure & Power Lines */}
        <div className="p-4 bg-zinc-900 text-emerald-400 font-mono text-xs border-2 border-ink space-y-1">
          <div className="text-pixelYellow font-bold text-[11px] mb-2 uppercase">
            {selectedAccount === "A" ? "POLICE ALLIANCE DECISION HIERARCHY" : "ALDERMOOR INDUSTRIAL DECISION HIERARCHY"}
          </div>
          {selectedAccount === "A" ? (
            <pre className="text-[11px] leading-relaxed overflow-x-auto text-zinc-200">
{`[ALLIANCE LEVEL]
 └── Rhys Calder (Alliance Drone Lead) ─────────── [CHAMPION] ────► Exiting Jan 2027

[MEMBER FORCES - INDEPENDENT BUDGETS]
 ├── Westmere: Insp. Karen Mbeki (Drone Unit) ─── [USER / EVAL] ──► 1,497 flights, Urgent 5 Dec Ticket
 ├── Metro Central: Ewan Brooks (Finance Partner) ─ [BUDGET / BUYER] ► Confirmed: NO POOLED BUDGET
 ├── Tarn Valley: Fatima Osei (DPO) ───────────── [BLOCKER / VETO] ► 4-mo unanswered DPIA ticket
 └── Norwold: Drone Ops Team ──────────────────── [AWAITING DPIA] ─► Waiting to clone Tarn Valley`}
            </pre>
          ) : (
            <pre className="text-[11px] leading-relaxed overflow-x-auto text-zinc-200">
{`[GROUP EXECUTIVE]
 └── Stefan Roy (Head of Group Security) ───────── [CHAMPION] ────► Claims €1.2M unbooked savings
      ├── Departing Deputy (Rollout Lead) ──────── [TECHNICAL] ───► ONLY person who knows setup; leaving!
      └── Group Finance (Shared Mailbox) ───────── [BUDGET / BUYER] ► Disputed €1.2M savings; wants plant audit

[PLANT MANAGERS]
 └── Beatriz Alonso (Plant 7 Manager) ──────────── [SKEPTIC] ─────► Resents paying; guards ignore alerts`}
            </pre>
          )}
        </div>
      </div>

      {/* Stakeholder Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {stakeholders.map((person: any, idx: number) => (
          <div
            key={idx}
            className="panel p-6 bg-white space-y-4 hover:shadow-retroLg transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3 border-b-2 border-ink pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold bg-ink text-white px-2 py-0.5 uppercase tracking-wide">
                    {person.power_role}
                  </span>
                  <h3 className="text-xl font-extrabold text-ink mt-1">
                    {person.name}
                  </h3>
                  <span className="text-xs font-mono text-zinc-600 block">
                    {person.title} • <strong>{person.org}</strong>
                  </span>
                </div>

                <span
                  className={`badge-tag ${
                    person.relationship.toLowerCase().includes("ally")
                      ? "badge-verified"
                      : person.relationship.toLowerCase().includes("warm")
                      ? "badge-told"
                      : person.relationship.toLowerCase().includes("guarded")
                      ? "badge-red"
                      : "badge-inferred"
                  }`}
                >
                  {person.relationship}
                </span>
              </div>

              {/* Authority & Influence */}
              <div className="space-y-2 text-xs font-mono">
                <div className="bg-parchment p-2.5 border border-ink/20">
                  <span className="font-bold text-zinc-500 block mb-0.5">DECISION-MAKING AUTHORITY:</span>
                  <p className="text-zinc-800">{person.authority}</p>
                </div>

                <div className="bg-yellow-50 p-2.5 border border-amber-300">
                  <span className="font-bold text-amber-900 block mb-0.5">COMMERCIAL INFLUENCE:</span>
                  <p className="text-zinc-800">{person.commercial_influence}</p>
                </div>

                <div className="bg-zinc-50 p-2.5 border border-zinc-200">
                  <span className="font-bold text-zinc-500 block mb-0.5">LAST KNOWN INTERACTION:</span>
                  <p className="text-zinc-700 italic">"{person.last_interaction}"</p>
                </div>

                <div className="bg-red-50 p-2.5 border border-red-200 text-red-950">
                  <span className="font-bold text-riskRed block mb-0.5">CRITICAL MISSING INFORMATION:</span>
                  <p>{person.missing_info}</p>
                </div>
              </div>
            </div>

            {/* Evidence Citation */}
            <div className="pt-3 border-t border-ink/20 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">
                Evidence: <code>{person.evidence}</code>
              </span>
              <button
                onClick={() => onViewEvidence(person.evidence.split(",")[0].trim(), selectedAccount)}
                className="text-xs text-electricBlue hover:underline flex items-center gap-1 font-bold"
              >
                <span>[View source]</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
