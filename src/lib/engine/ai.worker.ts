/// <reference lib="webworker" />
// Runs the AI off the main thread so animations never stutter while it thinks.
import { createAI } from './ai-core.js';
import { geometry } from './rules';

const ai = createAI();
self.onmessage = (ev: MessageEvent) => {
  const { id, type, n, drawn, level } = ev.data;
  if (type === 'reset') { ai.resetGame(); return; }
  const move = ai.choose(geometry(n), new Uint8Array(drawn), level);
  (self as unknown as Worker).postMessage({ id, move });
};
