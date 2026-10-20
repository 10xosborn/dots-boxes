/// <reference lib="webworker" />
// Runs the AI off the main thread so animations never stutter while it thinks.
import { createAI } from './ai-core.js';
import { geometry } from './rules';

const ai = createAI();
// Thinking on the player's time (Hard): 40 ms slices with a yield between them, so a new request is handled at once;
// it stops when there is nothing left worth solving, after 20 s, or as soon as any other message arrives.
let ponderTimer: ReturnType<typeof setTimeout> | null = null;
const stopPonder = () => { if (ponderTimer !== null) { clearTimeout(ponderTimer); ponderTimer = null; } };
self.onmessage = (ev: MessageEvent) => {
  const { id, type, rows, cols, drawn, level } = ev.data;
  stopPonder();
  if (type === 'reset') { ai.resetGame(); return; }
  if (type === 'ponder') {
    const g = geometry(rows, cols), d = new Uint8Array(drawn), until = performance.now() + 20000;
    const step = () => { ponderTimer = null; if (ai.ponder(g, d, 40) && performance.now() < until) ponderTimer = setTimeout(step, 0); };
    ponderTimer = setTimeout(step, 0);
    return;
  }
  const move = ai.choose(geometry(rows, cols), new Uint8Array(drawn), level);
  (self as unknown as Worker).postMessage({ id, move });
};
