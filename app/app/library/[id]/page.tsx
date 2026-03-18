"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getExerciseById, BODY_PARTS } from "@/lib/exercises";
import { ChevronLeft, Zap } from "lucide-react";

export default function ExerciseDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [imageIndex, setImageIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  const exercise = getExerciseById(id);

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
  }, []);

  useEffect(() => {
    if (!exercise?.images?.length) return;
    const t = setInterval(() => {
      setImageIndex(i => (i + 1) % exercise.images.length);
    }, 2500);
    return () => clearInterval(t);
  }, [exercise]);

  if (!exercise) {
    return (
      <main className="min-h-screen bg-animated flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-2">😕</p>
          <p className="text-white/60">Exercice introuvable</p>
          <button onClick={() => router.back()} className="btn-primary mt-4 px-6 py-3" style={{ borderRadius: 14 }}>
            Retour
          </button>
        </div>
      </main>
    );
  }

  const part = BODY_PARTS[exercise.bodyPart as keyof typeof BODY_PARTS];
  const difficultyColor = exercise.difficulty === "débutant" ? "#22c55e" : exercise.difficulty === "intermédiaire" ? "#eab308" : "#ef4444";

  return (
    <main className="min-h-screen bg-animated safe-top pb-8">
      <div
        className="flex flex-col transition-all duration-500"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {/* Hero image */}
        <div className="relative w-full" style={{ height: 300 }}>
          <div className="absolute inset-0" style={{ background: "rgba(255,255,255,0.03)" }}>
            {exercise.images[imageIndex] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={exercise.images[imageIndex].url}
                alt={exercise.images[imageIndex].caption}
                className="w-full h-full object-contain"
                onError={e => {
                  (e.target as HTMLImageElement).parentElement!.style.background = "rgba(34,197,94,0.05)";
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
          </div>
          {exercise.images.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(34,197,94,0.05)" }}>
              <span className="text-8xl">{part?.emoji}</span>
            </div>
          )}

          {/* Image indicators */}
          {exercise.images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
              {exercise.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImageIndex(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === imageIndex ? 20 : 6,
                    height: 6,
                    background: i === imageIndex ? "#22c55e" : "rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </div>
          )}

          {/* Back button overlay */}
          <button
            onClick={() => router.back()}
            className="absolute top-5 left-4 p-2 rounded-xl"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
          >
            <ChevronLeft size={22} color="white" />
          </button>

          {/* Caption */}
          {exercise.images[imageIndex]?.caption && (
            <div
              className="absolute bottom-0 left-0 right-0 px-4 py-6 text-center"
              style={{ background: "linear-gradient(to top, rgba(8,8,8,0.9), transparent)" }}
            >
              <p className="text-white/60 text-xs">{exercise.images[imageIndex].caption}</p>
            </div>
          )}
        </div>

        <div className="px-4 flex flex-col gap-5 pt-5">
          {/* Title & badges */}
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h1 className="text-2xl font-black text-white flex-1">{exercise.name}</h1>
              <span
                className="text-xs px-3 py-1.5 rounded-xl flex-shrink-0 font-semibold"
                style={{ background: `${difficultyColor}20`, color: difficultyColor }}
              >
                {exercise.difficulty}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-white/50">{part?.emoji} {part?.label}</span>
              <span className="text-white/20">•</span>
              <span className="text-sm text-white/50">{exercise.sets} séries × {exercise.reps} reps</span>
              <span className="text-white/20">•</span>
              <span className="text-sm text-white/50">{exercise.restTime}s repos</span>
            </div>
          </div>

          {/* Description */}
          <div className="glass rounded-2xl p-4">
            <p className="text-white/70 text-sm leading-relaxed">{exercise.description}</p>
          </div>

          {/* Muscles */}
          <div className="glass rounded-2xl p-4">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-3">Muscles sollicités</p>
            <div className="flex gap-2 flex-wrap">
              {exercise.musclesWorked.map(m => (
                <span
                  key={m}
                  className="text-sm px-3 py-1.5 rounded-xl"
                  style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="glass rounded-2xl p-4">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-4">Comment faire</p>
            <ol className="space-y-3">
              {exercise.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-white/70">
                  <span
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                    style={{ background: "rgba(34,197,94,0.2)", color: "#22c55e" }}
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          {exercise.tips.length > 0 && (
            <div
              className="rounded-2xl p-4"
              style={{ background: "rgba(234,179,8,0.06)", border: "1px solid rgba(234,179,8,0.15)" }}
            >
              <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wide mb-3">💡 Conseils du coach</p>
              <ul className="space-y-2">
                {exercise.tips.map((tip, i) => (
                  <li key={i} className="text-white/70 text-sm flex gap-2">
                    <span className="text-yellow-400 flex-shrink-0">▸</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          <div className="flex gap-2 flex-wrap pb-4">
            {exercise.tags.map(tag => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => router.push(`/session/start?bodyPart=${exercise.bodyPart}`)}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2 font-bold text-lg mb-4"
            style={{ borderRadius: 18 }}
          >
            <Zap size={20} fill="white" />
            S&apos;entraîner maintenant
          </button>
        </div>
      </div>
    </main>
  );
}
