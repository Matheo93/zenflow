/**
 * Haptic feedback utilities using the Vibration API.
 * Degrades gracefully on devices that don't support vibration.
 */

function vibrate(pattern: number | number[]): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

export const haptics = {
  /** Light tap — button press */
  tap: () => vibrate(10),
  /** Medium — start/pause action */
  medium: () => vibrate(25),
  /** Success — session completed */
  success: () => vibrate([50, 50, 50, 50, 100]),
  /** Breathing rhythm — gentle pulse */
  breathe: () => vibrate(15),
} as const;
