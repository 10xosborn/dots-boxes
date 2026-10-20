/** Tiny WebAudio synth. Off by default; enabled from Settings.
 *  Browsers keep audio paused until the page has been used, so the engine is created (or woken) inside the player's
 *  presses and keys, never at load: created any earlier it starts paused, and the first sounds come late or not at all.
 *  Levels peak around -10 dBFS (loud enough for laptop speakers); a limiter keeps overlapping notes clean.
 *  Each way of playing has its own sound: a button gives a dry tick (filtered noise, unlike every pitched note here),
 *  a line tapped, clicked or drawn from the keyboard a soft tock, a line dragged from dot to dot a pop as it drops in. */
type Note = [freq: number, at: number, dur: number, type?: OscillatorType | 'noise', vol?: number, to?: number];
const SEQ: Record<string, Note[]> = {
  // A soft tock for a line tapped, clicked or drawn from the keyboard, and for the other player's lines; the quiet octave
  // above gives it an edge on small speakers.
  line: [[520, 0, 0.12, 'triangle', 0.3], [1040, 0, 0.06, 'sine', 0.06]],
  // Dragging from dot to dot: a tick when a dot is picked up, a brighter click when the line snaps into place, a round pop
  // that rises as the line drops in when let go, and a falling blip when the drag is let go with no line to draw.
  pick: [[660, 0, 0.07, 'triangle', 0.2]],
  snap: [[990, 0, 0.08, 'triangle', 0.22], [1980, 0, 0.04, 'sine', 0.04]],
  drop: [[300, 0, 0.12, 'sine', 0.36, 760], [1520, 0.035, 0.05, 'sine', 0.06]],
  cancel: [[330, 0, 0.09, 'sine', 0.2], [262, 0.06, 0.11, 'sine', 0.18]],
  // Buttons: a short burst of noise through a band round `freq` (its hiss above 5 kHz taken off), a click with no pitch, so
  // it never sounds like a line; a little quieter than the line's note.
  click: [[2400, 0, 0.03, 'noise', 0.9]],
  box: [[784, 0, 0.16, 'sine', 0.3], [1175, 0.07, 0.24, 'sine', 0.26]],
  win: [[523, 0, 0.18, 'sine', 0.28], [659, 0.12, 0.18, 'sine', 0.28], [784, 0.24, 0.18, 'sine', 0.28], [1047, 0.36, 0.4, 'sine', 0.3]],
  lose: [[440, 0, 0.22, 'sine', 0.26], [370, 0.16, 0.22, 'sine', 0.26], [294, 0.32, 0.45, 'sine', 0.26]],
  draw: [[523, 0, 0.22, 'sine', 0.26], [523, 0.2, 0.32, 'sine', 0.26]],
  // Switching Sound on in Settings plays this, so the player hears straight away that it works.
  on: [[660, 0, 0.1, 'triangle', 0.24], [990, 0.09, 0.16, 'triangle', 0.24]],
};
let ctx: AudioContext | null = null, bus: AudioNode | null = null, on = false, noise: AudioBuffer | null = null;

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

// Every button ticks when it is clicked, by a press that began on it or from the keyboard. A click the browser sends to a
// button that only appeared under the finger (the results dialog after a game's last tap) stays silent, as the dialog
// ignores it too. Heard before the button acts, so switching Sound on starts with its chime alone, and switching it off
// still ticks.
let pressedOn: Element | null = null;
const buttonOf = (t: EventTarget | null) => (t instanceof Element ? t.closest('button') : null);
if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', ev => { pressedOn = buttonOf(ev.target); }, { capture: true, passive: true });
  window.addEventListener('click', ev => { const b = buttonOf(ev.target); if (b && (ev.detail === 0 || b === pressedOn)) sfx.play('click'); }, { capture: true, passive: true });
}

function tone(c: AudioContext, [f, t0, dur, type = 'sine', vol = 0.25, to]: Note) {
  const g = c.createGain(), t = c.currentTime + 0.005 + t0;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + (type === 'noise' ? 0.001 : 0.006)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  let src: AudioScheduledSourceNode;
  if (type === 'noise') {
    if (!noise) { noise = c.createBuffer(1, Math.ceil(c.sampleRate * 0.1), c.sampleRate); const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    const s = c.createBufferSource(), band = c.createBiquadFilter(), top = c.createBiquadFilter();
    s.buffer = noise; band.type = 'bandpass'; band.frequency.value = f; band.Q.value = 1; top.type = 'lowpass'; top.frequency.value = 5000;
    s.connect(band).connect(top).connect(g); src = s;
  } else {
    const o = c.createOscillator(); o.type = type; o.frequency.value = f;
    if (to) { o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(to, t + dur * 0.6); }   // a glide
    o.connect(g); src = o;
  }
  g.connect(bus!); src.start(t); src.stop(t + dur + 0.02);
}

export const sfx = {
  enable(v: boolean) {
    on = v;
    // Off: the engine pauses once a sound already started (the switch's own tick) has played out.
    if (!v) setTimeout(() => { if (!on && ctx?.state === 'running') ctx.suspend().catch(() => {}); }, 200);
  },
  play(k: keyof typeof SEQ) {
    if (!on || (!ctx && !used())) return;   // never start the engine before the page has been used: it would start paused
    const c = engine(); if (!c) return;
    if (c.state === 'running') { SEQ[k].forEach(n => tone(c, n)); return; }
    // Still starting: play once it runs, unless that takes long enough for the sound to come late.
    const asked = performance.now();
    c.resume().then(() => { if (c.state === 'running' && performance.now() - asked < 300) SEQ[k].forEach(n => tone(c, n)); }, () => {});
  },
};
