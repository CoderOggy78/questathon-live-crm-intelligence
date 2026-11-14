"use client";

import React, { useState } from "react";
import {
  Plane,
  Radio,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass,
  Crosshair,
  Shield,
  Factory,
  Search,
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";

interface FleetRadarProps {
  data: any;
  onViewEvidence: (id: string, account: string) => void;
}

export default function FleetRadarMap({ data, onViewEvidence }: FleetRadarProps) {
  const [selectedAccFilter, setSelectedAccFilter] = useState<"ALL" | "A" | "B">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BLOCKED" | "ANOMALY">("ALL");
  const [selectedDock, setSelectedDock] = useState<any>(null);

  if (!data?.accounts) return null;

  const accA = data.accounts.A;
  const accB = data.accounts.B;

  // Build unified dock telemetry nodes
  const allDocks: any[] = [];

  // Account A Docks (35)
  (accA.docks || []).forEach((d: any, idx: number) => {
    let force = "Westmere";
    let status = "ACTIVE";
    let statusNote = "Operational missions active";

    if (idx >= 15 && idx < 25) {
      force = "Metro Central";
      status = "STANDBY";
      statusNote = "Training flights only";
    } else if (idx >= 25 && idx < 30) {
      force = "Tarn Valley";
      status = "BLOCKED";
      statusNote = "GROUNDED: Unassigned 4-mo DPIA Ticket FB-10492";
    } else if (idx >= 30) {
      force = "Norwold";
      status = "BLOCKED";
      statusNote = "GROUNDED: Awaiting Tarn Valley DPIA approval";
    }

    allDocks.push({
      ...d,
      account: "A",
      accountName: "Eastern Counties Police Alliance",
      force,
      status,
      statusNote,
      x: 18 + (idx % 7) * 9 + ((idx * 3) % 5),
      y: 22 + Math.floor(idx / 7) * 13 + ((idx * 2) % 6),
    });
  });

  // Account B Docks (14)
  (accB.docks || []).forEach((d: any, idx: number) => {
    const isSilenced = ["AD-02", "AD-05", "AD-10"].includes(d.dock_id);
    allDocks.push({
      ...d,
      account: "B",
      accountName: "Aldermoor Industrial Group",
      force: `Plant ${idx + 1}`,
      status: isSilenced ? "ANOMALY" : "ACTIVE",
      statusNote: isSilenced
        ? "CRITICAL ANOMALY: Online 7 days/wk but ZERO flights in November!"
        : "Routine scheduled perimeter flights",
      x: 25 + (idx % 5) * 12 + ((idx * 5) % 8),
      y: 30 + Math.floor(idx / 5) * 18 + ((idx * 3) % 7),
    });
  });

  const filteredDocks = allDocks.filter((d) => {
    if (selectedAccFilter !== "ALL" && d.account !== selectedAccFilter) return false;
    if (statusFilter === "ACTIVE" && d.status !== "ACTIVE" && d.status !== "STANDBY") return false;
    if (statusFilter === "BLOCKED" && d.status !== "BLOCKED") return false;
    if (statusFilter === "ANOMALY" && d.status !== "ANOMALY") return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="panel p-6 bg-parchmentDark border-[3px] border-ink shadow-retroLg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pixelYellow border-2 border-ink shadow-retro flex items-center justify-center font-bold text-ink">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="inline-block bg-ink text-pixelYellow px-2 py-0.5 text-xs font-mono font-bold mb-1">
                TACTICAL SPATIAL COMMAND
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                LIVE DRONE FLEET RADAR & TELEMETRY MATRIX
              </h2>
              <p className="text-xs text-zinc-700 font-mono">
                Real-time operational status for all 49 autonomous docks across Police Alliance jurisdictions and Aldermoor industrial plants.
              </p>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="text-zinc-600 font-bold">ACCOUNT:</span>
            {["ALL", "A", "B"].map((acc) => (
              <button
                key={acc}
                onClick={() => setSelectedAccFilter(acc as any)}
                className={`px-3 py-1 border-2 border-ink font-bold ${
                  selectedAccFilter === acc
                    ? "bg-pixelYellow text-ink shadow-retro"
                    : "bg-white text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                {acc === "ALL" ? "All (49 Docks)" : acc === "A" ? "Police (35)" : "Aldermoor (14)"}
              </button>
            ))}

            <span className="text-zinc-600 font-bold ml-2">STATUS:</span>
            {["ALL", "ACTIVE", "BLOCKED", "ANOMALY"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st as any)}
                className={`px-2.5 py-1 border-2 border-ink font-bold ${
                  statusFilter === st
                    ? "bg-ink text-white shadow-retro"
                    : "bg-white text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Global Operational Status Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 bg-white border-2 border-ink shadow-sm">
            <span className="text-zinc-500 block text-[11px]">TOTAL COMMISSIONED DOCKS</span>
            <strong className="text-xl text-ink block mt-0.5">49 DOCKS</strong>
            <span className="text-[10px] text-zinc-500">35 Police • 14 Industrial</span>
          </div>

          <div className="p-3 bg-emerald-50 border-2 border-emerald-700 shadow-sm">
            <span className="text-emerald-800 font-bold block text-[11px]">ACTIVE OPERATIONAL</span>
            <strong className="text-xl text-emerald-700 block mt-0.5">26 DOCKS</strong>
            <span className="text-[10px] text-emerald-800">15 Westmere + 11 Aldermoor</span>
          </div>

          <div className="p-3 bg-red-50 border-2 border-riskRed shadow-sm">
            <span className="text-riskRed font-bold block text-[11px]">GROUNDED (DPIA BLOCKED)</span>
            <strong className="text-xl text-riskRed block mt-0.5">10 DOCKS</strong>
            <span className="text-[10px] text-riskRed">Tarn Valley (5) + Norwold (5)</span>
          </div>

          <div className="p-3 bg-amber-50 border-2 border-amber-600 shadow-sm">
            <span className="text-amber-900 font-bold block text-[11px]">FLIGHT BLACKOUT ANOMALY</span>
            <strong className="text-xl text-amber-900 block mt-0.5 animate-pulse">
              3 DOCKS (AD-02, 05, 10)
            </strong>
            <span className="text-[10px] text-amber-900">Online but 0 flights in Nov</span>
          </div>
        </div>
      </div>

      {/* Radar Canvas & Telemetry Panel */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Radar View (2 Cols) */}
        <div className="lg:col-span-2 panel p-6 bg-zinc-950 text-parchmentDark border-[3px] border-ink shadow-retroLg relative overflow-hidden min-h-[520px]">
          {/* Radar background grid & sweep */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-[450px] h-[450px] rounded-full border border-green-500"></div>
            <div className="w-[300px] h-[300px] rounded-full border border-green-500 absolute"></div>
            <div className="w-[150px] h-[150px] rounded-full border border-green-500 absolute"></div>
            <div className="w-full h-px bg-green-500 absolute"></div>
            <div className="h-full w-px bg-green-500 absolute"></div>
          </div>

          {/* Radar Sweep Effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
            <div className="w-[450px] h-[450px] rounded-full border-r-2 border-pixelYellow animate-spin"></div>
          </div>

          {/* Top Radar Status Info */}
          <div className="relative z-10 flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono text-xs">
            <div className="flex items-center gap-2 text-green-400">
              <Crosshair className="w-4 h-4 animate-pulse" />
              <span className="font-bold tracking-wider">RADAR ACTIVE • 49 NODES MAPPED</span>
            </div>
            <div className="flex items-center gap-4 text-zinc-400 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span> Operational
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> Standby
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> Blocked DPIA
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block"></span> Flight Blackout
              </span>
            </div>
          </div>

          {/* Dock Nodes Layout */}
          <div className="relative z-10 h-[430px] border border-zinc-800 bg-zinc-900/60 p-4">
            {filteredDocks.map((dock) => {
              const isSelected = selectedDock?.dock_id === dock.dock_id;
              const isAnomaly = dock.status === "ANOMALY";
              const isBlocked = dock.status === "BLOCKED";

              let nodeColor = "bg-green-500 border-green-300";
              if (dock.status === "STANDBY") nodeColor = "bg-yellow-400 border-yellow-200";
              if (isBlocked) nodeColor = "bg-red-500 border-red-300";
              if (isAnomaly) nodeColor = "bg-red-600 border-white animate-pulse";

              return (
                <div
                  key={dock.dock_id}
                  onClick={() => setSelectedDock(dock)}
                  style={{
                    position: "absolute",
                    left: `${dock.x}%`,
                    top: `${dock.y}%`,
                  }}
                  className={`group cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 z-20`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${nodeColor} flex items-center justify-center ${
                      isSelected ? "ring-4 ring-pixelYellow scale-125" : ""
                    }`}
                  >
                    {isAnomaly && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    )}
                  </div>

                  {/* Tooltip on hover */}
                  <div className="hidden group-hover:block absolute bottom-5 left-1/2 -translate-x-1/2 bg-ink text-white font-mono text-[10px] px-2 py-1 border border-pixelYellow shadow-lg whitespace-nowrap z-50">
                    <strong>{dock.dock_id}</strong> ({dock.force})
                    <span className="block text-zinc-400">{dock.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Telemetry Inspector Drawer (1 Col) */}
        <div className="panel p-6 bg-white border-[3px] border-ink shadow-retro space-y-4 font-mono">
          <div className="flex items-center justify-between border-b-2 border-ink pb-3">
            <h3 className="font-bold text-sm text-ink flex items-center gap-2">
              <Radio className="w-4 h-4 text-electricBlue" />
              DOCK TELEMETRY INSPECTOR
            </h3>
            <span className="text-[10px] text-zinc-500 uppercase">
              {selectedDock ? "NODE SELECTED" : "SELECT ANY NODE"}
            </span>
          </div>

          {selectedDock ? (
            <div className="space-y-4">
              <div className="p-3 bg-parchment border-2 border-ink">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-zinc-500">DOCK ID:</span>
                  <span
                    className={`badge-tag ${
                      selectedDock.status === "ACTIVE"
                        ? "badge-verified"
                        : selectedDock.status === "BLOCKED"
                        ? "bg-red-100 text-riskRed border-riskRed"
                        : selectedDock.status === "ANOMALY"
                        ? "bg-red-600 text-white border-ink animate-pulse"
                        : "badge-told"
                    }`}
                  >
                    {selectedDock.status}
                  </span>
                </div>
                <strong className="text-xl text-ink block">{selectedDock.dock_id}</strong>
                <span className="text-xs text-zinc-600 block mt-0.5">
                  {selectedDock.accountName} • {selectedDock.force}
                </span>
              </div>

              {/* Hardware & Aircraft Specs */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-zinc-200 py-1">
                  <span className="text-zinc-500">Dock Serial:</span>
                  <strong className="text-ink">{selectedDock.dock_serial}</strong>
                </div>
                <div className="flex justify-between border-b border-zinc-200 py-1">
                  <span className="text-zinc-500">Aircraft Serial:</span>
                  <strong className="text-ink">{selectedDock.aircraft_serial}</strong>
                </div>
                <div className="flex justify-between border-b border-zinc-200 py-1">
                  <span className="text-zinc-500">Hardware Model:</span>
                  <strong className="text-ink">{selectedDock.model}</strong>
                </div>
                <div className="flex justify-between border-b border-zinc-200 py-1">
                  <span className="text-zinc-500">Software Build:</span>
                  <strong className="text-ink">{selectedDock.software}</strong>
                </div>
                <div className="flex justify-between border-b border-zinc-200 py-1">
                  <span className="text-zinc-500">Commission Date:</span>
                  <strong className="text-ink">{selectedDock.commissioned}</strong>
                </div>
                <div className="flex justify-between border-b border-zinc-200 py-1">
                  <span className="text-zinc-500">Last Seen Online:</span>
                  <strong className="text-ink text-green-700">{selectedDock.last_seen_online}</strong>
                </div>
              </div>

              {/* Operational Diagnostic Notice */}
              <div
                className={`p-3 border-2 text-xs leading-relaxed ${
                  selectedDock.status === "ANOMALY"
                    ? "bg-red-50 border-riskRed text-red-950"
                    : selectedDock.status === "BLOCKED"
                    ? "bg-amber-50 border-amber-600 text-amber-950"
                    : "bg-emerald-50 border-emerald-700 text-emerald-950"
                }`}
              >
                <strong className="block mb-1 font-bold">OPERATIONAL AUDIT:</strong>
                <p>{selectedDock.statusNote}</p>
              </div>

              <button
                onClick={() =>
                  onViewEvidence(
                    selectedDock.account === "A" ? "docks.csv" : "usage_weekly.csv",
                    selectedDock.account
                  )
                }
                className="w-full btn-pixel text-xs py-2 flex items-center justify-center gap-1.5"
              >
                <span>OPEN RAW CSV TELEMETRY</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="py-16 text-center text-zinc-500 space-y-2">
              <Crosshair className="w-8 h-8 mx-auto text-zinc-400 animate-spin-slow" />
              <p className="text-xs">
                Click any dock node on the spatial radar to view live telemetry, aircraft serials, and diagnostic alerts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
