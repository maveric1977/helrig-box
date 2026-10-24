# Build the firmware yourself

Most people should use the [web flasher](../flashing.md) instead. This page is for building the firmware from source, and for changing it.
What to buy, drivers and troubleshooting are in [flashing.md](../flashing.md).

## What you need on the computer

- **ESP-IDF v5.5.3** ([Espressif's install guide](https://docs.espressif.com/projects/esp-idf/en/v5.5.3/esp32p4/get-started/)), with its `export.sh`
  sourced in the shell you build from.
- **Rust** through `rustup`. ToneRelay's `esp32-p4/rust-toolchain.toml` selects the nightly toolchain and `rust-src`; `rustup` installs them the first time you build.
- **`ldproxy`** and **`espflash`**: `cargo install ldproxy espflash` (the bench used espflash 4.6.0).
- **`git`**, **Python 3** (ESP-IDF's tools), and **libclang** for the bindings. On macOS with the command line tools:
  `export LIBCLANG_PATH=/Library/Developer/CommandLineTools/usr/lib`. ToneRelay's `.cargo/config.toml` sets a Linux path
  (`/usr/lib/aarch64-linux-gnu`); an environment variable overrides it.

This was built on macOS (Apple silicon). Linux should follow the same steps but I have not run them there.

## Build

```bash
git clone --recurse-submodules https://github.com/maveric1977/helrig-box.git
cd helrig-box
. /path/to/esp-idf-v5.5.3/export.sh
export LIBCLANG_PATH=...            # macOS: see above
scripts/build.sh                    # or: scripts/build.sh --release
```

`scripts/build.sh` builds ToneRelay (the submodule in `third_party/ToneRelay`) with this repository's `profile/` through the
`TONERELAY_PROFILE_DIR` variable. The first build compiles ESP-IDF and the Rust crates and takes a few minutes [bench: about 40 s for a
rebuild with warm caches; the cold build was not timed]. The result is
`third_party/ToneRelay/esp32-p4/target/riscv32imafc-esp-espidf/debug/hxbridge-p4`.

## Flash

Connect the board's UART USB-C port to your computer, then:

```bash
scripts/flash.sh -p /dev/cu.usbmodemXXXX --fresh      # macOS port name; on Linux /dev/ttyACM0 or /dev/ttyUSB0
```

- `--fresh` also clears the saved settings, so the box starts like a new one and raises its **Helrig Box `<id>`** setup network. Leave it out to keep
  the saved Wi-Fi network (an update).
- Add `--release` if you built with `--release`.
- The script flashes with the partition table (`--partition-table partitions.csv`). ToneRelay's notes say that without it the flash layout is wrong and
  the catalog partition is not created; flash.sh always passes it.
- Do **not** hold BOOT while the board powers up or resets: that selects the chip's download mode. If the flash cannot connect, hold BOOT, tap RESET,
  release BOOT, and run the command again. [The bench board flashed without that.]
- Power-cycle the board afterwards.

Then follow [Setting up a Helrig Box](../setup.md).

If something does not work, see [Troubleshooting](../flashing.md#troubleshooting).
