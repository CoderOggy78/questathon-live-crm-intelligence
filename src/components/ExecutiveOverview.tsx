"use client";

import React, { useState } from "react";
import {
  Shield,
  Factory,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  CircleDollarSign,
  FileText,
  Radio,
  Plane,
  Users,
  Search,
  ExternalLink
} from "lucide-react";

interface ExecutiveOverviewProps {
  data: any;
  setTab: (tab: string) => void;
  setSelectedAccount: (acc: string) => void;
  onViewEvidence: (id: string, account: string) => void;
}

export default function ExecutiveOverview({
  data,
  setTab,
  setSelectedAccount,
  onViewEvidence,
}: ExecutiveOverviewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!data?.accounts) return null;

  const accA = data.accounts.A;
  const accB = data.accounts.B;
  const portfolio = data.portfolio || {};

  const accountsList = [accA, accB];

  const filteredAccounts = accountsList.filter((a) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.official_story.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Toolkit Header Banner matching Questathon Build visual design */}
      <div className="panel p-6 bg-parchmentDark border-[3px] border-ink shadow-retroLg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-4">
          <div>
            <div className="inline-block bg-pixelYellow text-ink px-2.5 py-0.5 text-xs font-mono font-bold border border-ink mb-1.5">
              CUSTOMER SUCCESS INTELLIGENCE HUB
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              BOOK OF BUSINESS: PORTFOLIO EXECUTIVE OVERVIEW
            </h2>
            <p className="text-xs text-zinc-700 font-mono">
              "The CRM you hand your manager on Monday morning" • 2 Stuck Accounts • £490,000 Recurring Base Revenue • 49 Docks • 1,497 Flights
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge-tag bg-pixelYellow text-ink font-bold">
              HAND IN READY
            </span>
          </div>
        </div>

        {/* Global Commercial & Operational KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 bg-white border-2 border-ink shadow-sm">
            <span className="text-zinc-500 block text-[11px]">ANNUAL CONTRACT VALUE (ACV)</span>
            <strong className="text-xl text-ink block mt-0.5">{portfolio.total_acv_display}</strong>
            <span className="text-[10px] text-zinc-500 block">Strictly non-automatic renewals</span>
          </div>

          <div className="p-3 bg-emerald-50 border-2 border-emerald-700 shadow-sm">
            <span className="text-emerald-800 font-bold block text-[11px]">QUALIFIED EXPANSION</span>
            <strong className="text-xl text-emerald-700 block mt-0.5">{portfolio.total_qualified_expansion}</strong>
            <span className="text-[10px] text-emerald-800 block">Tarn Valley + Idle Plants</span>
          </div>

          <div className="p-3 bg-white border-2 border-ink shadow-sm">
            <span className="text-zinc-500 block text-[11px]">FLEET & TELEMETRY</span>
            <strong className="text-xl text-ink block mt-0.5">49 DOCKS • 1,497 FLIGHTS</strong>
            <span className="text-[10px] text-zinc-500 block">Aggregated from CSV telemetry</span>
          </div>

          <div className="p-3 bg-red-50 border-2 border-riskRed shadow-sm">
            <span className="text-riskRed font-bold block text-[11px]">CRITICAL RISKS</span>
            <strong className="text-xl text-riskRed block mt-0.5 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 inline" /> 2 RED ALERTS
            </strong>
            <span className="text-[10px] text-riskRed block">Champion exit & flight blackout</span>
          </div>
        </div>
      </div>

      {/* Live Signals Alert Banner */}
      <div className="panel p-4 bg-amber-50 border-2 border-amber-600 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-ink text-pixelYellow rounded-none border border-ink">
            <Radio className="w-5 h-5 animate-pulse" />
          </span>
          <div>
            <h4 className="font-mono font-bold text-xs text-amber-900 flex items-center gap-2">
              <span>3 LIVE SIGNALS DETECTED VIA MCP</span>
              <span className="text-[9px] bg-riskRed text-white px-1.5 py-0.2 rounded font-mono">ACTION REQUIRED</span>
            </h4>
            <p className="text-xs text-amber-800 font-mono mt-0.5">
              1. Rhys Calder leaves Alliance in January • 2. Insp. Karen Mbeki urgent ticket FB-11206 for 5 Dec • 3. Aldermoor docks AD-02, 05, 10 dropped to 0 flights
            </p>
          </div>
        </div>
        <button
          onClick={() => setTab("signals")}
          className="btn-pixel text-xs py-1.5 px-3 flex items-center gap-1"
        >
          <span>INSPECT SIGNALS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filterable Accounts Directory Table */}
      <div className="panel p-6 bg-white space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-3">
          <div>
            <h3 className="font-mono font-bold text-base text-ink flex items-center gap-2">
              CURRENT ACCOUNT HEALTH & PORTFOLIO BREAKDOWN
            </h3>
            <p className="text-xs text-zinc-600 font-mono">
              Live status, fleet counts, contract sums, and verified commercial blockers across all accounts
            </p>
          </div>

          <div className="relative w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search account name or story..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border-2 border-ink text-xs font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-parchmentDark border-y-2 border-ink text-ink font-bold">
                <th className="py-2.5 px-3">ACCOUNT</th>
                <th className="py-2.5 px-3">SECTOR & MODEL</th>
                <th className="py-2.5 px-3 text-right">ACV & FLEET</th>
                <th className="py-2.5 px-3 text-right">QUALIFIED PIPELINE</th>
                <th className="py-2.5 px-3">PRIMARY COMMERCIAL BLOCKER</th>
                <th className="py-2.5 px-3">RENEWAL DEADLINE</th>
                <th className="py-2.5 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredAccounts.map((acc) => {
                const isA = acc.id === "A";
                return (
                  <tr key={acc.id} className="hover:bg-yellow-50/50 transition-colors">
                    <td className="py-4 px-3 font-bold text-ink whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-7 h-7 flex items-center justify-center font-bold text-white ${
                            isA ? "bg-electricBlue" : "bg-accentOrange"
                          } border border-ink`}
                        >
                          {acc.id}
                        </span>
                        <div>
                          <strong className="text-sm block">{acc.name}</strong>
                          <span className="text-[10px] text-zinc-500 font-normal">
                            Health Score: {acc.health_score}% (Vulnerable)
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-3">
                      <span className="text-zinc-800 font-medium block">
                        {isA ? "Police & Public Safety" : "Industrial Sites Security"}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {isA ? "4 Member Forces" : "15 Manufacturing Plants"}
                      </span>
                    </td>

                    <td className="py-4 px-3 text-right whitespace-nowrap font-bold">
                      <span className="text-sm text-ink block">
                        {acc.currency_symbol}{acc.annual_contract_value.toLocaleString()} / yr
                      </span>
                      <span className="text-[10px] text-zinc-500 font-normal">
                        {acc.devices_count} Docks • {acc.flights_count} Flights
                      </span>
                    </td>

                    <td className="py-4 px-3 text-right whitespace-nowrap font-bold">
                      <span className="text-sm text-emerald-700 block">
                        {acc.currency_symbol}{acc.qualified_value.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-normal">
                        Identified: {acc.currency_symbol}{acc.total_identified_value.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-4 px-3 text-xs">
                      {isA ? (
                        <div className="text-red-900 bg-red-50 p-2 border border-red-200 rounded-none max-w-xs">
                          <strong>DPIA Ticket Blocked 4 Months:</strong> Fatima Osei awaiting FlytBase data-flow documents; champion Rhys Calder exiting in January.
                        </div>
                      ) : (
                        <div className="text-red-900 bg-red-50 p-2 border border-red-200 rounded-none max-w-xs">
                          <strong>3 Docks Zero Flights Anomaly:</strong> AD-02, 05, 10 halted flights; deputy exiting imminently with all rollout know-how.
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-3 whitespace-nowrap font-bold text-riskRed">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{acc.renewal_deadline}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-normal block">
                        Non-automatic
                      </span>
                    </td>

                    <td className="py-4 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedAccount(acc.id);
                          setTab(isA ? "account-a" : "account-b");
                        }}
                        className="btn-pixel text-xs py-1.5 px-3 flex items-center gap-1 ml-auto"
                      >
                        <span>WORKSPACE</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Past Commercial History & Future Milestones Roadmap */}
      <div className="panel p-6 bg-white space-y-4">
        <div className="border-b-2 border-ink pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-mono font-bold text-base text-ink flex items-center gap-2">
              COMMERCIAL TIMELINE: PAST MILESTONES & FUTURE TRAJECTORY
            </h3>
            <p className="text-xs text-zinc-600 font-mono">
              Key contractual milestones from 2025 pilot through 2026 deployment and Q1 2027 renewal gates
            </p>
          </div>
          <button
            onClick={() => setTab("interactions")}
            className="text-xs font-mono font-bold text-electricBlue hover:underline flex items-center gap-1"
          >
            <span>View All 65+ Interactions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 bg-zinc-50 border border-zinc-300">
            <span className="text-zinc-500 font-bold block mb-1">Q3-Q4 2025: PILOTS & TRIALS</span>
            <p className="text-zinc-800">
              Account A completed £30k 6-dock pilot at Westmere. Account B completed €12k 2-dock trial. Both fees credited to first year.
            </p>
          </div>

          <div className="p-3 bg-zinc-50 border border-zinc-300">
            <span className="text-zinc-500 font-bold block mb-1">JAN 2026: ORDERS SIGNED</span>
            <p className="text-zinc-800">
              Account A signed £350k order (35 docks). Account B signed €140k order (14 docks). All first-year invoices paid in full.
            </p>
          </div>

          <div className="p-3 bg-yellow-50 border border-amber-300">
            <span className="text-amber-900 font-bold block mb-1">MAY-NOV 2026: DISCOVERY & CS</span>
            <p className="text-zinc-800">
              Sam handed over accounts to current CSM. Discovery revealed DPIA support ticket silence, deputy departure, and usage anomalies.
            </p>
          </div>

          <div className="p-3 bg-red-50 border border-riskRed text-red-950">
            <span className="text-riskRed font-bold block mb-1">JAN-FEB 2027: RENEWAL GATES</span>
            <p className="font-bold">
              Aldermoor renewal deadline 31 Jan 2027. Police Alliance renewal deadline 28 Feb 2027. Neither contract renews automatically!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
