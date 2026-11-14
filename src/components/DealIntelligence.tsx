"use client";

import React, { useState } from "react";
import {
  CircleDollarSign,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  Clock,
  ArrowRight,
  ShieldAlert,
  ExternalLink
} from "lucide-react";

interface DealIntelligenceProps {
  data: any;
  selectedAccount: string;
  setSelectedAccount: (acc: string) => void;
  onViewEvidence: (id: string, account: string) => void;
}

export default function DealIntelligence({
  data,
  selectedAccount,
  setSelectedAccount,
  onViewEvidence,
}: DealIntelligenceProps) {
  const acc = data?.accounts?.[selectedAccount];
  if (!acc) return null;

  const deals = acc.questions.q1_book_worth.deals || [];
  const symbol = acc.currency_symbol || (selectedAccount === "A" ? "£" : "€");

  return (
    <div className="space-y-6">
      {/* Question Header Banner */}
      <div className="panel p-6 bg-white space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-3">
          <div>
            <span className="text-xs font-mono font-bold bg-pixelYellow text-ink px-2 py-0.5 border border-ink">
              QUESTION 1 OF 5
            </span>
            <h2 className="text-2xl font-extrabold text-ink tracking-tight mt-1">
              WHAT IS THE BOOK WORTH?
            </h2>
            <p className="text-xs text-zinc-600 font-mono">
              Commercial value calculation, stage progression, deal-by-deal evidence, and confidence audit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-zinc-500">VIEW ACCOUNT:</span>
            <button
              onClick={() => setSelectedAccount("A")}
              className={`px-3 py-1 text-xs font-mono font-bold border-2 border-ink ${
                selectedAccount === "A"
                  ? "bg-electricBlue text-white shadow-retro"
                  : "bg-white text-ink hover:bg-zinc-100"
              }`}
            >
              Account A: Police (£)
            </button>
            <button
              onClick={() => setSelectedAccount("B")}
              className={`px-3 py-1 text-xs font-mono font-bold border-2 border-ink ${
                selectedAccount === "B"
                  ? "bg-accentOrange text-white shadow-retro"
                  : "bg-white text-ink hover:bg-zinc-100"
              }`}
            >
              Account B: Aldermoor (€)
            </button>
          </div>
        </div>

        {/* Commercial Totals Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-3 bg-parchment border-2 border-ink font-mono">
            <span className="text-[11px] text-zinc-500 block">TOTAL IDENTIFIED DEALS</span>
            <strong className="text-xl text-ink">
              {symbol}{acc.questions.q1_book_worth.total_identified.toLocaleString()}
            </strong>
            <span className="text-[10px] text-zinc-500 block mt-0.5">All pipeline claims</span>
          </div>

          <div className="p-3 bg-emerald-50 border-2 border-emerald-700 font-mono">
            <span className="text-[11px] text-emerald-800 font-bold block">QUALIFIED VALUE</span>
            <strong className="text-xl text-emerald-700">
              {symbol}{acc.questions.q1_book_worth.qualified_value.toLocaleString()}
            </strong>
            <span className="text-[10px] text-emerald-800 block mt-0.5">Backed by operational need</span>
          </div>

          <div className="p-3 bg-blue-50 border-2 border-electricBlue font-mono">
            <span className="text-[11px] text-blue-800 font-bold block">AGREED REVENUE</span>
            <strong className="text-xl text-blue-700">
              {symbol}0
            </strong>
            <span className="text-[10px] text-blue-800 block mt-0.5">No signed renewals yet</span>
          </div>

          <div className="p-3 bg-amber-50 border-2 border-amber-600 font-mono">
            <span className="text-[11px] text-amber-800 font-bold block">UNVERIFIED / CLAIMS</span>
            <strong className="text-xl text-amber-700">
              {symbol}{acc.questions.q1_book_worth.unverified_value.toLocaleString()}
            </strong>
            <span className="text-[10px] text-amber-800 block mt-0.5">Verbal claims only</span>
          </div>
        </div>
      </div>

      {/* Audit Warning Callout */}
      <div className="p-3 bg-amber-50 border-l-4 border-amber-600 text-xs font-mono text-amber-900">
        <strong>COMMERCIAL AUDIT MANDATE:</strong> Identified value must never be treated as closed revenue. Each opportunity below is categorized by stage (Identified, Qualified, Cleared, Agreed) and linked directly to signed order forms, invoice history, or discovery facts.
      </div>

      {/* Deal Cards */}
      <div className="space-y-4">
        {deals.map((deal: any) => (
          <div
            key={deal.id}
            className="panel p-6 bg-white space-y-4 hover:shadow-retroLg transition-all"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-ink pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`badge-tag ${deal.stage === "QUALIFIED" ? "badge-verified" : "badge-inferred"}`}>
                    STAGE: {deal.stage}
                  </span>
                  <span className={`badge-tag ${deal.status === "BLOCKED" ? "badge-red" : deal.status === "AT_RISK" ? "badge-amber" : "badge-told"}`}>
                    STATUS: {deal.status.replace("_", " ")}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-ink">
                  {deal.name}
                </h3>
              </div>

              <div className="text-right font-mono">
                <span className="text-xs text-zinc-500 block">COMMERCIAL VALUE</span>
                <span className="text-2xl font-black text-ink">
                  {symbol}{deal.value.toLocaleString()}
                </span>
                <span className="text-[10px] text-zinc-500 block">{deal.currency}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-2">
                <div className="p-2.5 bg-parchment border border-ink/20">
                  <span className="font-bold text-zinc-500 block mb-0.5">VALUE CONFIDENCE & AUDIT:</span>
                  <p className="text-zinc-800">{deal.confidence}</p>
                </div>
                <div className="p-2.5 bg-zinc-50 border border-zinc-200">
                  <span className="font-bold text-zinc-500 block mb-0.5">COMMERCIAL NOTES:</span>
                  <p className="text-zinc-700">{deal.notes}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 bg-white border-2 border-ink/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink">PRIMARY SOURCE EVIDENCE:</span>
                    <button
                      onClick={() => onViewEvidence(deal.source_record_id.split(",")[0].trim(), selectedAccount)}
                      className="text-xs text-electricBlue hover:underline flex items-center gap-1 font-bold"
                    >
                      <span>[View source]</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="italic text-zinc-700 bg-parchmentDark/40 p-2 border-l-2 border-ink">
                    "{deal.excerpt}"
                  </p>
                  <div className="text-[11px] text-zinc-500 pt-1">
                    Document: <strong>{deal.source_document}</strong> • ID: <code>{deal.source_record_id}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
