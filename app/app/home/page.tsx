"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, computeStats, getRecentSessions } from "@/lib/storage";
import { BODY_PARTS } from "@/lib/exercises";
import Navigation from "@/components/Navigation";
import BodyformLogo from "@/components/BodyformLogo";
import { Zap, Trophy, Flame, Clock, ChevronRight } from "lucide-react";

const MOTIVATIONS = [
  "Prêt à dépasser tes limites aujourd'hui ?",
  "Chaque séance est une victoire. Lance-toi !",
  "Ton corps est ton équipement. Utilise-le !",
  "Pas d'excuses. Juste du résultat.",
  "La régularité bat l'intensité. Reviens. Toujours.",
];

export default function HomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(getProfile());
  const [stats, setStats] = useState(computeStats());
  const [recentSessions, setRecentSessions] = useState(getRecentSessions(7));
  const [phrase] = useState(() => MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getProfile()?.onboardingComplete) {
      router.replace("/onboarding");
      return;
    }
    setProfile(getProfile());
    setStats(computeStats());
    setRecentSessions(getRecentSessions(7));
    setTimeout(() => setVisible(true), 80);
  }, [router]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <main className="min-h-screen bg-animated pb-28 safe-top">
      <div
        className="flex flex-col gap-5 px-4 pt-6 transition-all duration-500"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/50 text-sm">{greeting},</p>
            <h1 className="text-2xl font-bold text-white">
              {profile?.name || "Champion"} 💪
            </h1>
          </div>
          <BodyformLogo size="sm" src="/logo.mp4" />
        </div>

        {/* Phrase motivante */}
        <div
          className="rounded-2xl px-5 py-4"
          style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.15)" }}
        >
          <p className="text-white/80 text-sm leading-relaxed italic">&ldquo;{phrase}&rdquo;</p>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Flame, label: "Streak", value: `${stats.streak}j`, color: "#f43f5e" },
            { icon: Trophy, label: "Sessions", value: stats.totalSessions, color: "#eab308" },
            { icon: Clock, label: "Cette semaine", value: `${stats.thisWeekSessions}`, color: "#22c55e" },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass rounded-2xl p-3 flex flex-col items-center gap-1">
                <Icon size={18} color={stat.color} />
                <p className="text-white font-bold text-lg leading-none">{stat.value}</p>
                <p className="text-white/40 text-xs">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* CTA principale */}
        <button
          onClick={() => router.push("/session/start")}
          className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-lg font-bold"
          style={{ borderRadius: 20 }}
        >
          <Zap size={22} fill="white" />
          Lancer une session
        </button>

        {/* Session surprise */}
        <button
          onClick={() => router.push("/session/start?surprise=true")}
          className="w-full py-4 flex items-center justify-center gap-2 font-semibold"
          style={{
            background: "rgba(37,99,235,0.1)",
            border: "1px solid rgba(37,99,235,0.25)",
            borderRadius: 18,
            color: "#3b82f6",
          }}
        >
          🎲 Session Surprise
        </button>

        {/* Zones du corps */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold">Zones d&apos;entraînement</h2>
            <button onClick={() => router.push("/library")} className="text-xs text-blue-400">
              Voir tout
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(BODY_PARTS) as [string, { label: string; emoji: string; color: string }][]).map(([key, part]) => {
              const count = stats.bodyPartCounts[key] || 0;
              return (
                <button
                  key={key}
                  onClick={() => router.push(`/library?part=${key}`)}
                  className="glass rounded-2xl p-4 flex items-center gap-3 text-left card-hover"
                >
                  <span className="text-2xl">{part.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{part.label}</p>
                    <p className="text-white/40 text-xs">{count} session{count > 1 ? "s" : ""}</p>
                  </div>
                  <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Sessions récentes */}
        {recentSessions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold">Sessions récentes</h2>
              <button onClick={() => router.push("/progress")} className="text-xs text-blue-400">
                Historique
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {recentSessions.slice(0, 3).map(session => {
                const part = BODY_PARTS[session.bodyPart as keyof typeof BODY_PARTS];
                const date = new Date(session.date);
                return (
                  <div key={session.id} className="glass rounded-xl px-4 py-3 flex items-center gap-3">
                    <span className="text-xl">{part?.emoji || "⚡"}</span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{part?.label || session.bodyPart}</p>
                      <p className="text-white/40 text-xs">
                        {date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })} • {session.duration} min
                      </p>
                    </div>
                    {session.isSurprise && (
                      <span className="text-xs text-blue-400 glass-blue px-2 py-1 rounded-lg">🎲 Surprise</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {recentSessions.length === 0 && (
          <div className="glass rounded-2xl p-6 text-center">
            <p className="text-3xl mb-2">🏁</p>
            <p className="text-white font-semibold">Première session !</p>
            <p className="text-white/50 text-sm mt-1">Lance ta première session pour commencer ton aventure.</p>
          </div>
        )}
      </div>
      <Navigation />
    </main>
  );
}
