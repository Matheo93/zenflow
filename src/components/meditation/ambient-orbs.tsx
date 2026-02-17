"use client";

/**
 * Ambient floating orbs — subtle background effect for desktop.
 * Pure CSS with blur and slow float animations.
 * Hidden on mobile to save GPU.
 */
export function AmbientOrbs() {
  return (
    <div
      className="hidden sm:block fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Top-left zen orb */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-[0.07] animate-float-slow"
        style={{
          background:
            "radial-gradient(circle, oklch(72% 0.19 155), transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Bottom-right blue orb */}
      <div
        className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-[0.05] animate-float-slow-reverse"
        style={{
          background:
            "radial-gradient(circle, oklch(65% 0.12 250), transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Center subtle warm orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.03] animate-float-drift"
        style={{
          background:
            "radial-gradient(circle, oklch(70% 0.08 80), transparent 70%)",
          filter: "blur(100px)",
        }}
      />
    </div>
  );
}
