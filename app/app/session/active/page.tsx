"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { exercises, getExerciseById, BODY_PARTS, Exercise } from "@/lib/exercises";
import { saveSession } from "@/lib/storage";
import { ChevronRight, ChevronLeft, Pause, Play, Check, X } from "lucide-react";
import Image from "next/image";

function buildSession(bodyPart: string, durationMin: number, fatigue: number): Exercise[] {
  const difficulty = fatigue <= 2 ? "débutant" : fatigue === 3 ? "intermédiaire" : undefined;

  let pool = exercises.filter(e => {
    if (bodyPart === "full") return true;
    return e.bodyPart === bodyPart || e.bodyPart === "full";
  });

  if (difficulty) {
    const filtered = pool.filter(e => e.difficulty === difficulty);
    if (filtered.length > 0) pool = filtered;
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  // Estimate exercises fitting in time
  const avgTime = 3; // minutes per exercise (set + rest)
  const count = Math.max(3, Math.min(Math.floor(durationMin / avgTime), shuffled.length, 8));
  return shuffled.slice(0, count);
}

function ActiveSessionContent() {
  const router = useRouter();
  const params = useSearchParams();

  const bodyPart = params.get("bodyPart") || "full";
  const duration = parseInt(params.get("duration") || "30");
  const fatigue = parseInt(params.get("fatigue") || "3");
  const isSurprise = params.get("surprise") === "true";

  const [sessionExercises] = useState(() => buildSession(bodyPart, duration, fatigue));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [completedReps, setCompletedReps] = useState<Record<string, number[]>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [startTime] = useState(Date.now());
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const current = sessionExercises[currentIndex];

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && !isFinished) setSessionTime(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isFinished]);

  // Rest countdown
  useEffect(() => {
    if (!isResting || isPaused) return;
    if (restTimer <= 0) { setIsResting(false); return; }
    const t = setTimeout(() => setRestTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [isResting, restTimer, isPaused]);

  // Image carousel
  useEffect(() => {
    if (!current?.images?.length) return;
    const t = setInterval(() => {
      setCurrentImageIndex(i => (i + 1) % current.images.length);
    }, 2500);
    return () => clearInterval(t);
  }, [current]);

  const handleSetDone = useCallback((reps: number) => {
    const id = current.id;
    const newCompleted = {
      ...completedReps,
      [id]: [...(completedReps[id] || []), reps],
    };
    setCompletedReps(newCompleted);

    if (currentSet < current.sets) {
      setCurrentSet(s => s + 1);
      setRestTimer(current.restTime);
      setIsResting(true);
    } else {
      // Move to next exercise
      if (currentIndex < sessionExercises.length - 1) {
        setCurrentIndex(i => i + 1);
        setCurrentSet(1);
        setCurrentImageIndex(0);
        setRestTimer(60);
        setIsResting(true);
      } else {
        setIsFinished(true);
        // Save session
        const elapsed = Math.round((Date.now() - startTime) / 60000);
        saveSession({
          id: `session_${Date.now()}`,
          date: new Date().toISOString(),
          duration: elapsed || 1,
          bodyPart,
          exercises: sessionExercises.map(e => e.id),
          completedReps: newCompleted,
          fatigue,
          notes: "",
          isSurprise,
          totalVolume: Object.values(newCompleted).flat().reduce((a, b) => a + b, 0),
        });
      }
    }
  }, [current, currentSet, currentIndex, sessionExercises, completedReps, bodyPart, fatigue, isSurprise, startTime]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const partInfo = BODY_PARTS[bodyPart as keyof typeof BODY_PARTS];
  const progress = ((currentIndex) / sessionExercises.length) * 100;

  if (isFinished) {
    const totalReps = Object.values(completedReps).flat().reduce((a, b) => a + b, 0);
    return (
      <main className="min-h-screen bg-animated flex flex-col items-center justify-center px-5 text-center gap-6">
        <div className="text-6xl animate-bounce">🏆</div>
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Session terminée !</h1>
          <p className="text-white/60">Excellent travail. Tu peux être fier(e) de toi.</p>
        </div>
        <div className="glass rounded-2xl p-6 w-full max-w-sm">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{formatTime(sessionTime)}</p>
              <p className="text-xs text-white/40">Durée</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{sessionExercises.length}</p>
              <p className="text-xs text-white/40">Exercices</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{totalReps}</p>
              <p className="text-xs text-white/40">Répétitions</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <button onClick={() => router.push("/home")} className="btn-green w-full py-4 font-bold text-lg" style={{ borderRadius: 18 }}>
            🏠 Accueil
          </button>
          <button onClick={() => router.push("/progress")} className="btn-primary w-full py-4 font-bold" style={{ borderRadius: 18 }}>
            📊 Voir ma progression
          </button>
        </div>
      </main>
    );
  }

  if (!current) return null;

  return (
    <main className="min-h-screen bg-animated flex flex-col safe-top">
      <div
        className="flex flex-col flex-1 transition-all duration-500"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {/* Header */}
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => router.push("/home")}
              className="p-2 rounded-xl glass flex items-center gap-1 text-white/60 text-sm"
            >
              <X size={16} /> Quitter
            </button>
            <div className="text-center">
              <p className="text-white font-bold">{formatTime(sessionTime)}</p>
              <p className="text-white/40 text-xs">{isSurprise ? "🎲 Surprise" : partInfo?.label}</p>
            </div>
            <button
              onClick={() => setIsPaused(p => !p)}
              className="p-2 rounded-xl glass"
            >
              {isPaused ? <Play size={20} color="#22c55e" /> : <Pause size={20} color="white" />}
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="progress-bar h-1.5 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs text-white/40">{currentIndex + 1}/{sessionExercises.length}</span>
          </div>
        </div>

        {/* Rest screen */}
        {isResting ? (
          <div className="flex-1 flex flex-col items-center justify-center px-5 gap-6">
            <div className="glass rounded-3xl p-8 text-center w-full max-w-sm">
              <p className="text-white/60 mb-2">Temps de repos</p>
              <p className="text-7xl font-black text-white mb-2">{restTimer}</p>
              <p className="text-white/40 text-sm">secondes</p>
            </div>
            <p className="text-white/60 text-center text-sm">
              Prochain : {sessionExercises[currentIndex]?.name}
            </p>
            <button
              onClick={() => setIsResting(false)}
              className="btn-green px-8 py-3 font-bold"
              style={{ borderRadius: 16 }}
            >
              Passer ▸
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Exercise images */}
            <div className="relative w-full" style={{ height: 260 }}>
              <div
                className="absolute inset-0"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                {current.images[currentImageIndex] && (
                  <div className="relative w-full h-full">
                    <Image
                      src={current.images[currentImageIndex].url}
                      alt={current.images[currentImageIndex].caption}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
                <div
                  className="absolute bottom-0 left-0 right-0 px-4 py-3"
                  style={{ background: "linear-gradient(to top, rgba(8,8,8,0.9), transparent)" }}
                >
                  <p className="text-white/70 text-xs text-center">
                    {current.images[currentImageIndex]?.caption}
                  </p>
                  {current.images.length > 1 && (
                    <div className="flex justify-center gap-1 mt-1">
                      {current.images.map((_, i) => (
                        <div
                          key={i}
                          className="rounded-full transition-all"
                          style={{
                            width: i === currentImageIndex ? 16 : 4,
                            height: 4,
                            background: i === currentImageIndex ? "#22c55e" : "rgba(255,255,255,0.2)",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Exercise info */}
            <div className="px-4 flex flex-col gap-4 py-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-xl font-bold text-white flex-1">{current.name}</h2>
                  <span
                    className="text-xs px-2 py-1 rounded-lg flex-shrink-0"
                    style={{
                      background: current.difficulty === "débutant" ? "rgba(34,197,94,0.15)" : current.difficulty === "intermédiaire" ? "rgba(234,179,8,0.15)" : "rgba(239,68,68,0.15)",
                      color: current.difficulty === "débutant" ? "#22c55e" : current.difficulty === "intermédiaire" ? "#eab308" : "#ef4444",
                    }}
                  >
                    {current.difficulty}
                  </span>
                </div>
                <p className="text-white/50 text-sm mt-1">{current.description}</p>
              </div>

              {/* Set info */}
              <div className="glass-green rounded-2xl p-4 flex items-center justify-between">
                <div className="text-center">
                  <p className="text-3xl font-black text-white">{currentSet}</p>
                  <p className="text-white/40 text-xs">sur {current.sets}</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-black text-green-400">{current.reps}</p>
                  <p className="text-white/40 text-xs">répétitions</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-xl font-black text-blue-400">{current.restTime}s</p>
                  <p className="text-white/40 text-xs">repos</p>
                </div>
              </div>

              {/* Steps */}
              <div className="glass rounded-2xl p-4">
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-3">Exécution</p>
                <ol className="space-y-2">
                  {current.steps.map((step, i) => (
                    <li key={i} className="flex gap-2 text-sm text-white/70">
                      <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              {current.tips.length > 0 && (
                <div className="glass rounded-2xl p-4" style={{ background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.15)" }}>
                  <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wide mb-2">💡 Conseils</p>
                  <ul className="space-y-1">
                    {current.tips.map((tip, i) => (
                      <li key={i} className="text-white/60 text-xs">• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mark set done */}
              <div className="pb-6">
                <p className="text-white/40 text-xs text-center mb-3">Combien de répétitions tu as fait ?</p>
                <div className="flex gap-2 justify-center flex-wrap mb-4">
                  {["5", "8", "10", "12", "15", "20"].map(r => (
                    <button
                      key={r}
                      onClick={() => handleSetDone(parseInt(r))}
                      className="w-12 h-12 rounded-xl font-bold text-white transition-all"
                      style={{
                        background: "rgba(37,99,235,0.2)",
                        border: "1px solid rgba(37,99,235,0.3)",
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleSetDone(parseInt(current.reps.split("-")[0] || "10"))}
                  className="btn-primary w-full py-4 flex items-center justify-center gap-2 font-bold text-lg"
                  style={{ borderRadius: 18 }}
                >
                  <Check size={22} /> Série terminée !
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ActiveSessionPage() {
  return (
    <Suspense>
      <ActiveSessionContent />
    </Suspense>
  );
}
