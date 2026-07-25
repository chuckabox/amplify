# Sample truck media

Web-optimised copies of the sample photos and video of two "HR" fleet trucks,
used by the AI vision-analysis demo on the audit result page.

- `truck-a.jpg`, `truck-a-tyre.jpg` — Truck A (Fuso rigid flatbed) + Bridgestone
  M711 11R22.5 tyre close-up. Used by the analyser.
- `truck-b.jpg`, `clip.mp4`, `clip-poster.jpg` — Truck B (Isuzu FRR) front shot +
  walk-around video (front plate XB·25JG). Used by the analyser.
- `IMG_2314.jpg … IMG_2335.jpg`, `IMG_2318.mp4 … IMG_2333.mp4` — the full set of
  sample photos/videos, so the whole team has them.

Notes
- Converted from the original iPhone HEIC/HEVC files. The large raw originals are
  git-ignored (see `.gitignore`); these copies are everything the app needs.
- Videos are auto-rotated correctly. A few of the extra `IMG_*.jpg` stills may
  sit sideways (HEIC orientation quirks) — the ones the app actually shows are
  upright.
- Paths are loaded through `src/lib/asset.ts` so they resolve under the site's
  basePath (`/amplify` in production, root in dev).
