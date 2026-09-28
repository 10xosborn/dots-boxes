/** One-shot confetti burst on a full-screen canvas (only called when animations are on). */
export function confetti() {
  const c = document.createElement('canvas');
  Object.assign(c.style, { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '40' });
  document.body.appendChild(c);
  const x = c.getContext('2d'); if (!x) { c.remove(); return; }
  const dpr = devicePixelRatio || 1; c.width = innerWidth * dpr; c.height = innerHeight * dpr; x.scale(dpr, dpr);
  const cols = ['#FF5C7A', '#3ED6EA', '#B7A4FF', '#FFD166', '#ffffff'];
  const parts = Array.from({ length: 140 }, () => ({ x: innerWidth / 2 + (Math.random() - 0.5) * 120, y: innerHeight * 0.35,
    vx: (Math.random() - 0.5) * 11, vy: -Math.random() * 12 - 4, s: Math.random() * 7 + 4, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
    c: cols[Math.floor(Math.random() * cols.length)] }));
  const t0 = performance.now();
  const f = (t: number) => {
    const k = (t - t0) / 1000; x.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of parts) { p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.globalAlpha = Math.max(0, 1 - k / 2.8); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); x.restore(); }
    if (k < 2.8) requestAnimationFrame(f); else c.remove();
  };
  requestAnimationFrame(f);
}
