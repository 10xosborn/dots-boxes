<script lang="ts">
  /** The theme picker opened from the top bar: the three themes, and light or dark. Changes apply at once. */
  import { onMount } from 'svelte';
  import { app, saveSettings } from '../lib/state/app.svelte';
  import ThemeChoices from './ThemeChoices.svelte';
  import Seg from './Seg.svelte';

  let { onclose }: { onclose: () => void } = $props();
  let dlg: HTMLDialogElement;
  onMount(() => {
    dlg.showModal();   // a modal dialog: Esc closes it and focus returns to the theme button
    dlg.querySelector<HTMLElement>('[role=radio][aria-checked=true]')?.focus();
  });
  const close = () => dlg.close();
</script>

<!-- A click on the backdrop lands on the dialog itself (the content fills it), so it closes the picker. -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog class="theme-sheet" bind:this={dlg} aria-labelledby="themeTitle" onclose={onclose} onclick={e => { if (e.target === dlg) close(); }}>
  <div class="theme-body">
    <h2 id="themeTitle">Theme</h2>
    <ThemeChoices />
    <div class="theme-modes">
      <Seg label="Light or dark" bind:value={app.settings.theme} options={[{ v: 'light', label: 'Light' }, { v: 'dark', label: 'Dark' }]} onchange={() => saveSettings()} />
    </div>
    <button type="button" class="btn primary done" onclick={close}>Done</button>
  </div>
</dialog>
