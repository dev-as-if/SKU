# Clone QA

## Current capture

- Source: `https://www.skuindia.ac.in/`
- Pages discovered: 116 public routes
- Pages successfully captured: 113 page files plus the patched homepage
- Local assets captured: 301 files, approximately 24 MB, merged into `mirror-full/static`
- Images: 122
- Documents: 44 PDFs
- Videos: 0
- Missing local asset paths reported by checker: 8 unavailable source files

## Skipped or external

- `/admin/*` and login/logout routes are skipped because they are authenticated or operational surfaces.
- YouTube video playback remains a third-party dependency.
- Google-hosted fonts remain an external dependency where referenced by source CSS.
- The crawler is intentionally conservative around responses over 20 MB.

## Checks performed

- Live homepage response and title inspected.
- Homepage rendered in Chromium and screenshot captured.
- Local asset/link checker run with zero missing local asset paths.
- Representative CSS, logo, homepage, and inner-page endpoints returned successfully.

## Remaining work

The full public sitemap and inner-page capture are complete for 113 saved routes. Eight source files remain unavailable because the origin returned 404, 403, or timed out during download; they are listed in `clone-manifest.json`. A full responsive screenshot matrix and pixel-difference pass remain future QA work.