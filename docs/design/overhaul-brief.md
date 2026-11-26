ROLE
You are the lead product designer and senior Svelte/TypeScript engineer for Grid Rivals: Dots and Boxes (repo 10xosborn/dots-boxes). Stack: Svelte 5 (runes) + TypeScript + Vite, Firebase (Anonymous Auth, Firestore for scores and leaderboards, Realtime Database for online rooms), hosted on GitHub Pages. Every push to main deploys to production through .github/workflows/deploy.yml.
Mission: the whole UI looks generic, like an AI made it. Give Grid Rivals its own identity and add ethical engagement features, using my gstack skills, in small reviewable pull requests, without changing game logic, Firebase behaviour, speed or accessibility unless I approve. Before the redesign, fix what players feel today (Track R, section 7R): games lost on a reload or when a phone goes to the background, slow online moves, and a Maestro that loses on 4x4 and bigger boards. After it, add better invites, accounts and friends (Track S, section 7S). I approved both tracks on 29 Sep 2026, as specified there.

==================================================
0. HOUSE RULES (read before anything else)
==================================================
0.1 Read CLAUDE.md, README.md, src/app.css, src/lib/boardFit.ts, src/components/Board.svelte, src/lib/state/app.svelte.ts and src/lib/sound.ts first. CLAUDE.md is the source of truth. If this brief conflicts with CLAUDE.md, CLAUDE.md wins: stop, quote both passages, and ask me.
0.2 Approval gate. Before changing anything below, stop and post a CHANGE REQUEST (what, why, files, risk, rollback, and the no-change alternative), then wait for my "approved":
  - Game logic: src/lib/engine/** (rules.ts, ai-core.js, ai.ts, ai.worker.ts), turn/scoring/end rules, edge indexing, replay(), AI difficulty behaviour and the 300-800 ms "thinking" delay, the XP formula, level curve and stats in src/lib/progression.ts, what counts toward stats and leaderboards.
  - Firebase: src/lib/firebase/**, src/lib/data/** (adapters), src/lib/online/room.ts, firebase/firestore.rules, firebase/database.rules.json, any data written to Firestore or the Realtime Database, the sign-in flow, the invite link format (?room=CODE).
  - Speed: anything added to the startup path beyond the inline splash in section 10.1, any new runtime dependency (GSAP included), a service worker, or exceeding the budgets in section 9.
  - Accessibility: anything that removes or weakens an item in section 8.
  - Board input: pointer handling, hit-testing (edgeAt and its sp*0.34 threshold), drag-to-adjust, the keyboard cursor logic and focus behaviour in Board.svelte. Visual changes to the board are allowed; input behaviour is not.
  Already approved (29 Sep 2026): exactly what sections 7R and 7S specify, and nothing more. List those changes under "Approval gates hit" in each PR. rules.ts (turns, scoring, end of game, edge indexing, replay()) stays unchanged in every track.
0.3 Attribution. Commits and PR descriptions must contain no AI attribution: no "Co-Authored-By: Claude" trailer, no "Generated with Claude Code" line, no bot signature. This overrides gstack /ship defaults and any tool default. Use my git identity only.
0.4 Merging to main deploys to production. Never push to main and never merge. Open the PR, report, and wait for me to merge.
0.5 PR #3 (branch fix-cursor-and-ai-variety: keyboard cursor only in keyboard play; Hard AI varies its moves) is open and touches Board.svelte and app.css. Ask me whether it is merged before you start. Branch from the latest main after it lands and keep its behaviour.
0.6 Keep the architecture: Svelte 5 runes, the app.screen switch in App.svelte (no router), the DataAdapter pattern, the AI Web Worker, lazy Firebase imports. Prefer CSS, svelte/transition, svelte/motion and the Web Animations API over libraries. You may consult my ui-ux-pro-max-skill, gsap-skills and mobile-app-ui-design skills for checklists, but gstack drives the workflow and DESIGN.md is the design authority.
0.7 gstack keeps mockups and boards in ~/.gstack/projects/. Anything the repo needs (DESIGN.md, docs/design/overhaul-plan.md, final assets, licences) must be committed in the repo.
0.8 When you need a decision from me, ask at most 2-3 questions at a time, each with multiple-choice options (AskUserQuestion), your recommendation first. Sections 7R and 7S mark CHECKPOINT questions: ask each one when you reach it, with the options given there (fill in measured numbers where shown), and never decide anything about money, accounts or personal data on your own.

==================================================
1. THE PROBLEM AND THE IDENTITY GOALS
==================================================
Why it looks AI-made today (all in src/app.css unless noted): purple-indigo gradient page background (#0C0A24 to #22114A); three blurred "aurora" blobs; frosted-glass panels (backdrop-filter blur); a pink-violet-cyan gradient primary button; neon glow (CSS drop-shadow on every board line in Board.svelte, glowing active player cards); the same large radius on everything (22 px panels, 999 px chips); a grid-paper board background; bounce easing on pops; a centered hero. These match gstack's AI-slop blacklist. Replace all of them.
Identity goals (write them into DESIGN.md):
  - One core metaphor carries the visuals, motion, sound, copy and the end-of-match moment.
  - Recognisable from one cropped screenshot of the board.
  - Calm focus while playing; big, earned celebration only for big moments.
  - The two players are told apart by colour AND pattern AND initials, never colour alone.
  - Designed first for a 360x640 Android phone on mobile data, then laptops.
  - Honest engagement: players return because the game is good and their progress is theirs, never because of pressure.

==================================================
2. STEP 1: /design-consultation (creates DESIGN.md)
==================================================
Run /design-consultation with this context:
  - Product: 1-5 minute Dots and Boxes matches against three AI rivals (Rookie = easy, Tactician = medium, Maestro = hard), pass-and-play on one device, online games with a friend by invite link, XP and levels, fastest-win leaderboards on 3x3 to 6x6, custom boards up to 12x12.
  - Audience and use scene: students and younger players (assume some are 10-17), mostly mid-range Android phones on mobile data, in short breaks and in the evening; laptops second.
  - The memorable thing: every match leaves a beautiful artifact of who claimed what.
  - Propose and preview these five candidate directions and keep all five open until Step 2:
    A. Loom (my default). The board is a loom: lines are threads, closed boxes are woven in the owner's pattern (P1 twill, P2 basket weave), and the finished board is a cloth you keep. Dyed-thread colours on a matte, textured ground; crisp "thread-pull" line motion; warm wooden mallet sounds (marimba-like), pentatonic. Use original weave structures only: do not reproduce Kente patterns or Adinkra symbols (Ghana's National Folklore Board requires authorisation for branding or commercial use under Copyright Act 2005, s.64).
    B. Pegboard. A classroom geoboard: lines are elastic bands that snap between pegs; boxes click in as coloured tiles; tactile offset shadows; bright moulded-plastic colours; rubber-band twang and wood-clack sounds. Playful and kid-friendly.
    C. Glasswork. A leaded window: lines are lead cames; boxes fill with light as coloured glass panes; a finished match is a window. Jewel tones, soft chimes. Serene and premium, with no outer glow.
    D. Zen Garden. A raked-sand garden: lines are raked grooves; captured boxes settle in with a quiet bloom; sand, ink, jade and stone on a real sand texture; paper-like cards with soft shadows; slow, gentle motion; soft piano and ambient field recordings at very low volume. Avoid gstack's cream-serif-terracotta default look; draw on materials, not religious symbols.
    E. Retro Pixel. An arcade cabinet: 8/16-bit board, chunky borders, pixel dither patterns for ownership, steps() animations of 8-12 frames; pixel display type for headings only (never body text, never under 16 px); low-tempo chiptune at low volume. No CRT flicker or flashes.
    Rejected: the pen-and-paper notebook look (it trips the grid-paper, cream-palette and hand-drawn-illustration rules), today's neon-on-dark look, and "Neon Arcade" (glowing cyan and magenta on navy, glass panels, gradient buttons, Space Grotesk and Inter), which is today's look again and trips gstack's hard rejects.
  - Add these sections to DESIGN.md beyond gstack's template: Game board (dots, lines, line preview, pressed line, keyboard cursor, box fills, ownership patterns, last-move marker, chain feedback); Sound (palette, musical key, buses, loudness, music); Brand moments (splash, optional match intro, results reveal, level-up); Interaction states and micro-interactions (section 5 of this brief); Accessibility invariants (section 8); Engagement ethics (section 7.0); Performance budgets (section 9).
  - Constraints for DESIGN.md: a colour-vision-safe player pair (for example an orange family versus a blue family); each player colour at least 3:1 against the board; body text at least 4.5:1; focus indicators at least 3:1; keep both light and dark themes (the app has a toggle) and pick the primary theme from the use scene; at most 2 self-hosted font families; no font from gstack's overused-display list as the display face.
  - Preview: use the HTML preview path (gstack's Path B). Do not run gstack's design binary for image mockups: my OpenAI key has no credits, and gstack retries a 429 as if it were a rate limit.
Output: DESIGN.md at the repo root with tokens marked PROVISIONAL and a Decisions Log. gstack appends a "Design System" section to CLAUDE.md: allowed, keep it.

==================================================
3. STEP 2: /design-shotgun (I choose the direction)
==================================================
Run /design-shotgun and tell it: "DESIGN.md is provisional. Explore its five candidate directions."
  - Round 1: the Game screen mid-match on a 390x844 phone (4x4 board, a 3-box chain just captured, Maestro thinking) for all five directions, A to E.
  - Round 2: for the two I rate highest, add Home, Results after a win, and one splash keyframe. Each direction keeps its own font family, palette and layout, as gstack requires.
  - Every variant keeps: ownership patterns plus initials, all HUD information (names, scores, whose turn, clock, board size, difficulty, level), a board dot gap of at least 40 px, safe-area padding.
  - No AI image mockups (my OpenAI key has no credits): never run $D generate, variants, iterate or evolve, which call OpenAI. Build each variant as a self-contained HTML/SVG page at 390x844 and 1280x800, with the real board geometry from boardFit.ts, the candidate fonts, and working hover, pressed and focus states. Screenshot each page with gstack's browser, then show the PNGs on gstack's comparison board ($D compare --images a.png,b.png,... --serve, which runs locally with no API calls) so I can rate and comment. If the board fails, open the HTML pages side by side.
After I pick: update DESIGN.md with the final tokens, remove PROVISIONAL, log the decision, commit on branch design/00-design-system and open the PR "Design system" (docs only).

==================================================
4. STEP 3: PLAN, THEN /plan-design-review
==================================================
Write docs/design/overhaul-plan.md with one entry per PR in section 6: scope, files touched, layout impact (does anything above or below the board change height?), acceptance criteria, risks, and any approval gate it hits. Run /plan-design-review on it and raise every dimension to at least 8/10, or explain why not. Optionally run /plan-eng-review on the audio engine, the share card and the puzzle generator. Wait for my OK on the plan before building.

==================================================
5. STEP 4 AND STEP 5: BUILD IN SMALL PRs, GATE EVERY PR
==================================================
Baseline first (before PR 01): screenshots of every screen at 360x640, 390x844, 768x1024 and 1280x800 in dark and light; npm run build sizes; a /benchmark baseline; one keyboard-only full game; one screen-reader pass of a full game (move announcements).
For every PR:
  1. Branch design/NN-short-name (Track R: fix/rN-short-name; Track S: social/sN-short-name) from the latest main. One concern per PR; aim for under about 400 changed lines, excluding generated data and assets.
  2. Implement, then npm run check and npm run build.
  3. Start the dev server and run /design-review (diff-aware on the branch, against the local URL).
  4. Run /qa at the standard tier. If it offers to add a dev-only test framework (Vitest or Playwright), that is approved as devDependencies only.
  5. Run /benchmark and compare with the baseline.
  6. Fix what they find, re-run, then open the PR with the template in section 11 and stop for my review.

INTERACTION STATES (every button and control; PR 02, then every PR)
Specify every micro-interaction in DESIGN.md in Saffer's four parts: trigger, rules, feedback, and loops and modes.
Covers: .btn and all variants, the brand/home button, the level chip, back buttons, segmented controls, toggles, size steppers, text inputs, leaderboard tabs, results actions, links and any new control.
  - Hover: only under @media (hover: hover) and (pointer: fine), so touch screens never get stuck hover. A visible change within 120 ms, as DESIGN.md defines. Pointer cursor.
  - Pressed/active: shows within 50 ms (for example translateY(1px) or scale(.98) plus a darker tone). Works on touch; replace the default tap highlight (-webkit-tap-highlight-color: transparent) with the designed pressed state.
  - Focus-visible: a ring or outline of 2-3 px, offset 2-3 px, at least 3:1 against both the control and its background, never clipped by overflow (check .tabs and the results dialog) and never hidden under sticky elements (WCAG 2.4.11). No ring for mouse or touch focus (:focus:not(:focus-visible)), matching the board's current behaviour.
  - Disabled: clearly inactive, cursor not-allowed, no hover or press effect, still readable.
  - Busy: async buttons (Start game when saving a name, Create game, Join, Save name, Reset stats) show a busy state with aria-busy="true" and block double submits.
  - Selected: aria-pressed segments and aria-checked toggles get a non-colour cue too (weight, indicator or icon).
  - Board lines: restyle the hover preview; add a pressed state while the pointer is down; restyle the keyboard cursor (keyboard mode only) at 3:1 or better; drawn lines have no hover.
  - Size: controls stay at 44x44 px or larger (the current standard) and never below 24x24 px (WCAG 2.5.8).

==================================================
6. PR PLAN (approved scope unless marked APPROVAL)
==================================================
6A ORDER OF WORK (updated 29 Sep 2026)
  1. PR #3 lands (0.5).
  2. Track R (section 7R) comes before PR 01, because players feel these problems today: R1 Resume and presence; R2a Measure online latency; R2b Faster moves; R3a AI benchmark; R3b Maestro engine; R3c Opening books. /design-consultation and /design-shotgun produce documents, not code: run them once R1 is open for my review. Any small UI in Track R uses today's styles and components; PR 01-02 restyle it later.
  3. Right after Track R, before PR 01 (my decision on 30 Sep 2026): S2 Installable app, in today's colours with an icon made from the current mark (PR 01 swaps in the new ones), then S1 Invite links.
  4. PR 00-15 below.
  5. The rest of Track S (section 7S) after PR 09, so its screens use the new design system: S3 Accounts and usernames; S4 Friends and online status; S5 Invite server and push; S6 SMS and email invites.
  Tracks R and S follow section 5 like every other PR (/design-review for any UI, /qa, /benchmark), plus the tests in their own specs.

PR 00 Design system (DESIGN.md, docs only).
PR 01 Tokens and foundations (F1): CSS custom properties from DESIGN.md in app.css (colour, type, spacing, radius hierarchy, elevation, motion, z-index); self-hosted fonts (woff2, Latin subset, preload the display face, font-display: swap; remove the Google Fonts links); remove the aurora blobs, frosted glass, gradient button, grid-paper background and glows; light and dark themes; theme-color meta per theme; the PWA manifest colours and app icons (S2 ships before PR 01). No layout change yet.
PR 02 Controls and interaction states (F2, section 5), plus an accessible ConfirmDialog.svelte (focus trap, Esc cancels, destructive action clearly marked) replacing window.confirm and window.prompt (Quit, Restart, Leave game, Reset stats, the copy-invite fallback) with the same choices.
PR 03 Opening splash (F3, section 10.1).
PR 04 Game screen and board (F4): HUD (player cards, turn indicator, meta chips, actions), board skin, last-move marker, chain feedback, optional match intro, invalid-move feedback (F28), removal of per-line CSS filters. If chrome above or below the board changes height, follow section 8.4.
PR 05 Sound engine and musical sound effects (F5, section 10.2).
PR 06 Background music and its controls (F6, section 10.3).
PR 07 Results as the peak moment (F8) and the share card (F15).
PR 08 Home (including the HeroBoard demo, restyled to the new metaphor), Quick Play, first-run sound choice and the 30-second tutorial (F9); AI rival personalities (F10).
PR 09 Restyle Setup, Online (lobby, waiting, game), Leaderboard, Stats and Settings; the "your move" tab signal (F19); haptics (F7).
PR 10 Feats (F13), feat Moments and gallery (F27), Road to Maestro (F17), Weekly Rhythm (F12), session wrap-up (F18).
PR 11 Earned styles (F16) and Seasons (F25).
PR 12 Daily goals (F24) and Rank tiers (F26).
PR 13 Daily Puzzle and its generator script (F11).
PR 14 Replay (F14).
PR 15 Documentation pass (section 12).
APPROVAL (write a CHANGE REQUEST for each and build nothing until I approve): F20 preset emotes in online rooms (Realtime Database rules), F22 weekly leagues (Firestore rules), "your move" push notifications, F29 clubs, online-rated games for F26, and any analytics. F21 (friends) and F23 (installable app) are now approved as Track S.

==================================================
7. ENGAGEMENT ETHICS, FEATURE SPECS AND ACCEPTANCE CRITERIA
==================================================
7.0 Engagement ethics (copy into DESIGN.md; check every PR against it)
  Principles: feedback over fireworks, acknowledgment over endless streaks, agency over hooks.
  Always:
  - Rewards come from skill and play, and are explained (keep the XP formula on Stats).
  - Offer natural stopping points; celebrate a good session, not time spent.
  - Let players hide the weekly rhythm and turn off chatter, sound, music, vibration and animations.
  - End losses kindly, with one useful tip.
  - Show only real progress.
  Never:
  - Energy, lives or timers that gate play.
  - Loot boxes, surprise chests or other random rewards with value, currencies, purchases, ads or rewards for watching them, pay-to-skip or paid streak repair.
  - Loss-framed streaks: no alerts about a broken streak, no red "lost" states, no countdowns.
  - Time-limited exclusives that never return.
  - Fake players, fake activity, or bots presented as people.
  - Auto-starting the next match or endless queues.
  - Guilt or shame copy ("Maestro is disappointed you left").
  - Rewards for inviting friends, contact uploads, or free-text chat.
  - Notifications without opt-in, at night, or about missed play.
  - Public shaming ranks ("bottom 10%").
  - Collecting data the game doesn't need.
  - Fake scarcity, shame-based social penalties, or pre-checked consent boxes.
  Test for every feature: would a player feel tricked, pressured or guilty? If yes, it doesn't ship.

F4 Game screen and board
  - Signature motion from DESIGN.md: a line draws from the nearer dot to the far one in 240 ms or less; a box claim lands in 320 ms or less. No generic bounce; overshoot only if the chosen direction justifies it, at most 6%.
  - Success-scaled feedback. Count the boxes the mover has closed this turn (UI state only; reset when the turn passes). 1 box: fill plus sound. 2-3 boxes: add a small "x2"/"x3" mark near the last box (aria-hidden, because the live region already announces the move). 4 or more: add a stronger accent (for example a 400 ms board-frame tint) and rising notes. Each captured box may show a brief "+1" that floats up and fades (aria-hidden); particles, if any, stay under 30 and scale with the chain. Never shake, zoom or cover lines; the board state must stay readable throughout.
  - Last-move marker: the most recent line (lines[lines.length - 1]) gets a distinct marker by shape as well as colour until the next move; opponent and friend moves get one 300 ms emphasis.
  - Remove the style:filter drop-shadow on lines; create depth with static styles only.
  - HUD: restyle player cards, turn indicator, chips and actions; keep every piece of information; fixed heights so scores and turn changes cause no layout shift.
  - Board background comes from DESIGN.md (a real texture asset is fine; no CSS grid-paper gradient).
  - Optional match intro under the Animations setting: at most 900 ms, shows both players or the rival's mark before move one, skipped by any tap or key, never shown for rematches.
  - Acceptance: 60 fps during a 6-box chain on 6x6 with 4x CPU throttling; a 12x12 board renders with no per-element filters; both themes pass contrast; players stay distinguishable in DevTools deuteranopia, protanopia, tritanopia and achromatopsia emulation.

F7 Haptics (Android)
  - Use navigator.vibrate only when it exists and the new "Vibration" setting is on (default on; hide the setting when unsupported). No iOS workarounds.
  - Own line 8 ms; own capture 18 ms; own chain of 3+ [18,40,18]; win [30,60,30,60,60]; loss or draw 20 ms. Never on the opponent's moves. Keep one hierarchy: lightest for placing lines and invalid taps, medium for captures, strongest only for the end of a game.

F8 Results as the peak moment
  - New BoardSnapshot.svelte: a static SVG of the finished board in the artifact style, built with geometry() and layout() read-only. Do not reuse or modify Board.svelte for this. Reveal in 600 ms or less; static when animations are off.
  - Headline by outcome plus the rival's reaction line (F10).
  - Replace the generic confetti (src/lib/confetti.ts) with a win celebration in the chosen direction's material: at most 60 particles, 1.5 s or less, wins only, none when animations are off.
  - Key moment from a new pure helper, src/lib/insights.ts, that replays the saved moves with the existing rules.ts functions (no engine edits): biggest single-turn capture (boxes and move number) and largest deficit overcome. After a loss, add one tip from a fixed list, chosen by simple detectors (for example "you drew a box's third side while a safe line existed", computed from boxEdges).
  - Keep the XP bar, level-up and the existing leaderboard compare and rank texts exactly as computed today; restyle only. Add a "next goal" line (XP to the next level, or the nearest feat or Road to Maestro step).
  - Actions: primary "Play again" (vs AI) or "Rematch" (online), autofocused as today; secondary Share (F15), Replay (F14), Change settings, Leaderboard (ranked boards only).
  - Keep role="dialog", aria-modal and the labelled title; add a focus trap while open.
  - Acceptance: Play again stays one tap or one Enter from the moment the dialog opens.

F9 Home, Quick Play, first-run sound choice, tutorial
  - Home primary "Play" starts a game at once with the saved setup (app.cfg), skipping Setup. First-time players (no scores and no dnb:ftue flag) start on Rookie 3x3. A secondary "Game options" opens Setup.
  - First-run sound choice: a small inline panel on Home, not a modal: "Play with sound?" [Sound on] [Silent]. The tap is the user gesture that unlocks audio. Save the choice and never ask again; Settings can change it.
  - "Learn in 30 seconds" tutorial, skippable and resumable (dnb:ftue): three steps on a 2x2 board using Board.svelte against a scripted opponent: draw any line; close a box and move again; don't draw a box's third side (the opponent takes it). At most 12 words of copy per step, no text walls, under 30 seconds in total, ending on two buttons: "Play Rookie" and "Invite a friend". If a suggested line must be highlighted, add an optional, visual-only "hint" prop to Board.svelte and flag it in the PR; input logic stays untouched.
  - If the profile name is still the default "Player", the first Results screen offers "Add your name for the leaderboard" inline, using data().setName (it already updates leaderboard rows).
  - Acceptance: from a fresh profile, the first line can be drawn within 10 s of the splash ending; the tutorial works with keyboard only and with a screen reader.

F10 AI rival personalities
  - Rookie, Tactician and Maestro get SVG marks (not emoji), accent colours and 2-3 short, kind preset lines each for: game start, a capture of 3 or more, a double-deal, win, loss, draw. Shown for 1.8 s in a fixed-height bubble in the AI's player card (aria-hidden). New setting "Opponent chatter" (default on).
  - Head-to-head record per rival, derived from saved scores, on Stats and in the player card sub-label ("You lead 5-2").

F11 Daily Puzzle
  - Generator: scripts/make-puzzles.mjs, modelled on scripts/opening-book.mjs from PR #3 (Node 22.18 or newer runs rules.ts directly). It plays seeded games with the existing AI to positions with 8-14 undrawn edges on 3x3 (up to 16 on 4x4), solves them exactly (3x3: full backward solve as in opening-book.mjs; 4x4: memoised negamax over the remaining edges), keeps positions where the side to move can win and greedy capturing scores worse than optimal play (so each puzzle teaches chain control), and writes src/lib/data/puzzles.json as [{ n, rows, cols, first, moves, target }] for at least 400 days. Fixed seed, deterministic, with a --check mode. No changes to src/lib/engine/**.
  - Play: puzzle number = days since the launch date in the player's local time zone. "Daily Puzzle #N" starts from the stored moves; the player faces Maestro; goal: "Take at least T of the remaining boxes". Attempts are counted and results kept locally (dnb:daily). Not saved as a ScoreEntry, no XP, not on leaderboards (changing that needs APPROVAL).
  - Share text: "Grid Rivals Daily #N: T/T boxes, first try" plus a spoiler-free row of attempt squares and the game link.
  - Archive: every past puzzle stays playable and is marked solved or unsolved, so nothing is lost by missing a day.
  - Counts toward Weekly Rhythm (F12) and feats (F13).
  - Acceptance: two browsers on the same local date get the same puzzle; --check passes; the screen passes the section 11 checklist.

F12 Weekly Rhythm
  - Local activity log dnb:activity: unique local dates with a finished AI game, online game or puzzle (cap 400 entries).
  - A week (Monday to Sunday, local) counts when you played on 3 different days. Rhythm = consecutive counted weeks; the current week shows progress ("2 of 3 days").
  - Rest weeks: earn 1 per 4 counted weeks, hold at most 2, applied automatically to a missed week.
  - Copy stays positive ("3-week rhythm"). A broken rhythm shows only "New rhythm" and "Best: 6 weeks": no red, no loss wording, no notifications. Setting "Show weekly rhythm" (default on). Local only; say so in Settings.
  - Milestones at 4, 8 and 12 weeks get a short celebration and a known style unlock (never a random reward).

F13 Feats
  - src/lib/feats.ts, pure: ScoreEntry[] plus local logs in, earned feats (with dates) and progress for locked ones out.
  - Starter set (rename to fit DESIGN.md's voice): First Box; Chain Reaction (5+ boxes in one turn); Long Chain (8+); Double-Deal (the player declined an available capture with a move that closed nothing and left an edge that closes two boxes at once); Comeback (won after trailing by 3+); Clean Sheet (won with the opponent on 0, board 3x3 or larger); Photo Finish (won by 1 on 4x4 or larger); Speed Win (won a standard 3x3 in under 30 s); Rookie, Tactician and Maestro Beaten; Giant Slayer (beat Maestro on 4x4 or larger); Daily Solver (7 puzzles); Steady Week (a counted week); Marathon (finished a custom board with 100+ boxes); Good Company (5 online games finished).
  - Stats gets a Feats grid with progress bars. Results announce new feats (at most 2 per results screen, aria-live polite). Feats are computed retroactively on first run ("You've already earned 4 feats").

F14 Replay
  - From Results and from a new "Recent games" list on Stats (last 10 AI games). Board.svelte with interactive=false; controls Prev, Play/Pause (400 ms per move), Next and a range slider ("Move 12 of 24"); markers at big captures; keys: Left/Right step, Space play/pause; each step announced in a live region.
  - Must fit the layout budget in section 8.4, or follow its procedure.

F15 Share card
  - src/lib/share.ts draws a 1080x1350 PNG with Canvas 2D from geometry() (no DOM-screenshot libraries): the finished board in the artifact style, names (optional toggle, default on for your own name, off for others), score, board size and difficulty, date, game URL.
  - navigator.canShare({ files }) then navigator.share; otherwise download the PNG and copy the text plus link. No external services.

F16 Earned styles (cosmetics)
  - Theme variants defined in DESIGN.md as token sets (colourways, textures, pattern variants, sound packs), unlocked by level (for example levels 2, 4, 6, 8, 10, 12, 15, 20) and by feats; chosen in a "Style" panel.
  - Derived from level and feats (recomputed, never bought). No shop, no currency.
  - Every variant passes the contrast and colour-vision checks; ownership patterns stay distinct. Prefer CSS variables so Board.svelte needs little or no code change; flag any change there.
  - Include dot skins and avatar frames (frames by rank tier once F26 lands). Runner-up directions from Step 2 can return later as earnable board themes, each passing the same checks.

F17 Road to Maestro
  - Ordered milestones derived from scores: beat Rookie 3x3, Rookie 4x4, Tactician 3x3, Tactician 4x4, Tactician 5x5, Maestro 4x4, Maestro 5x5, Maestro 6x6. (Leave out Maestro 3x3: Hard plays 3x3 perfectly.)
  - Home shows the next milestone with a one-tap "Play" that sets the config and starts.

F18 Session wrap-up and break option
  - Session = sessionStorage start time plus games finished this session. After the 5th game or 25 minutes, whichever comes first, Results shows a one-line session summary and a secondary "Done for now" button (to Home with a summary card).
  - Optional "Break reminder" in Settings (off by default; 20, 30 or 45 min), shown only on Results. Never interrupt a game. No guilt copy.

F19 "Your move" tab signal (online)
  - In Online.svelte, when it becomes your turn while document.hidden: prefix the title with "(Your move) " and switch to a favicon variant with a dot; play the turn cue if sound is on; restore both when the tab is visible. Same signal when a friend joins your waiting room.

F24 Daily goals (optional)
  - Three small goals a day from a fixed pool (for example "Close a 3-box chain", "Beat Tactician on 4x4", "Solve the Daily Puzzle"), progress computed from play, refreshed at local midnight. Missing a day costs nothing; no streak attached.
  - Rewards are progress toward earned styles (F16), never currency or XP. All three fit in one short session. Setting "Show daily goals" (default on). Local only (dnb:goals).

F25 Seasons (free track)
  - A 30-day season whose track fills with XP earned during the season, computed from saved scores (no new storage, no change to the XP formula). Tiers unlock styles; every reward returns in later seasons.
  - Shown after the first win. No premium track, no purchases, no countdown timers.

F26 Rank tiers
  - A skill rating (Elo or Glicko) computed from your saved AI games: each rival has a fixed rating per board size, and the rating is recomputed from the full score list, like stats(). Tiers, for example Bronze, Silver, Gold, Diamond, Master, Grandmaster.
  - Revealed after 10 games; hideable in Settings; a drop is shown quietly, with no loss wording. XP, levels and leaderboards stay unchanged. Online-rated games or syncing ranks need APPROVAL (Firebase).

F27 Feat Moments and gallery
  - Rare feats trigger a short, dismissible "Moment" card (badge, sound, optional share) on the Results screen: at most one per session, never mid-game, static when animations are off.
  - A gallery on Stats shows earned feats and, for locked ones, a silhouette with a hint.

F28 Invalid-move feedback
  - A tap during the opponent's turn, or one that misses every line, nudges the turn indicator (not the board), plays a soft thud if sound is on, gives an 8 ms tick on Android, and updates the live region ("Not your turn", once per turn).
  - Needs an optional, additive onreject callback from Board.svelte; hit-testing, the sp*0.34 threshold and keyboard logic stay untouched. Flag it in the PR.

F29 Clubs (APPROVAL, plan only)
  - Join a club (for example a school or campus team): club leaderboards and weekly club goals; team competition, never player shaming. Needs Firestore collections, rules and a moderation plan.

F20 and F22 (APPROVAL, plan only); F21 and F23 (now approved, see section 7S)
  - F20 Preset emotes: 6 fixed reactions (for example "Nice!", "Well played", "Oops", "Hmm", "GG", "Rematch?"), rate-limited to 1 per 3 s, per-match mute, no free text. Opened from a small radial menu; extra reactions unlock through feats. Needs a rooms/{code}/emotes path and database.rules.json changes.
  - F21 Friends and rivals: now approved and specified as S4. Still later, with approval: a weekly friends leaderboard, and earned styles and feats on your player card in online games. With no friends yet, suggest the AI rivals, always labelled as AI.
  - F22 Weekly leagues: week-keyed leaderboard collections (no server reset job); seasonal badges that come back in later seasons. Needs Firestore rules.
  - F23 Installable PWA: now approved and specified as S2, with push for friend invites as S5. "Your move" pushes still need approval: each type opted into separately, at most 3 a week, quiet hours at night (always for minors), never about streaks or missed play.
  - For every approved Firebase change: optional fields with defaults, never remove fields, and keep the rules accepting both old and new data.

==================================================
7R. TRACK R: RELIABILITY, SPEED AND MAESTRO (approved on 29 Sep 2026)
==================================================
Approved: the online code, the Realtime Database paths and rules named below, the AI engine files and scripts, and additive local storage keys. Not approved: rules.ts (turns, scoring, end of game, edge indexing, replay()), the XP formula and level curve, Easy AI behaviour, Medium beyond the R3 CHECKPOINT answer, and leaderboard behaviour (see the R3 CHECKPOINT).
Test every rules change with @firebase/rules-unit-testing against the Firebase emulators (dev-only), and put the console steps to publish the rules in the PR.

R1 Resume and presence (F30)
  What is wrong today (verified in the code):
  - watchRoom() in src/lib/online/room.ts writes rooms/{code}/online/{uid} and registers onDisconnect().remove() once. Firebase runs onDisconnect handlers only once, and the app must register them again after every reconnect. When a phone puts the tab in the background (Chrome on Android freezes background pages after 5 minutes, 1 minute in newer versions; iOS suspends them), the server deletes the flag, and nothing writes it back when the player returns.
  - myTurn in src/screens/Online.svelte requires friendOnline, so the other player is stuck behind "Waiting for your friend to reconnect".
  - The room code and seat live only in Online.svelte state, and App.svelte strips ?room= from the address bar, so a reload or a browser restart loses the online game; the host has no way back. AI and pass-and-play games live only in Game.svelte memory.
  Build:
  - Move presence out of the room node to presence/{code}/{uid}/{connectionId}, using Firebase's pattern: on every .info/connected true, push a new connection child, register onDisconnect().remove() on it first, then write it with serverTimestamp(). A player is present while any child exists. Remove your child on Leave. Rules: only the room's host and guest can read; each can write only under their own uid.
  - Moves never wait for presence: myTurn = the game isn't over and st.turn === seat.
  - Opponent away: nothing changes for the first 10 s (network blips); then a calm status line: "Ama stepped away. Your move will be waiting." You can still move. After 2 minutes, offer "Leave game" (nothing is scored, no forfeit).
  - Your own connection: when .info/connected has been false for more than 2 s, show "Reconnecting..."; a move made meanwhile shows as "Sending..." until the server confirms it (R2b).
  - On visibilitychange to visible, and on pageshow, read the room once with get() and re-render. The SDK reconnects by itself.
  - Online resume: save dnb:room {code, seat, savedAt} when you create or join; clear it on Leave, when the room is gone, or 10 minutes after a finished game with no rematch. On app start, if dnb:room is under 24 hours old, rejoin that room at the same seat (the anonymous uid persists) and open the Online screen. If the room is gone or you aren't in it, clear the key and say "That game has ended."
  - AI and pass-and-play resume: after every committed move, save dnb:active {v:1, id, mode, size, diff, p2, first, moves, ms, savedAt}; clear it on finish, Quit or Restart. After a reload during a game (a sessionStorage flag), reopen the game directly by replaying the moves with replay(). After a browser restart, Home shows "Continue your game" first, with Continue and Discard. If it is the AI's turn, queue the AI move.
  - The clock pauses while the app is closed. A resumed ranked game counts for XP, stats and the games and wins tally, but its time is not submitted as a fastest-win time; the results screen says "Resumed games don't set fastest-win times." Use the game id as the ScoreEntry id so a game can't be saved twice.
  Acceptance (a real Android phone and an iPhone, plus desktop):
  - AI game on 4x4: reload at move 10 -> same board, turn and clock, and the AI moves if it is its turn. Close the browser and reopen -> "Continue your game" -> the same game.
  - Online: A puts the game in the background for 2 minutes; B can still move; within 3 s of A coming back, both see normal play and A sees B's move.
  - Online: the host reloads mid-game and is back in the room, in the same seat, within 3 s (this fails today).
  - Online: B turns on airplane mode for 20 s mid-game -> "Reconnecting..."; a move B made offline arrives after reconnecting; no move is lost or duplicated.

R2a Measure online latency first (dev-only)
  - Why a move can take seconds today: sendMove() runs runTransaction() on the whole rooms/{code} node, which also holds presence. The client uploads the whole node; if anything under it changed, the server rejects it and the client retries, up to 25 times. A local set() under the node, or a dropped connection, aborts the transaction, and move() in Online.svelte doesn't catch that error, so a move can vanish until the player taps again. After any WebSocket failure the SDK starts the next connection on long-polling. The code can't show which of these causes the 10 s, so measure first.
  - Add a ?debug=net overlay (nothing extra is written in normal play). Per move: tap to local draw, tap to server confirmation, and tap to "opponent has it", timed on one clock by an echo: in debug mode the receiver writes netdebug/{code}/{n} (rules: the room's two players only) and the sender times the round trip. Also log transaction attempts and aborts, the transport (WebSocket or long-polling), .info/connected drops and visibility changes.
  - Test with two real phones on mobile data in Ghana (MTN and Telecel if possible), at least 50 moves each way. Put p50, p95 and the maximum in docs/perf/online-latency.md and in the PR.

R2b Faster moves (F31)
  - Replace the move transaction with one atomic multi-path update(): moves/{n} = e, next = n + 1, turn = the seat to move next (computed with rules.ts), updated = serverTimestamp(). Rules, each with a test: only the room's host or guest; only when it was your turn before the write; moves/{n} is write-once and n must equal the current next; e is an integer below the board's edge count; next goes up by exactly 1. Keep runTransaction only for createRoom and rematch, which are rare and not latency-critical; both set next = 0 and turn = first.
  - New rooms carry v: 2. The new rules apply only to v: 2 rooms; rooms made by an older version keep today's transaction path until they end, so nobody is locked out mid-game. Keep the other room fields and the ?room=CODE link.
  - Both clients replay the move list with rules.ts. If a move is illegal (a line drawn twice, or a turn that doesn't follow the rules), show "This game's moves don't add up" and end the match with nothing scored. Friend games stay casual: say in README that moves aren't checked on a server.
  - Sender: draw the line at once, then write. Catch every error; on a refusal, roll back, refresh with get() and show "Not sent. Tap again."
  - Receiver: listen to the room's fields and to onChildAdded on moves; apply each move once, in order.
  - Warm the connection: when Home or the Online lobby opens and Firebase is configured, sign in and attach a .info/connected listener, so the WebSocket is open before the first move.
  - Keep the database in europe-west1: it is the closest of the three Realtime Database locations to Ghana, and an existing database's location can't be changed.
  - If R2a finds long-polling in more than 10% of sessions, try forceWebSockets() behind a flag and compare.
  - Targets, measured with the R2a overlay on the same phones: your own line appears within 50 ms of the tap; the opponent sees it within 400 ms at p50 and 1,000 ms at p95; no lost or duplicated moves in 200 moves that include airplane-mode toggles.

R3 Maestro at full strength (F32)
  Goal: no room for failure. Maestro never makes a mistake it could avoid: perfect from the first move on every board that can be solved, exact endgames and expert middle games on the rest. I also gave you an AI spec ("High-Performance, Real-Time Dots and Boxes Hard AI Engine"); this section keeps its sound parts and overrides the parts that would make Maestro weaker (listed at the end of R3).
  Facts to design from:
  - 3x3 is a second-player win by 3 (Barker and Korf, AAAI 2012). 4x4 is a tie with best play; the first player can't make a losing move before their third move, but the second player can lose on move one (David Wilson's solve). 4x5 is also a tie, the largest board solved in a peer-reviewed paper, and it took ten days with a 24 GB table. 5x5 is unproven (the program The Shark claims a 13-12 first-player win; unpublished).
  - Solving 4x4 from the empty board took 274 s on one 3.33 GHz core with a 4 GB table, and 3x5 took 310 s (Barker and Korf). Each extra open line roughly doubles the work (Wilson). A phone can't solve these from move 1: it needs an opening book, as Wilson's own player uses.
  - Today (PR #3), Hard switches to exact search on 4x4 only when 26 or fewer of the 40 lines remain, gets 300 ms (1,500 ms on 3x3) with a Map-based table, and falls back to its safe-line race count when time runs out. The middle game, where chain battles are decided, runs on rules of thumb; that is why it loses on 4x4 and bigger boards.
  Architecture (inside the existing worker, behind the same createAI() interface that ai.ts and ai.worker.ts use):
  - BoardGraph: a bitset of drawn lines, per-box side counts, 64-bit Zobrist keys (two 32-bit halves) and the symmetry maps (8 on squares, 4 on rectangles) for canonical keys.
  - ChainAnalyzer: the strings-and-coins (dual graph) view, with boxes as nodes and undrawn lines as links. It finds capturable boxes, short chains (1-2 boxes), long chains (3+), loops (4+ boxes) and the joints where chains meet, and it scores simple loony endgames (only long chains and even loops) in closed form (Buzzard and Ciere 2014; Allcock 2021), including whether keeping control is worth it (Berlekamp's controlled value).
  - Solver: negamax alpha-beta on the net boxes still to come. A capture keeps the turn inside the search (no side switch, no extra depth). Iterative deepening. A transposition table in a typed array with lower and upper bounds: 16 MB when navigator.deviceMemory is 2 GB or less, else 32 MB. Move ordering after Barker and Korf: lines that give no box its third side first, radiating from the centre; third-side lines last. When boxes can be taken, try only "take all" and "leave the last 2 (4 in a loop)".
  - HardAIController: routes by board, reads the opening books, runs the solver or the middle-game search, ponders, and keeps the time budget.
  Routing:
  - Exact tier, every board with 40 lines or fewer (3x3, 3x4, 3x5, 4x4 and thin custom boards such as 2x7 and 1x12): perfect from move 1. Opening books (R3c) cover the opening wherever the in-browser solver can't finish in time; after that, the solver.
  - Expert tier, everything bigger (5x5, 6x6, 4x5 and larger custom boards): exact search as soon as the rest of the game fits the budget; before that, iterative-deepening alpha-beta with a capture quiescence search, scored by ChainAnalyzer and the long chain rule.
  Strategy rules (for the expert tier's evaluation and move ordering; the solver needs none of them):
  - Long chain rule: the first player wants dots + long chains to be even. So on 4x4 and 6x6 boxes the first player wants an odd number of long chains, and on 3x3 and 5x5 an even number; loops don't count. Steer the count with the safe lines you choose and, when it pays, with sacrifices that change it.
  - Move order: take boxes that are free and open nothing; then safe lines (no box gets its third side); then the cheapest sacrifice (a 1- or 2-box chain; the middle line of a 2-chain, so it can't be handed back); open a long chain or loop only when nothing else is left, choosing which with ChainAnalyzer.
  - Keeping control: when a long chain is opened for Maestro, take all but the last 2 boxes (all but 4 in a loop) and hand those over only when controlled value says keeping control is worth it; take everything in the last chain or loop.
  Time and feel:
  - Pondering: while the player thinks, the worker keeps solving the current position and its likely replies; keep the table across moves within a game.
  - Adaptive start: measure nodes per second on first use and start exact search as early as the budget allows.
  - Budget on a mid-range Android, measured without pondering time: visible thinking at most 600 ms per move at p95 and 1.5 s at p99, with a 4 s cap; "Maestro is thinking..." shows while it takes longer than the normal pause. The main thread never blocks.
  - No guessing on the exact tier: never return a move there that isn't proven optimal. Books and pondering must keep every move under the cap, and the benchmark must prove it; if a position ever reaches the cap, keep thinking and log it rather than guess. Only the expert tier may play its best move so far when time runs out.
  - Keep the existing 300-800 ms "thinking" pause: it already stops instant moves from feeling abrupt, and time spent thinking counts toward it (queueAI waits only for the remainder).
  R3a Benchmark first: scripts/ai-bench.mjs (Node, dev-only).
    - A reference exact solver in Node.
    - Test sets: 4x4 and 3x5 positions from plausible play at 10, 14, 18 and 22 lines drawn; 5x5 and 6x6 positions with 26 or fewer lines left; classic endgames (all-but-two, loops, long-chain-rule positions). Label every position with its exact value using the solver.
    - Metrics at simulated phone speed (the in-game time budget divided by 4): the share of Maestro moves that keep the exact value; think time p50, p95, p99 and max; results against today's Hard and against Medium over 1,000 games per size, alternating who starts.
    - Record today's engine as the baseline in docs/ai/benchmark.md, and run the benchmark on every PR that touches the engine.
  R3b Engine: build the architecture, routing, strategy rules and time rules above in ai-core.js (split into modules under src/lib/engine/ if that reads better) and the worker. Easy stays as it is.
  R3c Opening books: scripts/book.mjs (Node, offline; extend PR #3's scripts/opening-book.mjs) solves each exact-tier board that needs a book (at least 4x4 and 3x5) and stores one value-keeping move for every position Maestro can reach by following its own book, as first or second player, until the in-browser solver can take over (use the thresholds measured in R3b), reduced by symmetry. Ship each as a binary file fetched only when a game on that board starts with Maestro (the service worker caches it after S2). Budget: 400 KB gzip per board.
    CHECKPOINT (ask only if a book can't close the gap within the budget): "Maestro can't be perfect on <board> within the download budget. Which trade-off do you want?" 1) A bigger one-time download of <measured size> (Recommended if under 1.5 MB) 2) Maestro thinks longer once per game (<measured> s on a mid-range phone) 3) Perfect from move <N>, with a small chance of an early slip.
  CHECKPOINT (before R3b ships): "4x4 Maestro will be unbeatable: a draw is the best result, so its fastest-win leaderboard will get no new entries. What should happen?" 1) Keep wins-only leaderboards and add a local feat, "Held Maestro to a draw on 4x4" (Recommended: no Firebase change) 2) Also rank draws on the 4x4 Maestro board (a Firestore rules change) 3) Keep a beatable Maestro and add a perfect "Grandmaster" level.
  CHECKPOINT (before R3b ships): "Should Tactician (Medium) get tougher too?" 1) Yes: it plays endgames exactly (exact search once 16 or fewer lines remain, and correct all-but-two), but doesn't steer the chain count, so players who learn the long chain rule can still beat it (Recommended) 2) No, keep it as it is.
  Acceptance:
  - Exact tier (3x3, 3x4, 3x5, 4x4 and the thin boards): zero value-losing Maestro moves across every book (checked when it is built) and across 2,000 sampled games per board from both seats at simulated phone speed; Maestro never loses to the reference solver as first or second player; no move reaches the cap.
  - Expert tier (5x5 and 6x6): at least 99% value-keeping moves on the labelled set; at least 95% wins against today's Hard over 1,000 games per size; no losses to Medium; every position with 26 or fewer lines left is played exactly.
  - Think time and memory within section 9, and 60 fps while Maestro thinks.
  - The Maestro card in Setup says: "Perfect on 3x3, 4x4 and small boards. An expert on bigger ones."
  Where your AI spec is overridden, and why:
  - Its parity rule ("the first player favours an odd number of long chains plus loops") ignores board size and counts loops; the correct rule is above.
  - It hard-codes the double-cross in every chain but the last; sometimes taking everything is better, so the solver or controlled value decides.
  - Its 300 ms and 500 ms cut-offs with a heuristic fallback are exactly how today's engine loses; exact-tier moves are never guessed.
  - It puts 4x5 in the exact tier; 4x5 took ten days and a 24 GB table to solve, so it is in the expert tier here.
  - Its 150-250 ms micro-delay would replace the existing 300-800 ms pause, which stays.
  - Its 2-4 ply, 150 ms search for big boards is too shallow for "no room for failure"; the expert tier uses the full budget, pondering and an exact endgame.

==================================================
7S. TRACK S: INVITES, ACCOUNTS AND FRIENDS (approved on 29 Sep 2026)
==================================================
Approved: the features below; new Firestore collections and Realtime Database paths with tested rules; a service worker; Firebase Auth account linking; one small server for push, SMS and email. Not approved until I answer the CHECKPOINTs: spending money and where the server runs. The sign-up method is decided (S3).
Always: anyone can still play, and join a friend's link, without an account. No contact upload, no invite rewards, no free-text chat, no public player directory, no matchmaking with strangers (sections 7.0 and 13).

S1 Invite links (F33)
  - One invite text for every channel: "<Name> invited you to a Grid Rivals match (4x4). Tap to join: <link> (code <CODE>)".
  - Waiting-screen actions, in this order: Share (navigator.share, shown only when available; it offers WhatsApp, SMS and the rest), WhatsApp (https://wa.me/?text=<encoded text>; the primary button when Share isn't available), SMS (sms:?body= on Android, sms:&body= on iOS), Copy link, Show QR. The code stays big and readable, for saying it aloud.
  - The QR code is drawn on the device by a small library loaded only when Show QR is tapped (under 10 KB gzip), at least 200 px, and scans with the stock camera on Android and iPhone.
  - Link preview: add Open Graph tags to index.html (og:title, og:description "Tap to join your friend's match. No sign-up needed.", og:url without parameters, og:image 1200x630 PNG under 300 KB). GitHub Pages is static, so every room link shares this preview; the invite text carries the name and board size.
  - Arrival: a ?room= link shows "Kofi invited you. 4x4. Join" before taking the seat (one tap, no sign-up). A full, finished or expired room shows "This match has ended" with "Start your own game" (and "Challenge Kofi" once S4 exists and you're friends).
  - A room with no guest after 24 hours, or idle for 7 days, counts as ended (checked on the client from updated).
  - Don't use Firebase Dynamic Links (shut down on 25 August 2025); a plain https link already opens the game.
  - In-app browsers (Android WebView) have no navigator.share: fall back to WhatsApp and Copy.
  - Acceptance: Share, WhatsApp, SMS, Copy and QR work on Android Chrome, iPhone Safari and desktop Chrome; a link sent to yourself on WhatsApp shows the preview image and title; the arrival card shows before joining.

S2 Installable app, PWA (F23)
  - Ships right after Track R, before the redesign (my decision on 30 Sep 2026): use today's look until PR 01 replaces the colours and icons.
  - vite-plugin-pwa (dev dependency): a manifest (name "Grid Rivals: Dots and Boxes", short_name "Grid Rivals", start_url "./", scope "./", display standalone, today's theme colours until PR 01 switches them to DESIGN.md's, 192 px and 512 px icons plus a maskable one, made from the current mark until PR 01 replaces them), app-shell precache, network-first for index.html, never cache Firebase traffic; cache the opening books after first use.
  - Updates: "A new version is ready. Refresh" appears only on Home or Results, never mid-game; skipWaiting runs only when tapped, so no one is stuck on an old version from GitHub Pages.
  - Install: never offered on the first visit; offered after the third finished game, and in Settings. On iPhone, show the steps (Share, then Add to Home Screen).
  - Offline: AI and pass-and-play work; Online and Friends say "You're offline".
  - An installed app on Android opens in-scope links itself; iPhone opens them in Safari, so arrival must work in both.
  - Register the service worker once the app is idle after start-up, never on the startup path.

S3 Accounts and usernames (F34)
  Decided on 30 Sep 2026: players sign up with an email and password, or with Google, and every account has a unique username. No phone-number sign-up.
  - Keep guest play: anyone can play, and join a friend's link, without an account. "Create account" in Settings and on the Friends screen upgrades the anonymous account by linking, with linkWithCredential(user, EmailAuthProvider.credential(email, password)) or linkWithPopup(user, new GoogleAuthProvider()), so the uid, scores, XP and leaderboard rows carry over. "Sign in" on another device uses signInWithEmailAndPassword or signInWithPopup.
  - Console set-up (steps in README): turn on the Email/Password and Google providers, and add your GitHub Pages domain (10xosborn.github.io, unless you use a custom domain) to Authentication's authorised domains, or Google sign-in fails.
  - Use popups, not redirects: redirect sign-in breaks for sites not hosted on Firebase in browsers that block third-party storage, and GitHub Pages is one of those sites. Google also refuses sign-in inside in-app browsers (embedded web views), so there show "Open in your browser to use Google" and offer email instead.
  - Email and password: at least 8 characters, no forced symbols or digits, the most common passwords refused, a show/hide toggle, and "Forgot password?" (sendPasswordResetEmail). Send a verification email (sendEmailVerification). An unverified account can play and be invited, but sending friend requests needs a verified email or Google (the rules check request.auth.token.email_verified). Any failed sign-in shows one message, "That email or password is wrong", and the app never reveals whether an email is registered (Firebase's email enumeration protection works the same way).
  - If the Google account or email already belongs to a Grid Rivals account, sign in to it and offer to copy this device's scores into it (matched by score id).
  - Username, chosen during sign-up and required for every account:
    - 3-16 characters: letters, digits and underscores, starting with a letter. Unique regardless of case ("Kofi_GH" and "kofi_gh" are the same name) and shown as typed. Refuse a reserved list (admin, support, moderator, gridrivals, rookie, tactician, maestro and similar) and a blocked-words list.
    - Availability shows as you type: about 400 ms after the last keystroke, read usernames/{lowercase name} and show "Checking...", then "Available" or "That username is taken", with two or three free suggestions. Put the message in an aria-live region.
    - The claim is atomic: one batch creates usernames/{lowercase name} {uid, name, at} and sets users/{uid}.username. Rules: create only if the document doesn't exist and the uid is your own; anyone signed in may read a single document, and nobody may list the collection. If someone claims the name a moment earlier, say "Someone just took that username" and keep the rest of the form filled in.
    - Changing it: once every 30 days (the rules check users/{uid}.usernameChangedAt). The old name stays reserved for the same player for 30 days (its document keeps the uid and gets releaseAt), so nobody can pick it up to pose as them. After releaseAt another player may claim it (the rules compare request.time), so no server job is needed.
    - For account holders, other players see the username everywhere: online matches, invites, friends and leaderboards. Keep users/{uid}.name and the leaderboard rows' names equal to it; the Firestore rules check that for non-anonymous users. Guests keep a free display name shown with a "Guest" tag, and the rules stop a guest from choosing a name that is someone's username.
    - Your personal link is ?add=<username>.
  - Extend "Delete my data" to the account, the username (held for 30 days, then freed), friends, requests, presence and private data.

S4 Friends and online status (F21)
  - Firestore: friendRequests/{fromUid}_{toUid} {from, to, fromName, createdAt}; users/{uid}/friends/{friendUid} {username, since, h2h {w, l, d}}; users/{uid}/blocked/{otherUid}. Accepting writes both friend docs in one batch (the rules allow it only while that request exists) and deletes the request; declining deletes it; blocked players can't send requests.
  - Limits: 100 friends, 20 pending requests sent, 10 new requests a day.
  - Add friends by exact username, by the ?add= link, or by its QR code. No browsing, and no suggestions from contacts.
  - Online status in the Realtime Database: status/{uid}/{connectionId}, with the same .info/connected pattern as R1. Only your friends can read it: you list who may see you in friendsOf/{uid}/{friendUid} (only you write your own list), and the rules check that list. Setting "Show when I'm online": on by default, friends only. Offline friends show "Active today" or "Active this week", nothing finer.
  - Friends screen: Friends (online first, with a green dot and the word "Online"), Requests, Add. "Invite" on an online friend creates a room and writes invites/{toUid}/{inviteId} {from, fromName, room, size, at}, which the rules allow only when the recipient's friendsOf list includes you. The friend sees "Kofi invites you to 4x4: Join / Not now" on any screen, or when their current game ends. Invites expire after 2 minutes; one pending invite per friend; at most 10 invites an hour.
  - Head-to-head: after an online game between friends, each player updates their own users/{me}/friends/{them}.h2h. A weekly friends leaderboard comes later.
  - Friends see username, level, online status and head-to-head only.
  - Acceptance: two accounts can request, accept and see each other; status changes within 5 s of opening or cleanly closing the app (a lost connection can take minutes to show; that is a Firebase limit); an invite reaches an online friend within 2 s; blocking works; every rule has an emulator test.

S5 Invite server and push notifications (F35)
  CHECKPOINT (before building): "Where should the small server that sends invites run?" 1) A Cloudflare Worker on the free plan (Recommended: no card needed; 100,000 requests a day; over the limit it stops rather than bills) 2) Firebase Cloud Functions on the Blaze plan (needs a Visa or Mastercard, not mobile money; the free tier should cover this use; set a spend cap and budget alerts).
  - One endpoint, POST /invite {toUid, room}, with the Firebase ID token in the header. Verify the token (RS256, key id from Google's public keys, audience = project id, issuer https://securetoken.google.com/<project id>). Check that the two are friends and neither has blocked the other, apply the caps, then send through ONE channel in the recipient's order: push if they have a token, else SMS (S6), else email (S6). Reply with the channel used, so the sender sees "Sent to Ama as a notification".
  - Push through FCM HTTP v1 (the legacy API is shut down). Ask for permission only when the player turns on "Game invites" in Friends or Settings, never on the first visit. On iPhone, push works only for apps added to the Home Screen (iOS 16.4+), so show the install steps first. Store tokens under users/{uid}/private/push/{token} (owner-only rules). Call getToken with serviceWorkerRegistration, because the app lives under /dots-boxes/ and firebase-messaging-sw.js can't sit at the domain root.
  - The notification reads "Kofi invited you to 4x4", and tapping it opens ?room=CODE.
  - Caps: a player gets at most 3 invite notifications a day in total and 1 per friend per hour; none between 21:00 and 08:00 Ghana time (UTC+0), a window each player can widen; no reminders or follow-ups.
  - Secrets (the service-account key and the SMS and email keys) live only in the server's secret store: never in the repo or the client bundle.

S6 SMS and email invites (F35)
  CHECKPOINT (before building; it costs money): "Which SMS provider and monthly cap?" 1) Arkesel, capped at GHS 50 a month (Recommended: about GHS 0.025-0.031 per SMS, paid with mobile money) 2) Hubtel or mNotify, at a similar price 3) No SMS for now; push and email only.
  - Register an alphanumeric sender ID (for example "GridRivals") with the provider first: MTN blocks unregistered sender IDs, and approval takes about two weeks.
  - Opt-in only: the recipient adds a +233 number, verifies it with a 6-digit code sent by the server (stored hashed; valid 10 minutes; 5 tries; 3 codes per number a day), and turns on "Text me when a friend invites me". Don't use Firebase phone sign-in for this.
  - The SMS is plain text in one 160-character segment, no emoji: "Kofi invited you to Grid Rivals (4x4). Join: <link> Stop invites: <settings link>".
  - Send texts only between 08:00 and 19:00 Ghana time (the window in the NCA's code for network messages). Outside it, use push or email, or tell the sender when Ama can get texts.
  - Anti-abuse (SMS pumping is the main cost risk): texts only to verified +233 numbers of accepted friends who opted in; 3 SMS invites a day per sender; 2 a day and 5 a week per recipient; a global daily cap and the monthly cap from the CHECKPOINT; when a cap is hit, stop and email me; log every send (hashed number, time, cost).
  - Email through Brevo (300 a day free, no card) or Resend (3,000 a month free), only to a verified address, with an unsubscribe link and the same caps.
  - Consent: Ghana's Data Protection Act 2012 (section 40) requires prior consent for direct marketing and a right to object. Invites go only to people who opted in, every message says how to stop them, and nothing else is ever sent.

==================================================
8. ACCESSIBILITY INVARIANTS (never regress)
==================================================
8.1 Keep every existing feature:
  - The board is a focusable SVG with role="application" and an aria-label; arrow keys move a cursor between free lines; Enter or Space draws; the cursor shows only in keyboard mode (PR #3).
  - Every move is announced in an aria-live="polite" region ("X drew a line and closed N boxes. Score A to B.").
  - Box ownership shown by colour plus pattern plus initials.
  - :focus-visible outlines on all controls; no focus ring after a mouse click or tap on the board.
  - prefers-reduced-motion turns animations off by default; the Settings "Animations" toggle; the .no-anim class (or an equivalent) disables all motion globally.
  - Sound stays off until the player chooses it.
  - Controls at 44 px or larger; the board only offers sizes whose dot gap is at least 40 px (MIN_TAP_PX); MAX_SIDE stays 12.
  - Light and dark themes with the theme-color meta updated.
  - Semantics: sections labelled by headings; the results dialog (role="dialog", aria-modal, focus to the primary button); segmented controls with aria-pressed; toggles with role="switch" and aria-checked; steppers with labels and a live output; progress bars with role="progressbar"; errors in role="alert", status in role="status".
  - Safe-area insets; no horizontal scroll.
8.2 Targets: WCAG 2.2 AA, plus 2.3.3 (animation from interactions) through the Animations setting. Audio Control (1.4.2): no audio before a user choice, and a visible mute on every screen. No flashing more than 3 times per second.
8.3 Reduced motion: when animations are off, replace motion with opacity fades of 150 ms or less, or nothing. Confetti off. Splash static.
8.4 Layout coupling procedure. The board's size is computed in places that must agree: available() in src/lib/boardFit.ts (app width 640 px, or 680 px when the viewport is at least 900 px; 16 px side padding on each side, so 32; board at most 620 px wide; 330 px of vertical chrome reserved; board at least 260 px tall), the inline width on .board-wrap in Board.svelte (min(100%, 620px, calc(max(260px, 100dvh - 330px) * W/H))) and .board-wrap and .app in app.css. If you change the top bar, player cards, turn bar, meta chips, game actions, .app max-width or padding, or add anything above or below the board on any screen that renders Board.svelte:
  1. Measure the new total chrome height at 360x640, 390x844 and 1280x800.
  2. Update the constants in boardFit.ts, Board.svelte and app.css together, as CLAUDE.md describes. Preferably move them into one exported LAYOUT object that both TypeScript and a CSS custom property read; flag that refactor in the PR.
  3. Verify that dotGapPx(size) predicts the rendered dot gap within 2 px for 3x3, 6x6 and the largest custom board at those viewports; that SizePicker still offers only boards with gaps of 40 px or more; that the game screen does not scroll at 390x844; and that rotating a phone still shrinks custom boards.
  4. Update CLAUDE.md's layout rule, and the README "Custom boards" numbers if the limits change.

==================================================
9. PERFORMANCE BUDGETS
==================================================
Baseline on current main (vite build): index JS 107 KB (42 KB gzip); CSS 16 KB (4.3 KB gzip); because Firebase is configured, the Firebase app chunk (31 KB gzip) and the Firestore chunk (132 KB gzip) load at startup; the Realtime Database room chunk (40 KB gzip) is lazy; the AI worker is 12 KB.
Budgets for the finished overhaul:
  - Index JS at most 57 KB gzip (+15 KB); CSS at most 12 KB gzip; the inline splash at most 4 KB; no new chunk on the startup path.
  - Audio code in its own chunk, loaded on the first user gesture when sound is on; a music file, if one is ever added, at most 1.5 MB and fetched only after music is turned on.
  - Fonts: at most 2 families, at most 4 woff2 files, 150 KB total.
  - No filter or backdrop-filter on per-line or per-box elements; animate transform and opacity only.
  - 60 fps on a mid-range Android during chain captures on 6x6 (no long tasks over 50 ms, even at 6x CPU throttling); CLS 0 on the game screen; the AI thinking delay unchanged (Maestro may think longer only as R3 specifies); /benchmark shows no LCP or TBT regression beyond noise.
  - Online (R2b): your own line within 50 ms of the tap; the opponent sees it within 400 ms at p50 and 1,000 ms at p95 on mobile data in Ghana.
  - Maestro (R3): visible thinking at most 600 ms per move at p95 and 1.5 s at p99, capped at 4 s, on a mid-range Android; worker memory 16-32 MB; each opening book at most 400 KB gzip (unless I approve more at the R3c CHECKPOINT), loaded only for Maestro games on that board.
  - Track S code (accounts, friends, QR, messaging) in lazy chunks, so the index budget above doesn't grow; the service worker registers after start-up, never on the startup path.

==================================================
10. SPLASH, SOUND AND MUSIC
==================================================
10.1 Opening splash (every cold open of the game, once per browser session)
  - Inline markup, CSS and a tiny script in index.html so it paints before the app bundle; the Svelte app removes it. No external requests; at most 4 KB; must not delay the module script.
  - Before first paint, the inline script reads dnb:settings from localStorage and sets data-theme, so there is no flash of the wrong theme.
  - Content: the brand mark animating (four dots appear 60 ms apart, a line travels round the square, the box fills in the owner's pattern), then the wordmark "Grid Rivals" with the subtitle "Dots and Boxes", in DESIGN.md's type (reserve space so the webfont swap does not jump).
  - Timing: core animation 1,000 ms or less, exit 300 ms or less. Dismiss at the later of animation end and app ready (App.svelte's app.ready). If the app is not ready at 1,000 ms, keep a subtle looping loader with a status line ("Signing in", "Loading your stats"). Hard cap 8 s, then show the app; the existing notice banner covers Firebase failures.
  - Skip: after 300 ms any tap, click or key skips the rest of the animation (the loader stays until ready).
  - Frequency: sessionStorage flag dnb:splashSeen, so reloads in the same session skip straight to the app (loader only if not ready).
  - Invite links (?room=CODE): compact variant reading "Joining game CODE", with no minimum duration.
  - Animations off or prefers-reduced-motion: static mark and wordmark with a 150 ms fade.
  - Accessibility: role="status" with visually hidden text "Loading Grid Rivals: Dots and Boxes"; no focus trap and no focus stealing; wordmark contrast at least 4.5:1; no flashing.
  - No audio in the splash.
  - Acceptance: with "Slow 4G" throttling the splash is visible at first paint and leaves within 300 ms of app.ready; on a warm cache the whole sequence ends within 1.3 s; skip works; a second load in the same session skips it; reduced motion is honoured; CLS 0.

10.2 Sound engine and musical sound effects
  - Move the synth into src/lib/audio/ (engine.ts: one AudioContext, master, music, sfx and ui gain buses, a DynamicsCompressor on master; sfx.ts; music.ts) as its own chunk, loaded on the first user gesture when sound is on so the first move's sound is not lost. Keep src/lib/sound.ts as a thin wrapper so existing imports and sfx.play('line' | 'box' | 'win' | 'lose' | 'draw') keep working; add optional context (edge, rows, cols, boxes this turn) and new cues: chain, double, turn, ui.
  - One musical key for everything (for example a major pentatonic), in the chosen direction's instrument family:
    line: a short pluck (80-140 ms) whose pitch comes from the line's position, so the board plays a scale;
    box: a two-note chord;
    chain: each further box in the same turn steps up the scale;
    double-deal: a short three-note motif;
    turn change: a very soft tick (optional);
    win: a 4-note resolving cadence; loss: a gentle 3-note descent, never a buzzer; draw: a suspended chord;
    ui: a subtle click on primary buttons only (never on hover).
  - Opponent moves play softer versions of the same sounds. Peak gain at most 0.35; no clipping.
  - AudioContext is created or resumed only after a user gesture (Chrome creates it "suspended" otherwise). Pause everything on visibilitychange when hidden; resume with a fade.
  - iOS: keep Safari's default audio session, which respects the silent switch (never set navigator.audioSession.type to "playback"). If navigator.audioSession exists, set type "ambient" so music mixes with the player's own audio. Settings hint: "On iPhone, the silent switch mutes game sound."
  - Settings (extend the Settings interface in app.svelte.ts with defaults so old saved objects still load): sound (master switch, kept for compatibility), sfxVolume (0.8), music (on once the player picks "Sound on"), musicVolume (0.35), vibration, chatter, showRhythm, breakReminder.

10.3 Background music
  - Default: generative ambient built with the Web Audio API (no audio files, no licence risk): 60-76 BPM, instrumental, the same key as the sound effects, sparse (a note every 1.5-4 s), a soft pad with gentle reverb (ConvolverNode with a generated impulse), seeded variation so it does not audibly loop, under 2% CPU on a mid-range phone. The engine must also accept a licensed loop file later (public/audio/, licence recorded in public/audio/LICENSES.md).
  - Never before a user choice; never in the splash. On later visits, resume on the first pointerdown or keydown anywhere (no "Tap to start" gate): call resume() inside that handler and, for older iOS, start a one-sample silent buffer there too. If Web Audio is unavailable or fails, stay silent without errors. Fade in over 2 s; duck by about 40% under the win or level-up fanfare; pause in hidden tabs; stop when sound is off.
  - Controls: a music button in the top bar (aria-pressed, label "Music", 44x44 px, placed so the top bar keeps its height, otherwise follow 8.4); music and effects volume sliders in Settings; a keyboard shortcut M to toggle music (ignored while typing in an input).
  - Acceptance: no audio until "Sound on" or the Settings toggle; mute reachable from every screen; volumes persist; hidden tab pauses within 1 s; iOS silent switch respected; no clipping when a chain plays over the music.

==================================================
11. PR TEMPLATE AND QA CHECKLIST
==================================================
PR description: summary; before and after screenshots (phone and desktop, dark and light); scope; files; layout impact (did boardFit.ts or Board.svelte change, and why); approval gates hit (none, or a link to my approval); accessibility results; performance (build sizes against the baseline, /benchmark); /qa health score before and after; ethics check (section 7.0) passed; docs updated.
QA checklist, every PR:
  - npm run check and npm run build pass; budgets met; no console errors.
  - /design-review: no AI-slop findings, matches DESIGN.md. /qa: no open critical or high issues.
  - Viewports 360x640, 390x844, 768x1024, 1280x800, 1920x1080; phone rotation; dark and light.
  - Input: mouse, touch (DevTools device mode and a real Android phone if available), a keyboard-only full game (Tab to the board, arrows, Enter), no focus ring after a tap.
  - Screen reader (NVDA on Windows or TalkBack): moves announced, dialog focus correct, every control labelled.
  - Reduced motion (OS setting) and the Animations toggle both remove motion; the splash is static.
  - Audio: nothing before a gesture; mute everywhere; M key; hidden tab pauses; settings persist.
  - Board fit: section 8.4 checks.
  - Game integrity: full games vs Easy, Medium and Hard on 3x3 and 5x5; pass-and-play; custom 7x7 on a phone and 12x12 on a desktop; results saved; leaderboard compare text unchanged; online create, join, invite link, rematch, leave and reconnect across two browsers; reload mid-game (AI, pass-and-play, and online as host and as guest); an online game with one phone in the background for 2 minutes.
  - Firebase: no new reads or writes in the Network tab unless approved (sections 7R and 7S list what is); every new rule has an emulator test.
  - Tracks R and S: run the acceptance tests in their specs and put the numbers (latency p50 and p95, benchmark results, rules tests) in the PR.
  - Contrast and colour vision: tokens meet section 2; players distinguishable in the four DevTools emulations.
  - Progress: rank, season and daily-goal progress match a fresh recomputation from saved scores, and hiding them in Settings works.
  - Attribution: git log and the PR body contain no AI attribution.

==================================================
12. DOCUMENTATION UPDATES
==================================================
  - DESIGN.md: created in Step 1, locked in Step 2, and its Decisions Log updated in every PR.
  - CLAUDE.md: keep gstack's Design System section. Add or update, without removing existing content unless I approve: the layout rule (section 8.4, and the LAYOUT object if created); splash and startup rules; audio rules (gesture unlock, buses, iOS, budgets); motion rules and reduced motion; engagement ethics; new modules (audio/, insights.ts, feats.ts, share.ts, goals.ts, season.ts, rating.ts, the rhythm and puzzle code); the puzzle generator command; the local storage keys (dnb:settings, dnb:cfg, dnb:scores, dnb:profile, plus new ones: dnb:ftue, dnb:activity, dnb:daily, dnb:goals, dnb:splashSeen, dnb:active, dnb:room); the approval gates in section 0.2; the online model (rooms v: 2, moves/{n}, next, turn, presence/{code}, status/{uid}, invites/{uid}, friendsOf/{uid}) and why moves never wait for presence; the AI engine (tiers, solver, books, pondering, time rules) and the benchmark and book commands; accounts, usernames, friends data and rules; the invite server, its channels, caps and secrets policy.
  - README.md: feature list; sound, music and vibration settings; Daily Puzzle generator instructions; font and audio credits and licences; updated project structure; how to publish the new database rules; how to turn on Email/Password and Google sign-in and add the authorised domain; how to set up the invite server, its secrets, caps and costs; how to run scripts/ai-bench.mjs and scripts/book.mjs; and that friend games aren't checked on a server.
  - docs/design/overhaul-plan.md: kept current as PRs land.

==================================================
13. DO NOT CHANGE
==================================================
  - The rules as implemented (extra turn on a capture, scoring, end of game), edge indexing and replay().
  - Easy AI behaviour (Medium only as the R3 CHECKPOINT answer allows), the difficulty levels, the worker set-up and the 300-800 ms thinking pause (Maestro changes only as R3 specifies).
  - The XP formula, level curve, stats, MIN_RATE_GAMES, what counts toward leaderboards, and the leaderboard queries.
  - The ScoreEntry shape and what is saved (R1 changes only the id a game is saved under and whether a resumed game submits its time); Firestore and Realtime Database paths, rules and transactions, except as 7R and 7S specify; anonymous sign-in as the default, so nobody has to sign up to play; the ?room=CODE link format and the room-code alphabet; Firebase config.
  - Board.svelte input logic (section 0.2).
  - The accessibility features in section 8.
  - MIN_TAP_PX (40), MAX_SIDE (12), custom-board rules and SizePicker's fit behaviour.
  - The formats of dnb:settings, dnb:cfg, dnb:scores and dnb:profile (additive fields with defaults only).
  - The GitHub Pages workflow, vite base './', and CI configuration.

==================================================
14. DEFINITION OF DONE
==================================================
  - DESIGN.md final, and every screen rebuilt to it.
  - /design-review finds no AI-slop patterns; /plan-design-review at 8/10 or better on every dimension; /qa health at or above the baseline with no critical or high issues.
  - Every acceptance criterion above met; budgets met; documentation updated.
  - No approval-gated change made without my recorded approval.
  - Tracks R and S acceptance tests met, with latency numbers in docs/perf/online-latency.md and AI results in docs/ai/benchmark.md; every CHECKPOINT answered by me before the work it gates.
  - Each PR reviewed and merged by me.

Start now: confirm the status of PR #3, record the baseline (section 5), then start Track R with R1 (section 6A). Run /design-consultation once R1 is open for my review.
