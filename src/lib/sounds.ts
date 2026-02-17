/**
 * Synthesized meditation sounds using the Web Audio API.
 * No MP3 files needed — everything is generated in real-time.
 */

let audioCtx: AudioContext | null = null;

function getContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Singing bowl — multiple harmonics with slow decay.
 * Frequencies based on a Tibetan bowl tuned to ~220Hz (A3).
 */
export function playBowl(): void {
  try {
    const ctx = getContext();
    const now = ctx.currentTime;
    const harmonics = [220, 440, 660, 880];
    const gains = [0.4, 0.25, 0.15, 0.08];
    const decays = [4, 3.5, 3, 2.5];

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.5, now);
    master.connect(ctx.destination);

    for (let i = 0; i < harmonics.length; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(harmonics[i], now);

      gain.gain.setValueAtTime(gains[i], now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + decays[i]);

      osc.connect(gain);
      gain.connect(master);

      osc.start(now);
      osc.stop(now + decays[i]);
    }
  } catch {
    // Audio not available — fail silently
  }
}

/**
 * Gentle chime — short bright tone with fast attack, medium decay.
 */
export function playChime(): void {
  try {
    const ctx = getContext();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, now); // C5

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(783.99, now); // G5

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2);
    osc2.stop(now + 2);
  } catch {
    // Audio not available — fail silently
  }
}

/**
 * Soft tick — subtle audio feedback for button presses.
 */
export function playTick(): void {
  try {
    const ctx = getContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch {
    // Audio not available — fail silently
  }
}
