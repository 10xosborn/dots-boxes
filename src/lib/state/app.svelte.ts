import type { DataAdapter, Profile, ScoreEntry, LbView, Level } from '../data/types';
import { kv } from '../data/local';
import { sfx } from '../sound';

export type Screen = 'home' | 'setup' | 'game' | 'online' | 'lb' | 'stats' | 'settings';

export interface Settings { anim: boolean; sound: boolean; theme: 'dark' | 'light' }
export interface GameConfig { mode: 'ai' | 'pvp'; n: number; diff: Level; first: '0' | '1' | 'r'; p2: string }

const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Single source of truth for app-wide UI state (Svelte 5 runes). */
export const app = $state({
  screen: 'home' as Screen,
  ready: false,
  notice: '' as string,
  profile: null as Profile | null,
  scores: [] as ScoreEntry[],
  settings: { anim: !reduced, sound: false, theme: 'dark', ...kv.json<Partial<Settings>>('dnb:settings', {}) } as Settings,
  cfg: { mode: 'ai', n: 4, diff: 'medium', first: '0', p2: 'Player 2', ...kv.json<Partial<GameConfig>>('dnb:cfg', {}) } as GameConfig,
  lb: { n: 4, diff: 'medium' as Level, view: 'fast' as LbView },
});

let adapter: DataAdapter | null = null;
export const setAdapter = (a: DataAdapter) => { adapter = a; };
export const data = () => { if (!adapter) throw new Error('Data adapter not ready'); return adapter; };

export function go(s: Screen) { app.screen = s; if (typeof window !== 'undefined') window.scrollTo(0, 0); }

export function saveSettings() {
  kv.set('dnb:settings', JSON.stringify(app.settings));
  applySettings();
}
export function saveCfg() { kv.set('dnb:cfg', JSON.stringify(app.cfg)); }

export function applySettings() {
  const root = document.documentElement;
  root.dataset.theme = app.settings.theme;
  document.body.classList.toggle('no-anim', !app.settings.anim);
  const meta = document.querySelector('meta[name=theme-color]');
  if (meta) meta.setAttribute('content', app.settings.theme === 'light' ? '#F4F1FF' : '#0C0A24');
  sfx.enable(app.settings.sound);
}

export async function refreshScores() { app.scores = await data().getScores(); }
