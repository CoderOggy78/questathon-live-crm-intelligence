"use client";

import React from "react";
import {
  LayoutDashboard,
  Shield,
  Factory,
  CircleDollarSign,
  Users,
  CheckSquare,
  AlertTriangle,
  EyeOff,
  FileSearch,
  Radio,
  Server,
  PenSquare
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
    { id: "overview", label: "Executive Overview", icon: LayoutDashboard },
    { id: "account-a", label: "Account A (Police)", icon: Shield },
    { id: "account-b", label: "Account B (Aldermoor)", icon: Factory },
    { id: "deals", label: "Q1: Deal Value", icon: CircleDollarSign },
    { id: "stakeholders", label: "Q2: Power Map", icon: Users },
    { id: "actions", label: "Q3: Next Actions", icon: CheckSquare },
    { id: "risks", label: "Q4: Risk Radar", icon: AlertTriangle },
    { id: "blindspots", label: "Q5: Blind Spots", icon: EyeOff },
    { id: "evidence", label: "Evidence Explorer", icon: FileSearch },
    {
      id: "signals",
      label: "Live Signals",
      icon: Radio,
      badge: signalsCount > 0 ? `${signalsCount} NEW` : undefined,
    },
    { id: "system", label: "Sync & MCP Status", icon: Server },
  ];

  return (
    <div className="bg-parchmentDark border-b-[3px] border-ink py-2 px-4 shadow-inner">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-2 overflow-x-auto pb-1 sm:pb-0">
        <div className="flex items-center gap-1.5 flex-nowrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = currentTab === tab.id;
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
          className="whitespace-nowrap ml-2 px-3 py-1.5 text-xs font-bold font-mono bg-electricBlue text-white border-2 border-ink shadow-retro hover:bg-blue-600 flex items-center gap-1.5 cursor-pointer"
        >
          <PenSquare className="w-3.5 h-3.5" />
          <span>WRITE MCP NOTE</span>
        </button>
      </div>
    </div>
  );
}
