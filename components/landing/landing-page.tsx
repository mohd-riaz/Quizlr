"use client";

import { useState, useEffect } from "react";
import { Nav } from "./nav";
import { HeroSection } from "./hero-section";
import { HowItWorks } from "./how-it-works";
import { FeaturesBento } from "./features-bento";
import { AiDemoSection } from "./ai-demo-section";
import { StatsSection } from "./stats-section";
import { CtaSection } from "./cta-section";
import { Footer } from "./footer";

// ── Constants ────────────────────────────────────────────────────────────────

const PLAYER_COLORS = [
  "oklch(0.75 0.14 65)", "oklch(0.7 0.16 145)", "oklch(0.7 0.16 255)",
  "oklch(0.7 0.16 25)", "oklch(0.7 0.14 85)", "oklch(0.7 0.16 320)",
];
const FLOAT_NAMES = [
  { n: "Priya", c: "oklch(0.75 0.14 65)" },
  { n: "Sol",   c: "oklch(0.7 0.16 255)" },
  { n: "Ines",  c: "oklch(0.7 0.16 25)"  },
  { n: "Alex",  c: "oklch(0.7 0.14 85)"  },
  { n: "Ravi",  c: "oklch(0.7 0.16 145)" },
  { n: "Mika",  c: "oklch(0.7 0.16 320)" },
];
const TYPING_PHRASES = ["The history of coffee", "World capitals · hard", "React 19 trivia", "The Apollo program"];
const AI_TOPICS = [
  "The Apollo program, 1961 to 1972",
  "Jazz history from bebop to fusion",
  "The periodic table · noble gases",
  "World capitals · Europe only",
];
type Player = { name: string; color: string; score: number; id: number };

function initPlayers(): Player[] {
  return ["Priya", "Jordan", "Mika", "Sol", "Ines", "Alex"].map((name, i) => ({
    name,
    color: PLAYER_COLORS[i % PLAYER_COLORS.length],
    score: 2800 - i * 130,
    id: i,
  }));
}

// ── Component ────────────────────────────────────────────────────────────────

export function LandingPage() {
  const [timer, setTimer]                 = useState(12);
  const [answeredCount, setAnsweredCount] = useState(23);
  const [players, setPlayers]             = useState<Player[]>(initPlayers);
  const [lbUpdated, setLbUpdated]         = useState("updated 0.3s ago");
  const [floatIdx, setFloatIdx]           = useState(0);
  const [floatVisible, setFloatVisible]   = useState(true);
  const [floatTotal, setFloatTotal]       = useState(24);
  const [sparkData, setSparkData]         = useState<number[]>(() => Array.from({ length: 30 }, () => 0.5));
  const [aps, setAps]                     = useState(42);
  const [step1Text, setStep1Text]         = useState("");
  const [aiTopicText, setAiTopicText]     = useState("");

  // Timer countdown
  useEffect(() => {
    const id = setInterval(() => {
      setTimer((t) => {
        const next = t - 1 < 0 ? 18 : t - 1;
        if (next === 18) setAnsweredCount(6);
        return next;
      });
      setAnsweredCount((c) => (c < 24 && Math.random() > 0.3 ? c + 1 : c));
    }, 900);
    return () => clearInterval(id);
  }, []);

  // Leaderboard shuffling
  useEffect(() => {
    const lastUpdate = { t: Date.now() };
    const scoreId = setInterval(() => {
      setPlayers((prev) => {
        const idx = Math.floor(Math.random() * prev.length);
        const next = prev.map((p, i) =>
          i === idx ? { ...p, score: p.score + Math.floor(Math.random() * 180) + 20 } : p
        );
        return [...next].sort((a, b) => b.score - a.score);
      });
      lastUpdate.t = Date.now();
    }, 2400);
    const lbId = setInterval(() => {
      const s = Math.max(0.1, (Date.now() - lastUpdate.t) / 1000).toFixed(1);
      setLbUpdated(`updated ${s}s ago`);
    }, 200);
    return () => { clearInterval(scoreId); clearInterval(lbId); };
  }, []);

  // Floating join chip
  useEffect(() => {
    const id = setInterval(() => {
      setFloatVisible(false);
      const t = setTimeout(() => {
        setFloatIdx((i) => (i + 1) % FLOAT_NAMES.length);
        setFloatTotal(20 + Math.floor(Math.random() * 8));
        setFloatVisible(true);
      }, 200);
      return () => clearTimeout(t);
    }, 3600);
    return () => clearInterval(id);
  }, []);

  // Sparkline
  useEffect(() => {
    const id = setInterval(() => {
      setSparkData((d) => [...d.slice(1), 0.25 + Math.random() * 0.75]);
      setAps(Math.floor(25 + Math.random() * 40));
    }, 900);
    return () => clearInterval(id);
  }, []);

  // Step 1 typing
  useEffect(() => {
    let pi = 0, ci = 0, del = false;
    let t: ReturnType<typeof setTimeout>;
    function tick() {
      const cur = TYPING_PHRASES[pi];
      if (!del) { ci++; setStep1Text(cur.slice(0, ci)); if (ci === cur.length) { del = true; t = setTimeout(tick, 1400); return; } }
      else { ci--; setStep1Text(cur.slice(0, ci)); if (ci === 0) { del = false; pi = (pi + 1) % TYPING_PHRASES.length; } }
      t = setTimeout(tick, del ? 30 : 60 + Math.random() * 40);
    }
    t = setTimeout(tick, 300);
    return () => clearTimeout(t);
  }, []);

  // AI topic typing
  useEffect(() => {
    let ai = 0, ac = 0, ad = false;
    let t: ReturnType<typeof setTimeout>;
    function tick() {
      const cur = AI_TOPICS[ai];
      if (!ad) { ac++; setAiTopicText(cur.slice(0, ac)); if (ac === cur.length) { ad = true; t = setTimeout(tick, 2200); return; } }
      else { ac--; setAiTopicText(cur.slice(0, ac)); if (ac === 0) { ad = false; ai = (ai + 1) % AI_TOPICS.length; } }
      t = setTimeout(tick, ad ? 22 : 55 + Math.random() * 40);
    }
    t = setTimeout(tick, 300);
    return () => clearTimeout(t);
  }, []);

  const floatPerson = FLOAT_NAMES[floatIdx];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <HeroSection
        timer={timer}
        answeredCount={answeredCount}
        players={players}
        lbUpdated={lbUpdated}
        floatVisible={floatVisible}
        floatName={floatPerson.n}
        floatColor={floatPerson.c}
        floatTotal={floatTotal}
      />
      <HowItWorks step1Text={step1Text} />
      <FeaturesBento sparkData={sparkData} aps={aps} />
      <AiDemoSection aiTopicText={aiTopicText} />
      <StatsSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
