# Install the firmware

## What you need

| Part | Notes |
|---|---|
| **[Waveshare ESP32-P4-NANO](https://www.waveshare.com/esp32-p4-nano.htm?sku=29026)** ([wiki](https://www.waveshare.com/wiki/ESP32-P4-NANO)) | The board this firmware is built and tested on. Its main chip, an ESP32-P4, talks to the pedal through the **USB-A** port. A second chip on the board, an ESP32-C6, does the Wi-Fi. Waveshare sells it in several kits. Order the **Basic Kit** (the board and a speaker). The box does not use the camera, PoE or display kits. |
| **A USB-C cable that carries data** | For power and flashing. A charge-only cable will not show a serial device. |
| **A USB-C power source** | A 5 V phone charger or a computer port. |
| **The pedal's USB cable** | The cable you use to connect the pedal to a computer. The end that goes into the box must be USB-A, because that is the box's pedal port. Check what your cable has on that end. |
| **A case** (optional) | A 3D-printable [lid and bottom](../hardware/casing/README.md), in a single-colour and a multi-colour version. Not test-printed yet. |

So far it has been tried with a Helix LT and an HX Stomp. Other Helix and HX pedals have not been tried. The Wi-Fi is **2.4 GHz only**, so the setup page does not list
5 GHz networks. Other ESP32-P4 boards are untested.

You also need [Helrig](https://helrig.com) on your computer. Connecting to a pedal needs Helrig Connect or Helrig Pro.

## Flash it from your browser

1. Use desktop **Chrome** or **Edge** (Windows, macOS or Linux). Safari, Firefox and phones cannot do this.
2. Connect the board's **UART USB-C** port to your computer. The pedal does not need to be plugged in yet.
3. Open the web flasher: **https://box.helrig.com/flash**
4. Press **Install** and choose **USB Single Serial** in the list. It may show up as `usbmodem`, `ttyACM` or a COM port.
5. Wait about **2 minutes** and keep the tab open and the cable connected. The board restarts by itself.

Installing over a box you already set up keeps its Wi-Fi networks and pairings, so you can update without setting it up again. To wipe those too, open **Options** on the flasher page and tick **Start as a new box** before you press Install. Every device then has to pair again.

Then continue with [Setting up a Helrig Box](setup.md).

## Drivers

None to install. The board shows up as a standard USB serial device. Seen on a macOS Mac, a Windows 11 VM and an Ubuntu VM:

| System | What happened |
|---|---|
| macOS | A `/dev/cu.usbmodem...` port from Apple's own driver. |
| Windows 11 | "USB Serial Device (COM3)" from Microsoft's own `usbser` driver. Other Windows versions are untested. |
| Linux (Ubuntu) | `/dev/ttyACM0` from the kernel's `cdc_acm` module. |

**Linux:** your user must be allowed to open the port, which usually means the `dialout` group. Run this, then log out and back in:

```bash
sudo usermod -aG dialout $USER
```

## Troubleshooting

- **The page cannot connect.** Unplug and replug the board. If that does not help, hold **BOOT**, tap **RESET**, release **BOOT**, then press **Install** again. Close any
  other program that is using the board's serial port.
- **No port in the list.** Try another cable (it must carry data). Check you are using the board's **UART USB-C** port, not the USB-A one.
- **"Permission denied" on Linux.** See the `dialout` step above.
- **The page says the browser cannot flash.** Use desktop Chrome or Edge.
- **The setup network does not appear.** Wait about 10 seconds after power-up. Phones can also keep an old list for a few minutes.
- **The box stopped halfway.** Run the page again. If the box still does not start, [build and flash it from source](dev/build.md).
- **Helrig does not find the pedal.** Replug the pedal's USB cable and try again. If it is still stuck, unplug the pedal's 9 V power for a moment. A
  USB replug is sometimes not enough. Helrig never sends a USB reset.
- **Helrig says the box needs pairing, or there is no Pair button.** Update Helrig to 1.5.3 or later. Then press **Pair** and, within 30 seconds, press **BOOT** on the board once. Hold it for 5 seconds and you factory-reset the box instead.
- **Do not hold BOOT while the board powers up.** That starts the chip's download mode instead of the firmware.
