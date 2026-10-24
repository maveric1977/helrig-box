<p align="center">
  <img src="brand/helrig-box-icon.svg" alt="" width="120">
</p>

<h1 align="center">Helrig Box</h1>

The Helrig Box is a small box that sits next to a Line 6 Helix or HX pedal and gives the [Helrig](https://helrig.com) apps wireless access to
it. The pedal plugs into the box by USB, the box joins your Wi-Fi, and Helrig on your computer finds it and edits the pedal as it would over
a cable.

This repository is the box's firmware identity and its documentation. The firmware itself is
[ToneRelay](https://github.com/mpeskett88/ToneRelay), an open-source Wi-Fi relay for Helix pedals by Mark Peskett. What makes a ToneRelay
build a Helrig Box is a small **profile** (`profile/`): the names the box shows the network (`Helrig Box e7fb0b`, `helrigbox.local`), the
page it serves for Wi-Fi setup, and its defaults (relay-only on). Everything else, the relay, the USB handling and the Wi-Fi code, is ToneRelay's,
and improvements to it go back to ToneRelay.

```
Helrig on your computer  ──  Wi-Fi, ws://helrigbox.local/raw  ──  Helrig Box  ──  USB  ──  Helix / HX
```

The box carries the pedal's USB transfers and does not interpret them; Helrig is the only thing that speaks the pedal's protocol. The
contract between the two is ToneRelay's `docs/raw-relay-protocol.md`.

## What is here

| | |
|---|---|
| `profile/profile.c` | The Helrig Box's names and defaults. |
| `profile/setup.html` | The setup and status page the box serves (about 9 KB, no network requests, the logo inline). |
| `brand/` | The lockup SVGs and the brief the page follows. Helrig's artwork: see `NOTICE.md`. |
| `scripts/build.sh`, `scripts/flash.sh` | Build ToneRelay with this profile; flash it, and optionally clear the box's settings. |
| `web/` | The web flasher: a page that installs the firmware from Chrome or Edge, with no tools. |
| `docs/build.md` | What to buy, what to install, how to build and flash. |
| `docs/releasing.md` | How a release and the web flasher are published. |
| `docs/setup.md` | What a new owner does, factory reset, and what has been measured. |
| `third_party/ToneRelay` | ToneRelay's source, pinned (a submodule). |

## Build and flash

```bash
git submodule update --init
. /path/to/esp-idf/export.sh        # IDF_PATH and the toolchain
scripts/build.sh                    # or --release
scripts/flash.sh -p /dev/ttyACM0 --fresh
```

`--fresh` clears the saved settings, so the box starts like a new one and raises its setup network. Power-cycle the board afterwards.

## Status

Built and tried on an ESP32-P4-NANO (Waveshare) with a Helix LT and an HX Stomp. The Helrig apps' support for the box is in
[the Helrig repository](https://github.com/maveric1977/helrig) (private). The ToneRelay changes this depends on (the relay, the profile
mechanism and the fixes) are going upstream; until they are merged, `third_party/ToneRelay` points at a fork.
