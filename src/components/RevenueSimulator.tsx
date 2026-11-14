"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  CircleDollarSign,
  ArrowRight,
  Shield,
  Factory,
  Copy,
  PenSquare,
  Sparkles,
  Info
} from "lucide-react";

interface RevenueSimulatorProps {
  data: any;
  openNoteModal: () => void;
  onViewEvidence: (id: string, account: string) => void;
}

export default function RevenueSimulator({
  data,
  openNoteModal,
  onViewEvidence,
}: RevenueSimulatorProps) {
  // Lever toggles
  const [levers, setLevers] = useState<{ [key: string]: boolean }>({
    karen_sla: true,
    dpia_pack: true,
    cfo_bypass: true,
    aldermoor_audit: true,
    docks_repair: true,
    aldermoor_expansion: false,
  });

  const toggleLever = (key: string) => {
    setLevers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const applyPreset = (preset: "inaction" | "defensive" | "expansion") => {
    if (preset === "inaction") {
      setLevers({
        karen_sla: false,
        dpia_pack: false,
        cfo_bypass: false,
        aldermoor_audit: false,
        docks_repair: false,
        aldermoor_expansion: false,
      });
    } else if (preset === "defensive") {
      setLevers({
        karen_sla: true,
        dpia_pack: false,
        cfo_bypass: true,
        aldermoor_audit: true,
        docks_repair: true,
        aldermoor_expansion: false,
      });
    } else if (preset === "expansion") {
      setLevers({
        karen_sla: true,
        dpia_pack: true,
        cfo_bypass: true,
        aldermoor_audit: true,
        docks_repair: true,
        aldermoor_expansion: true,
      });
    }
  };

  // Calculations
  // Account A Base: £350,000
  // Needs: karen_sla (secures Westmere £175k) + cfo_bypass (secures remaining £175k before Rhys leaves)
  const policeBaseRetained =
    (levers.karen_sla ? 175000 : 0) + (levers.cfo_bypass ? 175000 : 0);
  const policeExpansion = levers.dpia_pack ? 200000 : 0;
  const policeTotal = policeBaseRetained + policeExpansion;

  // Account B Base: €140,000
  // Needs: aldermoor_audit (satisfies finance) + docks_repair (solves AD-02/05/10 anomaly)
  const aldermoorBaseRetained =
    (levers.aldermoor_audit ? 80000 : 0) + (levers.docks_repair ? 60000 : 0);
  const aldermoorExpansion = levers.aldermoor_expansion ? 180000 : 0;
  const aldermoorTotal = aldermoorBaseRetained + aldermoorExpansion;

  // Combined ARR in normalized GBP approx for summary
  const totalBaseRetainedGBP = policeBaseRetained + Math.round(aldermoorBaseRetained * 0.86);
  const totalExpansionGBP = policeExpansion + Math.round(aldermoorExpansion * 0.86);
  const totalProjectedARR_GBP = totalBaseRetainedGBP + totalExpansionGBP;

  const baselineRiskGBP = 490000;
  const churnedGBP = Math.max(0, baselineRiskGBP - totalBaseRetainedGBP);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="panel p-6 bg-parchmentDark border-[3px] border-ink shadow-retroLg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pixelYellow border-2 border-ink shadow-retro flex items-center justify-center font-bold text-ink">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-block bg-ink text-pixelYellow px-2 py-0.5 text-xs font-mono font-bold mb-1">
                EXECUTIVE SCENARIO ENGINE
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                REVENUE & CHURN SCENARIO MODELER
              </h2>
              <p className="text-xs text-zinc-700 font-mono">
                Simulate the commercial consequences of Monday morning decisions on £490k baseline ARR and £380k qualified expansion.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => applyPreset("inaction")}
              className="px-3 py-1.5 bg-red-100 hover:bg-red-200 border-2 border-ink text-xs font-mono font-bold text-riskRed shadow-sm"
            >
              1. INACTION (CHURN)
            </button>
            <button
              onClick={() => applyPreset("defensive")}
              className="px-3 py-1.5 bg-yellow-100 hover:bg-pixelYellow border-2 border-ink text-xs font-mono font-bold text-ink shadow-sm"
            >
              2. DEFENSIVE RETENTION
            </button>
            <button
              onClick={() => applyPreset("expansion")}
              className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 border-2 border-ink text-xs font-mono font-bold text-emerald-800 shadow-sm"
            >
              3. FULL UNBLOCK & EXPANSION
            </button>
          </div>
        </div>

        {/* Global Impact Summary Scorecard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 bg-white border-2 border-ink shadow-sm">
            <span className="text-zinc-500 block text-[11px]">BASELINE ARR PROTECTED</span>
            <strong className="text-xl text-ink block mt-0.5">
              £{policeBaseRetained.toLocaleString()} + €{aldermoorBaseRetained.toLocaleString()}
            </strong>
            <span className="text-[10px] text-zinc-500">
              Of £350k + €140k recurring base
            </span>
          </div>

          <div className="p-3 bg-emerald-50 border-2 border-emerald-700 shadow-sm">
            <span className="text-emerald-800 font-bold block text-[11px]">UNLOCKED EXPANSION</span>
            <strong className="text-xl text-emerald-700 block mt-0.5">
              +£{policeExpansion.toLocaleString()} + €{aldermoorExpansion.toLocaleString()}
            </strong>
            <span className="text-[10px] text-emerald-800">
              Tarn/Norwold + 18 Plants
            </span>
          </div>

          <div
            className={`p-3 border-2 shadow-sm ${
              churnedGBP > 0 ? "bg-red-50 border-riskRed text-riskRed" : "bg-zinc-50 border-zinc-400 text-zinc-700"
            }`}
          >
            <span className="font-bold block text-[11px]">UNMITIGATED CHURN RISK</span>
            <strong className="text-xl block mt-0.5">
              -£{churnedGBP.toLocaleString()}
            </strong>
            <span className="text-[10px] block">
              {churnedGBP > 0 ? "Contracts in immediate jeopardy" : "Zero projected churn"}
            </span>
          </div>

          <div className="p-3 bg-pixelYellow/30 border-2 border-ink shadow-sm">
            <span className="text-ink font-bold block text-[11px]">TOTAL PROJECTED VALUE</span>
            <strong className="text-xl text-ink block mt-0.5">
              ~£{totalProjectedARR_GBP.toLocaleString()} / yr
            </strong>
            <span className="text-[10px] text-zinc-600">
              Net portfolio ARR outcome
            </span>
          </div>
        </div>
      </div>

      {/* Main Lever Toggle Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Account A Levers */}
        <div className="panel p-6 bg-white border-[3px] border-ink shadow-retro space-y-4">
          <div className="flex items-center justify-between border-b-2 border-ink pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-electricBlue text-white border border-ink">
                <Shield className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-mono font-bold text-base text-ink">
                  ACCOUNT A: POLICE ALLIANCE LEVERS
                </h3>
                <span className="text-xs text-zinc-500 font-mono">
                  Base: £350k/yr • Renewal: 28 Feb 2027
                </span>
              </div>
            </div>
            <span className="text-sm font-mono font-bold text-electricBlue">
              £{policeTotal.toLocaleString()} Projected
            </span>
          </div>

          <div className="space-y-3">
            {/* Lever 1 */}
            <div
              onClick={() => toggleLever("karen_sla")}
              className={`p-3 border-2 border-ink cursor-pointer transition-all ${
                levers.karen_sla ? "bg-emerald-50 border-emerald-700" : "bg-parchment opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={levers.karen_sla}
                    onChange={() => {}}
                    className="w-4 h-4 accent-emerald-700"
                  />
                  <strong className="text-xs font-mono text-ink">
                    Action 1: Deliver 99.9% SLA & Standby Airframe to Karen Mbeki (5 Dec)
                  </strong>
                </div>
                <span className="badge-tag bg-white font-bold text-[10px]">
                  +£175,000 BASE
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-600 mt-1 pl-6">
                Resolves P0 Ticket FB-11206. Protects Westmere Police (1,497 flights), preventing alliance dissolution before renewal.
              </p>
            </div>

            {/* Lever 2 */}
            <div
              onClick={() => toggleLever("cfo_bypass")}
              className={`p-3 border-2 border-ink cursor-pointer transition-all ${
                levers.cfo_bypass ? "bg-emerald-50 border-emerald-700" : "bg-parchment opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={levers.cfo_bypass}
                    onChange={() => {}}
                    className="w-4 h-4 accent-emerald-700"
                  />
                  <strong className="text-xs font-mono text-ink">
                    Action 2: Bypass Rhys Calder & Brief Member Force CFOs Directly
                  </strong>
                </div>
                <span className="badge-tag bg-white font-bold text-[10px]">
                  +£175,000 BASE
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-600 mt-1 pl-6">
                Ewan Brooks confirmed each force pays individually. Direct commercial engagement insulates contract from Rhys's Jan 2027 exit.
              </p>
            </div>

            {/* Lever 3 */}
            <div
              onClick={() => toggleLever("dpia_pack")}
              className={`p-3 border-2 border-ink cursor-pointer transition-all ${
                levers.dpia_pack ? "bg-emerald-50 border-emerald-700" : "bg-parchment opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={levers.dpia_pack}
                    onChange={() => {}}
                    className="w-4 h-4 accent-emerald-700"
                  />
                  <strong className="text-xs font-mono text-ink">
                    Action 3: Deliver Engineering DPIA Pack to Fatima Osei (Ticket FB-10492)
                  </strong>
                </div>
                <span className="badge-tag bg-emerald-700 text-white font-bold text-[10px]">
                  +£200,000 EXPANSION
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-600 mt-1 pl-6">
                Unblocks 4-month stalled assessment. Enables Tarn Valley & Norwold to fly 20 docks, converting qualified pipeline into signed ARR.
              </p>
            </div>
          </div>
        </div>

        {/* Account B Levers */}
        <div className="panel p-6 bg-white border-[3px] border-ink shadow-retro space-y-4">
          <div className="flex items-center justify-between border-b-2 border-ink pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-accentOrange text-white border border-ink">
                <Factory className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-mono font-bold text-base text-ink">
                  ACCOUNT B: ALDERMOOR INDUSTRIAL LEVERS
                </h3>
                <span className="text-xs text-zinc-500 font-mono">
                  Base: €140k/yr • Renewal: 31 Jan 2027
                </span>
              </div>
            </div>
            <span className="text-sm font-mono font-bold text-accentOrange">
              €{aldermoorTotal.toLocaleString()} Projected
            </span>
          </div>

          <div className="space-y-3">
            {/* Lever 4 */}
            <div
              onClick={() => toggleLever("aldermoor_audit")}
              className={`p-3 border-2 border-ink cursor-pointer transition-all ${
                levers.aldermoor_audit ? "bg-emerald-50 border-emerald-700" : "bg-parchment opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={levers.aldermoor_audit}
                    onChange={() => {}}
                    className="w-4 h-4 accent-emerald-700"
                  />
                  <strong className="text-xs font-mono text-ink">
                    Action 4: Replace €1.2M Claim with Audited Plant Cost Model
                  </strong>
                </div>
                <span className="badge-tag bg-white font-bold text-[10px]">
                  +€80,000 BASE
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-600 mt-1 pl-6">
                Aldermoor Group Finance booked €0 savings. Delivering real fence-breach and alarm-verification metrics restores credibility.
              </p>
            </div>

            {/* Lever 5 */}
            <div
              onClick={() => toggleLever("docks_repair")}
              className={`p-3 border-2 border-ink cursor-pointer transition-all ${
                levers.docks_repair ? "bg-emerald-50 border-emerald-700" : "bg-parchment opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={levers.docks_repair}
                    onChange={() => {}}
                    className="w-4 h-4 accent-emerald-700"
                  />
                  <strong className="text-xs font-mono text-ink">
                    Action 5: Field Mission for Docks AD-02, 05, 10 & Document Rollout SOPs
                  </strong>
                </div>
                <span className="badge-tag bg-white font-bold text-[10px]">
                  +€60,000 BASE
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-600 mt-1 pl-6">
                Investigate why AD-02/05/10 dropped to 0 flights in November. Extract rollout SOPs from Stefan's deputy before imminent resignation.
              </p>
            </div>

            {/* Lever 6 */}
            <div
              onClick={() => toggleLever("aldermoor_expansion")}
              className={`p-3 border-2 border-ink cursor-pointer transition-all ${
                levers.aldermoor_expansion ? "bg-emerald-50 border-emerald-700" : "bg-parchment opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={levers.aldermoor_expansion}
                    onChange={() => {}}
                    className="w-4 h-4 accent-emerald-700"
                  />
                  <strong className="text-xs font-mono text-ink">
                    Action 6: Expand Standardized Automated Flights to 18 Additional Plants
                  </strong>
                </div>
                <span className="badge-tag bg-emerald-700 text-white font-bold text-[10px]">
                  +€180,000 EXPANSION
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-600 mt-1 pl-6">
                Commercial proposal for remaining 18 plants contingent on successful SOP handover and guard protocol alignment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Scenario Analysis Card */}
      <div className="panel p-6 bg-parchmentDark border-[3px] border-ink shadow-retro flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <h4 className="font-mono font-bold text-sm text-ink flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pixelYellow" />
            EXECUTIVE HANDOVER RECOMMENDATION FOR MONDAY
          </h4>
          <p className="text-xs font-mono text-zinc-700 leading-relaxed">
            By executing Week 1 actions on both accounts, you eliminate 100% of the £490,000 churn threat and position FlytBase to unlock £380,000 in qualified expansion before fiscal year end.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openNoteModal}
            className="btn-pixel text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span>DISPATCH STRATEGY AS MCP NOTE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
