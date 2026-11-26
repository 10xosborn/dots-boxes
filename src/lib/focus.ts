/** A modal dialog's keydown handler (spec: dialogs trap focus): Tab from its last control goes back to its first, and Shift+Tab
 *  from its first to its last, so focus never leaves it (a modal dialog already keeps the page behind out of reach). Only
 *  controls Tab can reach count: a radio group's unchosen options (tabindex -1) don't. */
export function wrapTab(e: KeyboardEvent) {
  if (e.key !== 'Tab') return;
  const d = e.currentTarget as HTMLElement;
  const all = [...d.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,[tabindex]')]
    .filter(el => el.tabIndex >= 0 && !(el as HTMLButtonElement).disabled && el.getClientRects().length > 0);
  if (!all.length) return;
  const first = all[0], last = all[all.length - 1], at = document.activeElement;
  if (e.shiftKey ? at === first || !d.contains(at) : at === last) { e.preventDefault(); (e.shiftKey ? last : first).focus(); }
}
