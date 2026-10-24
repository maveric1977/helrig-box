# Install the firmware

## What you need

| Part | Notes |
|---|---|
| **[Waveshare ESP32-P4-NANO](https://www.waveshare.com/esp32-p4-nano.htm)** ([wiki](https://www.waveshare.com/wiki/ESP32-P4-NANO)) | The board this firmware is built and tested on. Its ESP32-P4 talks to the pedal over the **USB-A** port; an onboard ESP32-C6 provides the Wi-Fi. Waveshare sells it as several kits (with a speaker, camera, PoE module or display): the firmware uses none of the extras, so the board alone or the basic kit is enough. |
| **A USB-C cable that carries data** | For power and flashing. A charge-only cable will not show a serial device. |
| **A USB-C power source** | A 5 V phone charger or a computer port. |
| **The pedal's USB cable** | The cable you would use to connect the pedal to a computer, with a USB-A plug on the end that goes into the box, because the box's pedal port is **USB-A**. Check which connector your pedal has. |
| **A case** (optional) | None is specified yet. |

Pedals tried so far: a Helix LT and an HX Stomp. Others in the family have not been tried. The Wi-Fi is **2.4 GHz only**: the setup page does not list
5 GHz networks. Other ESP32-P4 boards are untested.

You also need [Helrig](https://helrig.com) on your computer. Connecting to a pedal needs Helrig Connect or Helrig Pro.

## Flash it from your browser

1. Use desktop **Chrome** or **Edge** (Windows, macOS or Linux). Safari, Firefox and phones cannot do this.
2. Connect the board's **UART USB-C** port to your computer. The pedal does not need to be plugged in yet.
3. Open the web flasher: **https://box.helrig.com/flash**
4. Press **Connect and install** and choose **USB Single Serial** in the list (it may be named `usbmodem`, `ttyACM` or a COM port).
5. Wait about **2 minutes** and keep the tab open and the cable connected. The board restarts by itself.

Updating a box that is already set up keeps its Wi-Fi network. To start from scratch, tick **Start as a new box** before pressing the button.

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

- **The page cannot connect.** Unplug and replug the board. Or hold **BOOT**, tap **RESET**, release **BOOT**, and press the button again. Close any
  program that has the serial port open.
- **No port in the list.** Try another cable (it must carry data), and the board's **UART USB-C** port rather than the USB-A one.
- **"Permission denied" on Linux.** See the `dialout` step above.
- **The page says the browser cannot flash.** Use desktop Chrome or Edge.
- **The setup network does not appear.** Wait about 10 seconds after power-up. Phones can also keep an old list for a few minutes.
- **The box stopped halfway.** Run the page again. If the box still does not start, [build and flash it from source](dev/build.md).
- **Helrig does not find the pedal.** Replug the pedal's USB cable and try again. If a pedal stays stuck, pull its 9 V power for a moment, because a
  USB replug is sometimes not enough. Helrig never sends a USB reset.
- **Do not hold BOOT while the board powers up.** That starts the chip's download mode instead of the firmware.
