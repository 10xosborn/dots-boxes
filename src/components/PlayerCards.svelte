<script lang="ts">
  import type { Snippet } from 'svelte';
  import { app } from '../lib/state/app.svelte';
  import Avatar from './Avatar.svelte';
  // The game's heads-up display (spec, step 3). Tabletop and Neon: two player cards with avatars, then the turn pill whose
  // tinted half slides to the mover. Paper: a ruled score sheet, each player on a line (a sticker, the name, tally marks in
  // gates of five, the score circled while it is their turn) and a handwritten turn note under them, with a pencil arrow to
  // the board on its two-page spread. `meta` holds the game's chips (clock, size, difficulty, level); Paper writes them as one
  // line of its sheet.
  // `you`: the seat of whoever holds this device ("Your turn"), or null on one shared device (names are used instead);
  // `bot`: the second player is the AI; `extra`: boxes the mover has closed this turn (the extra-turn cue, and a chain's x2, x3).
  let { names, subs, score, turn, over, thinking = false, extra = 0, you = null, bot = false, meta }:
    { names: [string, string]; subs: [string, string]; score: [number, number]; turn: 0 | 1; over: boolean;
      thinking?: boolean; extra?: number; you?: 0 | 1 | null; bot?: boolean; meta?: Snippet } = $props();
  const paper = $derived(app.settings.skin === 'paper');
  const mover = $derived(names[turn]), yours = $derived(you === turn), xt = $derived(!over && extra > 0);
  const main = $derived(over ? 'Game over' : thinking ? `${mover} is thinking` : yours ? 'Your turn' : `${mover}'s turn`);
  const closed = $derived(`closed ${extra === 1 ? 'a box' : `${extra} boxes`}, `);
  // Re-trigger the score "bump" animation whenever a score changes.
  let bump = $state([0, 0]);
  let prev = [0, 0];
  $effect(() => { for (const p of [0, 1]) if (score[p] > prev[p]) bump[p]++; prev = [...score]; });

  // Tally marks in gates of five, drawn as the mockup's pencil strokes (four leaning a little, the fifth across them), a gate
  // every 31 px. The newest mark is its own path so it can draw itself in.
  const STROKES = [[2.6, 3.5], [9.6, 10.3], [14.6, 15.5], [21.6, 22.3]];
  const mark = (i: number) => { const g = Math.floor(i / 5) * 31, k = i % 5; return k < 4 ? `M${g + STROKES[k][0]} 3L${g + STROKES[k][1]} 23` : `M${g} 19L${g + 25} 6`; };
  const marks = (n: number) => Array.from({ length: n }, (_, i) => mark(i)).join('');
  const tallyW = (n: number) => { if (!n) return 0; const i = n - 1, g = Math.floor(i / 5) * 31, k = i % 5; return (k < 4 ? g + STROKES[k][1] : g + 25) + 2; };
</script>

{#if paper}
  <div class="sheet">
    {#each [0, 1] as p}
      {@const q = p as 0 | 1}
      <div class="srow p{p}" class:on={!over && turn === p}>
        <span class="stk"><Avatar p={q} bot={bot && p === 1} size={24} /></span>
        <div class="nm"><b>{names[p]}<svg class="ul" viewBox="0 0 90 8" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M2 5C24 2 54 7 88 3" /></svg></b> <small>{you === p ? 'you' : subs[p]}</small></div>
        <svg class="tally" width={tallyW(score[p])} height="26" viewBox="0 0 {tallyW(score[p]) || 1} 26" aria-hidden="true">
          {#if score[p] > 1}<path d={marks(score[p] - 1)} />{/if}
          {#key score[p]}{#if score[p]}<path class="new" pathLength="1" d={mark(score[p] - 1)} />{/if}{/key}
        </svg>
        <span class="sc" aria-label="{names[p]} score">{score[p]}<svg class="circ" viewBox="0 0 50 42" aria-hidden="true"><path pathLength="1" d="M9 25C6 9 33 2 43 14S40 39 22 39S4 31 14 13" /></svg></span>
      </div>
    {/each}
    <!-- One line, so no stray spaces: "go again!" to whoever holds the device, "goes again." for the AI or a friend online.
         A long name truncates (.who); the rest of the note, the cue included, stays whole (.rest). -->
    <p class="note">{#if over}Game over.{:else if xt}<span class="who">{#if yours}<span class="lead">{'Your turn. '}</span>You{:else}{mover}{/if}</span><span class="rest">{' ' + closed}<mark>{yours || (you === null && !thinking) ? 'go again!' : 'goes again.'}</mark></span>{:else if thinking}<span class="tt">{mover} is thinking</span>{:else}{yours ? 'Your turn.' : `${mover}'s turn.`}{/if}</p>
    <div class="meta">{@render meta?.()}</div>
    {#if !over}<svg class="arrow" viewBox="0 0 96 58" aria-hidden="true"><path d="M4 8C30 2 58 8 72 30S84 50 90 52" /><path d="M80 47L91 53L88 41" /></svg>{/if}
  </div>
{:else}
  <div class="hud">
    {#each [0, 1] as p}
      {@const q = p as 0 | 1}
      <div class="pcard p{p}" class:on={!over && turn === p}>
        <Avatar p={q} bot={bot && p === 1} size={40} />
        <div class="who"><div class="nm">{names[p]}</div><div class="sub">{subs[p]}</div></div>
        {#key bump[p]}<div class="sc" class:bump={bump[p] > 0} aria-label="{names[p]} score">{score[p]}</div>{/key}
      </div>
    {/each}
    <div class="turnbar" class:t1={turn === 1} class:thinking class:xt>
      <div class="pill"><span class="tt">{main}</span>{#if xt}<span class="xt"><span class="sep">·</span>+1 extra turn{#if extra > 1}<b class="combo">×{extra}</b>{/if}</span>{/if}</div>
    </div>
  </div>
  <div class="meta">{@render meta?.()}</div>
{/if}
