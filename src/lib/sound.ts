/** Tiny WebAudio synth. Off by default; enabled from Settings.
 *  Browsers keep audio paused until the page has been used, so the engine is created (or woken) inside the player's
 *  presses and keys, never at load: created any earlier it starts paused, and the first sounds come late or not at all.
 *  Levels peak around -10 dBFS (loud enough for laptop speakers); a limiter keeps overlapping notes clean. */
type Note = [freq: number, at: number, dur: number, type?: OscillatorType, vol?: number];
const SEQ: Record<string, Note[]> = {
  // A soft tock for a line; the quiet octave above gives it an edge on small speakers.
  line: [[520, 0, 0.12, 'triangle', 0.3], [1040, 0, 0.06, 'sine', 0.06]],
  // Dragging from dot to dot: a tick when a dot is picked up, a brighter click when the line snaps into place,
  // and a falling blip when the drag is let go with no line to draw.
  pick: [[660, 0, 0.07, 'triangle', 0.2]],
  snap: [[990, 0, 0.08, 'triangle', 0.22], [1980, 0, 0.04, 'sine', 0.04]],
  cancel: [[330, 0, 0.09, 'sine', 0.2], [262, 0.06, 0.11, 'sine', 0.18]],
  box: [[784, 0, 0.16, 'sine', 0.3], [1175, 0.07, 0.24, 'sine', 0.26]],
  win: [[523, 0, 0.18, 'sine', 0.28], [659, 0.12, 0.18, 'sine', 0.28], [784, 0.24, 0.18, 'sine', 0.28], [1047, 0.36, 0.4, 'sine', 0.3]],
  lose: [[440, 0, 0.22, 'sine', 0.26], [370, 0.16, 0.22, 'sine', 0.26], [294, 0.32, 0.45, 'sine', 0.26]],
  draw: [[523, 0, 0.22, 'sine', 0.26], [523, 0.2, 0.32, 'sine', 0.26]],
  // Switching Sound on in Settings plays this, so the player hears straight away that it works.
  on: [[660, 0, 0.1, 'triangle', 0.24], [990, 0.09, 0.16, 'triangle', 0.24]],
};
let ctx: AudioContext | null = null, bus: AudioNode | null = null, on = false;

/** The page has been pressed or typed in (or the browser can't tell). */
const used = () => typeof navigator === 'undefined' || (navigator.userActivation?.hasBeenActive ?? true);

/** The engine, created on first use and woken if the browser paused it. */
function engine() {
  if (!ctx) {
    try {
      ctx = new AudioContext({ latencyHint: 'interactive' });
      const limit = ctx.createDynamicsCompressor();
      limit.threshold.value = -10; limit.knee.value = 6; limit.ratio.value = 8; limit.attack.value = 0.002; limit.release.value = 0.1;
      limit.connect(ctx.destination); bus = limit;
    } catch { ctx = null; return null; }
  }
  if (ctx.state !== 'running') ctx.resume().catch(() => {});
  return ctx;
}

// Presses and keys are the moments every browser lets audio start, so the engine is made or woken there. The
// listeners stay: they cost nothing and also wake an engine the browser paused later (a phone sent to the background).
// A touch only counts once the finger lifts, so the engine waits for that rather than starting paused.
function unlock() { if (on && (typeof navigator === 'undefined' || (navigator.userActivation?.isActive ?? true))) engine(); }
if (typeof window !== 'undefined') for (const t of ['pointerdown', 'pointerup', 'keydown', 'touchend']) window.addEventListener(t, unlock, { capture: true, passive: true });

function tone(c: AudioContext, [f, t0, dur, type = 'sine', vol = 0.25]: Note) {
  const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + 0.005 + t0;
  o.type = type; o.frequency.value = f;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(bus!); o.start(t); o.stop(t + dur + 0.02);
}

export const sfx = {
  enable(v: boolean) { on = v; if (!v && ctx?.state === 'running') ctx.suspend().catch(() => {}); },
  play(k: keyof typeof SEQ) {
    if (!on || (!ctx && !used())) return;   // never start the engine before the page has been used: it would start paused
    const c = engine(); if (!c) return;
    if (c.state === 'running') { SEQ[k].forEach(n => tone(c, n)); return; }
    // Still starting: play once it runs, unless that takes long enough for the sound to come late.
    const asked = performance.now();
    c.resume().then(() => { if (c.state === 'running' && performance.now() - asked < 300) SEQ[k].forEach(n => tone(c, n)); }, () => {});
  },
};
