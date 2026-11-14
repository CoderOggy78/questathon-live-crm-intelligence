"use client";

import React from "react";
import {
  EyeOff,
  AlertCircle,
  HelpCircle,
  User,
  ArrowRight,
  Target,
  FileQuestion
} from "lucide-react";

interface BlindSpotFinderProps {
  data: any;
  selectedAccount: string;
  setSelectedAccount: (acc: string) => void;
  openNoteModal: () => void;
}

export default function BlindSpotFinder({
  data,
  selectedAccount,
  setSelectedAccount,
  openNoteModal,
}: BlindSpotFinderProps) {
  const acc = data?.accounts?.[selectedAccount];
  if (!acc) return null;

  const gaps = acc.questions.q5_blind_spots.gaps || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="panel p-6 bg-white space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-3">
          <div>
            <span className="text-xs font-mono font-bold bg-pixelYellow text-ink px-2 py-0.5 border border-ink">
              QUESTION 5 OF 5
            </span>
            <h2 className="text-2xl font-extrabold text-ink tracking-tight mt-1">
              WHAT DO YOU STILL NOT KNOW?
            </h2>
            <p className="text-xs text-zinc-600 font-mono">
              Blind Spot Finder: Identifying critical knowledge gaps, unknown decision-makers, and unverified data that could alter commercial outcomes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-zinc-500">ACCOUNT:</span>
            <button
              onClick={() => setSelectedAccount("A")}
              className={`px-3 py-1 text-xs font-mono font-bold border-2 border-ink ${
                selectedAccount === "A"
                  ? "bg-electricBlue text-white shadow-retro"
                  : "bg-white text-ink hover:bg-zinc-100"
              }`}
            >
              Account A: Police
            </button>
            <button
              onClick={() => setSelectedAccount("B")}
              className={`px-3 py-1 text-xs font-mono font-bold border-2 border-ink ${
                selectedAccount === "B"
                  ? "bg-accentOrange text-white shadow-retro"
                  : "bg-white text-ink hover:bg-zinc-100"
              }`}
            >
              Account B: Aldermoor
            </button>
          </div>
        </div>

        <div className="p-3 bg-red-50 border-l-4 border-riskRed text-xs font-mono text-red-950">
          <strong>HONESTY IN INTELLIGENCE:</strong> An empty blind spot list is evidence of poor discovery, not completeness. The items below represent decisive gaps that must be clarified before committing renewal forecasts to leadership.
        </div>
      </div>

      {/* Blind Spot Cards */}
      <div className="space-y-5">
        {gaps.map((gap: any) => (
          <div
            key={gap.rank}
            className="panel p-6 bg-white space-y-4 hover:shadow-retroLg transition-all"
          >
            <div className="flex items-start justify-between gap-3 border-b-2 border-ink pb-3">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 bg-riskRed text-white border border-ink flex items-center justify-center font-bold font-pixel text-xs">
                  GAP {gap.rank}
                </span>
                <div>
                  <span className="text-xs font-mono font-bold text-zinc-500 block mb-0.5">
                    AFFECTED DEAL: {gap.affected_deal}
                  </span>
                  <h3 className="text-lg font-extrabold text-ink">
                    {gap.unknown}
                  </h3>
                </div>
              </div>
            </div>

            {/* 6-point breakdown grid */}
            <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-2">
                <div className="p-3 bg-zinc-50 border border-zinc-200">
                  <span className="font-bold text-zinc-500 block mb-0.5">1. WHY DOES IT MATTER?</span>
                  <p className="text-zinc-800 leading-relaxed">{gap.why_it_matters}</p>
                </div>

                <div className="p-3 bg-yellow-50 border border-amber-300">
                  <span className="font-bold text-amber-900 block mb-0.5">2. WHAT DECISION DEPENDS ON THIS?</span>
                  <p className="text-zinc-800 leading-relaxed">{gap.decision_dependent}</p>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 text-red-950">
                  <span className="font-bold text-riskRed block mb-0.5">3. WHAT HAPPENS IF UNRESOLVED?</span>
                  <p className="leading-relaxed">{gap.if_unresolved}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-blue-50 border border-blue-200 text-blue-950">
                  <span className="font-bold text-blue-800 block mb-0.5">4. WHO CAN PROVIDE THE ANSWER?</span>
                  <p className="leading-relaxed font-bold">{gap.who_can_answer}</p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-950">
                  <span className="font-bold text-emerald-800 block mb-1">5. HOW TO OBTAIN THIS INFORMATION:</span>
                  <p className="leading-relaxed">{gap.how_to_obtain}</p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={openNoteModal}
                    className="btn-pixel w-full text-xs py-2 flex items-center justify-center gap-1.5"
                  >
                    <span>LOG ACTION TASK FOR THIS GAP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
