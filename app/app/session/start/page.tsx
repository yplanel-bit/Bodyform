"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProfile, selectSurpriseBodyPart, getLeastTrainedBodyPart } from "@/lib/storage";
import { BODY_PARTS } from "@/lib/exercises";
import { ChevronRight, Zap } from "lucide-react";
import BodyformLogo from "@/components/BodyformLogo";

function PreSessionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSurprise = searchParams.get("surprise") === "true";
  const profile = getProfile();

  const [fatigue, setFatigue] = useState(3);
  const [duration, setDuration] = useState(profile?.sessionDuration || 30);
  const [bodyPartMode, setBodyPartMode] = useState<"choose" | "auto" | "surprise">(
    isSurprise ? "surprise" : "auto"
  );
  const [selectedPart, setSelectedPart] = useState("full");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
  }, []);

  const handleStart = () => {
    let targetPart = selectedPart;
    if (bodyPartMode === "auto") {
      targetPart = getLeastTrainedBodyPart(profile?.preferredBodyParts || ["full"]);
    } else if (bodyPartMode === "surprise" && profile) {
      targetPart = selectSurpriseBodyPart(profile);
    }

    const params = new URLSearchParams({
      bodyPart: targetPart,
      duration: String(duration),
      fatigue: String(fatigue),
      surprise: String(bodyPartMode === "surprise"),
    });
    router.push(`/session/active?${params.toString()}`);
  };

  const fatigueLabels = ["", "Épuisé 😴", "Fatigué 😓", "Normal 😐", "En forme ⚡", "Au top 🔥"];
  const fatigueColors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#4ade80"];

  return (
    <main className="min-h-screen bg-animated px-5 py-8 safe-top safe-bottom">
      <div
        className="flex flex-col gap-5 max-w-md mx-auto transition-all duration-500"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)" }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            {isSurprise ? "🎲 Session Surprise" : "Configurer la session"}
          </h1>
          <BodyformLogo size="sm" />
        </div>

        {/* Fatigue du jour */}
        <div className="glass rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4">Comment tu te sens aujourd&apos;hui ?</h2>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-2xl">{fatigueLabels[fatigue].split(" ")[1]}</span>
              <span className="font-bold" style={{ color: fatigueColors[fatigue] }}>
                {fatigueLabels[fatigue].split(" ")[0]}
              </span>
            </div>
            <input
              type="range" min={1} max={5} value={fatigue}
              onChange={e => setFatigue(+e.target.value)}
              className="w-full"
              style={{ accentColor: fatigueColors[fatigue] }}
            />
            <div className="flex justify-between text-xs text-white/30">
              <span>Épuisé</span>
              <span>Au top</span>
            </div>
          </div>
          {fatigue <= 2 && (
            <div className="mt-3 rounded-xl px-4 py-3" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <p className="text-red-400 text-sm">⚠️ Session légère recommandée. Le repos est aussi un entraînement.</p>
            </div>
          )}
        </div>

        {/* Durée */}
        <div className="glass rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4">
            Temps disponible : <span className="text-green-400">{duration} min</span>
          </h2>
          <input
            type="range" min={10} max={90} step={5} value={duration}
            onChange={e => setDuration(+e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-white/30 mt-1">
            <span>10 min</span>
            <span>90 min</span>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {[15, 30, 45, 60].map(d => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className="px-3 py-1 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: duration === d ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${duration === d ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.06)"}`,
                  color: duration === d ? "#22c55e" : "rgba(255,255,255,0.4)",
                }}
              >
                {d} min
              </button>
            ))}
          </div>
        </div>

        {/* Zone du corps */}
        <div className="glass rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4">Partie du corps</h2>
          <div className="flex flex-col gap-3">
            {[
              { value: "auto", label: "Décider automatiquement", desc: "Bodyform choisit selon ton historique", emoji: "🤖" },
              { value: "surprise", label: "Session Surprise 🎲", desc: "Exercices inattendus pour casser la routine", emoji: "🎲" },
              { value: "choose", label: "Je choisis", desc: "Tu sélectionnes la zone à travailler", emoji: "👆" },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setBodyPartMode(opt.value as typeof bodyPartMode)}
                className="rounded-xl p-3 text-left transition-all flex items-center gap-3"
                style={{
                  background: bodyPartMode === opt.value ? "rgba(37,99,235,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${bodyPartMode === opt.value ? "rgba(37,99,235,0.4)" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                <span className="text-xl">{opt.emoji}</span>
                <div>
                  <p className="text-white text-sm font-medium">{opt.label}</p>
                  <p className="text-white/40 text-xs">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {bodyPartMode === "choose" && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {(Object.entries(BODY_PARTS) as [string, { label: string; emoji: string }][]).map(([key, part]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPart(key)}
                  className="rounded-xl p-3 flex items-center gap-2 transition-all"
                  style={{
                    background: selectedPart === key ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${selectedPart === key ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  <span>{part.emoji}</span>
                  <span className="text-white text-xs font-medium">{part.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-lg font-bold mt-2"
          style={{ borderRadius: 20 }}
        >
          <Zap size={22} fill="white" />
          Lancer la session
          <ChevronRight size={20} />
        </button>
      </div>
    </main>
  );
}

export default function PreSessionPage() {
  return (
    <Suspense>
      <PreSessionForm />
    </Suspense>
  );
}
