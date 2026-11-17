# Repository Guidelines

## Commit And PR Guidance

Use Linux kernel/Git-style commit subjects with a concrete area, subsystem, component, directory, package, or file prefix:

```
area: imperative patch summary
sub/sys: imperative patch summary
```

The prefix should name the repository area primarily changed. Prefer specific prefixes such as a directory, package, file, subsystem, or component name.

Do not use generic Conventional Commit prefixes such as `fix:`, `feat:`, `chore:`, `docs:`, or `refactor:` unless they are actual repository areas in this repository. The prefix should describe where the change belongs, not what type of change it is.

Use an imperative verb in the summary after the colon, such as `fix`, `clarify`, `split`, `validate`, `rename`, `remove`, `add`, `update`, `document`, etc. Do not use past tense verbs like `fixed` or `added`.

When a patch spans multiple areas, choose the narrowest common area if one exists. If no clear common area exists, use the primary behavior changed rather than listing multiple unrelated prefixes.

The summary after the colon should briefly describe what the patch does, because it becomes the first line shown in the git changelog. Keep it short, imperative, and specific. Prefer subjects under 72 characters. Use lowercase for the first word after the colon unless it is a proper noun, and do not end the subject with a period.

Examples:

```
storybook: clarify build ownership
web/routes: split route-level chunks
ui/field: fix select menu positioning
server/auth: validate session cookie
githooks.txt: improve the intro section
```

Use a commit body when the reason for the change is not obvious from the diff. Explain why the change is needed, not just what changed.

PRs should describe the changed area, summarize the user-visible or developer-visible impact, list validation commands run, link related issues, and include screenshots for visible web UI changes.

If no validation was run, state that explicitly and explain why. Do not claim to have run commands that were not actually executed.

For UI changes that are not easily captured in a screenshot, describe the visual change and any manual checks performed.

## Project Cover Images

Use real project screenshots for the Work catalog. Prefer the project's working website; use screenshots from its README when requested or when they better represent the actual project. Do not use a GitHub repository page, file listing, or source-code view as a cover. If no suitable screenshot is available, leave the project's `image` as `null`.

Keep the confirmed project-specific sources:

- Capture EM3 and emjudge in dark mode.
- Use the README covers or screenshots for embate, TNL Article Downloader, Linyao Design System, Sparduino, and `Where Is oloo?`.
- Use `assets/icon.webp` from `elvisdragonmao/clipcc-extension-AWP` for AWP for ClipCC; frame the full artwork without cropping its logo or text.

Prepare every cover as follows:

1. Aim for a 2:1 composition. Crop or frame the screenshot without stretching its contents.
2. Resize proportionally to a maximum width of **500 px** and a maximum height of **250 px**. Do not upscale smaller images.
3. Encode as **WebP with quality 80**.
4. Save to `public/images/work/<project-id>.webp`, using the stable project ID from `src/data/work-projects.json`.
5. Set the shared catalog's `image.src` to `/images/work/<project-id>.webp` and record the file's actual `width` and `height`. All locales use this shared image metadata.
6. Verify the final file's format and dimensions, then inspect its framing and legibility in the project card.

Every card must retain its **2:1 dark-gray media rectangle**, including cards with `image: null` or a failed image request, so the grid stays aligned. Use an empty `alt` for these decorative covers and do not show alt text, broken-image icons, or other missing-image text inside the placeholder. Keep the existing failed-image handling that hides the image while preserving its media container.
