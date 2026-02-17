/**
 * Push notification utilities for session reminders and completion.
 * Uses the Notification API with graceful degradation.
 */

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;

  const result = await Notification.requestPermission();
  return result === "granted";
}

export function notifySessionComplete(durationMinutes: number): void {
  if (
    typeof window === "undefined" ||
    !("Notification" in window) ||
    Notification.permission !== "granted"
  ) {
    return;
  }

  new Notification("Session Complete", {
    body: `Great work! You meditated for ${durationMinutes} min.`,
    icon: "/icons/icon.svg",
    tag: "zenflow-complete",
    silent: true,
  });
}

export function notifyBreakReminder(): void {
  if (
    typeof window === "undefined" ||
    !("Notification" in window) ||
    Notification.permission !== "granted"
  ) {
    return;
  }

  new Notification("Time for a break", {
    body: "Take a mindful micro-pause. Your body will thank you.",
    icon: "/icons/icon.svg",
    tag: "zenflow-reminder",
  });
}
