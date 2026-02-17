"use client";

import { useCallback, useSyncExternalStore } from "react";

export interface Session {
  id: string;
  date: string;
  durationSeconds: number;
  completedAt: string;
}

export interface SessionStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
}

const STORAGE_KEY = "zenflow-sessions";

function loadSessions(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session[]) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: Session[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // Storage full or unavailable
  }
}

function computeStreak(sessions: Session[]): Pick<SessionStats, "currentStreak" | "longestStreak"> {
  if (sessions.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const uniqueDays = [
    ...new Set(sessions.map((s) => s.date)),
  ].sort((a, b) => b.localeCompare(a));

  let currentStreak = 1;
  let longestStreak = 1;
  let streak = 1;

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const mostRecent = uniqueDays[0];

  if (mostRecent !== today && mostRecent !== yesterday) {
    currentStreak = 0;
  }

  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]);
    const curr = new Date(uniqueDays[i]);
    const diffDays = (prev.getTime() - curr.getTime()) / 86400000;

    if (Math.round(diffDays) === 1) {
      streak++;
      longestStreak = Math.max(longestStreak, streak);
      if (mostRecent === today || mostRecent === yesterday) {
        currentStreak = streak;
      }
    } else {
      streak = 1;
    }
  }

  return { currentStreak, longestStreak: Math.max(longestStreak, currentStreak) };
}

/**
 * External store for session history — avoids setState-in-effect.
 */
let cachedSessions: Session[] | null = null;
const listeners = new Set<() => void>();

function getSessions(): Session[] {
  if (cachedSessions === null) {
    cachedSessions = loadSessions();
  }
  return cachedSessions;
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): Session[] {
  return getSessions();
}

function getServerSnapshot(): Session[] {
  return [];
}

export function useSessionHistory() {
  const sessions = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addSession = useCallback((durationSeconds: number) => {
    const now = new Date();
    const session: Session = {
      id: crypto.randomUUID(),
      date: now.toISOString().split("T")[0],
      durationSeconds,
      completedAt: now.toISOString(),
    };

    cachedSessions = [session, ...(cachedSessions ?? [])];
    saveSessions(cachedSessions);
    listeners.forEach((cb) => cb());
  }, []);

  const stats: SessionStats = {
    totalSessions: sessions.length,
    totalMinutes: Math.round(
      sessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60
    ),
    ...computeStreak(sessions),
  };

  return { sessions, stats, addSession };
}
