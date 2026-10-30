# Setting up a Helrig Box

You need a box with the [firmware installed](flashing.md).

## Setting up a new box

1. Plug the box in. It starts its own Wi-Fi network called `Helrig Box` plus six characters, for example `Helrig Box 3fa9c1`. The same six characters show after "Helrig Box" in Helrig.
2. On your phone, join that network and open `http://192.168.4.1`. The page lists the Wi-Fi networks the box can see. Only 2.4 GHz networks show up.
3. Pick yours, type the password, and press **Connect**. The page says when the box is on your network and shows its address.
4. Open Helrig, plug your pedal into the box, and choose the box in the device menu. Helrig finds it on its own. You never type an address.
5. The first time, Helrig says the box **needs pairing**. Do the steps under [Pairing](#pairing) below. This needs Helrig 1.5.3 or later.

About 45 seconds after the box joins your Wi-Fi, it switches its own network off. Your phone may keep showing the name for a few minutes. That is your phone's old list, not the box.

If the box can't join any saved network for 40 seconds (a new router, say), its own network comes back. Repeat steps 2 and 3.

While the box is on your Wi-Fi, the same page is at the box's address, and you can add another network there.

## Pairing

Pairing tells the box which computers and tablets it should trust. A device that hasn't paired can't use your pedal through the box, even if it's on your Wi-Fi. Pairing means pressing a button on the board, so only someone standing at the box can do it.

1. In Helrig, choose the box. If it says **Needs pairing**, press **Pair**.
2. Within 30 seconds of pressing Pair, press the **BOOT** button on the board once and let go. Don't hold it. Holding it for 5 seconds is a [factory reset](#factory-reset).
3. Helrig remembers the pairing on that device, so you do this once per device, unless you reset the box.

Pair each computer or tablet you use, once. If Helrig says the box didn't accept the saved pairing, press **Pair** again. If it says another device is pairing, wait a minute. The box handles one pairing at a time.

Pairing does not encrypt the traffic between the box and your computer, so use the box on a network you trust, like your home or your rehearsal room. See [Safety](#safety).

## Several Wi-Fi networks

The box remembers up to three Wi-Fi networks, for example home, the rehearsal room and your phone's hotspot. Add each one from the same setup page you used for the first. If the box is on a network now, the page is at the box's address. If it has no network to join, use the box's own setup network.

- When the box starts, it joins the network it used last, if that one is in range. If not, it picks the strongest saved network it can see. A network that just failed goes to the back of the line.
- The page lists your saved networks, names only, never passwords. **Forget** removes one.
- Save a fourth and it replaces the one the box joined longest ago.
- **Phone hotspot:** the box only does 2.4 GHz, so switch on your hotspot's compatibility option. On an iPhone it is called Maximize Compatibility.
- When the box moves to a different network, your phone is no longer on the same Wi-Fi, so the setup page can't reach it any more. The page tells you after a few seconds. Put your phone on the box's new network and open Helrig. It finds the box on its own.

## Factory reset

To wipe the box and start over, hold the **BOOT** button on the board for 5 seconds while the box is running. It forgets every Wi-Fi network, the password of its own setup network, and its pairing token (the key that proves a device is paired). Then it restarts and brings back its setup network. It is still a Helrig Box, and every device has to pair again.

Do not hold BOOT while you plug the power in. That starts the chip's download mode instead of the firmware.

The board has only a power light, so nothing blinks. About 5 seconds after the restart, the setup network reappears. That is how you know it worked.

## Safety

Pairing stops other devices on your Wi-Fi from using the pedal through the box. It does not encrypt the traffic between the box and your computer, so use the box on a network you trust, like your home or your rehearsal room.
