// Home page load, main vs branch interleaved (under serve-two.mjs: MAIN_URL, BRANCH_URL): a cold context per load on a
// 390x844 phone at 2x with the CPU slowed 4x, Firebase blocked; the /benchmark skill's metrics from the page's own entries:
// TTFB, FCP, LCP, DOM interactive, DOM complete, full load, requests, transfer, JS and CSS bytes; and "home ready" (the
// Play button in the page). Medians over ROUNDS loads per build, the order flipping each round.  ROUNDS=8 MODES=table-dark,paper-light
import { chromium } from 'file:///C:/Users/osbor/.claude/skills/gstack/node_modules/playwright-core/index.mjs';
const ROUNDS = +(process.env.ROUNDS || 8), MODES = (process.env.MODES || 'table-dark,paper-light').split(',');
const prod = url => { const h = new globalThis.URL(String(url)).hostname; return !h.startsWith('fonts.') && (h.endsWith('googleapis.com') || h.endsWith('firebaseio.com') || h.endsWith('firebasedatabase.app') || h.endsWith('firebaseapp.com')); };
const med = a => { const s = [...a].filter(Number.isFinite).sort((x, y) => x - y); return s.length ? Math.round(s[Math.floor(s.length / 2)]) : NaN; };
const b = await chromium.launch();
async function once(url, skin, theme) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); await ctx.route(prod, r => r.abort());
  await ctx.addInitScript(s => { localStorage.setItem('dnb:settings', s); new PerformanceObserver(l => { const e = l.getEntries().pop(); if (e) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new MutationObserver((_, o) => { if ([...document.querySelectorAll('button')].some(x => x.textContent.trim() === 'Play')) { window.__ready = performance.now(); o.disconnect(); } }).observe(document, { childList: true, subtree: true }); },
    JSON.stringify({ skin, theme, anim: true, sound: false }));
  const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.goto(url, { waitUntil: 'load' }); await p.getByRole('button', { name: 'Play', exact: true }).waitFor({ timeout: 30000 }); await p.waitForTimeout(1500);
  const m = await p.evaluate(() => { const n = performance.getEntriesByType('navigation')[0], r = performance.getEntriesByType('resource'), fcp = performance.getEntriesByType('paint').find(e => e.name === 'first-contentful-paint');
    const by = t => r.filter(e => e.initiatorType === t || (t === 'css' && e.name.endsWith('.css'))).reduce((s, e) => s + (e.transferSize || 0), 0);
    return { ttfb: n.responseStart - n.requestStart, fcp: fcp ? fcp.startTime : NaN, lcp: window.__lcp ?? NaN, ready: window.__ready ?? NaN, domInteractive: n.domInteractive, domComplete: n.domComplete, load: n.loadEventEnd,
      requests: r.length, transfer: r.reduce((s, e) => s + (e.transferSize || 0), 0) + (n.transferSize || 0), js: r.filter(e => e.name.endsWith('.js')).reduce((s, e) => s + (e.transferSize || 0), 0), css: by('css') }; });
  await ctx.close(); return m;
}
const KEYS = ['ttfb', 'fcp', 'lcp', 'ready', 'domInteractive', 'domComplete', 'load', 'requests', 'transfer', 'js', 'css'];
const out = {};
for (const mode of MODES) {
  const [skin, theme] = mode.split('-'), got = { main: [], branch: [] };
  for (let r = 0; r < ROUNDS; r++) for (const t of r % 2 ? ['branch', 'main'] : ['main', 'branch']) got[t].push(await once(t === 'main' ? process.env.MAIN_URL : process.env.BRANCH_URL, skin, theme));
  out[mode] = {};
  for (const k of KEYS) out[mode][k] = { main: med(got.main.map(x => x[k])), branch: med(got.branch.map(x => x[k])) };
  console.log(`${mode}: ${KEYS.map(k => `${k} ${out[mode][k].main} -> ${out[mode][k].branch}`).join(' | ')}`);
}
if (process.env.JSON) (await import('node:fs')).writeFileSync(process.env.JSON, JSON.stringify(out, null, 1));
await b.close();
