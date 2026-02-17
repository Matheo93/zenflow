"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTimer } from "@/lib/use-timer";
import { useKeyboard } from "@/lib/use-keyboard";
import { useSessionHistory } from "@/lib/use-session-history";
import { haptics } from "@/lib/haptics";
import { playBowl, playChime, playTick } from "@/lib/sounds";
import { ProgressRing } from "./progress-ring";
import { TimerDisplay } from "./timer-display";
import { BreathingGuide } from "./breathing-guide";
import { DurationPicker } from "./duration-picker";
import { CompletionScreen } from "./completion-screen";
import { Confetti } from "./confetti";

const DEFAULT_DURATION = 120;
const RING_SIZE = 280;
const RING_STROKE = 6;

export function MeditationTimer() {
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const { stats, addSession } = useSessionHistory();

  const handleComplete = useCallback(() => {
    haptics.success();
    playChime();
    addSession(duration);
  }, [addSession, duration]);

  const { remaining, state, progress, start, pause, reset } = useTimer(
    DEFAULT_DURATION,
    handleComplete
  );

  const isActive = state === "running";
  const isDone = state === "done";
  const isIdle = state === "idle";

  const handleMainAction = useCallback(() => {
    if (isIdle || state === "paused") {
      haptics.medium();
      playBowl();
      start();
    } else if (isActive) {
      haptics.tap();
      playTick();
      pause();
    }
  }, [isIdle, isActive, state, start, pause]);

  const handleReset = useCallback(() => {
    haptics.tap();
    playTick();
    reset(duration);
  }, [reset, duration]);

  const handleNewSession = useCallback(() => {
    haptics.tap();
    playTick();
    reset(duration);
  }, [reset, duration]);

  const handleDurationChange = useCallback(
    (seconds: number) => {
      setDuration(seconds);
      reset(seconds);
    },
    [reset]
  );

  useKeyboard({
    onSpace: isDone ? handleNewSession : handleMainAction,
    onR: handleReset,
  });

  return (
    <>
      <Confetti isActive={isDone} />

      <AnimatePresence mode="wait">
        {isDone ? (
          <motion.div
            key="completion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center"
          >
            <CompletionScreen
              durationSeconds={duration}
              stats={stats}
              onNewSession={handleNewSession}
            />
          </motion.div>
        ) : (
          <motion.div
            key="timer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center gap-6 px-6"
          >
            {/* Duration picker — only when idle */}
            <div className="h-12 flex items-center">
              <AnimatePresence>
                {isIdle && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <DurationPicker
                      selected={duration}
                      onSelect={handleDurationChange}
                      disabled={!isIdle}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Timer ring + display */}
            <div
              className="relative flex items-center justify-center"
              style={{ width: RING_SIZE, height: RING_SIZE }}
            >
              <ProgressRing
                progress={progress}
                size={RING_SIZE}
                strokeWidth={RING_STROKE}
                isActive={isActive}
              />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <TimerDisplay remaining={remaining} />
              </div>
            </div>

            {/* Breathing guide */}
            <div className="h-32 flex items-center justify-center">
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <BreathingGuide isActive={isActive} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col items-center gap-4 w-full max-w-xs">
              <button
                onClick={handleMainAction}
                className={`
                  w-full h-16 rounded-2xl text-lg font-semibold tracking-wide
                  transition-all duration-200 active:scale-95
                  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                  ${
                    isActive
                      ? "bg-surface text-foreground hover:bg-surface-hover"
                      : "bg-zen text-background hover:brightness-110 animate-pulse-glow"
                  }
                `}
                aria-label={
                  isActive
                    ? "Pause session"
                    : state === "paused"
                    ? "Resume session"
                    : "Start meditation"
                }
              >
                {isActive
                  ? "Pause"
                  : state === "paused"
                  ? "Resume"
                  : "Begin"}
              </button>

              <AnimatePresence>
                {state === "paused" && (
                  <motion.button
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 48 }}
                    exit={{ opacity: 0, height: 0 }}
                    onClick={handleReset}
                    className="w-full h-12 rounded-xl text-sm font-medium text-muted
                               hover:text-foreground transition-colors duration-200
                               active:scale-95"
                    aria-label="Reset timer"
                  >
                    Reset
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Keyboard hint — desktop only */}
            <p className="hidden sm:block text-[10px] text-muted/40 tracking-wide">
              Space to start/pause · R to reset
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
