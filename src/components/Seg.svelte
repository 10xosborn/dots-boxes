<script lang="ts" generics="T extends string | number">
  /** Segmented control: a row of mutually exclusive buttons. */
  let { value = $bindable(), options, label, onchange }:
    { value: T; options: { v: T; label: string }[]; label: string; onchange?: (v: T) => void } = $props();
</script>

<div class="seg" role="group" aria-label={label}>
  {#each options as o (o.v)}
    <button type="button" aria-pressed={value === o.v} onclick={() => { value = o.v; onchange?.(o.v); }}>{o.label}</button>
  {/each}
</div>
