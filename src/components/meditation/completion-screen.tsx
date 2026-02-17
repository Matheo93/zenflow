"use client";

import { motion } from "framer-motion";
import type { SessionStats } from "@/lib/use-session-history";

interface CompletionScreenProps {
  durationSeconds: number;
  stats: SessionStats;
  onNewSession: () => void;
}

export function CompletionScreen({
  durationSeconds,
  stats,
  onNewSession,
}: CompletionScreenProps) {
  const minutes = Math.floor(durationSeconds / 60);
  const breathingCycles = Math.floor(durationSeconds / 12); // 12s per cycle

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center gap-8 px-6 w-full max-w-sm"
    >
      {/* Completion icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="text-5xl"
        aria-hidden="true"
      >
        🧘
      </motion.div>

      {/* Message */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-semibold text-foreground">
          Well done
        </h2>
        <p className="text-sm text-muted">
          {minutes} min · {breathingCycles} breathing cycles
        </p>
      </div>

      {/* SVG Stats Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full"
      >
        <StatsDashboard stats={stats} />
      </motion.div>

      {/* New session button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={onNewSession}
        className="w-full h-14 rounded-2xl text-lg font-semibold tracking-wide
                   bg-zen text-background hover:brightness-110
                   transition-all duration-200 active:scale-95
                   focus-visible:ring-2 focus-visible:ring-ring"
      >
        New Session
      </motion.button>
    </motion.div>
  );
}

function StatsDashboard({ stats }: { stats: SessionStats }) {
  const dailyGoal = 3;
  const dailyProgress = Math.min(stats.totalSessions, dailyGoal) / dailyGoal;

  return (
    <div className="flex items-center justify-around gap-4 p-4 rounded-2xl bg-surface/50">
      {/* Daily goal ring */}
      <div className="flex flex-col items-center gap-1.5">
        <DailyGoalRing progress={dailyProgress} total={stats.totalSessions} goal={dailyGoal} />
        <span className="text-[10px] uppercase tracking-widest text-muted">today</span>
      </div>

      {/* Total sessions */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-2xl font-semibold tabular-nums text-foreground">
          {stats.totalSessions}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-muted">sessions</span>
      </div>

      {/* Total minutes */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-2xl font-semibold tabular-nums text-foreground">
          {stats.totalMinutes}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-muted">minutes</span>
      </div>

      {/* Streak with flame */}
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-1">
          <span className="text-2xl font-semibold tabular-nums text-foreground">
            {stats.currentStreak}
          </span>
          {stats.currentStreak > 0 && (
            <StreakFlame />
          )}
        </div>
        <span className="text-[10px] uppercase tracking-widest text-muted">streak</span>
      </div>
    </div>
  );
}

function DailyGoalRing({ progress, total, goal }: { progress: number; total: number; goal: number }) {
  const size = 48;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-surface"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-zen transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold tabular-nums text-foreground">
          {Math.min(total, goal)}/{goal}
        </span>
      </div>
    </div>
  );
}

function StreakFlame() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-zen" aria-hidden="true">
      <path
        d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M12 8c0 2-2 3-2 5a2 2 0 0 0 4 0c0-2-2-3-2-5z"
        fill="currentColor"
      />
    </svg>
  );
}
