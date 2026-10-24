#!/bin/sh
# Vercel build step: puts the firmware parts of the latest release next to the page, so the page can fetch them from its own origin.
# Needs a published release with helrig-box-web-firmware.zip attached (docs/dev/releasing.md). The repository is public, so no token is needed.
set -eu
URL="${FIRMWARE_URL:-https://github.com/maveric1977/helrig-box/releases/latest/download/helrig-box-web-firmware.zip}"
TMP="$(mktemp -d)"
curl -fsSL "$URL" -o "$TMP/fw.zip" || { echo "No release with helrig-box-web-firmware.zip yet: $URL" >&2; exit 1; }
mkdir -p firmware
python3 -m zipfile -e "$TMP/fw.zip" firmware
test -f firmware/manifest.json || { echo "manifest.json is missing from the release zip." >&2; exit 1; }
echo "firmware: $(python3 -c 'import json;print(json.load(open("firmware/manifest.json"))["version"])')"
