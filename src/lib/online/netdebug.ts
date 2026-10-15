/**
 * ?debug=net: a small panel of online move timings, for checking play between two phones (loaded only with the flag).
 * Each move is timed at four points: sent and confirmed by the server (on the mover's phone), heard by the other
 * phone's listener and shown on its screen; plus how long the mover's own screen took. Both phones stamp in server
 * time (their clock plus Firebase's estimate of the difference). That estimate can be off by up to half a round trip,
 * which makes one direction look slower and the other faster by the same amount, so the panel takes that amount out
 * (half the gap between the two directions' medians). The stamps go into the room (rooms/{code}/dbg), so both phones
 * show every move.
 */
import type { Player } from '../engine/rules';
import type { Room, MoveTiming } from './types';

type Api = typeof import('./room');

export function startNetDebug(api: Api, code: string, seat: Player) {
  let offset = 0;
  const off = api.watchServerOffset(ms => (offset = ms));
  const now = () => Math.round(Date.now() + offset);
  const sentAt = new Map<number, number>();
  const box = document.createElement('div');
  box.setAttribute('aria-hidden', 'true');
  box.style.cssText = 'position:fixed;right:6px;top:6px;z-index:9999;max-width:min(94vw,340px);padding:5px 7px;border-radius:6px;'
    + 'background:rgba(0,0,0,.82);color:#fff;font:10.5px/1.35 ui-monospace,Menlo,Consolas,monospace;white-space:pre-wrap;pointer-events:none';
  box.textContent = 'net debug: waiting for moves';
  document.body.append(box);
  const mark = (n: number, f: MoveTiming) => api.markMove(code, n, f);
  const med = (a: number[]) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : NaN; };
  return {
    sent(n: number) { sentAt.set(n, performance.now()); mark(n, { by: seat, s: now() }); },
    confirmed(n: number) { mark(n, { c: now() }); },
    ownShown(n: number) { const t = sentAt.get(n); if (t !== undefined) mark(n, { o: Math.round(performance.now() - t) }); },
    heard(n: number) { mark(n, { h: now() }); },
    shown(n: number) { mark(n, { r: now() }); },
    update(room: Room) {
      const d = room.dbg ?? {}, ks = Object.keys(d).map(Number).sort((a, b) => a - b), dir: [number[], number[]] = [[], []], own: number[] = [], conf: number[] = [];
      for (const k of ks) { const t = d[k]; if (!t || (t.by !== 0 && t.by !== 1)) continue;
        if (t.s && t.r) dir[t.by].push(t.r - t.s); if (t.s && t.c) conf.push(t.c - t.s); if (t.o !== undefined) own.push(t.o); }
      // Clock error between the phones: half the gap between the two directions (0 until both have a few moves).
      const skew = dir[0].length >= 3 && dir[1].length >= 3 ? (med(dir[0]) - med(dir[1])) / 2 : 0;
      const all = [...dir[0].map(v => v - skew), ...dir[1].map(v => v + skew)];
      const fmt = (v: number) => (Number.isFinite(v) ? Math.round(v) : '-');
      const last = ks.slice(-3).map(k => { const t = d[k]!, v = t.s && t.r && (t.by === 0 || t.by === 1) ? t.r - t.s + (t.by === 0 ? -skew : skew) : NaN;
        return `#${k + 1} ${t.by === 0 ? 'host' : 'guest'}: other ${fmt(v)}, confirmed ${fmt(t.s && t.c ? t.c - t.s : NaN)}, own ${t.o ?? '-'}`; });
      const poll = performance.getEntriesByType('resource').some(e => e.name.includes('.lp?'));
      box.textContent = `other screen: median ${fmt(med(all))} ms, worst ${all.length ? fmt(Math.max(...all)) : '-'} ms (${all.length} moves)\n`
        + `confirmed ${fmt(med(conf))} · own ${fmt(med(own))} · ${poll ? 'long-polling' : 'websocket'} · reconnects ${api.reconnectCount()} · clock fix ${fmt(skew)}\n`
        + last.join('\n');
    },
    stop() { off(); box.remove(); },
  };
}
