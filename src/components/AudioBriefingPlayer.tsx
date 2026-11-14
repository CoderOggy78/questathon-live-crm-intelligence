"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  FastForward,
  Headphones,
  CheckCircle2
} from "lucide-react";

interface AudioBriefingProps {
  compact?: boolean;
}

const BRIEFING_SCRIPTS = [
  {
    id: "handover",
    title: "Monday Morning Handover (3-Min Executive Digest)",
    duration: "2:45",
    narrative: [
      "Good Monday morning. Here is your executive portfolio briefing for the two accounts you are inheriting today.",
      "Your total baseline annual contract value is 350,000 pounds for Eastern Counties Police Alliance, and 140,000 euros for Aldermoor Industrial Group.",
      "Both contracts are strictly non-automatic renewals, expiring in January and February 2027.",
      "Account A has a critical P0 blocker: Tarn Valley and Norwold forces are completely grounded because a support ticket, FB-10492, has sat unassigned for four months requesting data protection documents.",
      "Furthermore, your champion Rhys Calder is departing in January, and there is no pooled alliance budget. You must engage the member force CFOs directly this week.",
      "Account B has two critical risks: Stefan Roy's 1.2 million euro savings claim is unbooked in finance, and three docks—AD-02, 05, and 10—dropped to zero flights in November while reporting online.",
      "Executing the five recommended playbooks today protects 490,000 pounds of recurring base revenue and unblocks 380,000 in qualified expansion.",
    ],
  },
  {
    id: "account-a",
    title: "Account A: Police Alliance Crisis Briefing",
    duration: "1:50",
    narrative: [
      "Deep dive on Eastern Counties Police Alliance, 350,000 pounds annual contract value.",
      "Only Westmere Police is currently flying operational missions, with 1,497 recorded flights.",
      "Inspector Karen Mbeki has logged an urgent ticket, FB-11206, requesting a 99.9% uptime SLA for a major public policing operation on 5 December.",
      "FlytBase has not yet replied. You must approve the standby airframe and SLA today.",
      "Tarn Valley DPO Fatima Osei confirmed that once engineering delivers server encryption architecture, she will approve the DPIA in three weeks, unlocking 200,000 pounds in expansion.",
    ],
  },
  {
    id: "account-b",
    title: "Account B: Aldermoor Industrial Audit Briefing",
    duration: "1:40",
    narrative: [
      "Deep dive on Aldermoor Industrial Group, 140,000 euros annual contract value.",
      "Stefan Roy's claimed 1.2 million euro annual savings is unverified. Group Finance has booked zero euros and questioned the renewal.",
      "Docks AD-02, 05, and 10 suddenly halted flights in mid-November, despite remaining powered on.",
      "Stefan's deputy rollout lead is leaving imminently with zero written SOPs.",
      "Your immediate action is to dispatch a field diagnostic team to Plant 2 and extract standard operating procedures before the deputy exits.",
    ],
  },
];

export default function AudioBriefingPlayer({ compact = false }: AudioBriefingProps) {
  const [selectedScriptId, setSelectedScriptId] = useState("handover");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [rate, setRate] = useState<number>(1.1);
  const [muted, setMuted] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);

  const script =
    BRIEFING_SCRIPTS.find((s) => s.id === selectedScriptId) || BRIEFING_SCRIPTS[0];
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    } else {
      setHasSpeechSupport(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Handle sentence-by-sentence speech
  const speakCurrentSentence = (sentenceIdx: number) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    if (sentenceIdx >= script.narrative.length) {
      setIsPlaying(false);
      setCurrentSentenceIdx(0);
      return;
    }

    const text = script.narrative[sentenceIdx];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Pick English voice if available
    const voices = synthRef.current.getVoices();
    const preferredVoice =
      voices.find((v) => v.lang.startsWith("en") && v.name.includes("Natural")) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => {
      if (isPlaying) {
        setCurrentSentenceIdx((prev) => {
          const next = prev + 1;
          if (next < script.narrative.length) {
            speakCurrentSentence(next);
            return next;
          } else {
            setIsPlaying(false);
            return 0;
          }
        });
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    if (!muted) {
      synthRef.current.speak(utterance);
    }
  };

  const handlePlayPause = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakCurrentSentence(currentSentenceIdx);
    }
  };

  const handleReset = () => {
    if (synthRef.current) synthRef.current.cancel();
    setIsPlaying(false);
    setCurrentSentenceIdx(0);
  };

  const cycleSpeed = () => {
    const nextRate = rate === 1 ? 1.25 : rate === 1.25 ? 1.5 : 1;
    setRate(nextRate);
    if (isPlaying) {
      speakCurrentSentence(currentSentenceIdx);
    }
  };

  return (
    <div className="p-4 bg-ink text-parchmentDark border-[3px] border-ink shadow-retroLg space-y-3 font-mono">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-700 pb-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-pixelYellow text-ink font-bold">
            <Headphones className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-extrabold text-pixelYellow tracking-wide flex items-center gap-2">
              <span>MONDAY MORNING AUDIO BRIEFING DIGEST</span>
              <span className="text-[9px] bg-electricBlue text-white px-1.5 py-0.2 rounded">
                EXECUTIVE VOICE AI
              </span>
            </h4>
            <span className="text-[10px] text-zinc-400">
              Listen to the 3-minute Monday handover briefing on your commute
            </span>
          </div>
        </div>

        {/* Script Selector Tabs */}
        <div className="flex items-center gap-1.5 text-[11px]">
          {BRIEFING_SCRIPTS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                handleReset();
                setSelectedScriptId(s.id);
              }}
              className={`px-2.5 py-1 border transition-all ${
                selectedScriptId === s.id
                  ? "bg-pixelYellow text-ink border-pixelYellow font-bold"
                  : "bg-zinc-800 text-zinc-300 border-zinc-600 hover:bg-zinc-700"
              }`}
            >
              {s.id === "handover" ? "Executive Summary" : s.id === "account-a" ? "Police Alliance" : "Aldermoor"}
            </button>
          ))}
        </div>
      </div>

      {/* Audio Controls & Animated Waveform */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/90 p-3 border border-zinc-700">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayPause}
            className="w-10 h-10 bg-pixelYellow hover:bg-yellow-400 text-ink border-2 border-white shadow-retro flex items-center justify-center font-bold transition-all"
            title={isPlaying ? "Pause Briefing" : "Play Briefing"}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-ink" /> : <Play className="w-5 h-5 fill-ink ml-0.5" />}
          </button>

          <button
            onClick={handleReset}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-600"
            title="Restart from beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={cycleSpeed}
            className="px-2 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-600 text-xs font-bold"
            title="Adjust Voice Speed"
          >
            {rate}x SPEED
          </button>

          <button
            onClick={() => setMuted(!muted)}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-600"
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Animated Waveform Bars */}
        <div className="flex items-center gap-1 h-6 px-3 bg-zinc-950 border border-zinc-800 rounded">
          {[4, 8, 14, 18, 12, 6, 16, 22, 10, 15, 20, 8, 14, 24, 12, 18, 7, 11].map((h, i) => (
            <span
              key={i}
              className={`w-1 rounded-sm transition-all duration-150 ${
                isPlaying ? "bg-pixelYellow" : "bg-zinc-600"
              }`}
              style={{
                height: isPlaying ? `${Math.max(4, (h * ((i % 3) + 1.2)) % 22)}px` : "4px",
              }}
            />
          ))}
        </div>

        <div className="text-right text-xs">
          <span className="text-zinc-400 block text-[10px]">SECTION PROGRESS</span>
          <strong className="text-pixelYellow">
            {currentSentenceIdx + 1} of {script.narrative.length} paragraphs
          </strong>
        </div>
      </div>

      {/* Live Synced Sentence Teleprompter */}
      <div className="p-3 bg-zinc-950 border border-zinc-800 text-xs leading-relaxed text-zinc-300 min-h-[48px] flex items-center">
        <div className="flex items-start gap-2">
          <Radio className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${isPlaying ? "text-pixelYellow animate-pulse" : "text-zinc-600"}`} />
          <p className="italic">
            <span className="text-pixelYellow font-bold not-italic mr-1.5">
              [{isPlaying ? "SPEAKING" : "READY"}]:
            </span>
            "{script.narrative[currentSentenceIdx]}"
          </p>
        </div>
      </div>
    </div>
  );
}
