<script lang="ts">
  /** The three themes as a radio group, each with a small preview; choosing one applies it at once. */
  import { app, saveSettings } from '../lib/state/app.svelte';
  import { SKINS, type Skin } from '../lib/theme/themes';

  let group: HTMLDivElement;
  function pick(id: Skin) { app.settings.skin = id; saveSettings(); }
  // Arrow keys move through the themes, as in any radio group.
  function key(e: KeyboardEvent, i: number) {
    const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + SKINS.length) % SKINS.length;
    pick(SKINS[n].id);
    group.querySelectorAll<HTMLElement>('[role=radio]')[n]?.focus();
  }
</script>

<div class="theme-opts" role="radiogroup" aria-label="Theme" bind:this={group}>
  {#each SKINS as s, i (s.id)}
    {@const on = app.settings.skin === s.id}
    {@const [page, board, box, line1, line2, dot] = s.swatch[app.settings.theme]}
    <button type="button" class="theme-opt" role="radio" aria-checked={on} tabindex={on ? 0 : -1} onclick={() => pick(s.id)} onkeydown={e => key(e, i)}>
      <svg viewBox="0 0 52 52" aria-hidden="true">
        <rect width="52" height="52" fill={page} />
        <rect x="7" y="7" width="38" height="38" rx="3" fill={board} />
        <rect x="14" y="14" width="12" height="12" fill={box} />
        <path d="M14 14H26M14 26H26M14 14V26" stroke={line1} stroke-width="2.6" stroke-linecap="round" fill="none" />
        <path d="M26 14V26M26 26H38" stroke={line2} stroke-width="2.6" stroke-linecap="round" fill="none" />
        <g fill={dot}>{#each [14, 26, 38] as y}{#each [14, 26, 38] as x}<circle cx={x} cy={y} r="2.3" />{/each}{/each}</g>
      </svg>
      <span><b style:font-family={s.font}>{s.name}</b><small>{s.blurb}</small></span>
      <span class="tick" aria-hidden="true">&#10003;</span>
    </button>
  {/each}
</div>
