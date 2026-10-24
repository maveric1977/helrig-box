#!/usr/bin/env bash
# Builds the Helrig Box firmware: ToneRelay's ESP32-P4 firmware with this repository's profile (names, setup page, defaults).
#
#   scripts/build.sh            debug build (what the bench uses)
#   scripts/build.sh --release  release build
#
# Needs ESP-IDF's environment (source its export.sh, so IDF_PATH is set), a rustup toolchain for esp-idf-sys, and ToneRelay's source in
# third_party/ToneRelay (a submodule) or wherever TONERELAY_DIR points.
set -euo pipefail

HERE="$(cd "$(dirname "$0")/.." && pwd)"
TONERELAY_DIR="${TONERELAY_DIR:-$HERE/third_party/ToneRelay}"
if [[ ! -d "$TONERELAY_DIR/esp32-p4" ]]; then
  echo "ToneRelay's source is not at $TONERELAY_DIR (git submodule update --init, or set TONERELAY_DIR)." >&2; exit 1
fi
if [[ -z "${IDF_PATH:-}" ]]; then
  echo "IDF_PATH is not set: source ESP-IDF's export.sh first." >&2; exit 1
fi

export TONERELAY_PROFILE_DIR="$HERE/profile"
cd "$TONERELAY_DIR/esp32-p4"
# The profile is read when the C component is configured; touching this file makes cargo rebuild it, so switching profile takes effect.
touch sdkconfig.defaults
cargo build "$@"

KIND=debug
for a in "$@"; do [[ "$a" == "--release" ]] && KIND=release; done
echo "built: $TONERELAY_DIR/esp32-p4/target/riscv32imafc-esp-espidf/$KIND/hxbridge-p4 (profile: $TONERELAY_PROFILE_DIR)"
