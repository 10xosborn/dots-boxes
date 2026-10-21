<script lang="ts">
  // A player's avatar (spec, "Player avatars"): the AI's friendly bot, or a plain person silhouette for anyone without an
  // avatar of their own (those come with the avatar builder). Decoration only: the name beside it carries who it is.
  // Each theme colours it: --av1/--av2 the disc and --av1-ink/--av2-ink the figure, by player; the bot's disc --bot (the
  // AI's colour, deepened where its white head needs it), its visor --bot-visor and its eyes --bot-eye.
  let { p = 0, bot = false, size = 40 }: { p?: 0 | 1; bot?: boolean; size?: number } = $props();
</script>

<svg class="avt p{p}" class:bot width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
  <circle class="disc" cx="32" cy="32" r="32" />
  {#if bot}
    <path class="hd" d="M12.41 57.3C16 52 23 50 32 50s16 2 19.59 7.3a32 32 0 0 1-39.18 0Z" />
    <rect class="vs" x="28" y="44" width="8" height="7" />
    <path class="stalk" d="M32 18v-6" />
    <circle class="bulb" cx="32" cy="9.5" r="3.8" />
    <rect class="hd" x="11.5" y="25.5" width="6" height="13" rx="3" />
    <rect class="hd" x="46.5" y="25.5" width="6" height="13" rx="3" />
    <rect class="hd" x="16" y="17" width="32" height="28" rx="9" />
    <rect class="vs" x="20" y="24" width="24" height="12" rx="6" />
    <circle class="eye" cx="26.5" cy="30" r="2.7" /><circle class="eye" cx="37.5" cy="30" r="2.7" />
    <rect class="vs" x="26.5" y="39" width="11" height="2.8" rx="1.4" />
  {:else}
    <circle class="fig" cx="32" cy="24.5" r="11" />
    <path class="fig" d="M10.4 55.6C12.4 46.2 21 40 32 40s19.6 6.2 21.6 15.6a32 32 0 0 1-43.2 0Z" />
  {/if}
</svg>
