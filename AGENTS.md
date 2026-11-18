# Repository Guidelines

## Commits and pull requests

- Use `area: imperative summary` with a specific file, directory, package, or component as the prefix. Use a lowercase verb, aim for under 72 characters, and omit the final period. Reserve generic prefixes like `fix` and `docs` for actual repository areas.
- Add a commit body when the reason for the change needs context.
- In PRs, summarize the impact, link related issues, and list the checks actually run. If none ran, explain why. For visible UI changes, include screenshots or describe the result and manual checks when screenshots cannot capture it.

## Images

- Prefer real screenshots from the live project. Use README screenshots when requested or when they better represent the project. Exclude repository pages, file lists, and source views. Leave `image: null` when no suitable cover exists.
- Frame Work covers at **2:1** without stretching or upscaling. Export **WebP quality 80**, at most **500 × 250 px**, to `public/images/work/<project-id>.webp`. Record the actual dimensions and public URL in `src/data/work-projects.json`. Verify the file and check its framing and legibility in the card.
- Keep the dark-gray **2:1** media area on every Work card. Use empty alt text for decorative covers and hide failed images without collapsing the placeholder.
- Capture EM3 and emjudge in dark mode. Use README covers for embate, TNL Article Downloader, Linyao Design System, Sparduino, and `Where Is oloo?`. For AWP for ClipCC, use `assets/icon.webp` from `elvisdragonmao/clipcc-extension-AWP` and keep the full logo and text visible.
- Use **WebP quality 65** for About photos. Preserve aspect ratio and transparency, avoid upscaling, and cap dimensions at **2×** rendered size and **3840 × 2160 px**. See [About media](src/assets/about/README.md) for details.

## Character assets

- Keep editable and runtime model binaries in the Desktop backup and outside Git. Preserve the ignore rules and the existing Git history for `EM.stl` and `303/ar`.
- Preserve the face, eyes, Blink, UVs, skin weights, and rig calibration when optimizing. Use **WebP quality 78** with full alpha precision and texture caps of **2048 px** for the body and **1024 px** for other maps.
- Deploy only after a successful build that verifies `/models/dragon.glb` against `src/data/character-asset.json`. For offline builds or recovery, set `CHARACTER_MODEL_SOURCE` to the approved model's absolute path. Update the manifest when replacing the approved model.

## Public pages

- Keep the homepage's Open Graph and Twitter metadata image-free. The homepage's character and static cover are display assets. Project detail pages may use their own covers.
- Preserve legacy tool URLs and their original languages. Advertise language alternates only for translations that exist.
