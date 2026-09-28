export const fmtClock = (ms: number) => { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
export const fmtTime = (ms: number) => {
  const t = Math.round(ms / 100) / 10, m = Math.floor(t / 60), s = (t - m * 60).toFixed(1);
  return m ? `${m}:${s.padStart(4, '0')}` : `${s} s`;
};
export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
export const DIFF_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' } as const;
export const AI_NAMES = { easy: 'Rookie', medium: 'Tactician', hard: 'Maestro' } as const;
export const DIFF_HELP = {
  easy: 'Plays loosely and misses boxes. Good for learning.',
  medium: 'Grabs every box and never gives a free one away early.',
  hard: 'Counts chains and sacrifices boxes to keep control. Perfect on 3×3.',
} as const;
export function initials(a: string, b: string): [string, string] {
  const x = (a[0] || '1').toUpperCase(); let y = (b[0] || '2').toUpperCase();
  if (y === x) y = (b.replace(/\s/g, '')[1] || '2').toUpperCase();
  if (y === x) y = '2';
  return [x, y];
}
