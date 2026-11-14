"use client";

import React from "react";
import {
  LayoutDashboard,
  Building2,
  Activity,
  History,
  CircleDollarSign,
  Users,
  CheckSquare,
  AlertTriangle,
  EyeOff,
  FileSearch,
  Radio,
  Server,
  PenSquare,
  Receipt,
  Briefcase,
  Sparkles,
  Sliders,
  Compass
} from "lucide-react";

interface NavigationProps {
  currentTab: string;
  setTab: (tab: string) => void;
  openNoteModal: () => void;
  signalsCount?: number;
}

export default function Navigation({
  currentTab,
  setTab,
  openNoteModal,
  signalsCount = 3,
}: NavigationProps) {
  const tabs = [
    { id: "overview", label: "Book of Business", icon: LayoutDashboard },
    {
      id: "briefing",
      label: "Monday Handover",
      icon: Briefcase,
      badge: "HAND IN",
    },
    {
      id: "copilot",
      label: "AI Copilot",
      icon: Sparkles,
      badge: "AI INTEL",
    },
    {
      id: "simulator",
      label: "Revenue Simulator",
      icon: Sliders,
      badge: "SCENARIOS",
    },
    {
      id: "radar",
      label: "Fleet Radar",
      icon: Compass,
      badge: "TACTICAL",
    },
    { id: "accounts", label: "Accounts Directory", icon: Building2 },
    { id: "ledger", label: "Commercial Ledger", icon: Receipt },
    { id: "usage", label: "Usage & Telemetry", icon: Activity },
    { id: "interactions", label: "Interactions Timeline", icon: History },
    { id: "deals", label: "Q1: Deal Value", icon: CircleDollarSign },
    { id: "stakeholders", label: "Q2: Power Map", icon: Users },
    { id: "actions", label: "Q3: Next Actions", icon: CheckSquare },
    { id: "risks", label: "Q4: Risk Radar", icon: AlertTriangle },
    { id: "blindspots", label: "Q5: Blind Spots", icon: EyeOff },
    {
      id: "signals",
      label: "Live Signals",
      icon: Radio,
      badge: signalsCount > 0 ? `${signalsCount} NEW` : undefined,
    },
    { id: "evidence", label: "Evidence Archive", icon: FileSearch },
    { id: "system", label: "Sync & MCP Status", icon: Server },
  ];

  return (
    <div className="bg-parchmentDark border-b-[3px] border-ink py-2 px-4 shadow-inner sticky top-[68px] z-30">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-2 overflow-x-auto pb-1 sm:pb-0">
        <div className="flex items-center gap-1.5 flex-nowrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active =
              currentTab === tab.id ||
              (tab.id === "accounts" && (currentTab === "account-a" || currentTab === "account-b"));
            return (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={`whitespace-nowrap px-3 py-1.5 text-xs font-bold font-mono border-2 border-ink transition-all flex items-center gap-1.5 ${
                  active
                    ? "bg-pixelYellow text-ink shadow-retro font-extrabold translate-y-[-1px]"
                    : "bg-white text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? "text-ink" : "text-zinc-500"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="bg-riskRed text-white text-[9px] px-1.5 py-0.2 rounded font-mono font-bold animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Write Note action button */}
        <button
          onClick={openNoteModal}
          className="whitespace-nowrap ml-2 px-3 py-1.5 text-xs font-bold font-mono bg-electricBlue text-white border-2 border-ink shadow-retro hover:bg-blue-600 flex items-center gap-1.5 cursor-pointer flex-shrink-0"
        >
          <PenSquare className="w-3.5 h-3.5" />
          <span>WRITE MCP NOTE</span>
        </button>
      </div>
    </div>
  );
}
