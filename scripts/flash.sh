#!/usr/bin/env bash
# Flashes the Helrig Box firmware built by scripts/build.sh.
#
#   scripts/flash.sh -p /dev/ttyACM0            flash the application (the saved Wi-Fi network is kept)
#   scripts/flash.sh -p /dev/ttyACM0 --fresh    also clear the saved settings, so the box starts like a new one
#   add --release if you built with --release
#
# Needs espflash, and ESP-IDF's environment for --fresh.
set -euo pipefail

HERE="$(cd "$(dirname "$0")/.." && pwd)"
TONERELAY_DIR="${TONERELAY_DIR:-$HERE/third_party/ToneRelay}"
PORT=""; FRESH=0; KIND=debug
while [[ $# -gt 0 ]]; do
  case "$1" in
    -p|--port) PORT="${2:-}"; shift 2 ;;
    --fresh) FRESH=1; shift ;;
    --release) KIND=release; shift ;;
    -h|--help) sed -n '2,9p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "unknown option: $1" >&2; exit 1 ;;
  esac
done
[[ -n "$PORT" ]] || { echo "give the serial port with -p" >&2; exit 1; }

cd "$TONERELAY_DIR/esp32-p4"
BIN="target/riscv32imafc-esp-espidf/$KIND/hxbridge-p4"
[[ -f "$BIN" ]] || { echo "no build at $BIN: run scripts/build.sh first." >&2; exit 1; }
espflash flash -p "$PORT" --chip esp32p4 --partition-table partitions.csv --partition-table-offset 0x8000 "$BIN"
if [[ $FRESH -eq 1 ]]; then
  scripts/provision.sh -p "$PORT"
fi
echo "done. Power-cycle the board."
