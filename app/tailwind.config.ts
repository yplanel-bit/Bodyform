import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        green: { primary: "#22c55e", dark: "#16a34a", neon: "#4ade80" },
        blue: { electric: "#2563eb", bright: "#3b82f6" },
        glass: { bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)" }
      },
      backgroundImage: {
        "gradient-logo": "linear-gradient(135deg, #22c55e, #16a34a)",
        "gradient-text": "linear-gradient(135deg, #22d3ee, #22c55e)"
      },
      backdropBlur: { glass: "12px" },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite"
      },
      keyframes: {
        float: { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-10px)" } }
      }
    }
  },
  plugins: []
};
export default config;
