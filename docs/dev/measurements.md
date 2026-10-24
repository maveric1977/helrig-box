# What has been measured

Everything here was measured on one ESP32-P4-NANO with a Helix LT and an HX Stomp, one box and one Mac, unless it says otherwise.

## Setup, replies and writes

On an ESP32-P4-NANO with a Helix LT and an HX Stomp (one box, one Mac):
- **Setup:** the setup network was up 5.0 s after boot; a network scan took 2.9 s; a join took 4.4 s from the press to an address. From power-on with a
  saved network the box has its address after 9.3 s.
- **Replies:** HTTP replies after a 5 s idle gap had a median of about 38 ms (worst 69 ms) with Wi-Fi power-save off, against about 103 ms (worst 362 ms)
  with it on. `mdns-sd` found the box in 2 of 2 runs with it off and in 0 of 3 with it on.
- **Saved writes** through the box: three on the LT and four on the Stomp, all confirmed by the pedal.
- **Not tested:** an hour-long session, many saves in a row, Wi-Fi loss in the middle of a write, two boxes in one room, the 40 s fallback.

## The setup network and the BOOT reset

[Measured on the box's serial log: the setup network went off exactly 45.0 s after the box got an address; a BOOT hold ran the reset after 5.002 s
(pin GPIO35); a phone kept listing the old network for 3 to 5 minutes. The 40 s fallback that brings the setup network back is in the code but has not
been exercised.]

## Flashing from a Waveshare factory board

[Reported by the maintainer, not logged: with the board holding Waveshare's own 10.1" factory image (`merged-factory.bin` from `waveshareteam/ESP32-P4-Platform`, written at 0x0, which replaced our firmware, the settings and the catalog partition), the web flasher at `box.helrig.com/flash` in macOS Chrome installed v0.1.1 and the box worked. This is a stand-in for a new board: that package is a display build, and what a new NANO ships with is not documented.]

## Flashing and drivers

[Measured: the web flasher wrote the firmware from macOS Chrome, served from localhost, in about 124 to 126 s at 115200 baud, four times; a faster
baud rate reset the board mid-flash, and the box did not start afterwards until it was reflashed (once). Updates kept the saved Wi-Fi. The board enumerated as a standard serial
device on macOS, Windows 11 and Ubuntu with no driver installed. Not tried: the published https page, Windows or Linux Chrome, a release build.]
