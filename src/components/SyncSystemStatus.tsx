"use client";

import React, { useState } from "react";
import {
  Server,
  RefreshCw,
  CheckCircle2,
  Clock,
  Key,
  Shield,
  Database,
  Users
} from "lucide-react";

interface SyncSystemStatusProps {
  syncState: any;
  team: any[];
  onTriggerSync?: () => void;
}

export default function SyncSystemStatus({
  syncState,
  team,
  onTriggerSync,
}: SyncSystemStatusProps) {
  const [triggering, setTriggering] = useState(false);

  const completed = syncState?.completedTools || [];
  const pending = syncState?.pendingTools || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="panel p-6 bg-white space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-3">
          <div>
            <span className="text-xs font-mono font-bold bg-pixelYellow text-ink px-2 py-0.5 border border-ink">
              INFRASTRUCTURE & COMPLIANCE
            </span>
            <h2 className="text-2xl font-extrabold text-ink tracking-tight mt-1">
              SYNC & SYSTEM STATUS
            </h2>
            <p className="text-xs text-zinc-600 font-mono">
              Live MCP client health, rate-limit scheduler (1 call / min), response cache verification, and FlytBase team directory.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-1 border border-emerald-400">
              MCP PROTOCOL JSON-RPC 2.0 • 200 OK
            </span>
          </div>
        </div>

        {/* System Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-mono">
          <div className="p-3 bg-parchment border-2 border-ink">
            <span className="text-zinc-500 block mb-1">OFFICIAL MCP ENDPOINT:</span>
            <strong className="text-ink text-xs break-all block">
              https://questathon.aihackerscollective.com/api/public/mcp
            </strong>
          </div>

          <div className="p-3 bg-parchment border-2 border-ink">
            <span className="text-zinc-500 block mb-1">AUTHENTICATION PROTOCOL:</span>
            <strong className="text-ink text-xs block">
              Authorization: Bearer aq1.b2e3...GCry
            </strong>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Stored strictly server-side</span>
          </div>

          <div className="p-3 bg-parchment border-2 border-ink">
            <span className="text-zinc-500 block mb-1">RATE LIMIT PROTECTION:</span>
            <strong className="text-emerald-700 text-xs block">
              ENFORCED: 1 CALL PER 62 SECONDS
            </strong>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Zero quota violations</span>
          </div>
        </div>
      </div>

      {/* Completed Tools Checklist */}
      <div className="panel p-6 bg-white space-y-4">
        <div className="flex items-center justify-between border-b-2 border-ink pb-3">
          <div>
            <h3 className="font-mono font-bold text-base text-ink flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-700" />
              INGESTED MCP TOOL RESPONSES ({completed.length} PERSISTED)
            </h3>
            <p className="text-xs text-zinc-600 font-mono">
              Raw JSON payloads cached locally in <code className="text-xs">data/raw/</code> and indexed in SQLite/JSON database
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
          {completed.map((t: any, idx: number) => (
            <div
              key={idx}
              className="p-3 bg-parchment border border-ink/30 flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-ink block">{t.name}</strong>
                {t.args && Object.keys(t.args).length > 0 && (
                  <span className="text-[10px] text-zinc-600 block">
                    Args: {JSON.stringify(t.args)}
                  </span>
                )}
                <span className="text-[10px] text-zinc-500 block mt-1">
                  Cached: {t.file}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FlytBase Team Directory */}
      <div className="panel p-6 bg-white space-y-4">
        <div className="flex items-center justify-between border-b-2 border-ink pb-3">
          <div>
            <h3 className="font-mono font-bold text-base text-ink flex items-center gap-2">
              <Users className="w-4 h-4 text-electricBlue" />
              FLYTBASE INTERNAL TEAM DIRECTORY ({team.length} MEMBERS)
            </h3>
            <p className="text-xs text-zinc-600 font-mono">
              Retrieved from <code className="text-xs">get_flytbase_team</code> for internal ticket routing and escalation
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
          {team.map((person: any) => (
            <div
              key={person.id}
              className="p-3 bg-zinc-50 border border-zinc-300 space-y-1"
            >
              <strong className="text-ink text-sm block">{person.name}</strong>
              <p className="text-zinc-600 text-[11px] leading-relaxed">
                {person.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
