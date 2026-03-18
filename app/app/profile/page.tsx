"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, saveProfile, UserProfile } from "@/lib/storage";
import { BODY_PARTS } from "@/lib/exercises";
import Navigation from "@/components/Navigation";
import BodyformLogo from "@/components/BodyformLogo";
import { Save, RotateCcw, ChevronRight } from "lucide-react";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const GOALS = [
  { id: "strength", label: "Force", emoji: "💪" },
  { id: "muscle", label: "Masse musculaire", emoji: "🏋️" },
  { id: "weightloss", label: "Perte de poids", emoji: "🔥" },
  { id: "flexibility", label: "Souplesse", emoji: "🧘" },
  { id: "endurance", label: "Endurance", emoji: "⚡" },
  { id: "skills", label: "Figures callisthénie", emoji: "🤸" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saved, setSaved] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const p = getProfile();
    if (!p) { router.replace("/onboarding"); return; }
    setProfile(p);
    setTimeout(() => setVisible(true), 80);
  }, [router]);

  const update = (key: keyof UserProfile, value: unknown) => {
    if (!profile) return;
    setProfile({ ...profile, [key]: value });
  };

  const toggleArray = (key: keyof UserProfile, value: string) => {
    if (!profile) return;
    const arr = (profile[key] as string[]) || [];
    const updated = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
    update(key, updated);
  };

  const handleSave = () => {
    if (!profile) return;
    saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm("Réinitialiser tout le profil et l'historique ?")) {
      localStorage.clear();
      router.replace("/");
    }
  };

  if (!profile) return null;

  return (
    <main className="min-h-screen bg-animated pb-28 safe-top">
      <div
        className="flex flex-col gap-5 px-4 pt-6 transition-all duration-500"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Mon Profil</h1>
            <p className="text-white/40 text-sm">Modifie tes informations à tout moment</p>
          </div>
          <BodyformLogo size="sm" src="/logo.mp4" />
        </div>

        {/* Identity */}
        <div className="glass rounded-2xl p-5 flex flex-col gap-4">
          <h2 className="text-white font-semibold">Identité</h2>
          <div>
            <label className="text-white/50 text-xs mb-1 block">Prénom</label>
            <input
              type="text"
              value={profile.name}
              onChange={e => update("name", e.target.value)}
              className="w-full bg-transparent text-white font-semibold text-lg outline-none border-b border-white/10 pb-2"
              placeholder="Ton prénom"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/50 text-xs mb-2 block">Âge : <span className="text-white font-semibold">{profile.age} ans</span></label>
              <input type="range" min={14} max={70} value={profile.age}
                onChange={e => update("age", +e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-2 block">Poids : <span className="text-white font-semibold">{profile.weight} kg</span></label>
              <input type="range" min={40} max={150} value={profile.weight}
                onChange={e => update("weight", +e.target.value)} className="w-full" />
            </div>
          </div>
        </div>

        {/* Fitness level */}
        <div className="glass rounded-2xl p-5 flex flex-col gap-3">
          <h2 className="text-white font-semibold">Niveau</h2>
          <div className="flex gap-2">
            {(["débutant", "intermédiaire", "avancé"] as UserProfile["fitnessLevel"][]).map(level => (
              <button
                key={level}
                onClick={() => update("fitnessLevel", level)}
                className="flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all"
                style={{
                  background: profile.fitnessLevel === level ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${profile.fitnessLevel === level ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.06)"}`,
                  color: profile.fitnessLevel === level ? "#22c55e" : "rgba(255,255,255,0.5)",
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="glass rounded-2xl p-5 flex flex-col gap-3">
          <h2 className="text-white font-semibold">Objectifs</h2>
          <div className="grid grid-cols-2 gap-2">
            {GOALS.map(goal => {
              const selected = (profile.goals || []).includes(goal.id);
              return (
                <button key={goal.id} onClick={() => toggleArray("goals", goal.id)}
                  className="rounded-xl p-3 flex items-center gap-2 transition-all"
                  style={{
                    background: selected ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${selected ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.06)"}`,
                  }}>
                  <span>{goal.emoji}</span>
                  <span className="text-white text-xs font-medium">{goal.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Body parts */}
        <div className="glass rounded-2xl p-5 flex flex-col gap-3">
          <h2 className="text-white font-semibold">Zones prioritaires</h2>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(BODY_PARTS) as [string, { label: string; emoji: string }][]).map(([key, part]) => {
              const selected = (profile.preferredBodyParts || []).includes(key);
              return (
                <button key={key} onClick={() => toggleArray("preferredBodyParts", key)}
                  className="rounded-xl p-3 flex items-center gap-2 transition-all"
                  style={{
                    background: selected ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${selected ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.06)"}`,
                  }}>
                  <span>{part.emoji}</span>
                  <span className="text-white text-xs font-medium">{part.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Schedule */}
        <div className="glass rounded-2xl p-5 flex flex-col gap-4">
          <h2 className="text-white font-semibold">Planning</h2>
          <div>
            <label className="text-white/50 text-xs mb-2 block">Jours d&apos;entraînement</label>
            <div className="flex gap-1.5 flex-wrap">
              {DAYS.map(day => {
                const selected = (profile.availableDays || []).includes(day);
                return (
                  <button key={day} onClick={() => toggleArray("availableDays", day)}
                    className="w-10 h-10 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: selected ? "linear-gradient(135deg, #22c55e, #16a34a)" : "rgba(255,255,255,0.06)",
                      color: selected ? "white" : "rgba(255,255,255,0.4)",
                    }}>
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-white/50 text-xs mb-2 block">Durée préférée : <span className="text-white font-semibold">{profile.sessionDuration} min</span></label>
            <input type="range" min={15} max={90} step={5} value={profile.sessionDuration}
              onChange={e => update("sessionDuration", +e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="text-white/50 text-xs mb-2 block">Préférence horaire</label>
            <div className="grid grid-cols-2 gap-2">
              {(["matin", "midi", "soir", "flexible"] as UserProfile["workSchedule"][]).map(h => (
                <button key={h} onClick={() => update("workSchedule", h)}
                  className="py-2 rounded-xl text-sm font-medium capitalize transition-all"
                  style={{
                    background: profile.workSchedule === h ? "rgba(37,99,235,0.2)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${profile.workSchedule === h ? "rgba(37,99,235,0.4)" : "rgba(255,255,255,0.06)"}`,
                    color: profile.workSchedule === h ? "#3b82f6" : "rgba(255,255,255,0.5)",
                  }}>
                  {h === "matin" ? "☀️ Matin" : h === "midi" ? "🌤 Midi" : h === "soir" ? "🌙 Soir" : "🕐 Flexible"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* App info & navigation */}
        <div className="glass rounded-2xl overflow-hidden">
          {[
            { label: "Bibliothèque d'exercices", emoji: "📚", path: "/library" },
            { label: "Ma progression", emoji: "📊", path: "/progress" },
          ].map(item => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="w-full px-5 py-4 flex items-center gap-3 border-b border-white/5 last:border-0"
            >
              <span>{item.emoji}</span>
              <span className="text-white text-sm flex-1 text-left">{item.label}</span>
              <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
            </button>
          ))}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className={`w-full py-4 flex items-center justify-center gap-2 font-bold text-lg transition-all ${saved ? "btn-green" : "btn-primary"}`}
          style={{ borderRadius: 18 }}
        >
          <Save size={20} />
          {saved ? "✅ Enregistré !" : "Enregistrer les modifications"}
        </button>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="w-full py-3 flex items-center justify-center gap-2 text-sm font-medium mb-4"
          style={{ color: "rgba(239,68,68,0.7)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 16 }}
        >
          <RotateCcw size={16} />
          Réinitialiser toutes les données
        </button>
      </div>
      <Navigation />
    </main>
  );
}
