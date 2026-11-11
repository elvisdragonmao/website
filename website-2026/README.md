# elvismao.com

The new English personal website, built with Astro, TypeScript and Three.js. This is an independent deployable project. The legacy website in `../website-old/` remains separate; its tools, newsletter page and other old routes have not been migrated into this site.

## Develop and build

Requirements: Node.js **22.23.4+** and Corepack. The project uses the same pinned **pnpm 12.18.0** release and integrity hash as the legacy website.

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm run dev
```

The development server defaults to `http://127.0.0.1:4326/`. `/cover-lab/` is available only in development for tuning the shared character camera, gaze, Blink and ASCII settings. `/loading-lab/` previews three text-mode loading treatments.

```sh
corepack pnpm run check
corepack pnpm run build
corepack pnpm run preview --port 4327
```

Deploy **`dist/`** to a static host. The character assets must first be restored from the local backup (see below). Normal builds use those local public assets; they do not run Blender, regenerate models, or require files from the Desktop. The current build contains the homepage, About, Work, four project pages, Colophon and 404. Development tools and historical images are excluded. For a host connected to the parent repository, set its project root to `website-2026`, build command to `corepack pnpm run build`, and output directory to `dist`.

## Format and Cloudflare deployment

The Prettier settings and Astro/import/package.json plugins match the parent website. `pnpm-workspace.yaml` keeps this project independent from the legacy package and retains its `esbuild` / `sharp` build permissions.

```sh
corepack pnpm run format
corepack pnpm run format:check
corepack pnpm run deploy:check
```

`deploy:check` builds the site and performs a Wrangler dry run. It does not publish. For a deliberate deployment with Cloudflare authentication configured:

```sh
corepack pnpm run deploy
```

`wrangler.jsonc` carries over the parent Worker name `elvismao`, compatibility date, `./dist` static asset directory, forced trailing slashes and custom404 handling. Builds and deploys always run from this project directory.

The repository workflow `.github/workflows/website-2026.yml` installs through Corepack, checks formatting, builds, and validates the Cloudflare deployment bundle. It does not automatically publish on push. The archived site's pre-commit hook is stored in `../website-old/.husky/`; the 2026 project uses the commands and CI checks above.

## Structure

```text
src/
  assets/projects/<slug>/   project cover images, bundled with hashed URLs
  components/              navigation, project gallery, footer and signup form
  data/                    projects, ASCII headings and public character URLs
  dev/                     development-only cover and loading labs
  layouts/                 page shell and metadata
  pages/                   actual public routes
  scripts/scene/           character, camera, fields and story rendering
  scripts/                 gallery and page navigation behavior
  styles/                  shared and feature styles
public/
  images/dragon.webp       current character fallback
  models/dragon.glb        current compressed runtime character
assets/character/          editable Blender/master GLB, credits and validation
scripts/                   optional character export and compression
docs/
  experience.md            current English copy and motion direction
  history/                 six historical character screenshots
```

Project cards and case studies share `src/data/projects.ts`; each project's image lives under its own slug in `src/assets/projects`. Homepage ASCII banners are in `src/data/ascii-headings.json`. Character URLs are defined once in `src/data/character.ts`.

## Local-only working files

`docs/`, `assets/character/`, `public/models/`, and 3D model formats are intentionally ignored by Git while the rebuild is being developed. A clone contains the code and fallback poster, but not the interactive character. Restore the corresponding folders from the Desktop backup before expecting the full character in development or a deployment. No model is regenerated automatically. Never force-add those assets or the working documents.

## Character workflow

The approved editable model is `assets/character/source.blend`; all five image maps are packed into it. The original appearance, Blink and calibrated head/eye controls are retained. See [character source and credits](assets/character/README.md).

```sh
# Recompress the uncompressed GLB without Blender:
corepack pnpm run character:prepare

# After editing the Blender master, export and prepare the web model:
corepack pnpm run character:export
```

Only the second command needs Blender. Set `BLENDER_BIN` if its executable is not at the standard macOS location or on PATH. Source models and reports stay outside `public/` and never ship with the website.

Production uses the committed cover preset. Development query parameters, browser-saved tuning, custom test events and renderer inspection globals are not exposed in the production build. Tune in `/cover-lab/`, then update `src/scripts/scene/cover-settings.ts` to publish an approved preset.

## Scope and integrations

- English content is the current public version. A Chinese navigation entry can be added when the new Chinese routes exist; there is no dead placeholder.
- Legacy `/code/`, `/hmmm/` and other old pages are not included in this build.
- Work inquiries can go directly to [LinYao Studio](https://linyao.tw/).
- The inline newsletter retains the existing Google Forms native POST and field mappings. The service owns confirmation; this site does not claim receipt.
- Canonical and Open Graph URLs use `site` in `astro.config.mjs`.
- Reduced-motion, no-JavaScript and static fallback content remain readable.

## Credits and history

Current model, typography, icons and creative-code credits are available at `/colophon/`; redistribution credit is also beside the public model. The five character-development stages are documented in [the small history gallery](docs/history/README.md). Research downloads, reference images, superseded models and old QA captures are no longer part of the project.
