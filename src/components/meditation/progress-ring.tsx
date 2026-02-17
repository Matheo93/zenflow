"use client";

interface ProgressRingProps {
  /** Progress from 0 to 1 */
  progress: number;
  /** Diameter of the ring in pixels */
  size: number;
  /** Stroke width */
  strokeWidth: number;
  /** Whether the timer is active */
  isActive: boolean;
}

export function ProgressRing({
  progress,
  size,
  strokeWidth,
  isActive,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="absolute inset-0 -rotate-90"
      aria-hidden="true"
    >
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-surface"
      />
      {/* Progress arc */}
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
        className={`text-zen transition-[stroke-dashoffset] duration-1000 ease-linear ${
          isActive ? "opacity-100" : "opacity-60"
        }`}
      />
    </svg>
  );
}
