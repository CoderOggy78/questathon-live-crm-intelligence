"use client";

import React, { useEffect, useState } from "react";
import { X, FileText, CheckCircle2, AlertCircle, HelpCircle, ArrowRight } from "lucide-react";

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidenceId: string | null;
  account: string;
}

export default function EvidenceModal({
  isOpen,
  onClose,
  evidenceId,
  account,
}: EvidenceModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !evidenceId) return;

    setLoading(true);
    // Fetch evidence details from API
    fetch(`/api/evidence?account=${account}&path=${encodeURIComponent(evidenceId)}&factId=${encodeURIComponent(evidenceId)}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [isOpen, evidenceId, account]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border-[3px] border-ink shadow-retroLg max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="bg-ink text-parchment px-5 py-3 flex items-center justify-between border-b-2 border-ink">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-pixelYellow" />
            <h3 className="font-mono font-bold text-sm tracking-wide">
              EVIDENCE VERIFICATION & TRACEABILITY
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5 bg-parchment">
          {loading ? (
            <div className="py-12 text-center font-mono text-sm text-zinc-600">
              Retrieving verified source artifact...
            </div>
          ) : (
            <>
              {/* Evidence header pill */}
              <div className="panel p-4 bg-white space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-zinc-500">SOURCE CITED:</span>
                    <span className="font-mono font-bold text-xs bg-parchmentDark px-2 py-0.5 border border-ink">
                      {evidenceId}
                    </span>
                  </div>
                  <div>
                    {data?.fact?.status === "verified" || data?.record ? (
                      <span className="badge-tag badge-verified">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED EVIDENCE
                      </span>
                    ) : data?.fact?.status === "told" ? (
                      <span className="badge-tag badge-told">
                        <AlertCircle className="w-3 h-3" /> TOLD BY STAKEHOLDER
                      </span>
                    ) : (
                      <span className="badge-tag badge-unverified">
                        <HelpCircle className="w-3 h-3" /> UNVERIFIED CLAIM
                      </span>
                    )}
                  </div>
                </div>

                {data?.fact && (
                  <div className="mt-2 text-sm font-medium text-ink bg-parchmentDark/40 p-3 border-l-4 border-electricBlue">
                    <p className="font-serif italic text-base">"{data.fact.text}"</p>
                    <div className="mt-2 text-xs text-zinc-600 flex items-center gap-3">
                      <span>Attributed to: <strong>{data.fact.said_by}</strong></span>
                      <span>•</span>
                      <span>Recorded at: Minute {data.fact.learned_at_minute}</span>
                      {data.fact.verified_by && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">Backing File: {data.fact.verified_by}</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Underlying document record */}
              {data?.record ? (
                <div className="panel p-4 bg-white space-y-2">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs font-mono font-bold text-ink">
                      OFFICIAL PAPERWORK FILE: {data.record.path}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500 uppercase">
                      KIND: {data.record.kind || "document"}
                    </span>
                  </div>
                  <pre className="bg-zinc-900 text-zinc-100 p-4 rounded text-xs font-mono overflow-x-auto whitespace-pre-wrap max-h-72 border border-zinc-700">
                    {data.record.text || JSON.stringify(data.record.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="panel p-4 bg-white text-xs font-mono text-zinc-600">
                  <p className="font-bold text-ink mb-1">PROVENANCE RECORD:</p>
                  <p>
                    This statement is directly recorded in the official account export (<code className="bg-zinc-100 px-1">get_my_accounts</code>) under account <strong>{account}</strong>.
                  </p>
                </div>
              )}

              {/* Provenance Explanatory Callout */}
              <div className="p-3 bg-amber-50 border-2 border-amber-300 text-xs font-mono text-amber-900">
                <strong>TRACEABILITY AUDIT RULE:</strong> This record was directly delivered by the official Questathon MCP server endpoint (<code className="text-xs">/api/public/mcp</code>). No figures or stakeholder identities in this view have been fabricated or synthesized without primary source records.
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-parchmentDark px-5 py-3 border-t-2 border-ink flex justify-end">
          <button onClick={onClose} className="btn-pixel text-xs py-1.5 px-4">
            CLOSE VIEWER
          </button>
        </div>
      </div>
    </div>
  );
}
