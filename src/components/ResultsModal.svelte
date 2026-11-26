<script module lang="ts">
  export interface ResultInfo {
    kind: 'win' | 'loss' | 'draw';
    title: string; score: [number, number]; ms: number; tags: string[];
    xp?: { gained: number; before: number; after: number };
    compare?: string; compareHi?: boolean; rank?: string;
    /** The players in the score's order, and the seat of whoever holds this device (null on one shared device): Paper's
     *  scorecard names the opponent ("vs Tactician"). */
    names?: [string, string]; you?: 0 | 1 | null;
  }
</script>

<script lang="ts">
  // The results dialog (spec, step 5), a modal dialog over the finished board in each theme's style: Tabletop's square sheet,
  // Neon's rounded glass with a glow ring, Paper's torn scorecard (tallies, a hatched level bar and an XP stamp that lands
  // last), which slides up over the board page. It must be answered: Esc does nothing.
  import { onMount } from 'svelte';
  import { app } from '../lib/state/app.svelte';
  import { level } from '../lib/progression';
  import { fmtTime } from '../lib/format';
  import { confetti } from '../lib/confetti';
  import { marks, tallyW } from '../lib/tally';
  import { wrapTab } from '../lib/focus';

  let { info, primary, secondary = [] }: {
    info: ResultInfo;
    primary: { label: string; run: () => void };
    secondary?: { label: string; run: () => void }[];
  } = $props();

  const paper = $derived(app.settings.skin === 'paper');
  const A = $derived(info.xp ? level(info.xp.before) : null);
  const B = $derived(info.xp ? level(info.xp.after) : null);
  const up = $derived(!!A && !!B && B.level > A.level);
  let width = $state(0), dlg: HTMLDialogElement, card: HTMLDivElement, btn: HTMLButtonElement;
  $effect(() => {
    if (!A || !B) return;
    width = B.level > A.level ? 0 : A.pct;              // start where the bar was
    const t = setTimeout(() => (width = B.pct), 60);     // then fill to the new value
    return () => clearTimeout(t);
  });
  // The tap that ends a game opens this dialog under the finger, and the browser then sends that tap's click to
  // whatever is there now (Rematch or Leave). Only a press that starts on the dialog counts; keys always do.
  let pressed = false;
  const act = (run: () => void) => (ev: MouseEvent) => { if (pressed || ev.detail === 0) run(); };

  // Paper's heading: "Scorecard · 5×5 · Medium · vs Tactician" (both names on one shared device).
  const versus = $derived(!info.names ? '' : info.you == null ? `${info.names[0]} vs ${info.names[1]}` : `vs ${info.names[1 - info.you]}`);
  const eyebrow = $derived(['Scorecard', ...info.tags, versus].filter(Boolean).join(' · '));
  // Each score's tally marks under it: one row of up to four gates, or two rows that shrink to fit the column.
  const tally = (n: number) => {
    const gates = Math.ceil(n / 5), rows = gates > 4 ? 2 : 1, per = Math.ceil(gates / rows) || 1;
    return { d: marks(n, per), w: rows > 1 ? per * 31 - 4 : tallyW(n), h: rows * 30 - 4 };
  };

  // Paper's scorecard covers the board page (spec: "fills the phone; centred on desktop"): on a phone from under the two score
  // rows to the foot of the page, as wide as the sheet; from 640 px wide (tablets, the desktop spread) centred on the board.
  // Measured from the game's layout, since the dialog sits in the top layer. A phone turned sideways centres it on the screen,
  // as the other themes do (app.css).
  function place() {
    if (!card) return;
    const s = card.style, set = (k: string, v: number) => s.setProperty(k, `${Math.round(v)}px`);
    card.classList.remove('placed'); for (const k of ['--cx', '--cy', '--cw', '--ch']) s.removeProperty(k);
    const game = document.querySelector<HTMLElement>('.game'), wrap = game?.querySelector<HTMLElement>('.board-wrap');
    if (!paper || !game || !wrap || matchMedia('(orientation:landscape) and (max-height:540px)').matches) return;
    const b = wrap.getBoundingClientRect();
    if (innerWidth >= 640) {
      const w = Math.min(460, innerWidth - 32);
      set('--cx', b.left + b.width / 2 - w / 2); set('--cw', w); card.classList.add('placed');
      const h = card.offsetHeight;   // its own height at that width
      set('--cy', Math.max(16, Math.min(b.top + (b.height - h) / 2, innerHeight - 16 - h)));
      return;
    }
    const rows = game.querySelector('.sheet .srow.p1')?.getBoundingClientRect(), sheet = game.querySelector('.sheet')?.getBoundingClientRect();
    const foot = game.querySelector('.play')?.getBoundingClientRect();
    if (!rows || !sheet || !foot) return;
    set('--cx', sheet.left); set('--cw', sheet.width); card.classList.add('placed');
    // From under the score rows to the foot of the page; when its own height doesn't fit there, it rises over the rows
    // (never above 16 px from the top).
    const y = Math.max(16, Math.min(rows.bottom + 6, foot.bottom - card.offsetHeight));
    set('--cy', y); set('--ch', foot.bottom - y);
  }

  onMount(() => {
    dlg.showModal(); place(); btn.focus();
    if (info.kind === 'win' && app.settings.anim) confetti(dlg);   // inside the dialog: the top layer covers everything else
    addEventListener('resize', place);
    return () => removeEventListener('resize', place);
  });
  $effect(() => { void paper; void info; place(); });   // a theme change or the leaderboard lines arriving
</script>

<!-- closedby="none" and the cancel handler keep Esc from closing it; were it closed anyway, it opens again. -->
<dialog class="modal" class:card={paper} bind:this={dlg} closedby="none" aria-labelledby="resTitle"
  oncancel={e => e.preventDefault()} onclose={() => { if (dlg.isConnected) dlg.showModal(); }} onpointerdown={() => (pressed = true)} onkeydown={wrapTab}>
  <div class="panel" bind:this={card}>
    {#if paper}<svg class="torn" viewBox="0 0 366 12" preserveAspectRatio="none" aria-hidden="true"><path d="M0 12L0 7L7 2L15 6L20 1L25 3L30 5L36 1L41 4L49 1L55 1L63 1L68 2L73 5L81 1L87 1L93 3L101 2L106 5L113 5L119 1L125 3L130 5L135 5L140 5L146 4L154 3L162 5L170 3L177 2L183 6L189 1L196 5L204 3L212 3L217 1L225 2L232 2L240 4L245 6L250 5L257 3L264 5L272 5L280 1L285 3L293 6L298 1L305 6L313 3L321 6L328 1L336 3L342 5L347 4L352 2L359 2L365 4L366 4L366 12Z"/></svg>{/if}
    <div class="res-head">
      {#if paper}
        <p class="eyebrow">{eyebrow}</p>
      {:else}
        <svg class="res-icon" viewBox="0 0 64 64" aria-hidden="true">
          {#if info.kind === 'win'}
            <path d="M20 10h24v12a12 12 0 0 1-24 0Z" fill="var(--gold)"/><path d="M20 14h-8v4a8 8 0 0 0 8 8M44 14h8v4a8 8 0 0 1-8 8" fill="none" stroke="var(--gold)" stroke-width="4"/><rect x="28" y="34" width="8" height="10" fill="var(--gold)"/><rect x="20" y="46" width="24" height="7" rx="3" fill="var(--gold)"/>
          {:else if info.kind === 'loss'}
            <rect x="12" y="12" width="40" height="40" rx="8" fill="none" stroke="var(--p2)" stroke-width="4"/><path d="M24 26h.01M40 26h.01" stroke="var(--p2)" stroke-width="6" stroke-linecap="round"/><path d="M24 42c4-4 12-4 16 0" fill="none" stroke="var(--p2)" stroke-width="4" stroke-linecap="round"/>
          {:else}
            <rect x="10" y="18" width="20" height="28" rx="6" fill="var(--p1-soft)" stroke="var(--p1)" stroke-width="4"/><rect x="34" y="18" width="20" height="28" rx="6" fill="var(--p2-soft)" stroke="var(--p2)" stroke-width="4"/>
          {/if}
        </svg>
      {/if}
      <h2 class="res-title" id="resTitle">{info.title}{#if paper && info.kind === 'win'}<svg class="swoosh" class:p1={info.score[1] > info.score[0]} viewBox="0 0 170 12" preserveAspectRatio="none" aria-hidden="true"><path d="M3 8C50 2 110 11 166 3"/></svg>{/if}</h2>
      <!-- One line: no space between the score and the dash. Paper writes each score's tally marks under it. -->
      <div class="res-score">{#each [0, 1] as p}{#if p}<span class="dash">–</span>{/if}<span class={p ? 'b' : 'a'}>{info.score[p]}{#if paper}{@const t = tally(info.score[p])}<svg width={t.w} height={t.h} viewBox="0 0 {t.w || 1} {t.h}" aria-hidden="true"><path d={t.d} /></svg>{/if}</span>{/each}</div>
      <div class="res-meta">{#if info.ms > 0}<span class="chip">Time <b>{fmtTime(info.ms)}</b></span>{/if}{#each info.tags as t}<span class="chip">{t}</span>{/each}</div>
    </div>
    <div class="res-body">
      {#if info.xp && B && A}
        <!-- Paper: "Level N" and the bar beside the "+N XP" stamp; a level up adds a second stamp. -->
        <div class="xpblock">
          <div class="top"><span>Level {B.level}</span><span class="gain">+{info.xp.gained} XP</span></div>
          <div class="xpbar" role="progressbar" aria-label="Progress to level {B.level + 1}" aria-valuenow={B.into} aria-valuemin={0} aria-valuemax={B.need}><b style:width="{width}%"></b></div>
          <div class="help">{B.into} / {B.need} XP to level {B.level + 1}</div>
          {#if up}<span class="levelup">{paper ? 'Level up!' : `Level up! You reached level ${B.level}`}</span>{/if}
        </div>
      {/if}
      {#if info.compare}<p class="res-note" class:hi={info.compareHi}>{info.compare}</p>{/if}
      {#if info.rank}<p class="res-note rank muted">{info.rank}</p>{/if}
      <div class="res-actions">
        <button class="btn primary" bind:this={btn} onclick={act(primary.run)}>{primary.label}</button>
        {#if secondary.length}
          <div class="row">{#each secondary as s}<button class="btn small" onclick={act(s.run)}>{s.label}</button>{/each}</div>
        {/if}
      </div>
    </div>
  </div>
</dialog>
