"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import ExecutiveOverview from "../components/ExecutiveOverview";
import AccountWorkspace from "../components/AccountWorkspace";
import DealIntelligence from "../components/DealIntelligence";
import StakeholderMap from "../components/StakeholderMap";
import NextActions from "../components/NextActions";
import RiskRadar from "../components/RiskRadar";
import BlindSpotFinder from "../components/BlindSpotFinder";
import EvidenceExplorer from "../components/EvidenceExplorer";
import LiveEvents from "../components/LiveEvents";
import SyncSystemStatus from "../components/SyncSystemStatus";
import EvidenceModal from "../components/EvidenceModal";
import WriteNoteModal from "../components/WriteNoteModal";

export default function Home() {
  const [currentTab, setTab] = useState<string>("overview");
  const [selectedAccount, setSelectedAccount] = useState<string>("A");
  const [data, setData] = useState<any>(null);
  const [syncState, setSyncState] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [activeEvidenceId, setActiveEvidenceId] = useState<string | null>(null);
  const [evidenceAccount, setEvidenceAccount] = useState<string>("A");
  const [noteModalOpen, setNoteModalOpen] = useState(false);

  const loadData = () => {
    fetch("/api/crm")
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) {
          setData(res.data);
          setSyncState(res.syncState);
          setTeam(res.team || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load CRM data:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleViewEvidence = (evidenceId: string, account: string) => {
    setActiveEvidenceId(evidenceId);
    setEvidenceAccount(account || selectedAccount);
    setEvidenceModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Header
          currentTab={currentTab}
          setTab={setTab}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
          syncState={syncState}
        />

        <Navigation
          currentTab={currentTab}
          setTab={setTab}
          openNoteModal={() => setNoteModalOpen(true)}
          signalsCount={3}
        />

        <main className="mx-auto max-w-7xl px-4 py-8">
          {loading ? (
            <div className="py-24 text-center font-mono space-y-3">
              <div className="inline-block w-8 h-8 border-4 border-ink border-t-pixelYellow rounded-full animate-spin"></div>
              <p className="text-sm font-bold text-ink">
                INITIALIZING EVIDENCE-BACKED CRM INTELLIGENCE...
              </p>
              <p className="text-xs text-zinc-500">
                Reading persisted MCP cache and structuring account models...
              </p>
            </div>
          ) : !data ? (
            <div className="panel p-8 bg-white text-center space-y-4">
              <h3 className="font-mono font-bold text-lg text-ink">
                No CRM Snapshot Found
              </h3>
              <p className="text-xs font-mono text-zinc-600">
                The ingestion daemon is running in the background. Please refresh in a moment.
              </p>
            </div>
          ) : (
            <>
              {currentTab === "overview" && (
                <ExecutiveOverview
                  data={data}
                  setTab={setTab}
                  setSelectedAccount={setSelectedAccount}
                  onViewEvidence={handleViewEvidence}
                />
              )}

              {currentTab === "account-a" && (
                <AccountWorkspace
                  accountId="A"
                  data={data}
                  setTab={setTab}
                  onViewEvidence={handleViewEvidence}
                />
              )}

              {currentTab === "account-b" && (
                <AccountWorkspace
                  accountId="B"
                  data={data}
                  setTab={setTab}
                  onViewEvidence={handleViewEvidence}
                />
              )}

              {currentTab === "deals" && (
                <DealIntelligence
                  data={data}
                  selectedAccount={selectedAccount}
                  setSelectedAccount={setSelectedAccount}
                  onViewEvidence={handleViewEvidence}
                />
              )}

              {currentTab === "stakeholders" && (
                <StakeholderMap
                  data={data}
                  selectedAccount={selectedAccount}
                  setSelectedAccount={setSelectedAccount}
                  onViewEvidence={handleViewEvidence}
                />
              )}

              {currentTab === "actions" && (
                <NextActions
                  data={data}
                  selectedAccount={selectedAccount}
                  setSelectedAccount={setSelectedAccount}
                  onViewEvidence={handleViewEvidence}
                  openNoteModal={() => setNoteModalOpen(true)}
                />
              )}

              {currentTab === "risks" && (
                <RiskRadar
                  data={data}
                  selectedAccount={selectedAccount}
                  setSelectedAccount={setSelectedAccount}
                  onViewEvidence={handleViewEvidence}
                />
              )}

              {currentTab === "blindspots" && (
                <BlindSpotFinder
                  data={data}
                  selectedAccount={selectedAccount}
                  setSelectedAccount={setSelectedAccount}
                  openNoteModal={() => setNoteModalOpen(true)}
                />
              )}

              {currentTab === "evidence" && (
                <EvidenceExplorer
                  data={data}
                  onViewEvidence={handleViewEvidence}
                />
              )}

              {currentTab === "signals" && (
                <LiveEvents
                  data={data}
                  onViewEvidence={handleViewEvidence}
                  openNoteModal={() => setNoteModalOpen(true)}
                />
              )}

              {currentTab === "system" && (
                <SyncSystemStatus
                  syncState={syncState}
                  team={team}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Retro Operational Footer */}
      <footer className="border-t-[3px] border-ink bg-white py-4 mt-12">
        <div className="mx-auto max-w-7xl px-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-600">
          <div className="flex items-center gap-3">
            <span className="font-bold text-ink">QUESTATHON CRM INTELLIGENCE</span>
            <span>•</span>
            <span>Customer Success Decision-Support Platform</span>
          </div>
          <div>
            <span>Official MCP Endpoint: <code>/api/public/mcp</code></span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <EvidenceModal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        evidenceId={activeEvidenceId}
        account={evidenceAccount}
      />

      <WriteNoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        defaultAccount={selectedAccount}
        onSuccess={() => loadData()}
      />
    </div>
  );
}
