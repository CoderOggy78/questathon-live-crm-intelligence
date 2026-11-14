"use client";

import React, { useState } from "react";
import { X, PenSquare, Send, CheckCircle2, AlertTriangle } from "lucide-react";

interface WriteNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAccount?: string;
  onSuccess?: () => void;
}

export default function WriteNoteModal({
  isOpen,
  onClose,
  defaultAccount = "A",
  onSuccess,
}: WriteNoteModalProps) {
  const [account, setAccount] = useState(defaultAccount);
  const [kind, setKind] = useState("next_step");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) {
      setConfirmed(true);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account,
          kind,
          title: title || "Executive Action Note",
          text,
        }),
      });
      const data = await res.json();
      setResult(data);
      setSubmitting(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error(err);
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmed(false);
    setResult(null);
    setText("");
    setTitle("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border-[3px] border-ink shadow-retroLg max-w-xl w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-ink text-parchment px-5 py-3 flex items-center justify-between border-b-2 border-ink">
          <div className="flex items-center gap-2">
            <PenSquare className="w-5 h-5 text-pixelYellow" />
            <h3 className="font-mono font-bold text-sm tracking-wide">
              WRITE BACK THROUGH MCP (write_note)
            </h3>
          </div>
          <button onClick={handleReset} className="p-1 hover:bg-zinc-800 text-zinc-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 bg-parchment space-y-4">
          {result ? (
            <div className="space-y-4 text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
              <h4 className="font-mono font-bold text-base text-ink">
                Note Successfully Recorded!
              </h4>
              <p className="text-xs font-mono text-zinc-600">
                {result.mcpSuccess
                  ? "Delivered directly to the official MCP server and stored in your local persistent database."
                  : "Saved to your local persistent CRM database (MCP rate-limited or simulated)."}
              </p>
              <div className="panel p-3 bg-white text-left text-xs font-mono">
                <p><strong>Account:</strong> {account}</p>
                <p><strong>Kind:</strong> {kind}</p>
                <p><strong>Title:</strong> {title || "Executive Action Note"}</p>
                <p className="mt-2 text-zinc-700 bg-parchmentDark/50 p-2 border border-ink/20">"{text}"</p>
              </div>
              <button onClick={handleReset} className="btn-pixel w-full text-xs py-2">
                RETURN TO DASHBOARD
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold text-ink mb-1">
                    TARGET ACCOUNT
                  </label>
                  <select
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    className="w-full bg-white border-2 border-ink px-3 py-1.5 text-xs font-mono"
                  >
                    <option value="A">Account A: Police Alliance</option>
                    <option value="B">Account B: Aldermoor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-ink mb-1">
                    NOTE KIND
                  </label>
                  <select
                    value={kind}
                    onChange={(e) => setKind(e.target.value)}
                    className="w-full bg-white border-2 border-ink px-3 py-1.5 text-xs font-mono"
                  >
                    <option value="next_step">Next Step / Action</option>
                    <option value="risk">Risk / Blocker</option>
                    <option value="task">Operational Task</option>
                    <option value="note">General Strategic Note</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-ink mb-1">
                  TITLE
                </label>
                <input
                  type="text"
                  placeholder="e.g. Schedule DPIA Review Session with Fatima Osei"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border-2 border-ink px-3 py-2 text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-ink mb-1">
                  NOTE TEXT (Detailed Rationale & Evidence)
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the exact action, who owns it, deadline, and source evidence..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-white border-2 border-ink px-3 py-2 text-xs font-mono"
                  required
                />
              </div>

              {confirmed && (
                <div className="p-3 bg-amber-100 border-2 border-amber-600 text-xs font-mono text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block mb-0.5">EXPLICIT CONFIRMATION REQUIRED:</strong>
                    You are about to transmit this note to the live MCP endpoint (<code className="text-xs">write_note</code>) respecting the 1-call-per-minute policy. Click Submit below to confirm.
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-pixel-secondary text-xs py-2 px-4"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting || !text}
                  className="btn-pixel text-xs py-2 px-5 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {submitting
                      ? "TRANSMITTING..."
                      : confirmed
                      ? "CONFIRM & TRANSMIT TO MCP"
                      : "REVIEW & CONFIRM"}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
