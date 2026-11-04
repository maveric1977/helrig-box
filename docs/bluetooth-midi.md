# Bluetooth MIDI: switch presets from OnSong or any MIDI app

The Helrig Box can act as a Bluetooth MIDI device. Your setlist app sends a preset change for each song, and the box passes it to the pedal over USB.

It does the job of a Bluetooth MIDI adapter such as a WIDI Jack, with the box you already use for Wi-Fi. This is MIDI only. It switches presets. It does not edit them: editing still goes over Wi-Fi or USB, in [Helrig](https://helrig.com).

## What it is for

**Setlist apps.** Tell OnSong which preset a song uses. When you open the song, the pedal changes. The app also sends its tempo clock, and the box passes that on too.

**The rest of your rig.** On our bench the HX Stomp's own MIDI Thru passed the messages on to other pedals.

**Editing and switching together.** Helrig can edit the pedal over Wi-Fi while your app switches presets over Bluetooth. We ran both at once.

**Other apps.** AUM and the Nord app listed the box as connected. We have not tried more than that.

## What you need

- A Helrig Box with the Bluetooth MIDI firmware. Flash it at [box.helrig.com/flash](https://box.helrig.com/flash). A box you already have keeps its Wi-Fi networks.
- The pedal in the box's USB-A port, as usual.
- An iPad or a Mac.

This part does not go through Helrig: the app talks to the box directly. The pairing here is Bluetooth pairing, in your iPad's or Mac's own list. It is separate from Helrig's pairing, the BOOT-button step you do for editing over Wi-Fi.

## Set it up on an iPad

1. Open a list of Bluetooth MIDI devices. Apple's own list is the one apps such as AUM show.
2. Tap **Helrig Box**. The first time, accept the pairing request. The list can say "Not Connected" for a moment. Close it and open it again to see the new state.
3. In OnSong, pick the box as the MIDI output.

OnSong's own Bluetooth button did not connect the box in our tests. Connect it from the list in step 1 first. OnSong then shows it as connected.

## Set it up on a Mac

1. Open Audio MIDI Setup, then **Window**, **Show MIDI Studio**.
2. Click the Bluetooth icon, then **Connect** next to Helrig Box. Accept the pairing request.
3. The box is now a MIDI destination in every Mac app.

## What it does not do

- It does not edit presets over Bluetooth.
- From the pedal, it sends back program changes, control changes and notes only (a preset or snapshot change made on the pedal reaches your app). SysEx and MIDI clock from the pedal are not passed on.
- Anyone within Bluetooth range can pair with the box. There is no pairing window yet. Once paired, the link is encrypted.
- It has only been tried with an HX Stomp, an iPad, a Mac and an Android tablet. Windows and Linux are untried.

## If the iPad lists the box but will not connect

Turn the iPad's Bluetooth off and on, then try again. If that fails, forget the box and pair it again. On an iPad, forgetting it in the Bluetooth MIDI list (**Edit**) is not enough: also forget it in **Settings**, **Bluetooth**, under **My Devices**. Pair again after that. In our test the first connection right after a fresh pairing dropped once, and tapping the box again connected it. After pairing again, close OnSong and Helrig completely and open them again: neither listed the box as connected until we did.

Do the same after a factory reset (BOOT held for 5 seconds) or after flashing with **Start as a new box**. The box forgets its Bluetooth pairings, so your iPad or Mac has to forget the box too.

OnSong, WIDI and Bluetooth are trademarks of their owners. Helrig and the Helrig Box are not affiliated with Line 6 or Yamaha Guitar Group.
