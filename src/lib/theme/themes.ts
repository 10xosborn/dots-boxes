/**
 * The three UI themes (DESIGN.md). A theme ("skin") sets the data-skin attribute on the root element;
 * light or dark sets data-theme. app.css holds every token; this file holds what code needs:
 * names for the theme picker, the browser bar colour and the picker's preview swatches.
 */
export type Skin = 'table' | 'neon' | 'paper';
export type Mode = 'light' | 'dark';

/** Colours for a theme's preview swatch in the picker: page, board, player 1's box (as it shows on the board), each player's lines, the dots. */
type Swatch = [page: string, board: string, box: string, line1: string, line2: string, dot: string];

export interface SkinInfo {
  id: Skin;
  name: string;
  blurb: string;
  /** The theme's display face, so the picker can show each name in its own type. */
  font: string;
  /** theme-color meta (the browser bar) per mode. */
  bar: Record<Mode, string>;
  swatch: Record<Mode, Swatch>;
}

export const SKINS: SkinInfo[] = [
  { id: 'table', name: 'Tabletop', blurb: 'A felt game board on a wooden table', font: '"Jost", system-ui, sans-serif',
    bar: { light: '#E3B970', dark: '#A0592B' },
    swatch: { light: ['#E3B970', '#C4DFC9', '#D77027', '#BF4E1E', '#7C5E08', '#2C4637'], dark: ['#A0592B', '#6A3A1C', '#4C2C17', '#E5E4E2', '#E0A070', '#D6D3CE'] } },
  { id: 'neon', name: 'Neon', blurb: 'Glowing light under glass', font: '"Unbounded", system-ui, sans-serif',
    bar: { light: '#D5DEE7', dark: '#350014' },
    swatch: { light: ['#D5DEE7', '#EBF1F5', '#54FD36', '#0047FF', '#007F73', '#FF4500'], dark: ['#350014', '#0B0F19', '#62269A', '#BD0249', '#E28C19', '#00F0FF'] } },
  { id: 'paper', name: 'Paper', blurb: 'Printed on warm, textured paper', font: '"Kalam", system-ui, sans-serif',
    bar: { light: '#E6DCC7', dark: '#A0592B' },
    swatch: { light: ['#E6DCC7', '#FCF8EF', '#FC4422', '#FC4422', '#4657CE', '#2E2B27'], dark: ['#A0592B', '#6A3A1C', '#855D41', '#E8D5B5', '#8FB8D6', '#F3EAD7'] } },
];

/** New players start on Minimalist Premium, the spec's recommended main look. */
export const DEFAULT_SKIN: Skin = 'table';

/** A saved value, or the default when it is missing or unknown (older saved settings have none). */
export const skinOf = (v: unknown): Skin => (v === 'table' || v === 'neon' || v === 'paper' ? v : DEFAULT_SKIN);
export const skinInfo = (s: Skin) => SKINS.find(k => k.id === s) ?? SKINS[0];
