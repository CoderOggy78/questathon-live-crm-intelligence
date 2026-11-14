"use client";

import React from "react";
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
  if (!data?.accounts) return null;

  const accA = data.accounts.A;
  const accB = data.accounts.B;

  return (
    <div className="space-y-6">
      {/* 30-Second Executive Summary Hero */}
      <div className="panel-dark p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <span className="font-pixel text-8xl">AQ</span>
        </div>
        <div className="max-w-4xl relative z-10">
          <div className="inline-block bg-pixelYellow text-ink px-2.5 py-0.5 text-xs font-mono font-bold mb-3 border border-ink">
            EXECUTIVE SITUATION REPORT • MONDAY HANDOVER READY
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-pixelYellow tracking-tight mb-2">
            Two Accounts. £490,000 In Base Contract Renewals. Two Hidden Vulnerabilities.
          </h2>
          <p className="text-sm leading-relaxed text-parchment font-mono">
            Both accounts appear calm on the surface, but primary source evidence reveals critical operational blockers:
            <strong> Account A</strong> faces champion departure (Rhys Calder leaves in January) and a 4-month unassigned DPIA support ticket;
            <strong> Account B</strong> suffered a sudden 14-day zero-flight collapse across 3 core docks and risks losing all deployment know-how when Stefan Roy's deputy leaves.
          </p>
        </div>

        {/* Global commercial KPI bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-parchment/20">
          <div>
            <span className="block text-[11px] font-mono text-zinc-400">TOTAL IDENTIFIED DEALS</span>
            <span className="text-xl font-bold font-mono text-white">£3.55M / €720K</span>
          </div>
          <div>
            <span className="block text-[11px] font-mono text-zinc-400">QUALIFIED REVENUE</span>
            <span className="text-xl font-bold font-mono text-emerald-400">£200K / €180K</span>
          </div>
          <div>
            <span className="block text-[11px] font-mono text-zinc-400">ANNUAL BASE CONTRACTS</span>
            <span className="text-xl font-bold font-mono text-pixelYellow">£350K / €140K</span>
          </div>
          <div>
            <span className="block text-[11px] font-mono text-zinc-400">CRITICAL BLOCKERS</span>
            <span className="text-xl font-bold font-mono text-riskRed flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 inline" /> 2 RED RISKS
            </span>
          </div>
        </div>
      </div>

      {/* Live Signals Alert Banner */}
      <div className="panel p-4 bg-amber-50 border-2 border-amber-500 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-amber-500 text-white rounded border border-ink">
            <Radio className="w-5 h-5 animate-pulse" />
          </span>
          <div>
            <h4 className="font-mono font-bold text-xs text-amber-900">
              3 LIVE SIGNALS DETECTED IN ACCOUNT TELEMETRY & INBOX
            </h4>
            <p className="text-xs text-amber-800 font-mono">
              Rhys Calder departure announced (Jan) • Westmere urgent ticket FB-11206 for 5 Dec • Aldermoor docks AD-02, 05, 10 zero flights
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

      {/* Side-by-Side Account Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Account A Card */}
        <div className="panel p-6 bg-white space-y-4 hover:shadow-retroLg transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3 border-b-2 border-ink pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-electricBlue uppercase tracking-wider">
                  ACCOUNT A • POLICE FORCES
                </span>
                <h3 className="text-lg font-bold text-ink">
                  {accA.name}
                </h3>
              </div>
              <span className="badge-tag badge-amber">
                HEALTH: {accA.health_score}% (AT RISK)
              </span>
            </div>

            {/* Official vs Reality */}
            <div className="space-y-2 text-xs font-mono">
              <div className="bg-zinc-100 p-2.5 border border-zinc-300">
                <span className="text-zinc-500 font-bold block mb-0.5">OFFICIAL STORY (UNVERIFIED):</span>
                <p className="text-zinc-800 italic">"{accA.official_story}"</p>
              </div>
              <div className="bg-red-50 p-2.5 border border-red-300 text-red-900">
                <span className="font-bold block mb-0.5 text-riskRed">EVIDENCE-BACKED REALITY:</span>
                <p>
                  Only Westmere flies operationally. Tarn Valley and Norwold are 100% blocked by an unassigned DPIA ticket. No pooled budget exists (each CFO must sign off individually). Rhys Calder leaves in Jan!
                </p>
              </div>
            </div>

            {/* Commercial figures */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-parchment p-3 border border-ink/20">
              <div>
                <span className="text-zinc-500 block">BASE CONTRACT:</span>
                <strong className="text-base text-ink">£350,000 / yr</strong>
                <span className="block text-[10px] text-zinc-500">Expires 28 Feb 2027</span>
              </div>
              <div>
                <span className="text-zinc-500 block">QUALIFIED EXPANSION:</span>
                <strong className="text-base text-emerald-700">£200,000</strong>
                <span className="block text-[10px] text-zinc-500">Tarn Valley & Norwold</span>
              </div>
            </div>

            {/* Key stakeholders & Top action */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-zinc-600">
                <span>Key People:</span>
                <span className="text-ink font-bold">Rhys Calder, Insp. Mbeki, Fatima Osei, Ewan Brooks</span>
              </div>
              <div className="p-2.5 bg-yellow-50 border-l-4 border-pixelYellow">
                <strong className="text-ink block mb-0.5">TOP RECOMMENDED ACTION:</strong>
                <p className="text-zinc-800">
                  Resolve Ticket FB-11206 with Karen Mbeki in writing by Friday for 5 Dec public event.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-ink flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedAccount("A");
                setTab("account-a");
              }}
              className="btn-pixel text-xs py-2 px-4 flex items-center gap-1.5 w-full justify-center"
            >
              <span>OPEN ACCOUNT A WORKSPACE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Account B Card */}
        <div className="panel p-6 bg-white space-y-4 hover:shadow-retroLg transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3 border-b-2 border-ink pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-accentOrange uppercase tracking-wider">
                  ACCOUNT B • INDUSTRIAL SITES
                </span>
                <h3 className="text-lg font-bold text-ink">
                  {accB.name}
                </h3>
              </div>
              <span className="badge-tag badge-amber">
                HEALTH: {accB.health_score}% (AT RISK)
              </span>
            </div>

            {/* Official vs Reality */}
            <div className="space-y-2 text-xs font-mono">
              <div className="bg-zinc-100 p-2.5 border border-zinc-300">
                <span className="text-zinc-500 font-bold block mb-0.5">OFFICIAL STORY (UNVERIFIED):</span>
                <p className="text-zinc-800 italic">"{accB.official_story}"</p>
              </div>
              <div className="bg-red-50 p-2.5 border border-red-300 text-red-900">
                <span className="font-bold block mb-0.5 text-riskRed">EVIDENCE-BACKED REALITY:</span>
                <p>
                  Stefan's €1.2M savings is an unvalidated spreadsheet; Finance has booked €0. Third-party guards ignore drone alerts. Three active docks just collapsed to 0 flights. Deputy leaving with all technical rollout know-how!
                </p>
              </div>
            </div>

            {/* Commercial figures */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-parchment p-3 border border-ink/20">
              <div>
                <span className="text-zinc-500 block">BASE CONTRACT:</span>
                <strong className="text-base text-ink">€140,000 / yr</strong>
                <span className="block text-[10px] text-zinc-500">Expires 31 Jan 2027</span>
              </div>
              <div>
                <span className="text-zinc-500 block">QUALIFIED EXPANSION:</span>
                <strong className="text-base text-emerald-700">€180,000</strong>
                <span className="block text-[10px] text-zinc-500">Idle Plants Activation</span>
              </div>
            </div>

            {/* Key stakeholders & Top action */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-zinc-600">
                <span>Key People:</span>
                <span className="text-ink font-bold">Stefan Roy, Beatriz Alonso, Nadia Rahman, Julian Tate</span>
              </div>
              <div className="p-2.5 bg-yellow-50 border-l-4 border-pixelYellow">
                <strong className="text-ink block mb-0.5">TOP RECOMMENDED ACTION:</strong>
                <p className="text-zinc-800">
                  Investigate telemetry and call Beatriz Alonso regarding 2-week zero-flight blackout on AD-02, 05, 10.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-ink flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedAccount("B");
                setTab("account-b");
              }}
              className="btn-pixel text-xs py-2 px-4 flex items-center gap-1.5 w-full justify-center"
            >
              <span>OPEN ACCOUNT B WORKSPACE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
