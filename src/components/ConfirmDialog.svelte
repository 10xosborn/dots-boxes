<script lang="ts">
  /** The themed confirm dialog: a title, one line and two buttons, the safe one first and focused (spec, step 5). A modal
   *  dialog, so focus stays inside it; Esc or a click outside counts as the safe choice, and focus goes back where it was. */
  import { onMount } from 'svelte';
  import { answer, type Question } from '../lib/confirm.svelte';
  import { wrapTab } from '../lib/focus';

  let { q }: { q: Question } = $props();
  let dlg: HTMLDialogElement, safe: HTMLButtonElement;
  onMount(() => { dlg.showModal(); safe.focus(); });
  const close = (yes: boolean) => dlg.close(yes ? 'yes' : '');
</script>

<!-- A click on the backdrop lands on the dialog itself (its body fills it, padding and all), so it answers with the safe choice. -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog class="confirm" bind:this={dlg} aria-labelledby="cfTitle" aria-describedby={q.text ? 'cfText' : undefined}
  onclose={() => answer(dlg.returnValue === 'yes')} onclick={e => { if (e.target === dlg) close(false); }} onkeydown={wrapTab}>
  <div class="cf-body">
    <h2 id="cfTitle">{q.title}</h2>
    {#if q.text}<p id="cfText">{q.text}</p>{/if}
    <div class="cf-actions">
      <button type="button" class="btn primary" bind:this={safe} onclick={() => close(false)}>{q.safe}</button>
      <button type="button" class="btn" onclick={() => close(true)}>{q.action}</button>
    </div>
  </div>
</dialog>
