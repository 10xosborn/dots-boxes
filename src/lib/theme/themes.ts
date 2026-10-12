/**
 * The three UI themes (DESIGN.md). A theme ("skin") sets the data-skin attribute on the root element;
 * light or dark sets data-theme. app.css holds every token; this file holds what code needs:
 * names for the theme picker, the browser bar colour and the picker's preview swatches.
 */
export type Skin = 'table' | 'neon' | 'paper';
export type Mode = 'light' | 'dark';

/** Colours for a theme's preview swatch in the picker: page, board, player 1, player 2, line. */
type Swatch = [page: string, board: string, p1: string, p2: string, line: string];

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
    bar: { light: '#E3B970', dark: '#2A1F18' },
    swatch: { light: ['#E3B970', '#C4DFC9', '#D77027', '#F4AF3D', '#23392D'], dark: ['#2A1F18', '#2F3F39', '#E9494B', '#63C1C8', '#AEC8BF'] } },
  { id: 'neon', name: 'Neon', blurb: 'Glowing lights in a dark room', font: '"Unbounded", system-ui, sans-serif',
    bar: { light: '#EEF1FA', dark: '#070A18' },
    swatch: { light: ['#EEF1FA', '#FFFFFF', '#FC4422', '#4657CE', '#4657CE'], dark: ['#070A18', '#0B0F24', '#FC4422', '#21BDCA', '#21BDCA'] } },
  { id: 'paper', name: 'Paper', blurb: 'Printed on warm, textured paper', font: '"Kalam", system-ui, sans-serif',
    bar: { light: '#E6DCC7', dark: '#1A1816' },
    swatch: { light: ['#E6DCC7', '#FCF8EF', '#FC4422', '#4657CE', '#2E2B27'], dark: ['#1A1816', '#27241F', '#FF8C32', '#21BDCA', '#EFE8DA'] } },
];

/** New players start on Minimalist Premium, the spec's recommended main look. */
export const DEFAULT_SKIN: Skin = 'table';

/** A saved value, or the default when it is missing or unknown (older saved settings have none). */
export const skinOf = (v: unknown): Skin => (v === 'table' || v === 'neon' || v === 'paper' ? v : DEFAULT_SKIN);
export const skinInfo = (s: Skin) => SKINS.find(k => k.id === s) ?? SKINS[0];
