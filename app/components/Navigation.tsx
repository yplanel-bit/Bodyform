"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, BookOpen, BarChart2, User, Zap } from "lucide-react";

const navItems = [
  { href: "/home", icon: Home, label: "Accueil" },
  { href: "/library", icon: BookOpen, label: "Exercices" },
  { href: "/session/start", icon: Zap, label: "Session", primary: true },
  { href: "/progress", icon: BarChart2, label: "Progrès" },
  { href: "/profile", icon: User, label: "Profil" },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div
        className="mx-2 mb-2 rounded-2xl"
        style={{
          background: "rgba(10,10,10,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);

            if (item.primary) {
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className="flex flex-col items-center -mt-6"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                      boxShadow: "0 0 25px rgba(37,99,235,0.5)",
                    }}
                  >
                    <Icon size={24} color="white" strokeWidth={2.5} />
                  </div>
                  <span className="text-xs mt-1 text-blue-400 font-semibold">{item.label}</span>
                </button>
              );
            }

            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all"
              >
                <Icon
                  size={22}
                  color={active ? "#22c55e" : "rgba(255,255,255,0.4)"}
                  strokeWidth={active ? 2.5 : 1.5}
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: active ? "#22c55e" : "rgba(255,255,255,0.4)" }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
