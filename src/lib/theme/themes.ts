/**
 * The three UI themes (DESIGN.md). A theme ("skin") sets the data-skin attribute on the root element;
 * light or dark sets data-theme. app.css holds every token; this file holds what code needs:
 * names for the theme picker, the browser bar colour and the picker's preview swatches.
 */
export type Skin = 'table' | 'neon' | 'paper';
export type Mode = 'light' | 'dark';

/** Colours for a theme's preview swatch in the picker: page, board, player 1's box, each player's lines, the dots. */
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
    bar: { light: '#E3B970', dark: '#200B32' },
    swatch: { light: ['#E3B970', '#C4DFC9', '#D77027', '#BF4E1E', '#7C5E08', '#2C4637'], dark: ['#200B32', '#0C4E41', '#BE3926', '#F59A86', '#B3B8F7', '#E9E1F0'] } },
  { id: 'neon', name: 'Neon', blurb: 'Glowing lights in a dark room', font: '"Unbounded", system-ui, sans-serif',
    bar: { light: '#EEF1FA', dark: '#200B32' },
    swatch: { light: ['#EEF1FA', '#FFFFFF', '#FC4422', '#FC4422', '#4657CE', '#4657CE'], dark: ['#200B32', '#2D2F79', '#BE3926', '#FF6A4D', '#3FE0C0', '#E4DEFF'] } },
  { id: 'paper', name: 'Paper', blurb: 'Printed on warm, textured paper', font: '"Kalam", system-ui, sans-serif',
    bar: { light: '#E6DCC7', dark: '#200B32' },
    swatch: { light: ['#E6DCC7', '#FCF8EF', '#FC4422', '#FC4422', '#4657CE', '#2E2B27'], dark: ['#200B32', '#4A2C63', '#F07A64', '#F28C76', '#7FE0C8', '#F3EDF7'] } },
];

/** New players start on Minimalist Premium, the spec's recommended main look. */
export const DEFAULT_SKIN: Skin = 'table';

/** A saved value, or the default when it is missing or unknown (older saved settings have none). */
export const skinOf = (v: unknown): Skin => (v === 'table' || v === 'neon' || v === 'paper' ? v : DEFAULT_SKIN);
export const skinInfo = (s: Skin) => SKINS.find(k => k.id === s) ?? SKINS[0];
