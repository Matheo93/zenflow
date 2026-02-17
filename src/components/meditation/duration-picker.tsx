"use client";

import { haptics } from "@/lib/haptics";
import { playTick } from "@/lib/sounds";

const PRESETS = [
  { label: "1 min", seconds: 60 },
  { label: "2 min", seconds: 120 },
  { label: "5 min", seconds: 300 },
] as const;

interface DurationPickerProps {
  selected: number;
  onSelect: (seconds: number) => void;
  disabled: boolean;
}

export function DurationPicker({
  selected,
  onSelect,
  disabled,
}: DurationPickerProps) {
  return (
    <div className="flex items-center gap-3" role="radiogroup" aria-label="Session duration">
      {PRESETS.map((preset) => {
        const isActive = selected === preset.seconds;
        return (
          <button
            key={preset.seconds}
            role="radio"
            aria-checked={isActive}
            disabled={disabled}
            onClick={() => {
              haptics.tap();
              playTick();
              onSelect(preset.seconds);
            }}
            className={`
              h-11 px-5 rounded-xl text-sm font-medium
              transition-all duration-200 active:scale-95
              focus-visible:ring-2 focus-visible:ring-ring
              ${
                isActive
                  ? "bg-zen/20 text-zen border border-zen/30"
                  : "bg-surface text-muted hover:text-foreground hover:bg-surface-hover border border-transparent"
              }
              ${disabled ? "opacity-40 pointer-events-none" : ""}
            `}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}
