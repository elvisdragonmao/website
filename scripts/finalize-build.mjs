import { copyFileSync } from "node:fs";

// Cloudflare serves the nearest 404.html with HTTP 404 for unknown nested paths.
for (const locale of ["zh-Hant", "zh-Hans"]) {
	copyFileSync(new URL(`../dist/${locale}/404/index.html`, import.meta.url), new URL(`../dist/${locale}/404.html`, import.meta.url));
}
