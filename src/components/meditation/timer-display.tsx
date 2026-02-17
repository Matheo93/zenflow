"use client";

interface TimerDisplayProps {
  remaining: number;
}

export function TimerDisplay({ remaining }: TimerDisplayProps) {
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className="flex items-baseline gap-1 tabular-nums" aria-label={`${minutes} minutes ${seconds} seconds remaining`}>
      <span className="text-7xl font-light tracking-tight text-foreground">
        {minutes}
      </span>
      <span className="text-5xl font-light text-muted animate-pulse">:</span>
      <span className="text-7xl font-light tracking-tight text-foreground">
        {seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
