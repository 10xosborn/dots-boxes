# Backup of the project's reports (26 November 2026)

This branch is a backup, not code. It has its own history: never merge it into `main` or start work from it.

Before resetting Windows on 26 November 2026, the owner put everything that lived only on the old PC onto GitHub. The project memory (`CLAUDE.md`, `.claude/`, the overhaul brief and the full design spec) is on `main`. This branch holds the rest:

| Here | Where it lived | What it is |
|---|---|---|
| `repo-gstack/` | `grid-rivals/.gstack/` | gstack's QA, benchmark and design reports for each pull request, with their screenshots |
| `gstack-home/projects/10xosborn-dots-boxes/` | `~/.gstack/projects/10xosborn-dots-boxes/` | gstack's notes for this project: test outcomes, learnings, timeline, design audits and the 30 September 2026 "before" baseline |
| `gstack-home/config.yaml` | `~/.gstack/config.yaml` | gstack's settings (no keys in it) |
| `parent-folder-claude/` | `Grid Rivals/.claude/`, the folder above the project | that folder's Claude Code settings |
| `git/design-04-board-marks.bundle` | the local branch `design/04-board-marks` | 3 parked commits, superseded by pull request #21 |
| `restore.sh` | | puts all of the above back |

Left out on purpose: gstack's OpenAI key, login tokens, and the global Claude Code settings (`~/.claude/settings.json`), which describe other, private projects.

## Putting it back

In Git Bash, inside the project folder (a fresh clone of this repo):

    git show origin/backup/reports:restore.sh > ../restore.sh && bash ../restore.sh

Every file comes back byte for byte where it was, replacing any file of the same name. Then follow "After a Windows reset" in `CLAUDE.md` on `main`.

## Adding to it later

New reports go on as a new commit on top of this branch. Never force-push it.
