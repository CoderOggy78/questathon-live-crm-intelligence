"use client";

import React, { useState } from "react";
import {
  CircleDollarSign,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  Search,
  ExternalLink,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";

interface CommercialLedgerProps {
  data: any;
  onViewEvidence: (id: string, account: string) => void;
}

export default function CommercialLedger({
  data,
  onViewEvidence,
}: CommercialLedgerProps) {
  const [filterAccount, setFilterAccount] = useState<string>("ALL");
  const [filterStage, setFilterStage] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  if (!data?.accounts) return null;

  const accA = data.accounts.A;
  const accB = data.accounts.B;

  // Compile unified commercial line items
  const ledgerItems = [
    // Account A items
    {
      id: "a_base_contract",
      account: "A",
      account_name: accA.name,
      deal_name: "Contract Renewal: 35 Docks Across 4 Forces",
      type: "ANNUAL_CONTRACT",
      claimed_value: 350000,
      audited_value: 350000,
      currency: "£",
      stage: "IDENTIFIED",
      status: "AT_RISK",
      audit_label: "VERIFIED BASE",
      source_doc: "contract.txt & invoices.json",
      source_id: "contract.txt",
      paid_status: "Paid (4 parts via Schedule 2)",
      renewal_date: "2027-02-28",
      blocker: "Non-automatic renewal. Rhys Calder leaves in Jan; no pooled budget (each CFO must sign).",
      audit_summary: "Order form signed 20 Jan 2026. 35 docks @ £350k/yr. All 4 first-year invoices paid."
    },
    {
      id: "a_tarn_expansion",
      account: "A",
      account_name: accA.name,
      deal_name: "Qualified Expansion: Tarn Valley & Norwold Go-Live",
      type: "EXPANSION",
      claimed_value: 200000,
      audited_value: 200000,
      currency: "£",
      stage: "QUALIFIED",
      status: "BLOCKED",
      audit_label: "QUALIFIED (BLOCKED)",
      source_doc: "tickets.json & calls/fo_dpia",
      source_id: "fo_dpia_2",
      paid_status: "Uncontracted (£200k potential)",
      renewal_date: "N/A",
      blocker: "DPIA unsigned for 4 months due to unanswered FlytBase support ticket for data-flow pack.",
      audit_summary: "DPO Fatima Osei: will sign within 3 weeks of receiving engineering pack. Norwold waiting to copy."
    },
    {
      id: "a_stadium_opportunity",
      account: "A",
      account_name: accA.name,
      deal_name: "Westmere Stadium Project (30 Docks)",
      type: "PIPELINE_CLAIM",
      claimed_value: 300000,
      audited_value: 0,
      currency: "£",
      stage: "IDENTIFIED",
      status: "UNVERIFIED_CLAIM",
      audit_label: "SPECULATIVE / TOLD",
      source_doc: "emails/2026-10-02_rhys_stadium.txt",
      source_id: "rc_stadium_0",
      paid_status: "No quote issued",
      renewal_date: "N/A",
      blocker: "No formal quote issued. Insp. Mbeki demanding written operator training SLA for 5 Dec event first.",
      audit_summary: "Rhys Calder verbal claim only. Audited net revenue held at £0 until formal RFQ and event SLA settled."
    },
    {
      id: "a_tender_framework",
      account: "A",
      account_name: accA.name,
      deal_name: "Alliance Framework Tender (Up to 300 Docks)",
      type: "SPECULATIVE_TENDER",
      claimed_value: 3000000,
      audited_value: 0,
      currency: "£",
      stage: "IDENTIFIED",
      status: "QUARANTINED",
      audit_label: "QUARANTINED CLAIM",
      source_doc: "deal_history.json & rc_tender_0",
      source_id: "rc_tender_0",
      paid_status: "Unpublished tender",
      renewal_date: "N/A",
      blocker: "No published notice, tender specification, or pooled alliance budget on file.",
      audit_summary: "Ewan Brooks confirms each force funds independently. Quarantined from commercial forecast."
    },

    // Account B items
    {
      id: "b_base_contract",
      account: "B",
      account_name: accB.name,
      deal_name: "Contract Renewal: 14 Docks Across 15 Plants",
      type: "ANNUAL_CONTRACT",
      claimed_value: 140000,
      audited_value: 140000,
      currency: "€",
      stage: "IDENTIFIED",
      status: "AT_RISK",
      audit_label: "VERIFIED BASE",
      source_doc: "contract.txt & invoices.json",
      source_id: "contract.txt",
      paid_status: "Paid (€128k net after €12k trial credit)",
      renewal_date: "2027-01-31",
      blocker: "Non-automatic renewal. Plant managers resent security levy; deputy leaving soon.",
      audit_summary: "Signed 15 Jan 2026 by Stefan Roy. One annual invoice paid. Renewal deadline 31 Jan 2027."
    },
    {
      id: "b_idle_plants",
      account: "B",
      account_name: accB.name,
      deal_name: "Qualified Expansion: Bring Idle Plants Into Patrol",
      type: "EXPANSION",
      claimed_value: 180000,
      audited_value: 180000,
      currency: "€",
      stage: "QUALIFIED",
      status: "BLOCKED",
      audit_label: "QUALIFIED (BLOCKED)",
      source_doc: "deal_history.json & calls/ba_deputy",
      source_id: "ba_use_2",
      paid_status: "Uncontracted (€180k potential)",
      renewal_date: "N/A",
      blocker: "Network project will cut docks off; rollout know-how departs with Stefan's deputy.",
      audit_summary: "Deputy configured all docks and holds setup in head. Third-party guards ignore drone alerts."
    },
    {
      id: "b_sister_company",
      account: "B",
      account_name: accB.name,
      deal_name: "Sister Company Expansion (40 Plants)",
      type: "PIPELINE_CLAIM",
      claimed_value: 400000,
      audited_value: 0,
      currency: "€",
      stage: "IDENTIFIED",
      status: "UNVERIFIED_CLAIM",
      audit_label: "SPECULATIVE / TOLD",
      source_doc: "emails/2026-09-22_stefan_case_study.txt",
      source_id: "sr_roi_2",
      paid_status: "Zero direct contact",
      renewal_date: "N/A",
      blocker: "Depends on unstarted case study based on fictitious €1.2M unreduced guard savings.",
      audit_summary: "Group Finance has booked €0 savings. Quarantined from forecast until finance audits metrics."
    },
    {
      id: "b_roi_savings_claim",
      account: "B",
      account_name: accB.name,
      deal_name: "Stefan Roy's Claimed Annual Savings (€1.2M)",
      type: "DISPUTED_SAVINGS",
      claimed_value: 1200000,
      audited_value: 0,
      currency: "€",
      stage: "DISPUTED",
      status: "QUARANTINED",
      audit_label: "DISPUTED / FICTITIOUS",
      source_doc: "files/roi_spreadsheet.csv & emails/finance_mailbox",
      source_id: "roi_spreadsheet",
      paid_status: "Booked in Finance: €0",
      renewal_date: "N/A",
      blocker: "Zero guard contracts have been reduced. Finance refuses to endorse the number.",
      audit_summary: "Fact sr_roi_2: based on theoretical guard hours; finance confirms zero realized savings."
    }
  ];

  const filtered = ledgerItems.filter((item) => {
    if (filterAccount !== "ALL" && item.account !== filterAccount) return false;
    if (filterStage !== "ALL" && item.stage !== filterStage) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.deal_name.toLowerCase().includes(q) ||
        item.blocker.toLowerCase().includes(q) ||
        item.source_doc.toLowerCase().includes(q)
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
              AUDITED COMMERCIAL REVENUE WATERFALL
            </span>
            <h2 className="text-2xl font-extrabold text-ink tracking-tight mt-1">
              COMMERCIAL LEDGER & PIPELINE AUDIT
            </h2>
            <p className="text-xs text-zinc-600 font-mono">
              Strict reconciliation between claimed discover values and audited contract reality. Zero speculative revenue counted.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge-tag badge-verified">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% RECONCILED TO CONTRACTS
            </span>
          </div>
        </div>

        {/* Financial Summary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 bg-parchment border-2 border-ink">
            <span className="text-zinc-500 block text-[11px]">VERIFIED BASE ACV</span>
            <strong className="text-xl text-ink block mt-0.5">£350K + €140K</strong>
            <span className="text-[10px] text-zinc-500 block">Signed orders on file</span>
          </div>

          <div className="p-3 bg-emerald-50 border-2 border-emerald-700">
            <span className="text-emerald-800 font-bold block text-[11px]">QUALIFIED EXPANSIONS</span>
            <strong className="text-xl text-emerald-700 block mt-0.5">£200K + €180K</strong>
            <span className="text-[10px] text-emerald-800 block">High potential (blocked)</span>
          </div>

          <div className="p-3 bg-amber-50 border-2 border-amber-600">
            <span className="text-amber-800 font-bold block text-[11px]">AGREED FUTURE RENEWALS</span>
            <strong className="text-xl text-amber-700 block mt-0.5">£0 / €0</strong>
            <span className="text-[10px] text-amber-800 block">Pending executed 2027 orders</span>
          </div>

          <div className="p-3 bg-red-50 border-2 border-riskRed">
            <span className="text-riskRed font-bold block text-[11px]">QUARANTINED CLAIMS</span>
            <strong className="text-xl text-riskRed block mt-0.5">£3.3M + €1.6M</strong>
            <span className="text-[10px] text-riskRed block">Unverified tenders & ROI</span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid sm:grid-cols-3 gap-3 pt-2">
          <div className="sm:col-span-1 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search commercial deal, blocker..."
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
                onClick={() => setFilterAccount(acc)}
                className={`px-3 py-1 border border-ink font-bold ${
                  filterAccount === acc ? "bg-ink text-white" : "bg-parchment hover:bg-zinc-200"
                }`}
              >
                {acc === "ALL" ? "ALL" : `ACC ${acc}`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-zinc-500">STAGE:</span>
            {["ALL", "IDENTIFIED", "QUALIFIED", "DISPUTED"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStage(st)}
                className={`px-2.5 py-1 border border-ink font-bold text-[11px] ${
                  filterStage === st ? "bg-ink text-white" : "bg-parchment hover:bg-zinc-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="panel p-6 bg-white space-y-4">
        <div className="flex items-center justify-between border-b-2 border-ink pb-3 text-xs font-mono">
          <span className="font-bold text-ink">
            SHOWING {filtered.length} COMMERCIAL LINE ITEMS
          </span>
          <span className="text-zinc-500">
            Click [AUDIT SOURCE] on any line to inspect signed contracts and invoices
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-parchmentDark border-y-2 border-ink text-ink font-bold">
                <th className="py-2.5 px-3">COMMERCIAL LINE</th>
                <th className="py-2.5 px-3">ACCOUNT</th>
                <th className="py-2.5 px-3 text-right">CLAIMED VALUE</th>
                <th className="py-2.5 px-3 text-right">AUDITED NET</th>
                <th className="py-2.5 px-3">STAGE & STATUS</th>
                <th className="py-2.5 px-3">PRIMARY COMMERCIAL BLOCKER</th>
                <th className="py-2.5 px-3 text-right">EVIDENCE AUDIT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filtered.map((item) => {
                const isA = item.account === "A";
                return (
                  <tr key={item.id} className="hover:bg-yellow-50/50 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-ink">
                      <strong className="block text-sm text-ink">{item.deal_name}</strong>
                      <span className="text-[10px] text-zinc-500 font-normal">
                        Type: {item.type} • Source: {item.source_doc}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 border text-[10px] font-bold ${
                          isA ? "bg-electricBlue text-white" : "bg-accentOrange text-white"
                        }`}
                      >
                        {isA ? "ACC A (Police)" : "ACC B (Aldermoor)"}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right whitespace-nowrap font-mono">
                      <span className="text-zinc-500 line-through">
                        {item.currency}{item.claimed_value.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right whitespace-nowrap font-mono font-bold">
                      <span
                        className={`text-sm ${
                          item.audited_value > 0 ? "text-emerald-700" : "text-riskRed"
                        }`}
                      >
                        {item.currency}{item.audited_value.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`badge-tag ${
                          item.audit_label.includes("VERIFIED")
                            ? "badge-verified"
                            : item.audit_label.includes("QUALIFIED")
                            ? "badge-amber"
                            : "badge-red"
                        }`}
                      >
                        {item.audit_label}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-xs max-w-xs">
                      <p className="text-zinc-700 leading-snug">{item.blocker}</p>
                    </td>

                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => onViewEvidence(item.source_id, item.account)}
                        className="btn-pixel-secondary text-[11px] py-1 px-2.5 hover:bg-pixelYellow flex items-center gap-1 ml-auto"
                      >
                        <span>AUDIT SOURCE</span>
                        <ExternalLink className="w-3 h-3" />
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
