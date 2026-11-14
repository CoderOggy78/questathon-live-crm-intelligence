"use client";

import React from "react";
import {
  Radio,
  Clock,
  ArrowRight,
  ExternalLink,
  AlertTriangle,
  UserX,
  TrendingDown,
  MailCheck
} from "lucide-react";

interface LiveEventsProps {
  data: any;
  onViewEvidence: (id: string, account: string) => void;
  openNoteModal: () => void;
}

export default function LiveEvents({
  data,
  onViewEvidence,
  openNoteModal,
}: LiveEventsProps) {
  const signalsA = data?.accounts?.A?.signals || [];
  const signalsB = data?.accounts?.B?.signals || [];
  const allSignals = [...signalsA, ...signalsB];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="panel p-6 bg-white space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-3">
          <div>
            <span className="text-xs font-mono font-bold bg-riskRed text-white px-2 py-0.5 border border-ink animate-pulse">
              LIVE MCP SIGNALS FEED
            </span>
            <h2 className="text-2xl font-extrabold text-ink tracking-tight mt-1">
              LIVE EVENT INTELLIGENCE
            </h2>
            <p className="text-xs text-zinc-600 font-mono">
              Real-time events detected through MCP (<code className="text-xs">get_signals</code>) that alter risk assessments, stakeholder relationships, and action priorities.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-zinc-500 bg-parchmentDark px-3 py-1.5 border border-ink">
              ACTIVE SIGNALS: <strong>{allSignals.length} SIGNALS</strong>
            </span>
          </div>
        </div>

        <div className="p-3 bg-blue-50 border-l-4 border-electricBlue text-xs font-mono text-blue-950">
          <strong>DYNAMIC ADAPTATION ENGINE:</strong> When new events arrive, the CRM stores the event, identifies the affected account, re-evaluates risks, and immediately updates next recommended actions.
        </div>
      </div>

      {/* Signal Cards */}
      <div className="space-y-5">
        {allSignals.map((sig: any) => {
          const isA = sig.account === "A";
          return (
            <div
              key={sig.id}
              className="panel p-6 bg-white space-y-4 hover:shadow-retroLg transition-all border-l-8 border-l-riskRed"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-ink pb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-ink text-pixelYellow border border-ink">
                    {sig.id === "champion_leaves" ? (
                      <UserX className="w-5 h-5" />
                    ) : sig.id === "urgent_request" ? (
                      <MailCheck className="w-5 h-5" />
                    ) : (
                      <TrendingDown className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge-tag ${isA ? "badge-verified" : "badge-amber"}`}>
                        ACCOUNT {sig.account}
                      </span>
                      <span className="badge-tag badge-red">LIVE SIGNAL</span>
                      <span className="text-xs font-mono text-zinc-500">ID: {sig.id}</span>
                    </div>
                    <h3 className="text-lg font-extrabold text-ink">
                      {sig.title}
                    </h3>
                  </div>
                </div>

                <div className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> DATED: {sig.dated}
                </div>
              </div>

              {/* Summary and Ingested Records */}
              <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-2">
                  <div className="p-3 bg-zinc-50 border border-zinc-200">
                    <span className="font-bold text-zinc-500 block mb-1">EVENT SUMMARY:</span>
                    <p className="text-zinc-800 leading-relaxed">{sig.summary}</p>
                  </div>

                  <div className="p-3 bg-red-50 border border-red-200 text-red-950">
                    <span className="font-bold text-riskRed block mb-1">IMPACT ON ACCOUNT STRATEGY:</span>
                    <p className="leading-relaxed">
                      {sig.id === "champion_leaves" &&
                        "All single-threaded influence is broken. Direct access to force CFOs (Ewan Brooks) and operational chiefs (Karen Mbeki) is now mandatory before January."}
                      {sig.id === "urgent_request" &&
                        "Public event on 5 December represents make-or-break operational proof. Failure to reply in writing this week will destroy Westmere's trust."}
                      {sig.id === "usage_drop" &&
                        "Unexplained collapse on 3 previously active docks threatens renewal validation and proves plant-level disengagement. Immediate diagnostic required."}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-950">
                    <span className="font-bold text-emerald-800 block mb-1">RECOMMENDED OPERATIONAL RESPONSE:</span>
                    <p className="leading-relaxed">
                      {sig.id === "champion_leaves" &&
                        "Trigger transition protocol with Rhys Calder; schedule introduction to force governance lead."}
                      {sig.id === "urgent_request" &&
                        "Escalate ticket FB-11206 to FlytBase Support Lead today; commit written training and on-call SLA."}
                      {sig.id === "usage_drop" &&
                        "Audit dock telemetry logs for AD-02, 05, 10; contact Beatriz Alonso (Plant 7) to confirm site condition."}
                    </p>
                  </div>

                  {sig.records?.map((rec: any, rIdx: number) => (
                    <div key={rIdx} className="p-3 bg-white border border-ink/30 space-y-1">
                      <span className="font-bold text-ink block">SOURCE RECORD: {rec.path}</span>
                      <pre className="bg-zinc-900 text-zinc-200 p-2 rounded text-[11px] overflow-x-auto max-h-32 whitespace-pre-wrap">
                        {rec.text}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-200 flex justify-end">
                <button
                  onClick={openNoteModal}
                  className="btn-pixel text-xs py-1.5 px-4 flex items-center gap-1.5"
                >
                  <span>WRITE MCP NOTE FOR THIS SIGNAL</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
