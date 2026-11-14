"use client";

import React, { useState } from "react";
import {
  FileSearch,
  Search,
  FileText,
  Mail,
  PhoneCall,
  FileSpreadsheet,
  ExternalLink,
  Shield,
  Factory
} from "lucide-react";

interface EvidenceExplorerProps {
  data: any;
  onViewEvidence: (id: string, account: string) => void;
}

export default function EvidenceExplorer({
  data,
  onViewEvidence,
}: EvidenceExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAcc, setSelectedAcc] = useState<string>("ALL");
  const [selectedKind, setSelectedKind] = useState<string>("ALL");

  if (!data?.accounts) return null;

  const recordsA = data.accounts.A?.paperwork_summary?.records_list?.map((r: any) => ({
    ...r,
    account: "A",
  })) || [];

  const recordsB = data.accounts.B?.paperwork_summary?.records_list?.map((r: any) => ({
    ...r,
    account: "B",
  })) || [];

  const allRecords = [...recordsA, ...recordsB];

  const filtered = allRecords.filter((rec: any) => {
    if (selectedAcc !== "ALL" && rec.account !== selectedAcc) return false;
    if (selectedKind !== "ALL" && rec.kind !== selectedKind) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        rec.path.toLowerCase().includes(q) ||
        (rec.preview && rec.preview.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="panel p-6 bg-white space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-3">
          <div>
            <span className="text-xs font-mono font-bold bg-pixelYellow text-ink px-2 py-0.5 border border-ink">
              PRIMARY SOURCE ARCHIVE
            </span>
            <h2 className="text-2xl font-extrabold text-ink tracking-tight mt-1">
              EVIDENCE EXPLORER
            </h2>
            <p className="text-xs text-zinc-600 font-mono">
              Search and inspect all 65 primary source files, calls, emails, contracts, tickets, and flight logs ingested via MCP.
            </p>
          </div>

          <div className="font-mono text-xs text-zinc-500 bg-parchmentDark px-3 py-1.5 border border-ink">
            TOTAL RECORDS: <strong>{allRecords.length} FILES</strong>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search record path or text..."
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
                className={`px-2.5 py-1 border border-ink font-bold ${
                  selectedAcc === acc ? "bg-ink text-white" : "bg-parchment hover:bg-zinc-200"
                }`}
              >
                {acc === "ALL" ? "ALL" : `ACC ${acc}`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-zinc-500">KIND:</span>
            {["ALL", "call", "email", "doc"].map((k) => (
              <button
                key={k}
                onClick={() => setSelectedKind(k)}
                className={`px-2.5 py-1 border border-ink font-bold uppercase ${
                  selectedKind === k ? "bg-ink text-white" : "bg-parchment hover:bg-zinc-200"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Record Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((rec: any, idx: number) => {
          const isA = rec.account === "A";
          return (
            <div
              key={idx}
              className="panel p-4 bg-white space-y-3 hover:shadow-retro transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-zinc-200 pb-2 mb-2 text-xs font-mono">
                  <span className={`px-1.5 py-0.5 border text-[10px] font-bold ${isA ? "bg-electricBlue text-white" : "bg-accentOrange text-white"}`}>
                    ACCOUNT {rec.account}
                  </span>
                  <span className="text-[10px] uppercase font-bold bg-zinc-100 px-1 border border-zinc-300">
                    {rec.kind || "document"}
                  </span>
                </div>

                <strong className="text-xs font-mono text-ink block break-all mb-1">
                  {rec.path}
                </strong>
                <p className="text-[11px] font-mono text-zinc-600 line-clamp-3 bg-parchment/60 p-2 border border-ink/10">
                  {rec.preview || "Primary source artifact stored in MCP cache."}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-200 flex justify-end">
                <button
                  onClick={() => onViewEvidence(rec.path, rec.account)}
                  className="btn-pixel-secondary text-xs py-1 px-3 flex items-center gap-1.5 hover:bg-pixelYellow"
                >
                  <span>INSPECT FULL ARTIFACT</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
