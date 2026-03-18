"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isOnboardingDone } from "@/lib/storage";
import BodyformLogo from "@/components/BodyformLogo";

const PHRASES = [
  "Ton seul concurrent, c'est toi d'hier.",
  "Chaque répétition sculpte une version meilleure de toi.",
  "La douleur d'aujourd'hui est la force de demain.",
  "Tu ne trouves pas le temps — tu le crées.",
  "Ton corps est capable de bien plus que tu ne l'imagines.",
];

export default function SplashPage() {
  const router = useRouter();
  const [phrase] = useState(() => PHRASES[Math.floor(Math.random() * PHRASES.length)]);
  const [phase, setPhase] = useState<"video" | "main">("video");
  const [videoVisible, setVideoVisible] = useState(false);
  const [mainVisible, setMainVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVideoVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const goToMain = () => {
    setVideoVisible(false);
    setTimeout(() => {
      setPhase("main");
      setTimeout(() => setMainVisible(true), 100);
    }, 500);
  };

  const handleStart = () => {
    if (isOnboardingDone()) {
      router.push("/home");
    } else {
      router.push("/onboarding");
    }
  };

  if (phase === "video") {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#080808", cursor: "pointer" }}
        onClick={goToMain}
      >
        <video
          src="/logo.mp4"
          autoPlay
          muted
          playsInline
          onEnded={goToMain}
          style={{
            width: "min(360px, 90vw)",
            height: "min(360px, 90vw)",
            objectFit: "contain",
            opacity: videoVisible ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />
      </main>
    );
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: "#080808" }}
    >
      {/* Background orbs */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div
        className="flex flex-col items-center gap-10 w-full max-w-sm transition-all duration-700"
        style={{
          opacity: mainVisible ? 1 : 0,
          transform: mainVisible ? "translateY(0)" : "translateY(20px)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-1">
          <BodyformLogo size="xl" animated src="/logo.mp4" />
          <p className="text-xs text-green-400/60 tracking-widest uppercase mt-2">
            Coach Callisthénie
          </p>
        </div>

        {/* Phrase motivante */}
        <div
          className="w-full rounded-2xl px-6 py-5 text-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-lg font-semibold text-white leading-snug">
            &ldquo;{phrase}&rdquo;
          </p>
        </div>

        {/* Bouton démarrer */}
        <button
          onClick={handleStart}
          className="btn-primary w-full py-4 text-lg font-bold tracking-wide"
          style={{ borderRadius: 20 }}
        >
          ⚡ Démarrer
        </button>

        <p className="text-xs text-white/20 text-center">
          Callisthénie • Progressif • Intelligent
        </p>
      </div>
    </main>
  );
}
