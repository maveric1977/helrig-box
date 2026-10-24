# Releasing the firmware and the web flasher

The web flasher (`web/`) writes firmware parts that are built on a maintainer's machine and published with a GitHub release; the Pages
workflow (`.github/workflows/pages.yml`) copies them next to the page. [The workflow has not been run yet.]

1. Commit everything, so the version is not marked `-dirty`, and tag it: `git tag v0.1.0`.
2. `scripts/build.sh --release` (see [build.md](build.md)), then `scripts/package-web.sh --release`. This writes `web/firmware/`.
3. Try it locally: `cd web && python3 -m http.server 8765 --bind 127.0.0.1`, open `http://127.0.0.1:8765` in Chrome or Edge, and flash a board.
4. Zip and publish:

```bash
(cd web/firmware && zip -j ../../helrig-box-web-firmware.zip manifest.json app.bin bootloader.bin partition-table.bin)
git push origin v0.1.0
gh release create v0.1.0 helrig-box-web-firmware.zip --title "v0.1.0" --notes "..."
```

Publishing the release runs the workflow, which publishes the site. In the repository settings, Pages must be set to deploy from **GitHub Actions**.

The page writes the bootloader (0x2000), the partition table (0x8000) and the app (0x10000) only, so an update keeps the saved Wi-Fi network.
"Start as a new box" also writes empty data over the settings area (0x9000, 0x6000 bytes).
