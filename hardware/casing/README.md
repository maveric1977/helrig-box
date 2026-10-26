# Helrig Box casing

3D-printable case for the Helrig Box: a Waveshare ESP32-P4-NANO that plugs into a Line 6 Helix/HX pedal over USB and relays it over Wi-Fi.

The case is a lid and a bottom. The lid has a closed top with one window for the Ethernet jack, and openings in the front wall for the USB ports. It carries the Helrig branding: the symbol is debossed 0.6 mm into the top, and the wordmark is debossed 0.6 mm into the left and right walls. The bottom is the original, unchanged part.

Uses M2×7 screws.

There are two variants. They are the same shape; they differ in how the branding is coloured.

| | [Single colour](single-colour/) | [Multi colour](multi-colour/) |
|---|---|---|
| Printer | any FDM printer (made for Bambu Lab A1 mini) | multi-material printer (made for Bambu Lab A1 with AMS lite) |
| Branding | recessed, painted by hand | recessed, filled by printed inlays in brand colours |
| Files | 2 STLs: lid and bottom | 7 STLs: lid, bottom and 5 inlays |
| Lid orientation | top face up, with supports | top face down on the bed, no supports |
| Effort | one filament, a pen and a few minutes | prime tower, longer print, more waste |
| Tested | not printed yet | not printed yet |

**Not sure which?** Use the single-colour variant. It works on any printer, and the recess holds the paint.

## Previews

| Single colour (white lid, black bottom) | Multi colour (dark lid, brand-colour inlays) |
|---|---|
| ![Single-colour lid](single-colour/previews/lid-angled-right.png) | ![Multi-colour lid](multi-colour/previews/lid-angled-right.png) |
| ![Single-colour lid, left wall](single-colour/previews/lid-angled-left.png) | ![Multi-colour lid, left wall](multi-colour/previews/lid-angled-left.png) |

The bottom is the same in both:

![Bottom](single-colour/previews/bottom-angled.png)

## Structure

```
casing/
├── README.md              this file
├── ATTRIBUTION.md         credit, licence and list of changes
├── single-colour/
│   ├── README.md
│   ├── stl/               helrig-box_lid.stl, helrig-box_bottom.stl
│   └── previews/
└── multi-colour/
    ├── README.md
    ├── stl/               helrig-box_lid.stl, helrig-box_bottom.stl, helrig-box_inlay-*.stl
    └── previews/
```

## Hardware

- M2×7 screws.

## Dimensions

- Lid: 55 × 55 × 14.2 mm. Bottom: 55 × 55 × 5.6 mm.
- Recess depth 0.6 mm, in a 2.0 mm lid plate and 2.0 mm side walls, so 1.4 mm of material stays under the branding.
- Wordmark: 32 × 6.6 mm on each side wall. Symbol: 18 × 18 mm on the top.
- Thinnest recess features: wordmark strokes 1.24 mm, symbol gaps 1.05 mm, letter gaps about 0.8 mm.

## Licence and attribution

The case is based on the [Waveshare ESP32-P4-NANO case and board model](https://www.printables.com/model/1497431-waveshare-esp32-p4-nano-case-and-board-model) by MartinFaustMayer (@MartinFaustMa_212591) on Printables, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). This adaptation is shared under the same licence. See [ATTRIBUTION.md](ATTRIBUTION.md) for the credit and the list of changes, and keep it with the STL files if you share them.
