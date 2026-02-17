"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

interface BreathingGuideProps {
  isActive: boolean;
}

const PHASES = ["Inhale", "Hold", "Exhale", "Hold"] as const;
const PHASE_DURATIONS = [4000, 2000, 4000, 2000]; // 12s total cycle

/**
 * External store for breathing phase to avoid setState-in-effect lint error.
 * Uses useSyncExternalStore for React 19 compliance.
 */
function createBreathingStore() {
  let phaseIndex = 0;
  const listeners = new Set<() => void>();

  return {
    subscribe(cb: () => void) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    getSnapshot() {
      return phaseIndex;
    },
    start() {
      phaseIndex = 0;
      listeners.forEach((cb) => cb());

      function scheduleNext(): ReturnType<typeof setTimeout> {
        return setTimeout(() => {
          phaseIndex = (phaseIndex + 1) % PHASES.length;
          listeners.forEach((cb) => cb());
          handle = scheduleNext();
        }, PHASE_DURATIONS[phaseIndex]);
      }

      let handle = scheduleNext();
      return () => clearTimeout(handle);
    },
    reset() {
      phaseIndex = 0;
      listeners.forEach((cb) => cb());
    },
  };
}

const breathingStore = createBreathingStore();

export function BreathingGuide({ isActive }: BreathingGuideProps) {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isActive) {
      cleanupRef.current = breathingStore.start();
    } else {
      cleanupRef.current?.();
      cleanupRef.current = null;
      breathingStore.reset();
    }
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [isActive]);

  const phaseIndex = useSyncExternalStore(
    breathingStore.subscribe,
    breathingStore.getSnapshot,
    breathingStore.getSnapshot
  );

  const phase = PHASES[phaseIndex];
  const isExpanding = phase === "Inhale";
  const isContracting = phase === "Exhale";

  return (
    <div className="flex flex-col items-center gap-3" aria-live="polite">
      {/* Breathing circle */}
      <div className="relative flex items-center justify-center">
        {/* Outer glow ring */}
        <div
          className={`absolute rounded-full bg-zen/10 transition-all ease-in-out ${
            isExpanding
              ? "h-28 w-28 duration-[4000ms]"
              : isContracting
              ? "h-16 w-16 duration-[4000ms]"
              : "h-20 w-20 duration-[2000ms]"
          }`}
        />
        {/* Inner circle */}
        <div
          className={`relative rounded-full bg-zen/30 transition-all ease-in-out ${
            isExpanding
              ? "h-20 w-20 duration-[4000ms]"
              : isContracting
              ? "h-10 w-10 duration-[4000ms]"
              : "h-14 w-14 duration-[2000ms]"
          }`}
        >
          <div
            className={`absolute inset-2 rounded-full bg-zen transition-all ease-in-out ${
              isExpanding
                ? "opacity-80 duration-[4000ms]"
                : isContracting
                ? "opacity-40 duration-[4000ms]"
                : "opacity-60 duration-[2000ms]"
            }`}
          />
        </div>
      </div>

      {/* Phase label */}
      {isActive && (
        <span className="text-sm font-medium tracking-widest uppercase text-zen/80 animate-fade-in-up">
          {phase}
        </span>
      )}
    </div>
  );
}
