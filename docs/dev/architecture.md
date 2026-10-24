# How this repository is put together

The Helrig Box's firmware is [ToneRelay](https://github.com/mpeskett88/ToneRelay), an open-source Wi-Fi relay for Helix pedals by Mark Peskett. What makes a
ToneRelay build a Helrig Box is a small **profile** (`profile/`): the names the box shows the network (`Helrig Box e7fb0b`, `helrigbox.local`), the
page it serves for Wi-Fi setup, and its defaults (relay-only on). Everything else, the relay, the USB handling and the Wi-Fi code, is ToneRelay's,
and improvements to it go back to ToneRelay.

![Helrig on your computer, connected over Wi-Fi to the Helrig Box, connected by USB to your Helix or HX pedal](../../brand/diagrams/helrig-box-diagram-dark.svg)

The box carries the pedal's USB transfers and does not interpret them; Helrig is the only thing that speaks the pedal's protocol. The contract
between the two is ToneRelay's `docs/raw-relay-protocol.md`.

| | |
|---|---|
| `profile/profile.c` | The Helrig Box's names and defaults. |
| `profile/setup.html` | The setup and status page the box serves (about 9 KB, no network requests, the logo inline). |
| `brand/` | The lockup and icon SVGs and the brief the page follows. Helrig's artwork: see `NOTICE.md`. |
| `scripts/build.sh`, `scripts/flash.sh` | Build ToneRelay with this profile; flash it, and optionally clear the box's settings. |
| `scripts/package-web.sh` | Split the build into the parts the web flasher writes. |
| `web/` | The web flasher, published at box.helrig.com on Vercel ([releasing](releasing.md)). |
| `third_party/ToneRelay` | ToneRelay's source, pinned (a submodule). Until the changes this depends on are merged upstream, it points at a fork. |

See also: [build from source](build.md), [releasing](releasing.md), [setup page](setup-page.md), [measurements](measurements.md).
