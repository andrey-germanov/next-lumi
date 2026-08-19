#!/usr/bin/env bash
# Renders an announcement hero HTML to a 1200×675 @2x PNG.
#
#   ./render.sh <input.html> <output.png>
#
# Uses the Chrome already installed on this machine — no npm install, no
# headless-browser dependency added to the app.
set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || { echo "Chrome not found at: $CHROME" >&2; exit 1; }

IN="${1:?usage: render.sh <input.html> <output.png>}"
OUT="${2:?usage: render.sh <input.html> <output.png>}"
[ -f "$IN" ] || { echo "No such file: $IN" >&2; exit 1; }

# Absolute file:// URL so relative <img src> inside the HTML resolves.
ABS_IN="$(cd "$(dirname "$IN")" && pwd)/$(basename "$IN")"

# --force-device-scale-factor=2 → 2400×1350 output, crisp on every screen.
# stderr is noisy on macOS ("Trying to load the allocator multiple times") and
# harmless — only the exit code matters.
"$CHROME" \
  --headless \
  --disable-gpu \
  --hide-scrollbars \
  --force-device-scale-factor=2 \
  --window-size=1200,675 \
  --screenshot="$OUT" \
  "file://$ABS_IN" 2>/dev/null

[ -f "$OUT" ] || { echo "Render produced no file" >&2; exit 1; }

if command -v sips >/dev/null 2>&1; then
  W=$(sips -g pixelWidth  "$OUT" | awk '/pixelWidth/{print $2}')
  H=$(sips -g pixelHeight "$OUT" | awk '/pixelHeight/{print $2}')
  echo "✓ $OUT — ${W}×${H} ($(du -h "$OUT" | cut -f1))"
  [ "$W" = "2400" ] && [ "$H" = "1350" ] || echo "⚠ expected 2400×1350 — check body width/height in the HTML" >&2
else
  echo "✓ $OUT"
fi
