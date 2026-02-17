"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotation: number;
}

const ZEN_COLORS = [
  "oklch(72% 0.19 155)",
  "oklch(72% 0.19 155 / 0.7)",
  "oklch(65% 0.12 155)",
  "oklch(80% 0.10 155)",
  "oklch(60% 0.05 260)",
  "oklch(75% 0.03 80)",
];

function generatePieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 2 + Math.random() * 2,
    color: ZEN_COLORS[Math.floor(Math.random() * ZEN_COLORS.length)],
    size: 4 + Math.random() * 6,
    rotation: Math.random() * 360,
  }));
}

// External store to avoid setState-in-effect
let currentPieces: ConfettiPiece[] = [];
const confettiListeners = new Set<() => void>();

function confettiSubscribe(cb: () => void) {
  confettiListeners.add(cb);
  return () => confettiListeners.delete(cb);
}

function confettiGetSnapshot() {
  return currentPieces;
}

function confettiGetServerSnapshot(): ConfettiPiece[] {
  return [];
}

interface ConfettiProps {
  isActive: boolean;
}

export function Confetti({ isActive }: ConfettiProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isActive) {
      currentPieces = generatePieces(40);
      confettiListeners.forEach((cb) => cb());

      timeoutRef.current = setTimeout(() => {
        currentPieces = [];
        confettiListeners.forEach((cb) => cb());
      }, 4000);
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      currentPieces = [];
      confettiListeners.forEach((cb) => cb());
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isActive]);

  const pieces = useSyncExternalStore(
    confettiSubscribe,
    confettiGetSnapshot,
    confettiGetServerSnapshot
  );

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.x}%`,
            top: "-10px",
            width: `${piece.size}px`,
            height: `${piece.size * 1.5}px`,
            backgroundColor: piece.color,
            borderRadius: "2px",
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
