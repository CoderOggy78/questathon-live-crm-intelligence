"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Clock,
  User,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

interface RiskRadarProps {
  data: any;
  selectedAccount: string;
  setSelectedAccount: (acc: string) => void;
  onViewEvidence: (id: string, account: string) => void;
}

export default function RiskRadar({
  data,
  selectedAccount,
  setSelectedAccount,
  onViewEvidence,
}: RiskRadarProps) {
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const acc = data?.accounts?.[selectedAccount];
  if (!acc) return null;

  const risks = acc.questions.q4_risks.risks || [];
  const filteredRisks = risks.filter((r: any) => {
    if (filterSeverity === "all") return true;
    return r.severity === filterSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="panel p-6 bg-white space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-3">
          <div>
            <span className="text-xs font-mono font-bold bg-pixelYellow text-ink px-2 py-0.5 border border-ink">
              QUESTION 4 OF 5
            </span>
            <h2 className="text-2xl font-extrabold text-ink tracking-tight mt-1">
              WHAT IS ABOUT TO GO WRONG?
            </h2>
            <p className="text-xs text-zinc-600 font-mono">
              Proactive Risk Radar: detecting personnel turnover, approaching deadlines, unanswered customer requests, and commercial vulnerability.
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

        {/* Severity filter pills */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-zinc-500">FILTER SEVERITY:</span>
          {["all", "RED", "AMBER"].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 border-2 border-ink font-bold ${
                filterSeverity === sev
                  ? "bg-ink text-white"
                  : "bg-parchment hover:bg-zinc-200 text-zinc-700"
              }`}
            >
              {sev === "RED" ? "RED (IMMEDIATE)" : sev === "AMBER" ? "AMBER (ELEVATED)" : "ALL RISKS"}
            </button>
          ))}
        </div>
      </div>

      {/* Risk Cards */}
      <div className="space-y-4">
        {filteredRisks.map((risk: any, idx: number) => (
          <div
            key={idx}
            className={`panel p-6 bg-white space-y-4 hover:shadow-retroLg transition-all border-l-8 ${
              risk.severity === "RED" ? "border-l-riskRed" : "border-l-riskAmber"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-ink/20 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`badge-tag ${risk.severity === "RED" ? "badge-red" : "badge-amber"}`}>
                    SEVERITY: {risk.severity}
                  </span>
                  <span className="text-xs font-mono font-bold text-zinc-500">
                    AFFECTED: {risk.deal}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-ink">
                  {risk.title}
                </h3>
              </div>

              <div className="flex flex-col items-end text-xs font-mono">
                <span className="text-riskRed font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> ESCALATION DEADLINE: {risk.deadline}
                </span>
                <span className="text-zinc-600 mt-0.5">
                  OWNER: <strong>{risk.owner}</strong>
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-2">
                <div className="p-3 bg-zinc-50 border border-zinc-200">
                  <span className="font-bold text-zinc-500 block mb-1">RISK DESCRIPTION:</span>
                  <p className="text-zinc-800 leading-relaxed">{risk.description}</p>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 text-red-950">
                  <span className="font-bold text-riskRed block mb-1">POTENTIAL COMMERCIAL CONSEQUENCE:</span>
                  <p className="leading-relaxed">{risk.consequence}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-950">
                  <span className="font-bold text-emerald-800 block mb-1">RECOMMENDED MITIGATION STRATEGY:</span>
                  <p className="leading-relaxed">{risk.mitigation}</p>
                </div>
                <div className="p-3 bg-white border border-ink/30 flex items-center justify-between">
                  <span className="text-zinc-500">
                    Evidence: <code>{risk.evidence}</code>
                  </span>
                  <button
                    onClick={() => onViewEvidence(risk.evidence.split(",")[0].trim(), selectedAccount)}
                    className="text-xs text-electricBlue hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>[View source]</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
