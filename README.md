<p align="center">
  <img src="brand/helrig-box-icon.svg" alt="" width="120">
</p>

<h1 align="center">Helrig Box</h1>

<p align="center">A small box that puts your Helix or HX pedal on your Wi-Fi, so <a href="https://helrig.com">Helrig</a> can edit it without a cable to your computer.</p>

<p align="center">
  <img src="hardware/casing/helrig-box-photo.webp" alt="The finished Helrig Box: a small black 3D-printed case with the four-colour Helrig symbol on top and HELRIG in white on the side" width="480">
</p>

![Helrig on your computer, connected over Wi-Fi to the Helrig Box, connected by USB to your Helix or HX pedal](brand/diagrams/helrig-box-diagram-dark.svg)

The pedal plugs into the box by USB. The box joins your Wi-Fi. Helrig finds it and edits the pedal as it would over a cable. The box only passes the pedal's USB signal along. It never reads or changes your presets.

Tried so far with a **Helix LT** and an **HX Stomp**. Connecting to a pedal in Helrig needs Helrig Connect or Helrig Pro.

## Get one running

1. **Get the parts.** A [Waveshare ESP32-P4-NANO](https://www.waveshare.com/esp32-p4-nano.htm?sku=29026) board ([wiki](https://www.waveshare.com/wiki/ESP32-P4-NANO)), a USB-C cable that carries data, a USB-C power source,
   and the USB cable you use to connect your pedal to a computer. A [3D-printable case](hardware/casing/README.md) is optional. [Full list](docs/flashing.md#what-you-need).
2. **Install the firmware** from your browser (desktop Chrome or Edge), with nothing to install: **[box.helrig.com/flash](https://box.helrig.com/flash)**.
   It takes about 2 minutes. [Step by step, drivers and troubleshooting](docs/flashing.md).
3. **Set it up.** On your phone, join the Wi-Fi network the box makes. It is called **Helrig Box** plus six characters. Open `http://192.168.4.1` and pick your home Wi-Fi.
   [Setup and factory reset](docs/setup.md).
4. **Use it.** Plug your pedal into the box's **USB-A** port, open Helrig, and pick the box in the device menu. The first time, press **Pair** in Helrig, then press **BOOT** on the board once.

The box works on 2.4 GHz Wi-Fi only. It remembers up to three networks, so home, the rehearsal room and your phone's hotspot can all work. Each computer or tablet pairs with the box once, by pressing the BOOT button on the board. Pairing needs Helrig 1.5.3 or later. It does not encrypt the traffic, so use the box on a network you trust.

## Questions and problems

Check [Troubleshooting](docs/flashing.md#troubleshooting) first. If that does not help, [open an issue](https://github.com/maveric1977/helrig-box/issues) and say which
pedal, which computer and browser, and what the page or the box did.

## For developers

The firmware is [ToneRelay](https://github.com/mpeskett88/ToneRelay), an open-source Wi-Fi relay for Helix pedals by Mark Peskett, built with a small
Helrig Box profile (its names, setup page and defaults). This repository holds that profile, the web flasher and the docs.
[How it fits together](docs/dev/architecture.md) · [Build from source](docs/dev/build.md) · [Releasing](docs/dev/releasing.md) · [What has been measured](docs/dev/measurements.md)

## Licence

The code and docs are MIT ([LICENSE](LICENSE)). The Helrig name, the Helrig Box logo and the icon are Helrig's and are not covered by it; see
[NOTICE.md](NOTICE.md), which also lists the other software used. Helrig and the Helrig Box are not affiliated with Line 6 or Yamaha Guitar Group.
