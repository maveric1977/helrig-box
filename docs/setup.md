# Setting up a Helrig Box

You need a box with the [firmware installed](flashing.md).

## Setting up a new box

1. Plug the box in. It raises its own Wi-Fi network, **`Helrig Box <id>`** (six hex digits; the same ones follow "Helrig Box" in the app).
2. On your phone, join that network and open `http://192.168.4.1`. The page lists the 2.4 GHz networks the box can see.
3. Pick yours, type the password, and press **Connect**. The page says when the box is on your network and shows its address.
4. Open Helrig, plug your pedal into the box, and choose the box in the device menu. Helrig finds it by itself; you do not type an address.
5. The first time, Helrig says the box **needs pairing**. Follow [Pairing](#pairing).

About 45 seconds after the box has joined your network it switches its own network off. Phones and computers may keep listing the name for a few
minutes after it has gone; that is their cached list, not the box. If the box cannot join any saved network for 40 seconds, for example after you get a
new router, the setup network comes back and you repeat steps 2 and 3. While the box is on your network, the same page is at the box's address and
offers another network.

## Pairing

The box only lets a computer or tablet use the pedal once that device has paired with it. Pairing needs someone at the box, so a stranger on your
Wi-Fi cannot do it for you.

1. In Helrig, choose the box. If it says **Needs pairing**, press **Pair**.
2. Within 30 seconds, press the **BOOT** button on the board once, briefly. Do not hold it: holding it for 5 seconds is a [factory reset](#factory-reset).
3. Helrig keeps the pairing on that device. You do not do this again unless you reset the box.

Every device you use (a computer, a tablet) pairs once. If Helrig says the box did not accept the saved pairing, press **Pair** again. If it says
another device is pairing right now, wait a minute: the box opens one pairing window at a time.

## Several Wi-Fi networks

The box keeps up to three networks, for example home, the rehearsal room and your phone's hotspot. Add each one with the setup page the same way you added
the first: while the box is on a network, its page is at the box's address and offers another network; when it has no network to join, use the setup
network.

- When the box starts, it looks at what is in range. It joins the network it used last if it can see it, otherwise the strongest of the others. A
  network that has just failed is tried last.
- The page lists the saved networks (names only, never passwords) and has a **Forget** button for each.
- A fourth network replaces the one the box joined longest ago.
- **Phone hotspots:** turn on the hotspot's compatibility mode (on an iPhone, "Maximize Compatibility"), because the box uses 2.4 GHz only.
- When the box joins a different network, your phone or computer is no longer on the same one, so the setup page can no longer reach it. The page says
  so after a few seconds. Join the box's new network with your phone and open Helrig; it finds the box again by itself.

## Factory reset

Hold the board's **BOOT** button for 5 seconds while the box is running. It forgets all its Wi-Fi networks, the password of its own setup network and
its pairing token, then restarts and raises its setup network again. It stays a Helrig Box, and every device has to pair with it again. Do not hold
BOOT while powering the board up: that starts the chip's download mode. The board has only a power LED, so nothing blinks; the setup network
reappearing about 5 seconds after the restart is the sign.

## Safety

Pairing keeps other devices on your network from using a pedal that is plugged into the box. It does not encrypt anything: the box and your computer
should be on a network you trust.
