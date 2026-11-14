"use client";

import React, { useEffect, useState } from "react";
import { Shield, Radio, RefreshCw, Key, Building2, Factory } from "lucide-react";

interface HeaderProps {
  currentTab: string;
  setTab: (tab: string) => void;
  selectedAccount: string;
  setSelectedAccount: (acc: string) => void;
  syncState: any;
}

export default function Header({
  currentTab,
  setTab,
  selectedAccount,
  setSelectedAccount,
  syncState,
}: HeaderProps) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const updateCountdown = () => {
      if (!syncState?.lastCallTimestamp) return;
      const elapsed = Math.floor(Date.now() / 1000 - syncState.lastCallTimestamp);
      const remaining = Math.max(0, 62 - elapsed);
      setSecondsLeft(remaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [syncState]);

  return (
    <header className="border-b-[3px] border-ink bg-cardBg sticky top-0 z-40 shadow-sm">
      {/* Top operational status strip */}
      <div className="bg-ink text-parchmentDark px-4 py-1.5 text-xs flex flex-wrap items-center justify-between border-b border-ink/40">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold tracking-wider text-pixelYellow">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            MCP LIVE: CONNECTED
          </span>
          <span className="text-zinc-400">|</span>
          <span className="flex items-center gap-1 text-zinc-300">
            <Key className="w-3 h-3 text-pixelYellow" />
            TOKEN: aq1.b2e3...GCry
          </span>
          <span className="text-zinc-400">|</span>
          <span className="text-zinc-300">
            RATE LIMIT: <strong className="text-white">1 CALL/MIN</strong>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-zinc-400">NEXT SYNC:</span>
            <span className={`font-mono font-bold px-1.5 py-0.5 rounded ${secondsLeft === 0 ? "bg-green-700 text-white" : "bg-amber-800 text-amber-200"}`}>
              {secondsLeft === 0 ? "READY" : `${secondsLeft}s`}
            </span>
          </div>
          <span className="text-zinc-400 hidden sm:inline">|</span>
          <span className="text-zinc-300 font-mono hidden sm:inline">SATURDAY 14 NOV 2026</span>
        </div>
      </div>

      {/* Main navigation & account switcher */}
      <div className="mx-auto max-w-7xl px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setTab("overview")}>
          <div className="w-10 h-10 bg-pixelYellow border-2 border-ink shadow-retro flex items-center justify-center font-bold text-lg text-ink font-mono">
            AQ
          </div>
          <div>
            <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-ink flex items-center gap-2">
              QUESTATHON CRM INTELLIGENCE
              <span className="text-[10px] bg-electricBlue text-white px-2 py-0.5 font-mono uppercase border border-ink">v2.4 PROD</span>
            </h1>
            <p className="text-xs text-zinc-600 font-mono">
              Decision-Support System • Two Stuck Accounts • Live Evidence Traceability
            </p>
          </div>
        </div>

        {/* Account Quick Selectors */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedAccount("A");
              if (currentTab === "overview") setTab("account-a");
            }}
            className={`px-3 py-1.5 text-xs font-bold font-mono border-2 border-ink flex items-center gap-1.5 transition-all ${
              selectedAccount === "A"
                ? "bg-electricBlue text-white shadow-retro"
                : "bg-parchmentDark text-ink hover:bg-zinc-200"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>ACC A: POLICE ALLIANCE (£350k)</span>
          </button>

          <button
            onClick={() => {
              setSelectedAccount("B");
              if (currentTab === "overview") setTab("account-b");
            }}
            className={`px-3 py-1.5 text-xs font-bold font-mono border-2 border-ink flex items-center gap-1.5 transition-all ${
              selectedAccount === "B"
                ? "bg-accentOrange text-white shadow-retro"
                : "bg-parchmentDark text-ink hover:bg-zinc-200"
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>ACC B: ALDERMOOR (€140k)</span>
          </button>
        </div>
      </div>
    </header>
  );
}
