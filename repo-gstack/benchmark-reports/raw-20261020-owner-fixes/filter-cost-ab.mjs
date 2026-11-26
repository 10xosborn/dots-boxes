// What the whole-board filter regions cost (fix/owner-2026-10-20): the line and dot filters (Tabletop's engrave and lift,
// Paper's emboss with its blur and flat shadow) now cover the whole board instead of each group's box, which was small early
// in a game. Workload per session, from a FRESH game (empty board, pass and play, Animations on): 12 taps on free lines in a
// fixed order, each timed to the next painted frame (two rAFs), then 450 ms of frame intervals while the line grows; plus the
// CPU time the renderer and GPU processes used over the 12 taps (SystemInfo.getProcessInfo: in headless Chromium the raster
// work runs in the renderer, so the filters' pixels are counted). Sizes: 4x4 on a 390x844 phone with the CPU slowed 4x, and
// 12x12 at 1920x1080. Modes: Tabletop and Paper, day and night (Neon has no line filter). main and branch interleaved,
// ROUNDS rounds, the order flipping each round. Note: on main the first lines along one row are not painted at all.
// Run under serve-two.mjs (MAIN_URL, BRANCH_URL).  ROUNDS=4 SIZES=4,12 MODES=table-dark,... node filter-cost-ab.mjs
import { chromium } from 'file:///C:/Users/osbor/.claude/skills/gstack/node_modules/playwright-core/index.mjs';
const ROUNDS = +(process.env.ROUNDS || 4);
const prod = url => { const h = new globalThis.URL(String(url)).hostname; return !h.startsWith('fonts.') && (h.endsWith('googleapis.com') || h.endsWith('firebaseio.com') || h.endsWith('firebasedatabase.app') || h.endsWith('firebaseapp.com')); };
const b = await chromium.launch(), bcdp = await b.newBrowserCDPSession();
const cpuNow = async () => { const { processInfo } = await bcdp.send('SystemInfo.getProcessInfo'); const by = {}; for (const p of processInfo) by[p.type] = (by[p.type] || 0) + p.cpuTime; return by; };
async function session(url, vp, size, cpu, skin, theme) {
  const ctx = await b.newContext({ viewport: vp, ...(vp.width < 1000 ? { deviceScaleFactor: 2, isMobile: true, hasTouch: true } : {}) }); await ctx.route(prod, r => r.abort());
  await ctx.addInitScript(([s, c]) => { if (sessionStorage.getItem('x')) return; sessionStorage.setItem('x', 1); localStorage.setItem('dnb:settings', s); localStorage.setItem('dnb:cfg', c); },
    [JSON.stringify({ skin, theme, anim: true, sound: false }), JSON.stringify({ board: size === 4 ? { custom: false, n: 4, rows: 4, cols: 4 } : { custom: true, n: 0, rows: size, cols: size }, diff: 'easy', mode: 'pvp', p2: 'Player 2', first: '0' })]);
  const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p); const btn = n => p.getByRole('button', { name: n, exact: true });
  await p.goto(url); await btn('Play').waitFor({ timeout: 30000 }); if (await btn('Dismiss').count()) await btn('Dismiss').click();
  await btn('Play').click(); await btn('Start game').click(); await p.locator('#board .dots circle').first().waitFor(); await p.waitForTimeout(900);
  if (cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
  await p.waitForTimeout(300);
  const c0 = await cpuNow();
  const r = await p.evaluate(async () => {
    const svg = document.querySelector('#board'), m = svg.getScreenCTM();
    const frame = () => new Promise(res => requestAnimationFrame(() => requestAnimationFrame(res)));
    const ev = (type, x, y) => svg.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: x, clientY: y, pointerId: 1, isPrimary: true, pointerType: 'mouse' }));
    const intervals = ms => new Promise(res => { const out = []; let last = performance.now(); const t0 = last;
      const loop = t => { out.push(t - last); last = t; if (t - t0 < ms) requestAnimationFrame(loop); else res(out); }; requestAnimationFrame(loop); });
    const key = l => ['x1', 'y1', 'x2', 'y2'].map(q => Math.round(+l.getAttribute(q))).join(',');
    const paint = [], grow = [];
    for (let k = 0; k < 12; k++) {
      const used = new Set([...svg.querySelectorAll('.lines line')].map(key));
      const segs = svg.querySelector('.lanes').getAttribute('d').split('M').filter(Boolean).map(s => s.split('L').map(q => q.trim().split(' ').map(Number))).filter(([[a, b2], [c, d2]]) => !used.has([a, b2, c, d2].map(Math.round).join(',')));
      if (!segs.length) break;
      const [[a, b2], [c, d2]] = segs[(k * 7) % segs.length], q = new DOMPoint((a + c) / 2, (b2 + d2) / 2).matrixTransform(m), t0 = performance.now();
      ev('pointerdown', q.x, q.y); ev('pointerup', q.x, q.y); await frame(); paint.push(performance.now() - t0); grow.push(...(await intervals(450)));
    }
    return { paint, grow, lines: svg.querySelectorAll('.lines line').length };
  });
  const c1 = await cpuNow();
  await ctx.close();
  return { ...r, rendererMs: ((c1.renderer || 0) - (c0.renderer || 0)) * 1000, gpuMs: ((c1.gpu || 0) - (c0.gpu || 0)) * 1000 };
}
const med = a => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : NaN; };
const p90 = a => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.floor(s.length * 0.9))] : NaN; };
const f = x => (Number.isFinite(x) ? x.toFixed(1) : 'n/a');
const SIZES = (process.env.SIZES || '4,12').split(',').map(Number);
const MODES = (process.env.MODES || 'table-dark,table-light,paper-dark,paper-light').split(',').map(s => s.split('-'));
const out = [];
for (const size of SIZES) {
  const [label, vp, cpu] = size === 4 ? ['4x4 phone, CPU 4x', { width: 390, height: 844 }, 4] : [`${size}x${size} desktop`, { width: 1920, height: 1080 }, 1];
  for (const [skin, theme] of MODES) {
    const pool = { main: { paint: [], grow: [], cpu: [], gpu: [] }, branch: { paint: [], grow: [], cpu: [], gpu: [] } }, pairs = { paint: [], cpu: [] };
    for (let r = 0; r < ROUNDS; r++) {
      const got = {};
      for (const name of r % 2 ? ['branch', 'main'] : ['main', 'branch']) got[name] = await session(name === 'main' ? process.env.MAIN_URL : process.env.BRANCH_URL, vp, size, cpu, skin, theme);
      for (const name of ['main', 'branch']) { const g = got[name]; pool[name].paint.push(...g.paint); pool[name].grow.push(...g.grow); pool[name].cpu.push(g.rendererMs / g.paint.length); pool[name].gpu.push(g.gpuMs / g.paint.length); }
      pairs.paint.push(med(got.branch.paint) - med(got.main.paint)); pairs.cpu.push(got.branch.rendererMs / got.branch.paint.length - got.main.rendererMs / got.main.paint.length);
    }
    const row = { label, mode: `${skin}-${theme}` };
    for (const name of ['main', 'branch']) { const P = pool[name]; row[name] = { paintMed: med(P.paint), paintP90: p90(P.paint), growMed: med(P.grow), growP90: p90(P.grow), janky: P.grow.filter(x => x > 20).length / P.grow.length * 100, cpuPerTap: med(P.cpu), gpuPerTap: med(P.gpu) }; }
    row.pairPaint = med(pairs.paint); row.pairCpu = med(pairs.cpu); row.slowerRounds = pairs.paint.filter(x => x > 0).length; out.push(row);
    const M = row.main, B = row.branch;
    console.log(`${label} ${row.mode}: tap to paint median ${f(M.paintMed)} -> ${f(B.paintMed)} ms (p90 ${f(M.paintP90)} -> ${f(B.paintP90)}; paired ${f(row.pairPaint)}, branch slower in ${row.slowerRounds}/${ROUNDS}); grow frames median ${f(M.growMed)} -> ${f(B.growMed)} ms, p90 ${f(M.growP90)} -> ${f(B.growP90)}, >20 ms ${f(M.janky)}% -> ${f(B.janky)}%; renderer CPU per tap ${f(M.cpuPerTap)} -> ${f(B.cpuPerTap)} ms (paired ${f(row.pairCpu)}), GPU ${f(M.gpuPerTap)} -> ${f(B.gpuPerTap)}`);
  }
}
if (process.env.JSON) (await import('node:fs')).writeFileSync(process.env.JSON, JSON.stringify(out, null, 1));
await b.close();
