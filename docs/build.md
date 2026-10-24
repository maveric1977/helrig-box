# What to buy, and how to build and flash it

## What to buy

| Part | Notes |
|---|---|
| **Waveshare ESP32-P4-NANO** | The board this firmware is built and tested on. Its ESP32-P4 talks to the pedal over the **USB-A** port (high-speed USB host); an onboard ESP32-C6 provides the Wi-Fi. |
| **USB-C cable that carries data** | For power, flashing and the serial log. A charge-only cable will not show a serial device. |
| **A USB-C power source** | A 5 V phone charger or a computer port. [Not measured: the board's current draw; I have not logged it.] |
| **The pedal's USB cable** | The cable you would use to connect the pedal to a computer, with a USB-A plug on the other end, because the box's pedal port is **USB-A**. [Which connector your pedal model has: check the pedal; I have not listed them.] |
| **A case** (optional) | None is specified here yet. |

Pedals tried with this firmware: a Helix LT and an HX Stomp. Others in the family have not been tried.
The Wi-Fi is **2.4 GHz only** (the C6's radio): the setup page does not list 5 GHz networks. Other ESP32-P4 boards are untested; the pin map
in ToneRelay's firmware is written for this board.

ToneRelay's notes say the board's USB-C port is the UART programming port, and that it must show up as a serial device before flashing. The
pedal goes into the **USB-A** port. Check Waveshare's wiki for the port labels on your revision.

## Drivers

The board's USB-C UART port is a WCH CH343 (`1a86:55d3`, "USB Single Serial") that shows up as a standard USB serial device, so none of the three
systems needs a vendor driver. What was seen, with the board on each:

| System | What happened | |
|---|---|---|
| macOS | `/dev/cu.usbmodem...`, bound by Apple's own `AppleUSBACMData`; no WCH driver was installed | measured |
| Windows 11 (VM, online) | "USB Serial Device (COM3)", driver Microsoft `usbser`, version 10.0.26100.x, signed by Microsoft Windows | measured; offline not tried; other Windows versions not tried |
| Linux (Ubuntu VM) | `/dev/ttyACM0`, owned by `root:dialout` (mode 660), created by the kernel's own `cdc_acm` module; no driver install | measured |

**Linux:** your user must be allowed to open the port, which usually means the `dialout` group:

```bash
sudo usermod -aG dialout $USER     # then log out and back in
```

On the Ubuntu VM the user was not in that group, so flashing from it would have failed with a permission error. A Linux desktop with ModemManager
running can also grab a new serial port for a few seconds; if the flash cannot connect, try again. [Not seen here.]

## The quickest way: the web flasher

If you only want to install the firmware, use the web flasher (`web/`, published with GitHub Pages): open it in desktop **Chrome or Edge**, connect the
board's UART USB-C port, press **Connect and install**, and choose "USB Single Serial". It takes about 2 minutes, needs no tools, and keeps the saved
Wi-Fi network unless you tick "Start as a new box". [Measured on macOS with Chrome, served from localhost: three updates, each of which restarted the
box by itself and kept its Wi-Fi. Not yet tried on Windows or Linux, or from the published https page.] The rest of this page is for building the firmware yourself.

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

Then follow [`docs/setup.md`](setup.md): join the box's network from your phone, open `http://192.168.4.1`, and enter your Wi-Fi.

## If it does not work

- No serial port: another cable, and the board's UART USB-C port rather than the USB-A one.
- The build cannot find libclang: set `LIBCLANG_PATH` as above.
- The setup network does not appear: wait about 10 s after power-up [measured: 5.0 s to the network, 9.3 s to an address on a saved network]; phones
  can also keep a stale list. Hold BOOT for 5 s (running, not at power-up) for a factory reset.
- The pedal is not found by Helrig: replug the pedal's USB cable and try again. ToneRelay's notes say that a pedal already wedged may need its **9 V**
  power pulled, because a USB replug is not enough. Helrig never sends a USB reset.
