"use client";

import React, { useState } from "react";
import {
  Shield,
  Factory,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Users,
  CheckSquare,
  AlertTriangle,
  EyeOff
} from "lucide-react";

interface AccountWorkspaceProps {
  accountId: "A" | "B";
  data: any;
  setTab: (tab: string) => void;
  onViewEvidence: (id: string, account: string) => void;
}

export default function AccountWorkspace({
  accountId,
  data,
  setTab,
  onViewEvidence,
}: AccountWorkspaceProps) {
  const [filterFactStatus, setFilterFactStatus] = useState<string>("all");
  const [showAllRecords, setShowAllRecords] = useState(false);

  const acc = data?.accounts?.[accountId];
  if (!acc) return null;

  const isA = accountId === "A";
  const currencySymbol = acc.currency_symbol || (isA ? "£" : "€");

  const filteredFacts = (acc.raw_facts || []).filter((f: any) => {
    if (filterFactStatus === "all") return true;
    return f.status === filterFactStatus;
  });

  return (
    <div className="space-y-6">
      {/* Workspace Header Banner */}
      <div className={`p-6 border-[3px] border-ink shadow-retroLg ${isA ? "bg-white" : "bg-white"}`}>
        <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-ink pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 border-2 border-ink ${isA ? "bg-electricBlue text-white" : "bg-accentOrange text-white"}`}>
              {isA ? <Shield className="w-8 h-8" /> : <Factory className="w-8 h-8" />}
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                ACCOUNT {accountId} INTELLIGENCE WORKSPACE
              </span>
              <h2 className="text-2xl font-extrabold text-ink tracking-tight">
                {acc.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right font-mono">
              <span className="text-[11px] text-zinc-500 block">BASE CONTRACT ACV</span>
              <span className="text-xl font-bold text-ink">
                {currencySymbol}{(acc.annual_contract_value || 0).toLocaleString()} / yr
              </span>
            </div>
            <div className="border-l-2 border-ink pl-3 text-right font-mono">
              <span className="text-[11px] text-zinc-500 block">RENEWAL DEADLINE</span>
              <span className="text-sm font-bold text-riskRed flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {acc.renewal_deadline || "Pending"}
              </span>
            </div>
          </div>
        </div>

        {/* Narrative Comparison: Official Story vs Verified Reality */}
        <div className="grid md:grid-cols-2 gap-4 mt-4 text-xs font-mono">
          <div className="p-3 bg-zinc-100 border-2 border-zinc-300">
            <span className="text-zinc-500 font-bold block mb-1">
              OFFICIAL STORY (WHAT THE ACCOUNT SHEET SAYS - UNVERIFIED):
            </span>
            <p className="text-zinc-800 leading-relaxed italic">
              "{acc.official_story || 'No official summary provided.'}"
            </p>
          </div>
          <div className="p-3 bg-red-50 border-2 border-red-300 text-red-950">
            <span className="font-bold block mb-1 text-riskRed">
              EVIDENCE-GROUNDED AUDIT (WHAT DISCOVERY REVEALS):
            </span>
            <p className="leading-relaxed">
              {isA ? (
                <>
                  Only Westmere flies live operational missions. Tarn Valley and Norwold are idle due to a 4-month unassigned DPIA ticket. There is no pooled alliance budget; each force CFO must approve call-offs. Rhys Calder is departing in January!
                </>
              ) : (
                <>
                  Stefan's €1.2M savings is a personal spreadsheet of unreduced guard hours; Group Finance has booked €0. Third-party guards do not act on drone alerts. Docks AD-02, 05, 10 have zero flights in last 2 weeks. Stefan's deputy departs soon taking all deployment know-how!
                </>
              )}
            </p>
          </div>
        </div>

        {/* Five Questions Quick Navigation Bar */}
        <div className="mt-5 pt-4 border-t-2 border-ink flex flex-wrap gap-2">
          <span className="text-xs font-mono font-bold text-zinc-500 self-center mr-2">
            FIVE CRITICAL QUESTIONS:
          </span>
          <button
            onClick={() => setTab("deals")}
            className="px-3 py-1 bg-parchmentDark hover:bg-pixelYellow border border-ink text-xs font-mono font-bold flex items-center gap-1"
          >
            <CircleDollarSign className="w-3 h-3 text-ink" /> Q1: Deal Worth
          </button>
          <button
            onClick={() => setTab("stakeholders")}
            className="px-3 py-1 bg-parchmentDark hover:bg-pixelYellow border border-ink text-xs font-mono font-bold flex items-center gap-1"
          >
            <Users className="w-3 h-3 text-ink" /> Q2: Power Map
          </button>
          <button
            onClick={() => setTab("actions")}
            className="px-3 py-1 bg-parchmentDark hover:bg-pixelYellow border border-ink text-xs font-mono font-bold flex items-center gap-1"
          >
            <CheckSquare className="w-3 h-3 text-ink" /> Q3: Next Actions
          </button>
          <button
            onClick={() => setTab("risks")}
            className="px-3 py-1 bg-parchmentDark hover:bg-pixelYellow border border-ink text-xs font-mono font-bold flex items-center gap-1"
          >
            <AlertTriangle className="w-3 h-3 text-ink" /> Q4: Risk Radar
          </button>
          <button
            onClick={() => setTab("blindspots")}
            className="px-3 py-1 bg-parchmentDark hover:bg-pixelYellow border border-ink text-xs font-mono font-bold flex items-center gap-1"
          >
            <EyeOff className="w-3 h-3 text-ink" /> Q5: Blind Spots
          </button>
        </div>
      </div>

      {/* Facts & Statements Log */}
      <div className="panel p-6 bg-white space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-3">
          <div>
            <h3 className="font-mono font-bold text-base text-ink flex items-center gap-2">
              <FileText className="w-4 h-4 text-electricBlue" />
              DISCOVERY STATEMENTS & AUDIT LOG ({acc.raw_facts?.length || 0} ITEMS)
            </h3>
            <p className="text-xs text-zinc-600 font-mono">
              Statements logged during discovery with explicit verification status
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-zinc-500">FILTER STATUS:</span>
            {["all", "verified", "told", "claim"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterFactStatus(st)}
                className={`px-2 py-0.5 border border-ink uppercase ${
                  filterFactStatus === st
                    ? "bg-ink text-white font-bold"
                    : "bg-parchment hover:bg-zinc-200 text-zinc-700"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filteredFacts.map((fact: any) => (
            <div
              key={fact.id}
              className="p-3 border border-ink/30 bg-parchment hover:bg-yellow-50/50 transition-all flex flex-wrap items-start justify-between gap-3"
            >
              <div className="space-y-1 max-w-3xl">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="font-bold text-zinc-500">ID: {fact.id}</span>
                  <span>•</span>
                  <span>Said by: <strong>{fact.said_by}</strong></span>
                  <span>•</span>
                  <span>Minute {fact.learned_at_minute}</span>
                </div>
                <p className="text-sm font-mono text-ink">
                  "{fact.text}"
                </p>
                {fact.verified_by && (
                  <div className="text-xs font-mono text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified by primary source: {fact.verified_by}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {fact.status === "verified" ? (
                  <span className="badge-tag badge-verified">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                ) : fact.status === "told" ? (
                  <span className="badge-tag badge-told">
                    <AlertCircle className="w-3 h-3" /> TOLD
                  </span>
                ) : (
                  <span className="badge-tag badge-unverified">
                    <HelpCircle className="w-3 h-3" /> CLAIM
                  </span>
                )}
                <button
                  onClick={() => onViewEvidence(fact.id, accountId)}
                  className="px-2 py-1 bg-white border border-ink text-xs font-mono font-bold hover:bg-pixelYellow shadow-sm"
                >
                  SOURCE
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Paperwork Archive Summary */}
      <div className="panel p-6 bg-white space-y-4">
        <div className="flex items-center justify-between border-b-2 border-ink pb-3">
          <div>
            <h3 className="font-mono font-bold text-base text-ink flex items-center gap-2">
              <FileText className="w-4 h-4 text-ink" />
              OFFICIAL PAPERWORK ARCHIVE ({acc.paperwork_summary?.total_records || 0} RECORDS)
            </h3>
            <p className="text-xs text-zinc-600 font-mono">
              Calls ({acc.paperwork_summary?.calls || 0}), Emails ({acc.paperwork_summary?.emails || 0}), Contracts, Invoices, Tickets, Flights & Weekly Usage
            </p>
          </div>
          <button
            onClick={() => setShowAllRecords(!showAllRecords)}
            className="btn-pixel-secondary text-xs py-1 px-3 flex items-center gap-1"
          >
            <span>{showAllRecords ? "COLLAPSE LIST" : "EXPAND ALL RECORDS"}</span>
            {showAllRecords ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(showAllRecords
            ? acc.paperwork_summary?.records_list || []
            : (acc.paperwork_summary?.records_list || []).slice(0, 6)
          ).map((rec: any) => (
            <div
              key={rec.path}
              className="p-3 border border-ink/30 bg-parchment flex flex-col justify-between gap-2 text-xs font-mono"
            >
              <div>
                <div className="flex items-center justify-between text-zinc-500 mb-1">
                  <span className="uppercase font-bold text-[10px] bg-white px-1 border border-zinc-300">
                    {rec.kind}
                  </span>
                </div>
                <strong className="text-ink block break-all">{rec.path}</strong>
                <p className="text-zinc-600 line-clamp-2 mt-1 text-[11px]">
                  {rec.preview}
                </p>
              </div>
              <button
                onClick={() => onViewEvidence(rec.path, accountId)}
                className="mt-2 text-xs font-bold text-electricBlue hover:underline flex items-center gap-1"
              >
                <span>Read Document Excerpt</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
