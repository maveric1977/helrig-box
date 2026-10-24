#!/usr/bin/env bash
# Splits the firmware built by scripts/build.sh into the parts the web flasher writes, and describes them in web/firmware/manifest.json.
#
#   scripts/package-web.sh            from the debug build (what the bench uses)
#   scripts/package-web.sh --release  from the release build
#
# The parts are the bootloader (0x2000), the partition table (0x8000) and the app (0x10000). The settings (NVS, 0x9000), the radio data (0xf000) and the
# catalog partition are left alone, so a web update keeps the saved Wi-Fi network.
# Needs espflash and python3. The .bin files are not committed (see .gitignore); a release uploads web/firmware as a zip and the Vercel build fetches it (web/fetch-firmware.sh).
set -euo pipefail

HERE="$(cd "$(dirname "$0")/.." && pwd)"
TONERELAY_DIR="${TONERELAY_DIR:-$HERE/third_party/ToneRelay}"
KIND=debug; [[ "${1:-}" == "--release" ]] && KIND=release
T="$TONERELAY_DIR/esp32-p4/target/riscv32imafc-esp-espidf/$KIND"
[[ -f "$T/hxbridge-p4" && -f "$T/build/bootloader.bin" ]] || { echo "no $KIND build in $T: run scripts/build.sh first." >&2; exit 1; }

OUT="$HERE/web/firmware"
mkdir -p "$OUT"
MERGED="$(mktemp)"
trap 'rm -f "$MERGED"' EXIT
( cd "$TONERELAY_DIR/esp32-p4" && espflash save-image --chip esp32p4 --merge --skip-padding --flash-size 16mb \
    --bootloader "$T/build/bootloader.bin" --partition-table partitions.csv --partition-table-offset 0x8000 \
    "$T/hxbridge-p4" "$MERGED" )

VERSION="$(git -C "$HERE" describe --tags --always --dirty 2>/dev/null || echo unknown)"
TR="$(git -C "$TONERELAY_DIR" rev-parse --short HEAD)"
python3 -I - "$MERGED" "$OUT" "$VERSION" "$TR" <<'PY'
import hashlib, json, sys
merged, out, version, tr = sys.argv[1:5]
d = open(merged, 'rb').read()
assert d[0x2000] == 0xE9 and d[0x8000:0x8002] == b'\xaa\x50' and d[0x10000] == 0xE9, "unexpected merged layout"
assert d[0x9000:0x10000] == b'\xff' * 0x7000, "settings area is not padding"
parts = [("bootloader.bin", 0x2000, d[0x2000:0x8000]), ("partition-table.bin", 0x8000, d[0x8000:0x9000]), ("app.bin", 0x10000, d[0x10000:])]
man = {"name": "Helrig Box", "chip": "ESP32-P4", "version": version, "toneRelay": tr, "parts": []}
for name, off, data in parts:
    open(f"{out}/{name}", "wb").write(data)
    man["parts"].append({"file": name, "offset": off, "size": len(data), "sha256": hashlib.sha256(data).hexdigest()})
open(f"{out}/manifest.json", "w").write(json.dumps(man, indent=2) + "\n")
print(f"{version} (ToneRelay {tr}):", ", ".join(f"{p['file']} {p['size']}" for p in man["parts"]))
PY
