"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

const sizes = {
  sm: { figure: 60, text: 18 },
  md: { figure: 90, text: 26 },
  lg: { figure: 130, text: 38 },
  xl: { figure: 180, text: 52 },
};

export default function BodyformLogo({ size = "md", animated = false }: LogoProps) {
  const s = sizes[size];
  return (
    <div
      className={`flex flex-col items-center gap-2 ${animated ? "animate-[float_6s_ease-in-out_infinite]" : ""}`}
      style={{ width: s.figure }}
    >
      {/* Silhouette musculaire SVG inspirée du logo */}
      <svg
        width={s.figure}
        height={s.figure}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Torso */}
        <path
          d="M100 40 C80 40 65 55 65 75 L65 120 L80 125 L80 115 L120 115 L120 125 L135 120 L135 75 C135 55 120 40 100 40Z"
          fill="url(#bodyGrad)"
          filter="url(#glow)"
        />
        {/* Head */}
        <circle cx="100" cy="28" r="18" fill="url(#bodyGrad)" filter="url(#glow)" />
        {/* Left arm bicep */}
        <path
          d="M65 70 C50 65 38 70 35 85 C32 95 40 105 50 100 L65 90Z"
          fill="url(#bodyGrad)"
          filter="url(#glow)"
        />
        {/* Left forearm */}
        <path
          d="M35 85 C25 90 20 105 28 115 C32 120 40 118 42 110 L50 100Z"
          fill="url(#bodyGrad)"
          filter="url(#glow)"
        />
        {/* Right arm bicep */}
        <path
          d="M135 70 C150 65 162 70 165 85 C168 95 160 105 150 100 L135 90Z"
          fill="url(#bodyGrad)"
          filter="url(#glow)"
        />
        {/* Right forearm */}
        <path
          d="M165 85 C175 90 180 105 172 115 C168 120 160 118 158 110 L150 100Z"
          fill="url(#bodyGrad)"
          filter="url(#glow)"
        />
        {/* Muscle lines */}
        <path d="M90 65 Q100 80 110 65" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" fill="none" />
        <path d="M85 90 Q100 100 115 90" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" fill="none" />
        <path d="M88 105 Q100 112 112 105" stroke="rgba(0,0,0,0.2)" strokeWidth="1" fill="none" />
      </svg>

      {/* Text "Bodyform" avec gradient */}
      <span
        className="font-black tracking-tight text-gradient-logo"
        style={{ fontSize: s.text, lineHeight: 1 }}
      >
        Bodyform
      </span>
    </div>
  );
}
