# Setting up a Helrig Box

## Setting up a new box

1. Plug the box in. It raises its own Wi-Fi network, **`Helrig Box <id>`** (six hex digits; the same ones follow "Helrig Box" in the app).
2. On your phone, join that network and open `http://192.168.4.1`. The page lists the 2.4 GHz networks the box can see.
3. Pick yours, type the password, and press **Connect**. The page says when the box is on your network and shows its address.
4. Open Helrig on your computer, plug your pedal into the box, and choose the box in the device menu. Helrig finds it by itself
   (`_helrigbox._tcp`); you do not type an address.

45 seconds after it has joined your network the box switches its own network off [measured on the box's serial log: 45.0 s]. Phones and
computers may keep listing the name for a few minutes after it has gone; that is their cached list, not the box. If its Wi-Fi is lost for 40 seconds,
for example after a new router, the network comes back and you repeat steps 2 and 3 [the 40 s fallback is in the code but has not been exercised on
the board]. While the box is on your network the same page is at the box's address and offers another network.

## Factory reset

Hold the board's **BOOT** button for 5 seconds while the box is running. It forgets your Wi-Fi network and hotspot password, restarts and raises its
setup network again [measured: the reset ran 5.002 s after the press; the pin is GPIO35]. It stays a Helrig Box. Do not hold BOOT while powering the
board up: that starts the chip's download mode. The ESP32-P4-NANO has only a power LED, so nothing blinks; the setup network reappearing about 5 s
after the restart is the sign.

## Handing a box over

`scripts/flash.sh -p <port> --fresh` flashes the firmware and clears the saved settings, so the box starts as a blank Helrig Box.

## The setup page's look

Helrig's colours (ground `#0a0a0a`, text `#f2efe9`, and signal yellow `#FFD23F`, the Helrig Box colour, for actions and focus), the system font,
and the Helrig Box logo as inline vector paths. The page makes no network request, so it looks the same on the box's own network and on a home
network, and the logo links to https://helrig.com. See `brand/helrig_setup_brand.md`.

## What you need

- A Helrig Box (an ESP32-P4 board running this firmware) with the pedal plugged into it.
- The box and the computer on the same trusted network. There is no authentication on `/raw` yet.
- Helrig's desktop app. Connecting to a pedal needs Helrig Connect or Helrig Pro.

## Measured

On an ESP32-P4-NANO with a Helix LT and an HX Stomp (one box, one Mac):
- **Setup:** the setup network was up 5.0 s after boot; a network scan took 2.9 s; a join took 4.4 s from the press to an address. From power-on with a
  saved network the box has its address after 9.3 s.
- **Replies:** HTTP replies after a 5 s idle gap had a median of about 38 ms (worst 69 ms) with Wi-Fi power-save off, against about 103 ms (worst 362 ms)
  with it on. `mdns-sd` found the box in 2 of 2 runs with it off and in 0 of 3 with it on.
- **Saved writes** through the box: three on the LT and four on the Stomp, all confirmed by the pedal.
- **Not tested:** an hour-long session, many saves in a row, Wi-Fi loss in the middle of a write, two boxes in one room, the 40 s fallback.
