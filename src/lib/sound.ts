"use client";

/**
 * Interface sounds, generated rather than shipped.
 *
 * Every sound is synthesised with the Web Audio API, so there are no audio
 * files to download, no licences to worry about, and nothing to cache. It
 * also means the sounds can be tuned in code, which is quicker than
 * re-encoding an mp3.
 *
 * The vocabulary is deliberately small and mechanical, because the site is
 * instrument-like everywhere else. A tick on hover, a soft thock on click, a
 * two-tone sweep on the theme switch. Nothing musical, nothing that would
 * survive being left on for ten minutes.
 *
 * Off by default and remembered in localStorage. A site that makes noise
 * without being asked is a site people close.
 *
 * Browsers refuse to start an audio context until the user has interacted
 * with the page, so the context is created on the first gesture even when
 * sound was already switched on from a previous visit.
 */

export type SoundName = "hover" | "click" | "toggle" | "open" | "close";

const KEY = "zham:sound";
const MASTER = 0.22;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let enabled = false;
const listeners = new Set<(v: boolean) => void>();

function read(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function persist(v: boolean) {
  try {
    localStorage.setItem(KEY, v ? "1" : "0");
  } catch {
    /* private mode */
  }
}

/** Builds the context on demand. Returns null when the browser has none. */
function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
    } catch {
      return null;
    }
    master = ctx.createGain();
    master.gain.value = MASTER;
    master.connect(ctx.destination);

    // One short noise buffer, reused for every transient.
    const len = Math.floor(ctx.sampleRate * 0.12);
    noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function getSoundEnabled(): boolean {
  return enabled;
}

export function setSoundEnabled(v: boolean) {
  enabled = v;
  persist(v);
  if (v) {
    const c = ensureCtx();
    if (c) void c.resume();
  }
  listeners.forEach((fn) => fn(enabled));
}

export function subscribeSound(fn: (v: boolean) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Called once on mount so a returning visitor's setting is honoured. */
export function initSound(): boolean {
  enabled = read();
  return enabled;
}

/** Resumes the context on the first real gesture of the session. */
export function armSoundOnGesture() {
  if (!enabled) return;
  const once = () => {
    const c = ensureCtx();
    if (c) void c.resume();
    window.removeEventListener("pointerdown", once);
    window.removeEventListener("keydown", once);
  };
  window.addEventListener("pointerdown", once);
  window.addEventListener("keydown", once);
}

function tone(
  c: AudioContext,
  out: AudioNode,
  type: OscillatorType,
  from: number,
  to: number,
  dur: number,
  peak: number,
  delay = 0,
) {
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t0);
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(out);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function burst(c: AudioContext, out: AudioNode, dur: number, peak: number, hp: number) {
  if (!noise) return;
  const t0 = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = noise;
  const filter = c.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = hp;
  const g = c.createGain();
  g.gain.setValueAtTime(peak, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(filter);
  filter.connect(g);
  g.connect(out);
  src.start(t0);
  src.stop(t0 + dur + 0.02);
}

export function playSound(name: SoundName) {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c || !master) return;
  const out = master;

  switch (name) {
    case "hover":
      // A switch tick. High, short, and barely there.
      tone(c, out, "sine", 1750, 1500, 0.035, 0.05);
      break;
    case "click":
      // A thock. A falling body plus a filtered transient on the front.
      tone(c, out, "sine", 380, 190, 0.09, 0.14);
      burst(c, out, 0.045, 0.05, 2200);
      break;
    case "toggle":
      tone(c, out, "triangle", 620, 900, 0.07, 0.09);
      tone(c, out, "triangle", 900, 1320, 0.08, 0.06, 0.05);
      break;
    case "open":
      tone(c, out, "sine", 520, 780, 0.1, 0.07);
      tone(c, out, "sine", 780, 1180, 0.11, 0.05, 0.07);
      break;
    case "close":
      tone(c, out, "sine", 780, 520, 0.1, 0.06);
      tone(c, out, "sine", 520, 320, 0.11, 0.04, 0.06);
      break;
  }
}
