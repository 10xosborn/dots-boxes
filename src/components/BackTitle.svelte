<script lang="ts">
  import { go, type Screen } from '../lib/state/app.svelte';
  let { title, to = 'home', id }: { title: string; to?: Screen; id: string } = $props();
</script>
<div class="row" style="margin-bottom:12px">
  <button class="back" aria-label="Back" onclick={() => go(to)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg></button>
  <h2 {id} style="margin:0">{title}</h2>
</div>
