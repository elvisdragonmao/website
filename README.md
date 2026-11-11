# elvismao.com

The personal website of Elvis Mao / EM. The 2026 rebuild is being developed separately from the original site.

| Directory                          | Purpose                                                                   |
| ---------------------------------- | ------------------------------------------------------------------------- |
| [`website-2026/`](./website-2026/) | Astro / TypeScript / Three.js rebuild, with an interactive ASCII homepage |
| [`website-old/`](./website-old/)   | Archived original website and tools; not migrated into the rebuild        |

## Work on the rebuild

Use the pinned Corepack pnpm version from inside the project:

```sh
cd website-2026
corepack pnpm install --frozen-lockfile
corepack pnpm run dev
```

Development runs at `http://127.0.0.1:4326/`. Development-only routes include `/cover-lab/` and `/loading-lab/`.

```sh
corepack pnpm run format:check
corepack pnpm run build
corepack pnpm run deploy:check
```

The workflow validates changes without automatically publishing them. See the [project README](./website-2026/README.md) for deployment and character setup.

## Local working assets

Models, editable character sources, and `docs/` are intentionally excluded from Git while they are being organised. They are kept locally and backed up separately on the Desktop. Restore the character assets before running the complete interactive homepage; a fresh clone includes its static fallback.

The original site's award history and implementation notes remain in its [archived README](./website-old/README.md).
