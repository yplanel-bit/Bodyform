"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProfile, UserProfile } from "@/lib/storage";
import { BODY_PARTS } from "@/lib/exercises";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import BodyformLogo from "@/components/BodyformLogo";

const STEPS = [
  { id: "welcome", title: "Bienvenue !" },
  { id: "identity", title: "Parle-moi de toi" },
  { id: "fitness", title: "Ton niveau" },
  { id: "goals", title: "Tes objectifs" },
  { id: "bodyparts", title: "Zones à travailler" },
  { id: "schedule", title: "Ton emploi du temps" },
  { id: "done", title: "C'est parti !" },
];

const GOALS = [
  { id: "strength", label: "Force", emoji: "💪" },
  { id: "muscle", label: "Masse musculaire", emoji: "🏋️" },
  { id: "weightloss", label: "Perte de poids", emoji: "🔥" },
  { id: "flexibility", label: "Souplesse", emoji: "🧘" },
  { id: "endurance", label: "Endurance", emoji: "⚡" },
  { id: "skills", label: "Figures callisthénie", emoji: "🤸" },
];

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    name: "",
    age: 25,
    weight: 70,
    fitnessLevel: "débutant" as UserProfile["fitnessLevel"],
    goals: [] as string[],
    preferredBodyParts: [] as string[],
    availableDays: [] as string[],
    sessionDuration: 30,
    workSchedule: "flexible" as UserProfile["workSchedule"],
  });

  const updateForm = (key: string, value: unknown) => setForm(prev => ({ ...prev, [key]: value }));

  const toggleArray = (key: string, value: string) => {
    const arr = form[key as keyof typeof form] as string[];
    const updated = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
    updateForm(key, updated);
  };

  const canNext = () => {
    if (step === 1) return form.name.trim().length > 0;
    if (step === 4) return form.preferredBodyParts.length > 0;
    if (step === 5) return form.availableDays.length > 0;
    return true;
  };

  const handleFinish = () => {
    const profile: UserProfile = { ...form, onboardingComplete: true };
    saveProfile(profile);
    router.push("/home");
  };

  const progress = ((step) / (STEPS.length - 1)) * 100;

  return (
    <main className="min-h-screen flex flex-col bg-animated px-5 py-8 safe-top safe-bottom">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {step > 0 ? (
          <button onClick={() => setStep(s => s - 1)} className="p-2 rounded-xl glass">
            <ChevronLeft size={20} color="white" />
          </button>
        ) : <div />}
        <BodyformLogo size="sm" />
        <span className="text-sm text-white/40">{step + 1}/{STEPS.length}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 rounded-full mb-8" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div
          className="progress-bar h-1 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Step title */}
        <h1 className="text-2xl font-bold text-white mb-1">{STEPS[step].title}</h1>

        {/* ── Step 0 : Welcome ── */}
        {step === 0 && (
          <div className="flex flex-col gap-5 mt-6">
            <p className="text-white/60 leading-relaxed">
              Bodyform va créer ton programme de callisthénie personnalisé. Quelques questions rapides pour adapter l&apos;entraînement à tes besoins.
            </p>
            <div className="glass-green rounded-2xl p-5">
              <p className="text-green-400 font-semibold mb-2">✅ Ce que tu vas obtenir :</p>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• Programmes adaptés à ton niveau</li>
                <li>• Sessions intelligentes selon ton historique</li>
                <li>• Illustrations claires de chaque exercice</li>
                <li>• Suivi de ta progression semaine après semaine</li>
                <li>• Sessions surprises pour éviter la routine</li>
              </ul>
            </div>
          </div>
        )}

        {/* ── Step 1 : Identity ── */}
        {step === 1 && (
          <div className="flex flex-col gap-5 mt-6">
            <div className="glass rounded-2xl p-4">
              <label className="text-white/60 text-sm mb-2 block">Ton prénom</label>
              <input
                type="text"
                value={form.name}
                onChange={e => updateForm("name", e.target.value)}
                placeholder="Ex: Alex"
                className="w-full bg-transparent text-white text-lg font-semibold outline-none placeholder:text-white/20"
              />
            </div>
            <div className="glass rounded-2xl p-4">
              <label className="text-white/60 text-sm mb-3 block">Âge : <span className="text-white font-bold">{form.age} ans</span></label>
              <input
                type="range" min={14} max={70} value={form.age}
                onChange={e => updateForm("age", +e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-white/30 mt-1"><span>14</span><span>70</span></div>
            </div>
            <div className="glass rounded-2xl p-4">
              <label className="text-white/60 text-sm mb-3 block">Poids : <span className="text-white font-bold">{form.weight} kg</span></label>
              <input
                type="range" min={40} max={150} value={form.weight}
                onChange={e => updateForm("weight", +e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-white/30 mt-1"><span>40 kg</span><span>150 kg</span></div>
            </div>
          </div>
        )}

        {/* ── Step 2 : Fitness level ── */}
        {step === 2 && (
          <div className="flex flex-col gap-4 mt-6">
            <p className="text-white/50 text-sm">Sois honnête — le programme s&apos;ajuste automatiquement !</p>
            {([
              { value: "débutant", label: "Débutant", desc: "Je commence ou j'ai peu d'expérience", emoji: "🌱" },
              { value: "intermédiaire", label: "Intermédiaire", desc: "Je m'entraîne régulièrement depuis quelques mois", emoji: "⚡" },
              { value: "avancé", label: "Avancé", desc: "Je pratique la callisthénie depuis plus d'un an", emoji: "🔥" },
            ] as { value: UserProfile["fitnessLevel"]; label: string; desc: string; emoji: string }[]).map(opt => (
              <button
                key={opt.value}
                onClick={() => updateForm("fitnessLevel", opt.value)}
                className="rounded-2xl p-4 text-left transition-all"
                style={{
                  background: form.fitnessLevel === opt.value
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(255,255,255,0.04)",
                  border: `1px solid ${form.fitnessLevel === opt.value ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{opt.emoji}</span>
                  <div>
                    <p className="text-white font-semibold">{opt.label}</p>
                    <p className="text-white/50 text-sm">{opt.desc}</p>
                  </div>
                  {form.fitnessLevel === opt.value && (
                    <div className="ml-auto w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check size={14} color="white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── Step 3 : Goals ── */}
        {step === 3 && (
          <div className="flex flex-col gap-4 mt-6">
            <p className="text-white/50 text-sm">Sélectionne un ou plusieurs objectifs.</p>
            <div className="grid grid-cols-2 gap-3">
              {GOALS.map(goal => {
                const selected = form.goals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleArray("goals", goal.id)}
                    className="rounded-2xl p-4 text-center transition-all"
                    style={{
                      background: selected ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${selected ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)"}`,
                    }}
                  >
                    <div className="text-2xl mb-1">{goal.emoji}</div>
                    <div className="text-sm text-white font-medium">{goal.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 4 : Body parts ── */}
        {step === 4 && (
          <div className="flex flex-col gap-4 mt-6">
            <p className="text-white/50 text-sm">Quelles zones veux-tu travailler en priorité ?</p>
            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(BODY_PARTS) as [string, { label: string; emoji: string }][]).map(([key, part]) => {
                const selected = form.preferredBodyParts.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggleArray("preferredBodyParts", key)}
                    className="rounded-2xl p-4 text-center transition-all"
                    style={{
                      background: selected ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${selected ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)"}`,
                    }}
                  >
                    <div className="text-2xl mb-1">{part.emoji}</div>
                    <div className="text-sm text-white font-medium">{part.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 5 : Schedule ── */}
        {step === 5 && (
          <div className="flex flex-col gap-5 mt-6">
            <p className="text-white/50 text-sm">Ces infos permettent à Bodyform de planifier intelligemment tes sessions.</p>
            <div className="glass rounded-2xl p-4">
              <label className="text-white/60 text-sm mb-3 block">Jours disponibles pour t&apos;entraîner</label>
              <div className="flex gap-2 flex-wrap">
                {DAYS.map(day => {
                  const selected = form.availableDays.includes(day);
                  return (
                    <button
                      key={day}
                      onClick={() => toggleArray("availableDays", day)}
                      className="w-11 h-11 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        background: selected ? "linear-gradient(135deg, #22c55e, #16a34a)" : "rgba(255,255,255,0.06)",
                        color: selected ? "white" : "rgba(255,255,255,0.4)",
                        border: selected ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="glass rounded-2xl p-4">
              <label className="text-white/60 text-sm mb-3 block">
                Durée de session préférée : <span className="text-white font-bold">{form.sessionDuration} min</span>
              </label>
              <input
                type="range" min={15} max={90} step={5} value={form.sessionDuration}
                onChange={e => updateForm("sessionDuration", +e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-white/30 mt-1"><span>15 min</span><span>90 min</span></div>
            </div>
            <div className="glass rounded-2xl p-4">
              <label className="text-white/60 text-sm mb-3 block">Préférence horaire</label>
              <div className="grid grid-cols-2 gap-2">
                {(["matin", "midi", "soir", "flexible"] as UserProfile["workSchedule"][]).map(h => (
                  <button
                    key={h}
                    onClick={() => updateForm("workSchedule", h)}
                    className="py-2 rounded-xl text-sm font-medium capitalize transition-all"
                    style={{
                      background: form.workSchedule === h ? "rgba(37,99,235,0.2)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${form.workSchedule === h ? "rgba(37,99,235,0.4)" : "rgba(255,255,255,0.06)"}`,
                      color: form.workSchedule === h ? "#3b82f6" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {h === "matin" ? "☀️ Matin" : h === "midi" ? "🌤 Midi" : h === "soir" ? "🌙 Soir" : "🕐 Flexible"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 6 : Done ── */}
        {step === 6 && (
          <div className="flex flex-col gap-5 mt-6 items-center text-center">
            <div className="text-5xl">🎉</div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Prêt, {form.name || "champion"} !
              </h2>
              <p className="text-white/60 leading-relaxed">
                Ton profil est configuré. Bodyform va maintenant créer des sessions adaptées à ton niveau <strong className="text-green-400">{form.fitnessLevel}</strong> avec une durée de <strong className="text-green-400">{form.sessionDuration} min</strong>.
              </p>
            </div>
            <div className="glass-green rounded-2xl p-5 w-full text-left">
              <p className="text-green-400 font-semibold mb-3">Ton profil :</p>
              <div className="space-y-1 text-sm text-white/70">
                <p>👤 {form.name} • {form.age} ans • {form.weight} kg</p>
                <p>⚡ Niveau : {form.fitnessLevel}</p>
                <p>🎯 {form.goals.length} objectif(s) défini(s)</p>
                <p>💪 {form.preferredBodyParts.length} zone(s) prioritaire(s)</p>
                <p>📅 {form.availableDays.length} jour(s) / semaine</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="mt-6 pb-4">
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext()}
            className="btn-primary w-full py-4 font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ borderRadius: 18 }}
          >
            Continuer <ChevronRight size={20} />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="btn-green w-full py-4 font-bold text-lg flex items-center justify-center gap-2"
            style={{ borderRadius: 18 }}
          >
            <Check size={22} /> Commencer l&apos;aventure !
          </button>
        )}
      </div>
    </main>
  );
}
