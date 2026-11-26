/** The themed confirm dialog (spec, step 5) in place of the browser's confirm(): `await ask({...})` is true for the action and
 *  false for the safe choice, Esc or a click outside. One question at a time; App draws it (ConfirmDialog.svelte). */
export interface Question {
  title: string;
  text?: string;
  action: string;   // the button that goes ahead (Quit, Restart, Discard…)
  safe: string;     // the one that doesn't: shown first, focused and styled as the main button
}

export const confirmState = $state<{ q: Question | null }>({ q: null });
let settle: ((yes: boolean) => void) | null = null;

export function ask(q: Question): Promise<boolean> {
  settle?.(false);   // a newer question replaces one still open
  confirmState.q = q;
  return new Promise(resolve => (settle = resolve));
}

/** Answer the open question, if any: also how a screen dismisses it (false) when the game it asks about ends or is left. */
export function answer(yes: boolean) {
  const s = settle;
  settle = null; confirmState.q = null;
  s?.(yes);
}
