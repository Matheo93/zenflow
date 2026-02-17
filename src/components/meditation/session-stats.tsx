"use client";

import type { SessionStats as Stats } from "@/lib/use-session-history";
import { motion, AnimatePresence } from "framer-motion";

interface SessionStatsProps {
  stats: Stats;
  isVisible: boolean;
}

export function SessionStats({ stats, isVisible }: SessionStatsProps) {
  return (
    <AnimatePresence>
      {isVisible && stats.totalSessions > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex items-center gap-6"
        >
          <StatItem value={stats.totalSessions} label="sessions" />
          <StatItem value={stats.totalMinutes} label="minutes" />
          <StreakItem value={stats.currentStreak} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-lg font-semibold tabular-nums text-foreground">
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-muted">
        {label}
      </span>
    </div>
  );
}

function StreakItem({ value }: { value: number }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex items-center gap-1">
        <span className="text-lg font-semibold tabular-nums text-foreground">
          {value}
        </span>
        {value > 0 && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            className="text-zen"
            aria-hidden="true"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              fill="currentColor"
            />
          </svg>
        )}
      </div>
      <span className="text-[10px] uppercase tracking-widest text-muted">
        streak
      </span>
    </div>
  );
}
