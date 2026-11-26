#!/usr/bin/env bash
# Puts this branch's backup back where it was on the old PC (see README.md on this branch).
# Run it in Git Bash from inside the project folder, a clone of dots-boxes:
#   git show origin/backup/reports:restore.sh > ../restore.sh && bash ../restore.sh
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

B=refs/remotes/origin/backup/reports
git fetch origin "+refs/heads/backup/reports:$B"

PROJECT_NOTES="$HOME/.gstack/projects/10xosborn-dots-boxes"
mkdir -p .gstack "$PROJECT_NOTES" ../.claude

# core.autocrlf=false: every file comes back exactly as it was saved.
put() {
  git -c core.autocrlf=false archive --format=tar "$B:$1" | tar -x -C "$2"
  echo "restored $1 -> $2"
}
put repo-gstack .gstack
put gstack-home/projects/10xosborn-dots-boxes "$PROJECT_NOTES"
put parent-folder-claude ../.claude

git cat-file blob "$B:gstack-home/config.yaml" > "$HOME/.gstack/config.yaml"
echo "restored gstack-home/config.yaml -> ~/.gstack/config.yaml"

if git show-ref --verify --quiet refs/heads/design/04-board-marks; then
  echo "design/04-board-marks already exists: left as it is"
else
  git cat-file blob "$B:git/design-04-board-marks.bundle" > ../design-04-board-marks.bundle
  git fetch -q ../design-04-board-marks.bundle design/04-board-marks:design/04-board-marks
  rm ../design-04-board-marks.bundle
  echo "restored the parked branch design/04-board-marks"
fi

echo "Done. Next: CLAUDE.md, section \"After a Windows reset\"."
