# Setting up a Helrig Box

You need a box with the [firmware installed](flashing.md).

## Setting up a new box

1. Plug the box in. It raises its own Wi-Fi network, **`Helrig Box <id>`** (six hex digits; the same ones follow "Helrig Box" in the app).
2. On your phone, join that network and open `http://192.168.4.1`. The page lists the 2.4 GHz networks the box can see.
3. Pick yours, type the password, and press **Connect**. The page says when the box is on your network and shows its address.
4. Open Helrig on your computer, plug your pedal into the box, and choose the box in the device menu. Helrig finds it by itself; you do not type an address.

About 45 seconds after the box has joined your network it switches its own network off. Phones and computers may keep listing the name for a few
minutes after it has gone; that is their cached list, not the box. If the box's Wi-Fi is lost for 40 seconds, for example after you get a new router, the
setup network comes back and you repeat steps 2 and 3. While the box is on your network, the same page is at the box's address and offers another network.

## Factory reset

Hold the board's **BOOT** button for 5 seconds while the box is running. It forgets your Wi-Fi network and restarts, and raises its setup network
again. It stays a Helrig Box. Do not hold BOOT while powering the board up: that starts the chip's download mode. The board has only a power LED, so
nothing blinks; the setup network reappearing about 5 seconds after the restart is the sign.

## Safety

The box and your computer should be on a network you trust. There is no password on the box's connection to Helrig yet: anyone on the same network
could talk to a pedal that is plugged into it.
