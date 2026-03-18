"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { exercises, BODY_PARTS, BodyPart } from "@/lib/exercises";
import Navigation from "@/components/Navigation";
import { Search, ChevronRight } from "lucide-react";

function LibraryContent() {
  const router = useRouter();
  const params = useSearchParams();
  const initialPart = params.get("part") as BodyPart | null;

  const [activePart, setActivePart] = useState<BodyPart | "all">(initialPart || "all");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const filtered = exercises.filter(e => {
    const matchesPart = activePart === "all" || e.bodyPart === activePart;
    const matchesSearch = search === "" ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.musclesWorked.some(m => m.toLowerCase().includes(search.toLowerCase()));
    return matchesPart && matchesSearch;
  });

  const difficultyColors: Record<string, string> = {
    "débutant": "#22c55e",
    "intermédiaire": "#eab308",
    "avancé": "#ef4444",
  };

  return (
    <main className="min-h-screen bg-animated pb-28 safe-top">
      <div
        className="flex flex-col gap-4 px-4 pt-6 transition-all duration-500"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)" }}
      >
        <h1 className="text-2xl font-bold text-white">📚 Bibliothèque</h1>

        {/* Search */}
        <div className="glass rounded-2xl flex items-center gap-3 px-4 py-3">
          <Search size={18} color="rgba(255,255,255,0.3)" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un exercice..."
            className="flex-1 bg-transparent text-white outline-none placeholder:text-white/30 text-sm"
          />
        </div>

        {/* Body part filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          <button
            onClick={() => setActivePart("all")}
            className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: activePart === "all" ? "linear-gradient(135deg, #22c55e, #16a34a)" : "rgba(255,255,255,0.06)",
              color: activePart === "all" ? "white" : "rgba(255,255,255,0.5)",
              border: activePart === "all" ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(255,255,255,0.06)",
            }}
          >
            Tous
          </button>
          {(Object.entries(BODY_PARTS) as [BodyPart, { label: string; emoji: string }][]).map(([key, part]) => (
            <button
              key={key}
              onClick={() => setActivePart(key)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: activePart === key ? "linear-gradient(135deg, #22c55e, #16a34a)" : "rgba(255,255,255,0.06)",
                color: activePart === key ? "white" : "rgba(255,255,255,0.5)",
                border: activePart === key ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span>{part.emoji}</span>
              <span>{part.label}</span>
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-white/40 text-sm">{filtered.length} exercice{filtered.length > 1 ? "s" : ""}</p>

        {/* Exercise list */}
        <div className="flex flex-col gap-3">
          {filtered.map(exercise => {
            const part = BODY_PARTS[exercise.bodyPart as keyof typeof BODY_PARTS];
            return (
              <button
                key={exercise.id}
                onClick={() => router.push(`/library/${exercise.id}`)}
                className="glass rounded-2xl p-4 flex items-center gap-4 text-left card-hover w-full"
              >
                {/* Image preview */}
                <div
                  className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  {exercise.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={exercise.images[0].url}
                      alt={exercise.name}
                      className="w-full h-full object-contain"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <span className="text-3xl">{part?.emoji}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold text-sm truncate">{exercise.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-xs px-2 py-0.5 rounded-lg"
                      style={{
                        background: `${difficultyColors[exercise.difficulty]}20`,
                        color: difficultyColors[exercise.difficulty],
                      }}
                    >
                      {exercise.difficulty}
                    </span>
                    <span className="text-xs text-white/40">{part?.emoji} {part?.label}</span>
                    <span className="text-xs text-white/40">{exercise.sets}×{exercise.reps}</span>
                  </div>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {exercise.musclesWorked.slice(0, 2).map(m => (
                      <span key={m} className="text-xs text-white/30 glass px-2 py-0.5 rounded-lg">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">🔍</p>
            <p className="text-white/50">Aucun exercice trouvé</p>
          </div>
        )}
      </div>
      <Navigation />
    </main>
  );
}

export default function LibraryPage() {
  return (
    <Suspense>
      <LibraryContent />
    </Suspense>
  );
}
