# elvismao.com

Elvis Mao / 毛哥EM's personal website, built with Astro, TypeScript and Three.js. The portfolio, newsletter and historical web tools live in one application at the repository root.

## Development

Use Node.js **22.23.4+** and Corepack. The package manager is pinned to **pnpm 12.18.0** with an integrity hash.

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm run dev
```

Open `http://127.0.0.1:4326/`. `/cover-lab/` and `/loading-lab/` are development-only pages for the character camera, gaze, ASCII rendering and loading animation. They are excluded from production.

```sh
corepack pnpm run check
corepack pnpm run format:check
corepack pnpm run build
corepack pnpm run preview --port 4327
```

`build` checks TypeScript, generates static HTML, prepares localized error pages and verifies the output. The final check covers translated routes, locale metadata, project coverage, image placeholders, compatibility redirects, sitemap entries and local links/assets. Run it independently with `corepack pnpm run verify:build` after building.

## Languages and content

Astro owns language routing. English is the default and has no prefix:

| English         | Traditional Chinese     | Simplified Chinese      |
| --------------- | ----------------------- | ----------------------- |
| `/`             | `/zh-Hant/`             | `/zh-Hans/`             |
| `/about/`       | `/zh-Hant/about/`       | `/zh-Hans/about/`       |
| `/work/`        | `/zh-Hant/work/`        | `/zh-Hans/work/`        |
| `/work/emfont/` | `/zh-Hant/work/emfont/` | `/zh-Hans/work/emfont/` |
| `/colophon/`    | `/zh-Hant/colophon/`    | `/zh-Hans/colophon/`    |
| `/hmmm/`        | `/zh-Hant/hmmm/`        | `/zh-Hans/hmmm/`        |

All four case studies share their slugs across languages. Page routes pass a locale into shared views; templates are not duplicated. The URL determines the language, and the switcher preserves the current page, query and fragment.

- `src/i18n/index.ts`: locale types, Astro URL helpers and typed UI lookup.
- `src/i18n/ui.ts`: complete dictionaries for navigation, footer and common controls.
- `src/i18n/{home,about,work,projects,credits,newsletter}.ts`: page content and descriptions.
- `src/data/work-projects.json`: reviewed project IDs, order, featured status, images and links. Chinese project copy is keyed by the same IDs in `src/i18n/work.ts`; the build rejects missing or extra translations.
- `src/data/about.ts` and `about-localized.ts`: shared experience/talk/award IDs with localized copy.
- `src/data/projects.ts`: four case studies, shared assets and `getProjects(locale)`.

Required UI and page dictionaries use TypeScript completeness checks rather than silent English fallbacks. Interactive scripts receive only their page's translated messages through attributes. They initialize again after Astro ClientRouter navigation and dispose page resources before a swap.

The existing `/code/*` tools retain their canonical URLs and original languages. They do not generate duplicate translated versions or misleading `hreflang` links. `/code/` now opens the project catalog. Old `/en/*`, `/zh/*` and locale-prefixed tool URLs redirect to their canonical equivalents. `scripts/routing.mjs` derives tool compatibility entries from source routes; `public/_redirects` handles wildcard aliases on Cloudflare.

## Project structure

```text
src/
  assets/        bundled case study images and required legacy tool assets
  components/    shared UI, About components and legacy tool shell
  data/          shared structured content and asset references
  dev/           development-only visual labs and newsletter endpoint
  i18n/          typed UI and page dictionaries
  layouts/       metadata, language and document shell
  pages/         English routes, localized wrappers and historical tools
  scripts/       browser interactions and Three.js scene
  server/        shared newsletter submission handler
  worker.ts      production API router and static asset fallback
  styles/        shared and page styles
  views/         common page implementations
public/
  images/        portfolio thumbnails and character fallback poster
  models/        local runtime character assets, excluded from Git
scripts/         routing, output verification and character preparation
```

Portfolio images are WebP quality 80, with a maximum width of 500 and height of 250 pixels. Cards without a cover retain the same dark media rectangle. Homepage ASCII banners live in `src/data/ascii-headings.json`.

## Deployment

```sh
corepack pnpm run deploy:check
corepack pnpm run deploy
```

`deploy:check` builds and validates the Cloudflare bundle without publishing. `deploy` publishes after a successful build and requires Cloudflare authentication. The Worker configuration is `wrangler.jsonc`; the static output is `dist/`. Configure a connected host's project root as the repository root, its build command as `corepack pnpm run build`, and its output directory as `dist`.

`.github/workflows/website.yml` installs frozen dependencies, checks formatting, runs the isolated newsletter tests, builds and runs a Wrangler dry run. It does not publish automatically. Cloudflare serves the nearest localized `404.html` with HTTP 404 for missing pages.

## Local character assets

`docs/`, `assets/character/`, `public/models/` and 3D model formats are intentionally excluded from Git and backed up separately. A fresh clone includes the static character poster. Restore the local runtime model before expecting the full interactive character in development or deployment. Builds do not regenerate models or require Desktop files.

The editable `source.blend` and original GLB stay in the Desktop backup, with all image maps packed. The default commands below expect a restored local `assets/character/` folder; external-path options let masters stay outside the checkout. Only the small ignored runtime derivative needs to be copied into `public/models/` for a local interactive cover.

```sh
# Recompress an existing uncompressed GLB:
corepack pnpm run character:prepare

# Export an edited Blender master and prepare the runtime model:
corepack pnpm run character:export
```

The preparation command also accepts `--input`, `--output` and `--report` paths, so masters and optimized derivatives can stay in a Desktop backup. Export accepts `--source`, `--output`, `--runtime-output` and `--report`.

```sh
corepack pnpm run character:prepare -- --input /path/to/source.glb --output /path/to/dragon.glb
```

The runtime pipeline protects the face/chest, eye topology, all active Blink vertices, UVs, skin weights, hierarchy and calibration. It reduces the approved 48,314-triangle source to 31,094 triangles, resizes the body map to at most 2048² and other maps to at most 1024², encodes WebP quality 78 with full alpha precision, then applies Meshopt. It validates the final binary before replacing the derivative and leaves the editable masters untouched. Lower-body geometry is retained because it can enter the responsive camera flight. Geometry QA found no new non-manifold, winding or skin-weight issues; the original model's intentional mirrored UVs, eye-highlight islands and small degenerate/zero-length geometry remain documented in the Desktop reports.

Only export requires Blender. Set `BLENDER_BIN` if the executable is outside its standard macOS location or PATH. Production uses the committed cover preset; browser-saved tuning and development renderer controls are not exposed in the production build.

## Performance and SEO maintenance

About photos use quality-65 WebP at no more than twice their measured display dimensions (and never above the 3840 × 2160 bounding limit for 1080p displays). The portrait is prioritized; below-fold media and ASCII canvases load and paint near the viewport. Their preparation details are in `src/assets/about/README.md`.

`src/data/translated-paths.json` is the shared route registry. `src/lib/work-box.ts` owns both glyph-frame variants. Route transition rendering lives in `src/scripts/navigation/pixel-wipe.ts`, while `page-experience.ts` handles mounting and cleanup.

`src/components/SEO.astro` supplies canonical URLs, real locale alternates, robots, Open Graph, Twitter cards and JSON-LD to both page shells. Public identity and sharing defaults live in `src/data/seo.ts`; `src/lib/seo.ts` builds Person, WebSite, page, breadcrumb and project graphs. Work's ItemList follows the visible card order. Error pages are noindex and contain no rich-result graph. Build verification checks the actual metadata, image files and graph references.

The homepage intentionally has no social-preview image. Project pages can share their actual project cover; other pages retain text metadata without a generic image fallback.

`public/_headers` gives fingerprinted `/_astro/` files immutable caching and prevents alternate `workers.dev` hosts from being indexed. Stable public image URLs keep the hosting platform's normal revalidation behavior.

## Integrations and credits

Newsletter forms post to the same-origin `/api/newsletter/` endpoint. Its shared handler forwards the existing Google Forms fields and reports success only after reading an explicit confirmation in the response HTML. Empty or malformed fields are highlighted only after submission; network and upstream errors keep the form available for retry. Cloudflare runs the Worker first only for `/api/*`; other routes remain static assets. The same handler is exposed by a dev-only Astro route for `pnpm dev`. Work inquiries link to [LinYao Studio](https://linyao.tw/).

Some historical tools require their external service, an API key, or physical device capabilities. The weekly bulletin publisher's archived PDF URLs may be unavailable; the tool retains date selection and generated links. iPhone pressure measurements require actual 3D Touch hardware.

Current character, typography, icons and creative-code credits are available at `/colophon/`. The original site's implementation remains accessible in Git history. Code is distributed under the [Apache 2.0 license](LICENSE); third-party assets retain their respective terms.
