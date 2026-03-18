"use client";

export interface UserProfile {
  name: string;
  age: number;
  weight: number; // kg
  fitnessLevel: "débutant" | "intermédiaire" | "avancé";
  goals: string[];
  preferredBodyParts: string[];
  availableDays: string[];
  sessionDuration: number; // minutes
  workSchedule: "matin" | "midi" | "soir" | "flexible";
  onboardingComplete: boolean;
}

export interface SessionRecord {
  id: string;
  date: string;
  duration: number; // minutes
  bodyPart: string;
  exercises: string[];
  completedReps: Record<string, number[]>;
  fatigue: number; // 1-5
  notes: string;
  isSurprise: boolean;
  totalVolume: number;
}

export interface ProgressEntry {
  date: string;
  weight?: number;
  sessionCount: number;
  totalMinutes: number;
  bodyParts: Record<string, number>;
}

const KEYS = {
  profile: "bodyform_profile",
  sessions: "bodyform_sessions",
  progress: "bodyform_progress",
  lastSession: "bodyform_last_session",
};

// ── Profile ─────────────────────────────────────────────────
export function getProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEYS.profile);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

export function isOnboardingDone(): boolean {
  const profile = getProfile();
  return !!profile?.onboardingComplete;
}

// ── Sessions ─────────────────────────────────────────────────
export function getSessions(): SessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEYS.sessions);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveSession(session: SessionRecord): void {
  if (typeof window === "undefined") return;
  const sessions = getSessions();
  sessions.unshift(session);
  localStorage.setItem(KEYS.sessions, JSON.stringify(sessions.slice(0, 100)));
}

export function getRecentSessions(days = 30): SessionRecord[] {
  const sessions = getSessions();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return sessions.filter(s => new Date(s.date) >= cutoff);
}

export function getSessionsByBodyPart(bodyPart: string): SessionRecord[] {
  return getSessions().filter(s => s.bodyPart === bodyPart);
}

export function getMostTrainedBodyPart(): string {
  const sessions = getRecentSessions(30);
  const counts: Record<string, number> = {};
  sessions.forEach(s => {
    counts[s.bodyPart] = (counts[s.bodyPart] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "full";
}

export function getLeastTrainedBodyPart(preferred: string[]): string {
  const sessions = getRecentSessions(14);
  const counts: Record<string, number> = {};
  preferred.forEach(bp => { counts[bp] = 0; });
  sessions.forEach(s => {
    if (counts[s.bodyPart] !== undefined) counts[s.bodyPart]++;
  });
  const sorted = Object.entries(counts).sort((a, b) => a[1] - b[1]);
  return sorted[0]?.[0] || preferred[0] || "full";
}

// ── Progress ─────────────────────────────────────────────────
export function getProgressData(): ProgressEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEYS.progress);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function computeStats() {
  const sessions = getSessions();
  const thisWeek = getRecentSessions(7);
  const thisMonth = getRecentSessions(30);

  const bodyPartCounts: Record<string, number> = {};
  sessions.forEach(s => {
    bodyPartCounts[s.bodyPart] = (bodyPartCounts[s.bodyPart] || 0) + 1;
  });

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
  const avgFatigue = sessions.length
    ? sessions.slice(0, 10).reduce((sum, s) => sum + s.fatigue, 0) / Math.min(sessions.length, 10)
    : 0;

  // Sessions per week (last 4 weeks)
  const weeklySessions: { week: string; count: number }[] = [];
  for (let i = 3; i >= 0; i--) {
    const start = new Date();
    start.setDate(start.getDate() - (i + 1) * 7);
    const end = new Date();
    end.setDate(end.getDate() - i * 7);
    const count = sessions.filter(s => {
      const d = new Date(s.date);
      return d >= start && d < end;
    }).length;
    weeklySessions.push({
      week: `S-${i}`,
      count,
    });
  }

  return {
    totalSessions: sessions.length,
    thisWeekSessions: thisWeek.length,
    thisMonthSessions: thisMonth.length,
    totalMinutes,
    bodyPartCounts,
    avgFatigue: Math.round(avgFatigue * 10) / 10,
    weeklySessions,
    streak: computeStreak(sessions),
  };
}

function computeStreak(sessions: SessionRecord[]): number {
  if (!sessions.length) return 0;
  const dates = Array.from(new Set(sessions.map(s => s.date.split("T")[0]))).sort((a, b) => b.localeCompare(a));
  let streak = 0;
  let current = new Date();
  current.setHours(0, 0, 0, 0);

  for (const dateStr of dates) {
    const d = new Date(dateStr);
    const diff = Math.round((current.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 1) {
      streak++;
      current = d;
    } else {
      break;
    }
  }
  return streak;
}

// ── Surprise session algorithm ────────────────────────────────
export function selectSurpriseBodyPart(profile: UserProfile): string {
  const recent = getRecentSessions(7);
  const recentParts = recent.map(s => s.bodyPart);
  const preferred = profile.preferredBodyParts;

  // Find least trained preferred body part
  const available = preferred.filter(bp => !recentParts.includes(bp));
  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)];
  }

  // All were trained recently — pick the oldest
  return getLeastTrainedBodyPart(preferred.length ? preferred : ["full", "core", "chest"]);
}
