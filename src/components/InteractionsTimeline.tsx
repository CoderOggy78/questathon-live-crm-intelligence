"use client";

import React, { useState } from "react";
import {
  Calendar,
  PhoneCall,
  Mail,
  Ticket,
  Flag,
  Search,
  Filter,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock
} from "lucide-react";

interface InteractionsTimelineProps {
  data: any;
  onViewEvidence: (id: string, account: string) => void;
}

export default function InteractionsTimeline({
  data,
  onViewEvidence,
}: InteractionsTimelineProps) {
  const [selectedAcc, setSelectedAcc] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const interactions: any[] = data?.all_interactions || [];

  const filtered = interactions.filter((item) => {
    if (selectedAcc !== "ALL" && item.account !== selectedAcc) return false;
    if (selectedType !== "ALL" && item.type !== selectedType) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        (item.preview && item.preview.toLowerCase().includes(q)) ||
        (item.full_text && item.full_text.toLowerCase().includes(q))
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
              COMPLETE ACCOUNT HISTORIES (2025 - 2026)
            </span>
            <h2 className="text-2xl font-extrabold text-ink tracking-tight mt-1">
              INTERACTIONS & COMMERCIAL TIMELINE
            </h2>
            <p className="text-xs text-zinc-600 font-mono">
              Unified chronological stream of all 65+ primary source events: calls, emails, support tickets, invoices, and contractual milestones.
            </p>
          </div>

          <div className="font-mono text-xs text-zinc-500 bg-parchmentDark px-3 py-1.5 border border-ink">
            RECORDED EVENTS: <strong>{interactions.length} ITEMS</strong>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search call transcripts, emails, tickets..."
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
                {acc === "ALL" ? "ALL" : `ACC ${acc}`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-zinc-500">TYPE:</span>
            {["ALL", "CALL", "EMAIL", "TICKET", "MILESTONE"].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2 py-1 border border-ink font-bold text-[11px] ${
                  selectedType === t ? "bg-ink text-white" : "bg-parchment hover:bg-zinc-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="panel p-6 bg-white space-y-4">
        <div className="flex items-center justify-between border-b-2 border-ink pb-3 text-xs font-mono">
          <span className="font-bold text-ink">
            SHOWING {filtered.length} OF {interactions.length} RECORDED INTERACTIONS
          </span>
          <span className="text-zinc-500">
            Click any entry to expand full conversation notes
          </span>
        </div>

        <div className="space-y-3">
          {filtered.map((item) => {
            const isA = item.account === "A";
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="border-2 border-ink p-4 bg-parchment hover:bg-yellow-50/40 transition-all space-y-2"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 border text-[10px] font-bold font-mono ${
                        isA ? "bg-electricBlue text-white" : "bg-accentOrange text-white"
                      }`}
                    >
                      ACC {item.account}
                    </span>

                    <span
                      className={`badge-tag ${
                        item.type === "CALL"
                          ? "bg-blue-100 text-blue-800 border-blue-800"
                          : item.type === "EMAIL"
                          ? "bg-amber-100 text-amber-800 border-amber-800"
                          : item.type === "TICKET"
                          ? "bg-red-100 text-red-800 border-red-800"
                          : "bg-purple-100 text-purple-800 border-purple-800"
                      }`}
                    >
                      {item.type}
                    </span>

                    <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="text-xs font-mono font-bold text-zinc-700 hover:text-ink flex items-center gap-1"
                    >
                      <span>{isExpanded ? "Collapse" : "Read Full Text"}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => onViewEvidence(item.path, item.account)}
                      className="btn-pixel-secondary text-[10px] py-0.5 px-2 hover:bg-pixelYellow"
                    >
                      AUDIT
                    </button>
                  </div>
                </div>

                <h4 className="font-mono font-bold text-sm text-ink">
                  {item.title}
                </h4>

                <p className="text-xs font-mono text-zinc-600 line-clamp-2">
                  {item.preview}
                </p>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-ink/20 animate-in fade-in">
                    <span className="text-[10px] font-mono font-bold text-zinc-500 block mb-1">
                      FULL RECORD ARCHIVE ({item.path}):
                    </span>
                    <pre className="bg-zinc-900 text-zinc-100 p-3 rounded text-xs font-mono overflow-x-auto whitespace-pre-wrap max-h-72 border border-zinc-700">
                      {item.full_text}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
