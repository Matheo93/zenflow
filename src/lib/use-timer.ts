"use client";

import { useCallback, useRef, useState } from "react";

export type TimerState = "idle" | "running" | "paused" | "done";

interface UseTimerReturn {
  remaining: number;
  total: number;
  state: TimerState;
  progress: number;
  start: () => void;
  pause: () => void;
  reset: (newDuration?: number) => void;
}

export function useTimer(
  initialDuration: number,
  onComplete?: () => void
): UseTimerReturn {
  const [remaining, setRemaining] = useState(initialDuration);
  const [state, setState] = useState<TimerState>("idle");
  const [total, setTotal] = useState(initialDuration);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const remainingRef = useRef(initialDuration);
  const totalRef = useRef(initialDuration);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearTimer();
    setState("running");

    intervalRef.current = setInterval(() => {
      remainingRef.current -= 1;
      const next = remainingRef.current;

      if (next <= 0) {
        clearTimer();
        setRemaining(0);
        setState("done");
        onComplete?.();
        return;
      }

      setRemaining(next);
    }, 1000);
  }, [clearTimer, onComplete]);

  const pause = useCallback(() => {
    clearTimer();
    setState("paused");
  }, [clearTimer]);

  const reset = useCallback(
    (newDuration?: number) => {
      clearTimer();
      const dur = newDuration ?? totalRef.current;
      totalRef.current = dur;
      remainingRef.current = dur;
      setTotal(dur);
      setRemaining(dur);
      setState("idle");
    },
    [clearTimer]
  );

  const progress =
    state === "idle" ? 0 : 1 - remaining / total;

  return { remaining, total, state, progress, start, pause, reset };
}
