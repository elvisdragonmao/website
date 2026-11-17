# About media

These five local images supply the About page's portrait, photograph and layered ASCII artwork. Their authors, original sources and licenses are recorded in `src/data/credits.ts` and remain shared by every language.

| File            | Dimensions  | Display use                                      |
| --------------- | ----------- | ------------------------------------------------ |
| `profile.webp`  | 814 × 1200  | Portrait illustration, ASCII conversion and halo |
| `furry.webp`    | 1400 × 1050 | Photograph with the existing CRT treatment       |
| `kendrick.webp` | 600 × 838   | Background music portrait layer                  |
| `porter.webp`   | 500 × 333   | Foreground music portrait layer                  |
| `trump.webp`    | 499 × 434   | Debate ASCII artwork                             |

The current derivatives use WebP quality **65**, alpha quality **85**, and encoder effort **6**. Together they occupy 268,312 bytes, reduced from 569,504 bytes. Keep transparent cutouts transparent.

For replacements, start from the supplied source rather than repeatedly re-encoding these derivatives. Preserve aspect ratio and never upscale. The absolute upper bound is **3840 × 2160** (a 1920 × 1080 display at 2×); use the actual largest rendered artwork size at 2× when that is smaller. Include the compositor's zoom when measuring the portrait. The furry photograph retains more width because the layout expands its card across tablet screens.

`ImageArt.astro` imports the assets so Astro fingerprints their URLs and uses their actual dimensions. The portrait loads eagerly with high priority. Other media loads lazily with low priority, and `about-media.ts` prepares static glyphs shortly before their panels enter view. Repaints are cached until size or display pixel ratio changes; page-navigation cleanup disconnects the observers. Original images remain visible until glyph rendering succeeds and provide the no-JavaScript fallback.
