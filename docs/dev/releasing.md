# Releasing the firmware and the web flasher

The web flasher (`web/`) is a static site at **https://flash.helrig.com**, deployed by Vercel. It writes firmware parts that are built on a maintainer's
machine and published with a GitHub release; the Vercel build downloads the latest release's `helrig-box-web-firmware.zip` into `web/firmware`
(`web/fetch-firmware.sh`), so the page can fetch the parts from its own origin. Release downloads cannot be fetched from another origin by a page.
[None of this has been run yet: the Vercel project, the hook and the first release do not exist.]

## One-time setup

1. **Vercel project:** import `maveric1977/helrig-box`, set **Root Directory** to `web`, leave the framework as "Other". `web/vercel.json` sets the build
   command (`sh fetch-firmware.sh`) and the output directory. Add the domain `flash.helrig.com`.
2. **Deploy hook:** in the project settings (Git → Deploy Hooks) create a hook for the `main` branch, and save its URL as the repository secret
   `VERCEL_DEPLOY_HOOK_URL` (Settings → Secrets and variables → Actions). `.github/workflows/deploy-web.yml` calls it when a release is published.
3. The first deploy fails until a release exists with the zip attached; that is expected.

## Each release

1. Commit everything, so the version is not marked `-dirty`, and tag it: `git tag v0.1.0`.
2. `scripts/build.sh --release` (see [build.md](build.md)), then `scripts/package-web.sh --release`. This writes `web/firmware/`.
3. Try it locally: `cd web && python3 -m http.server 8765 --bind 127.0.0.1`, open `http://127.0.0.1:8765` in Chrome or Edge, and flash a board.
4. Zip and publish:

```bash
(cd web/firmware && zip -j ../../helrig-box-web-firmware.zip manifest.json app.bin bootloader.bin partition-table.bin)
git push origin v0.1.0
gh release create v0.1.0 helrig-box-web-firmware.zip --title "v0.1.0" --notes "..."
```

Publishing the release runs the workflow, which calls the deploy hook; Vercel rebuilds and fetches the new zip. Pushes to `main` also redeploy, using the
latest release's firmware.

The page writes the bootloader (0x2000), the partition table (0x8000) and the app (0x10000) only, so an update keeps the saved Wi-Fi network.
"Start as a new box" also writes empty data over the settings area (0x9000, 0x6000 bytes).
