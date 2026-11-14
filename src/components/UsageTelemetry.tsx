"use client";

import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Search,
  Plane,
  Radio,
  Clock,
  Filter,
  ExternalLink
} from "lucide-react";

interface UsageTelemetryProps {
  data: any;
  onViewEvidence: (id: string, account: string) => void;
}

export default function UsageTelemetry({
  data,
  onViewEvidence,
}: UsageTelemetryProps) {
  const [selectedAcc, setSelectedAcc] = useState<string>("ALL");
  const [filterAnomaly, setFilterAnomaly] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  if (!data?.accounts) return null;

  const accA = data.accounts.A;
  const accB = data.accounts.B;

  // Build combined fleet list of docks
  const allDocks: any[] = [];

  // Account A docks
  if (accA?.docks) {
    accA.docks.forEach((d: any) => {
      const stats = accA.dock_stats?.[d.dock_id] || {};
      allDocks.push({
        ...d,
        account: "A",
        account_name: accA.name,
        currency: "£",
        total_flights: stats.total_flights || 0,
        total_days_online: stats.total_days_online || 0,
        last_week_flights: stats.last_week_flights || 0,
        anomaly: stats.anomaly || false,
        anomaly_note: stats.anomaly_note || null,
        history: stats.history || []
      });
    });
  }

  // Account B docks
  if (accB?.docks) {
    accB.docks.forEach((d: any) => {
      const stats = accB.dock_stats?.[d.dock_id] || {};
      allDocks.push({
        ...d,
        account: "B",
        account_name: accB.name,
        currency: "€",
        total_flights: stats.total_flights || 0,
        total_days_online: stats.total_days_online || 0,
        last_week_flights: stats.last_week_flights || 0,
        anomaly: stats.anomaly || false,
        anomaly_note: stats.anomaly_note || null,
        history: stats.history || []
      });
    });
  }

  const filteredDocks = allDocks.filter((d) => {
    if (selectedAcc !== "ALL" && d.account !== selectedAcc) return false;
    if (filterAnomaly === "ANOMALY_ONLY" && !d.anomaly) return false;
    if (filterAnomaly === "ACTIVE_ONLY" && (d.total_flights === 0 || d.anomaly)) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        d.dock_id.toLowerCase().includes(q) ||
        (d.dock_serial && d.dock_serial.toLowerCase().includes(q)) ||
        (d.model && d.model.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalFlightsFlown = allDocks.reduce((sum, d) => sum + d.total_flights, 0);
  const anomalyCount = allDocks.filter((d) => d.anomaly).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="panel p-6 bg-white space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-3">
          <div>
            <span className="text-xs font-mono font-bold bg-pixelYellow text-ink px-2 py-0.5 border border-ink">
              FLEET TELEMETRY & OPERATIONS
            </span>
            <h2 className="text-2xl font-extrabold text-ink tracking-tight mt-1">
              USAGE & DOCK FLEET INTELLIGENCE
            </h2>
            <p className="text-xs text-zinc-600 font-mono">
              Live telemetry aggregated from <code className="text-xs">usage_weekly.csv</code> (1,323 weekly rows) and <code className="text-xs">flights.csv</code> (1,497 flight logs) across 49 docks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge-tag badge-red">
              <AlertTriangle className="w-3.5 h-3.5" /> {anomalyCount} FLEET ANOMALIES
            </span>
          </div>
        </div>

        {/* Telemetry Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 font-mono">
          <div className="p-3 bg-parchment border-2 border-ink">
            <span className="text-[11px] text-zinc-500 block">TOTAL DEPLOYED FLEET</span>
            <strong className="text-xl text-ink">49 DOCKS</strong>
            <span className="text-[10px] text-zinc-500 block mt-0.5">35 Police • 14 Industrial</span>
          </div>

          <div className="p-3 bg-emerald-50 border-2 border-emerald-700">
            <span className="text-[11px] text-emerald-800 font-bold block">TOTAL FLIGHTS FLOWN</span>
            <strong className="text-xl text-emerald-700">1,497 FLIGHTS</strong>
            <span className="text-[10px] text-emerald-800 block mt-0.5">842 Police • 655 Aldermoor</span>
          </div>

          <div className="p-3 bg-red-50 border-2 border-riskRed">
            <span className="text-[11px] text-riskRed font-bold block">CRITICAL TELEMETRY DROPS</span>
            <strong className="text-xl text-riskRed">3 DOCKS (0 FLIGHTS)</strong>
            <span className="text-[10px] text-riskRed block mt-0.5">AD-02, AD-05, AD-10 at Aldermoor</span>
          </div>

          <div className="p-3 bg-blue-50 border-2 border-electricBlue">
            <span className="text-[11px] text-blue-800 font-bold block">ACTIVE FLYING FLEET</span>
            <strong className="text-xl text-blue-700">
              {allDocks.filter((d) => d.total_flights > 0 && !d.anomaly).length} DOCKS
            </strong>
            <span className="text-[10px] text-blue-800 block mt-0.5">Performing regular night patrols</span>
          </div>
        </div>

        {/* Anomaly Warning Callout */}
        <div className="p-3 bg-red-50 border-2 border-riskRed text-xs font-mono text-red-950 flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-riskRed flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block mb-0.5">CRITICAL FLIGHT DROPOUT DETECTED VIA TELEMETRY:</strong>
            At <strong>Aldermoor Industrial Group</strong>, docks <strong>AD-02, AD-05, and AD-10</strong> (which previously flew 6 to 7 night flights every week) dropped to <strong>ZERO flights</strong> for the weeks of 16 Nov and 23 Nov, even while remaining online 7 days a week. No customer ticket was raised! Immediate operational investigation is required.
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid sm:grid-cols-3 gap-3 pt-2">
          <div className="sm:col-span-1 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Dock ID, Serial, Model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border-2 border-ink text-xs font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-zinc-500">ACCOUNT:</span>
            {["ALL", "A", "B"].map((acc) => (
              <button
                key={acc}
                onClick={() => setSelectedAcc(acc)}
                className={`px-3 py-1 border border-ink font-bold ${
                  selectedAcc === acc ? "bg-ink text-white" : "bg-parchment hover:bg-zinc-200"
                }`}
              >
                {acc === "ALL" ? "ALL (49 Docks)" : acc === "A" ? "Account A (35)" : "Account B (14)"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-zinc-500">STATUS:</span>
            {[
              { id: "ALL", label: "ALL" },
              { id: "ANOMALY_ONLY", label: "ANOMALIES" },
              { id: "ACTIVE_ONLY", label: "ACTIVE" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterAnomaly(f.id)}
                className={`px-3 py-1 border border-ink font-bold ${
                  filterAnomaly === f.id ? "bg-ink text-white" : "bg-parchment hover:bg-zinc-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dock Fleet Table */}
      <div className="panel p-6 bg-white space-y-4">
        <div className="flex items-center justify-between border-b-2 border-ink pb-3 text-xs font-mono">
          <span className="font-bold text-ink">
            SHOWING {filteredDocks.length} OF {allDocks.length} DOCKS
          </span>
          <span className="text-zinc-500">
            Click any dock to view underlying CSV telemetry records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-parchmentDark border-y-2 border-ink text-ink font-bold">
                <th className="py-2.5 px-3">DOCK ID</th>
                <th className="py-2.5 px-3">ACCOUNT</th>
                <th className="py-2.5 px-3">MODEL & SERIAL</th>
                <th className="py-2.5 px-3 text-right">TOTAL FLIGHTS</th>
                <th className="py-2.5 px-3 text-right">DAYS ONLINE</th>
                <th className="py-2.5 px-3">STATUS & TELEMETRY NOTES</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredDocks.map((dock) => {
                const isA = dock.account === "A";
                return (
                  <tr
                    key={dock.dock_id}
                    className={`hover:bg-yellow-50/60 transition-colors ${
                      dock.anomaly ? "bg-red-50/70" : ""
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-ink whitespace-nowrap">
                      {dock.dock_id}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`px-1.5 py-0.5 border text-[10px] font-bold ${
                          isA ? "bg-electricBlue text-white" : "bg-accentOrange text-white"
                        }`}
                      >
                        {isA ? "ACC A (Police)" : "ACC B (Aldermoor)"}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-medium text-ink block">{dock.model || "Standard dock"}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        Serial: {dock.dock_serial || "N/A"} • Aircraft: {dock.aircraft_serial || "N/A"}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-bold text-ink whitespace-nowrap">
                      <span className={`text-sm ${dock.total_flights > 0 ? "text-emerald-700" : "text-zinc-400"}`}>
                        {dock.total_flights} flights
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right text-zinc-600 whitespace-nowrap">
                      {dock.total_days_online} days
                    </td>

                    <td className="py-3 px-3">
                      {dock.anomaly ? (
                        <div className="flex items-center gap-1.5 text-riskRed font-bold text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{dock.anomaly_note}</span>
                        </div>
                      ) : dock.total_flights > 0 ? (
                        <div className="flex items-center gap-1.5 text-emerald-800 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600" />
                          <span>Active patrolling dock</span>
                        </div>
                      ) : (
                        <span className="text-zinc-500 text-[11px]">Installed / Awaiting live missions</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => onViewEvidence("usage_weekly.csv", dock.account)}
                        className="btn-pixel-secondary text-[11px] py-1 px-2.5 hover:bg-pixelYellow"
                      >
                        VIEW CSV
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
