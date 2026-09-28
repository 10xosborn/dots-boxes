/** Tiny WebAudio synth. Off by default; enabled from Settings. */
type Note = [freq: number, at: number, dur: number, type?: OscillatorType, vol?: number];
const SEQ: Record<string, Note[]> = {
  line: [[520, 0, 0.07, 'triangle', 0.05]],
  box: [[784, 0, 0.12], [1175, 0.07, 0.18]],
  win: [[523, 0, 0.15], [659, 0.12, 0.15], [784, 0.24, 0.15], [1047, 0.36, 0.35]],
  lose: [[440, 0, 0.2], [370, 0.16, 0.2], [294, 0.32, 0.4]],
  draw: [[523, 0, 0.2], [523, 0.2, 0.3]],
};
let ctx: AudioContext | null = null, on = false;
function tone([f, t0, dur, type = 'sine', vol = 0.08]: Note) {
  if (!ctx) return;
  const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + t0;
  o.type = type; o.frequency.value = f;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur + 0.02);
}
export const sfx = {
  enable(v: boolean) { on = v; if (on && !ctx) { try { ctx = new AudioContext(); } catch { on = false; } } },
  play(k: keyof typeof SEQ) { if (!on || !ctx) return; if (ctx.state === 'suspended') ctx.resume(); SEQ[k].forEach(tone); },
};
