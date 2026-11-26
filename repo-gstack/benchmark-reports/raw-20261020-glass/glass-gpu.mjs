// GPU and compositor cost of the liquid-glass variants (design-shotgun for Neon): CPU time used by each Chromium process type
// (SystemInfo.getProcessInfo) over 5 s idle on the game screen (the aurora steps four times a second) and over a 3 s held drag
// (the landing rings turn every frame; the aurora pauses), plus the frame intervals during the drag. Phone 390x844 at 2x,
// Animations on, Neon at night and by day, a 4x4 two-player game. Variants injected over the build (glass/glass-<V>.css);
// interleaved, REPS rounds, medians. Headless Chromium draws in software, so the GPU numbers are upper bounds; compare them.
// node glass-gpu.mjs [variants=now,A,B,C]
import { chromium } from 'file:///C:/Users/osbor/.claude/skills/gstack/node_modules/playwright-core/index.mjs';
const APP = process.env.APP || 'http://127.0.0.1:4173/', REPS = +(process.env.REPS || 3), VARIANTS = (process.argv[2] || 'now,A,B,C').split(',');
const DIR = 'C:/Users/osbor/AppData/Local/Temp/claude/C--Users-10xosborn-SWE-Grid-Rivals/0f966282-6aa2-4b9e-a828-6622b347074d/scratchpad/glass/';
const prod = url => { const h = new globalThis.URL(String(url)).hostname; return !h.startsWith('fonts.') && (h.endsWith('googleapis.com') || h.endsWith('firebaseio.com') || h.endsWith('firebasedatabase.app') || h.endsWith('firebaseapp.com')); };
const med = a => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : NaN; };
const b = await chromium.launch(), bcdp = await b.newBrowserCDPSession();
const cpu = async () => { const { processInfo } = await bcdp.send('SystemInfo.getProcessInfo'); const by = {}; for (const p of processInfo) by[p.type.toLowerCase()] = (by[p.type.toLowerCase()] || 0) + p.cpuTime; return by; };
const delta = (a, z) => Object.fromEntries(Object.keys(z).map(k => [k, ((z[k] || 0) - (a[k] || 0)) * 1000]));
async function session(theme, v) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); await ctx.route(prod, r => r.abort());
  await ctx.addInitScript(([s, c]) => { if (sessionStorage.getItem('x')) return; sessionStorage.setItem('x', 1); localStorage.setItem('dnb:settings', s); localStorage.setItem('dnb:cfg', c); },
    [JSON.stringify({ skin: 'neon', theme, anim: true, sound: false }), JSON.stringify({ board: { custom: false, n: 4, rows: 4, cols: 4 }, diff: 'easy', mode: 'pvp', p2: 'Player 2', first: '0' })]);
  const p = await ctx.newPage(); const bt = n => p.getByRole('button', { name: n, exact: true });
  await p.goto(APP); await bt('Play').waitFor({ timeout: 30000 }); if (v !== 'now') await p.addStyleTag({ path: `${DIR}glass-${v}.css` });
  if (await bt('Dismiss').count()) await bt('Dismiss').tap();
  await bt('Play').tap(); await bt('Start game').tap(); await p.locator('#board .dots circle').first().waitFor(); await p.waitForTimeout(1500);
  const i0 = await cpu(); await p.waitForTimeout(5000); const i1 = await cpu();
  // a held drag from the second dot of the top row, part way towards its neighbour, with synthetic pointer events
  const d0 = await cpu();
  const frames = await p.evaluate(async () => {
    const svg = document.querySelector('#board'), d = [...svg.querySelectorAll('.dots circle')], m = svg.getScreenCTM();
    const at = i => new DOMPoint(+d[i].getAttribute('cx'), +d[i].getAttribute('cy')).matrixTransform(m), a = at(1), z = at(2);
    const ev = (type, x, y) => svg.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: x, clientY: y, pointerId: 1, isPrimary: true, pointerType: 'mouse' }));
    ev('pointerdown', a.x, a.y); ev('pointermove', a.x + (z.x - a.x) * 0.3, a.y); ev('pointermove', a.x + (z.x - a.x) * 0.32, a.y + 2);
    const out = []; let last = performance.now(); const t0 = last;
    await new Promise(res => { const loop = t => { out.push(t - last); last = t; if (t - t0 < 3000) requestAnimationFrame(loop); else res(); }; requestAnimationFrame(loop); });
    ev('pointercancel', a.x, a.y); return out;
  });
  const d1 = await cpu();
  await ctx.close();
  return { idle: delta(i0, i1), drag: delta(d0, d1), frameMed: med(frames), frameP90: med(frames.slice().sort((x, y) => x - y).slice(Math.floor(frames.length * 0.8))), long: frames.filter(x => x > 20).length / frames.length * 100 };
}
for (const theme of ['dark', 'light']) {
  const got = Object.fromEntries(VARIANTS.map(v => [v, []]));
  for (let r = 0; r < REPS; r++) for (const v of (r % 2 ? [...VARIANTS].reverse() : VARIANTS)) got[v].push(await session(theme, v));
  for (const v of VARIANTS) {
    const g = got[v], k = t => Math.round(med(g.map(x => x.idle[t] || 0))), q = t => Math.round(med(g.map(x => x.drag[t] || 0)));
    console.log(`neon-${theme} ${v}: idle 5 s gpu ${k('gpu')} ms, renderer ${k('renderer')} ms | held drag 3 s gpu ${q('gpu')} ms, renderer ${q('renderer')} ms, frames median ${med(g.map(x => x.frameMed)).toFixed(1)} ms, >20 ms ${med(g.map(x => x.long)).toFixed(1)}%`);
  }
}
await b.close();
