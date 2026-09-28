<script lang="ts">
  let { checked = $bindable(), label, hint, onchange }:
    { checked: boolean; label: string; hint: string; onchange?: (v: boolean) => void } = $props();
</script>

<div class="switch">
  <div><b>{label}</b><small>{hint}</small></div>
  <button class="toggle" role="switch" aria-checked={checked} aria-label={label}
    onclick={() => { checked = !checked; onchange?.(checked); }}></button>
</div>
