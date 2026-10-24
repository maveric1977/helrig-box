# The setup page

## Look

Helrig's colours (ground `#0a0a0a`, text `#f2efe9`, and signal yellow `#FFD23F`, the Helrig Box colour, for actions and focus), the system font,
and the Helrig Box logo as inline vector paths. The page makes no network request, so it looks the same on the box's own network and on a home
network, and the logo links to https://helrig.com. See `brand/helrig_setup_brand.md`.


## Handing a box over

`scripts/flash.sh -p <port> --fresh` flashes the firmware and clears the saved settings, so the box starts as a blank Helrig Box.
