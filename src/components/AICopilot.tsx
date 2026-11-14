"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Send,
  HelpCircle,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Copy,
  PenSquare,
  Shield,
  Factory,
  Radio,
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface AICopilotProps {
  onViewEvidence: (id: string, account: string) => void;
  openNoteModal: () => void;
}

export default function AICopilot({
  onViewEvidence,
  openNoteModal,
}: AICopilotProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{
    role: "user" | "copilot";
    text: string;
    evidenceDocs?: string[];
    keyMetrics?: any;
    relatedAccount?: string;
  }>>([
    {
      role: "copilot",
      text: `**Welcome to the Questathon Executive AI Decision Copilot.**

I am your evidence-grounded intelligence agent for **Eastern Counties Police Alliance** (£350k) and **Aldermoor Industrial Group** (€140k).

Every answer I provide is calculated from stored MCP database records (calls, emails, tickets, telemetry, and contracts) with **100% primary source traceability**.

Select a prompt chip below or type any commercial or operational question:`,
      evidenceDocs: ["calls.json", "emails.json", "tickets.json", "usage_weekly.csv", "roi_spreadsheet.csv"],
      keyMetrics: { "Alliance ACV": "£350,000", "Aldermoor ACV": "€140,000", "Total Docks": "49", "Total Flights": "1,497" },
    },
  ]);

  const promptChips = [
    {
      label: "Why is Tarn Valley & Norwold (£200k) blocked?",
      query: "Why is the Tarn Valley and Norwold £200k expansion blocked?",
    },
    {
      label: "Is Stefan Roy's €1.2M savings real?",
      query: "Is Stefan Roy's €1.2M savings claim verified by finance?",
    },
    {
      label: "Which docks stopped flying in November?",
      query: "Which docks dropped to zero flights in November and why?",
    },
    {
      label: "Who holds real power at Police Alliance?",
      query: "Who holds purchasing power and budget at Eastern Counties Police Alliance?",
    },
    {
      label: "Draft emergency response to Karen Mbeki (FB-11206)",
      query: "Draft urgent SLA response to Inspector Karen Mbeki for 5 December event",
    },
  ];

  const handleAsk = async (textToAsk?: string) => {
    const q = textToAsk || query;
    if (!q.trim() || loading) return;

    // Add user message
    const userMsg = { role: "user" as const, text: q };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();

      if (data.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "copilot",
            text: data.answer,
            evidenceDocs: data.evidenceDocs || [],
            keyMetrics: data.keyMetrics || null,
            relatedAccount: data.relatedAccount || "A",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "copilot",
            text: `Error retrieving grounded intelligence: ${data.error || "Unknown error"}`,
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "copilot",
          text: `Connection error: ${err.message}. Please verify the local server.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied intelligence dossier to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="panel p-6 bg-parchmentDark border-[3px] border-ink shadow-retroLg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pixelYellow border-2 border-ink shadow-retro flex items-center justify-center font-bold text-ink">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="inline-block bg-ink text-pixelYellow px-2 py-0.5 text-xs font-mono font-bold mb-1">
                EVIDENCE-GROUNDED DECISION ENGINE
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                AI ACCOUNT INTELLIGENCE COPILOT
              </h2>
              <p className="text-xs text-zinc-700 font-mono">
                Real-time synthesis of all 85+ interactions, 25 tickets, 49 docks, and commercial agreements with zero hallucination.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge-tag bg-green-700 text-white font-mono font-bold text-xs">
              MCP KNOWLEDGE GROUNDED
            </span>
          </div>
        </div>

        {/* Quick Prompt Chips */}
        <div>
          <span className="text-[11px] font-mono font-bold text-zinc-600 block mb-2">
            SELECT A CRITICAL EXECUTIVE QUESTION TO INVESTIGATE:
          </span>
          <div className="flex flex-wrap gap-2">
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleAsk(chip.query)}
                className="px-3 py-1.5 bg-white hover:bg-pixelYellow border-2 border-ink text-xs font-mono font-bold text-ink shadow-sm transition-all flex items-center gap-1 text-left"
              >
                <ChevronRight className="w-3.5 h-3.5 text-ink flex-shrink-0" />
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="panel p-6 bg-white border-[3px] border-ink shadow-retro space-y-4">
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 border-2 border-ink ${
                msg.role === "copilot"
                  ? "bg-parchment shadow-sm"
                  : "bg-ink text-white font-mono ml-8"
              }`}
            >
              <div className="flex items-center justify-between border-b border-ink/20 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  {msg.role === "copilot" ? (
                    <>
                      <span className="w-5 h-5 bg-pixelYellow border border-ink text-ink flex items-center justify-center font-bold text-[10px]">
                        AI
                      </span>
                      <strong className="text-xs font-mono text-ink uppercase">
                        Decision Copilot Dossier
                      </strong>
                    </>
                  ) : (
                    <>
                      <span className="w-5 h-5 bg-white text-ink flex items-center justify-center font-bold text-[10px]">
                        ME
                      </span>
                      <strong className="text-xs font-mono text-white">
                        Executive Query
                      </strong>
                    </>
                  )}
                </div>

                {msg.role === "copilot" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(msg.text)}
                      className="text-[11px] font-mono font-bold text-zinc-700 hover:text-ink flex items-center gap-1 bg-white px-2 py-0.5 border border-ink shadow-sm"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={openNoteModal}
                      className="text-[11px] font-mono font-bold text-white bg-electricBlue px-2 py-0.5 border border-ink shadow-sm hover:bg-blue-600 flex items-center gap-1"
                    >
                      <PenSquare className="w-3 h-3" />
                      <span>Dispatch as MCP Note</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div
                className={`text-xs font-mono leading-relaxed space-y-2 whitespace-pre-line ${
                  msg.role === "copilot" ? "text-ink" : "text-zinc-100"
                }`}
              >
                {msg.text}
              </div>

              {/* Key Metrics Chips */}
              {msg.keyMetrics && (
                <div className="mt-3 pt-3 border-t border-ink/20 flex flex-wrap gap-2 text-[11px] font-mono">
                  {Object.entries(msg.keyMetrics).map(([k, v]: any) => (
                    <div key={k} className="bg-white border border-ink px-2 py-1 shadow-sm">
                      <span className="text-zinc-500 font-bold uppercase">{k}: </span>
                      <strong className="text-ink">{v}</strong>
                    </div>
                  ))}
                </div>
              )}

              {/* Traceable Evidence Badges */}
              {msg.evidenceDocs && msg.evidenceDocs.length > 0 && (
                <div className="mt-3 pt-2 border-t border-ink/20 flex flex-wrap items-center gap-2 text-[11px] font-mono">
                  <span className="font-bold text-zinc-600 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-electricBlue" />
                    PRIMARY EVIDENCE CITATIONS:
                  </span>
                  {msg.evidenceDocs.map((doc, dIdx) => (
                    <button
                      key={dIdx}
                      onClick={() => onViewEvidence(doc, msg.relatedAccount || "A")}
                      className="px-2 py-0.5 bg-yellow-100 hover:bg-pixelYellow border border-ink font-bold text-ink flex items-center gap-1"
                    >
                      <span>{doc}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="p-4 border-2 border-ink bg-parchment flex items-center gap-3 font-mono text-xs text-ink animate-pulse">
              <div className="w-4 h-4 border-2 border-ink border-t-pixelYellow rounded-full animate-spin"></div>
              <span>Grounding query against raw MCP records and financial ledgers...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="pt-4 border-t-2 border-ink flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            placeholder="Ask anything: e.g. 'Why did AD-02 stop flying?', 'What is the DPIA blocker?', 'Draft email to Karen'..."
            className="flex-1 px-4 py-2 bg-parchment border-2 border-ink font-mono text-xs focus:outline-none focus:bg-white"
          />
          <button
            onClick={() => handleAsk()}
            disabled={loading || !query.trim()}
            className="btn-pixel text-xs py-2 px-5 flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>ASK COPILOT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
