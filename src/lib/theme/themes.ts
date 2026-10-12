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
  { id: 'table', name: 'Tabletop', blurb: 'A board game on a wooden table', font: '"Jost", system-ui, sans-serif',
    bar: { light: '#E4D2B2', dark: '#241C15' },
    swatch: { light: ['#E4D2B2', '#FCFCFA', '#2F86C6', '#B92E3B', '#3A3A3D'], dark: ['#241C15', '#1C1D20', '#2F86C6', '#D0414E', '#DADADF'] } },
  { id: 'neon', name: 'Neon', blurb: 'Coral and slate, with a soft glow', font: '"Unbounded", system-ui, sans-serif',
    bar: { light: '#736C7E', dark: '#736C7E' },
    swatch: { light: ['#E1DEE3', '#FFFFFF', '#FB5553', '#736C7E', '#FB5553'], dark: ['#2A2630', '#1C1A22', '#FB5553', '#736C7E', '#FB5553'] } },
  { id: 'paper', name: 'Paper', blurb: 'A notebook and coloured pencils', font: '"Kalam", system-ui, sans-serif',
    bar: { light: '#FBF7EE', dark: '#1F2522' },
    swatch: { light: ['#E7DFCF', '#FBF7EE', '#D0601E', '#1F4FA8', '#2E2B27'], dark: ['#161B18', '#1F2522', '#F59A5B', '#8DB8F2', '#ECEDE6'] } },
];

/** New players start on Minimalist Premium, the spec's recommended main look. */
export const DEFAULT_SKIN: Skin = 'table';

/** A saved value, or the default when it is missing or unknown (older saved settings have none). */
export const skinOf = (v: unknown): Skin => (v === 'table' || v === 'neon' || v === 'paper' ? v : DEFAULT_SKIN);
export const skinInfo = (s: Skin) => SKINS.find(k => k.id === s) ?? SKINS[0];
