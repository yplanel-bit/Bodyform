"use client";

import { useEffect, useState } from "react";
import { computeStats, getSessions, getRecentSessions } from "@/lib/storage";
import { BODY_PARTS } from "@/lib/exercises";
import Navigation from "@/components/Navigation";
import { Trophy, Flame, Clock, BarChart2 } from "lucide-react";

export default function ProgressPage() {
  const [stats, setStats] = useState(computeStats());
  const [sessions, setSessions] = useState(getSessions());
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setStats(computeStats());
    setSessions(getSessions());
    setTimeout(() => setVisible(true), 80);
  }, []);

  const totalHours = Math.floor(stats.totalMinutes / 60);
  const totalMins = stats.totalMinutes % 60;

  const bodyPartEntries = Object.entries(stats.bodyPartCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(...Object.values(stats.bodyPartCounts), 1);

  const recentWeeks = stats.weeklySessions;
  const maxWeekSessions = Math.max(...recentWeeks.map(w => w.count), 1);

  return (
    <main className="min-h-screen bg-animated pb-28 safe-top">
      <div
        className="flex flex-col gap-5 px-4 pt-6 transition-all duration-500"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)" }}
      >
        <h1 className="text-2xl font-bold text-white">📊 Ma Progression</h1>

        {/* Key stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Trophy, label: "Total sessions", value: stats.totalSessions, color: "#eab308", unit: "" },
            { icon: Flame, label: "Série actuelle", value: stats.streak, color: "#f43f5e", unit: "jours" },
            { icon: Clock, label: "Temps total", value: `${totalHours}h${totalMins > 0 ? totalMins + "m" : ""}`, color: "#22c55e", unit: "" },
            { icon: BarChart2, label: "Ce mois", value: stats.thisMonthSessions, color: "#2563eb", unit: "sessions" },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass rounded-2xl p-4 flex flex-col gap-2">
                <Icon size={20} color={stat.color} />
                <p className="text-2xl font-black text-white">{stat.value} <span className="text-sm font-normal text-white/40">{stat.unit}</span></p>
                <p className="text-white/50 text-xs">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Weekly chart */}
        <div className="glass rounded-2xl p-5">
          <p className="text-white font-semibold mb-4">Sessions par semaine</p>
          <div className="flex items-end gap-3 h-28">
            {recentWeeks.map((week, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <p className="text-white text-sm font-bold">{week.count}</p>
                <div
                  className="w-full rounded-t-xl transition-all duration-700"
                  style={{
                    height: `${(week.count / maxWeekSessions) * 80}px`,
                    minHeight: week.count > 0 ? 8 : 2,
                    background: i === recentWeeks.length - 1
                      ? "linear-gradient(135deg, #22c55e, #16a34a)"
                      : "rgba(255,255,255,0.1)",
                  }}
                />
                <p className="text-xs text-white/40">{i === recentWeeks.length - 1 ? "Cette sem." : week.week}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Body part distribution */}
        {bodyPartEntries.length > 0 && (
          <div className="glass rounded-2xl p-5">
            <p className="text-white font-semibold mb-4">Zones travaillées</p>
            <div className="flex flex-col gap-3">
              {bodyPartEntries.map(([key, count]) => {
                const part = BODY_PARTS[key as keyof typeof BODY_PARTS];
                if (!part) return null;
                const pct = (count / maxCount) * 100;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-lg w-6 flex-shrink-0">{part.emoji}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-white/70 text-xs">{part.label}</span>
                        <span className="text-white/50 text-xs">{count} session{count > 1 ? "s" : ""}</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div
                          className="progress-bar h-2 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Session history */}
        <div>
          <h2 className="text-white font-semibold mb-3">Historique</h2>
          {sessions.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-3xl mb-2">🏁</p>
              <p className="text-white/50">Aucune session enregistrée encore.</p>
              <p className="text-white/30 text-sm mt-1">Lance ta première session pour voir ton historique ici.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {sessions.slice(0, 20).map(session => {
                const part = BODY_PARTS[session.bodyPart as keyof typeof BODY_PARTS];
                const date = new Date(session.date);
                const totalReps = Object.values(session.completedReps || {}).flat().reduce((a, b) => a + b, 0);
                return (
                  <div key={session.id} className="glass rounded-2xl px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{part?.emoji || "⚡"}</span>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {part?.label || session.bodyPart}
                            {session.isSurprise && (
                              <span className="ml-2 text-xs text-blue-400 glass-blue px-1.5 py-0.5 rounded-lg">🎲</span>
                            )}
                          </p>
                          <p className="text-white/40 text-xs">
                            {date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-white text-sm font-semibold">{session.duration} min</p>
                        {totalReps > 0 && <p className="text-white/40 text-xs">{totalReps} reps</p>}
                      </div>
                    </div>
                    {/* Fatigue indicator */}
                    <div className="flex items-center gap-1 mt-2">
                      {[1,2,3,4,5].map(i => (
                        <div
                          key={i}
                          className="h-1 flex-1 rounded-full"
                          style={{
                            background: i <= session.fatigue ? "#22c55e" : "rgba(255,255,255,0.08)"
                          }}
                        />
                      ))}
                      <span className="text-xs text-white/30 ml-2">Forme</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Navigation />
    </main>
  );
}
