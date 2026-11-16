import { readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// Read the actual routes so compatibility redirects cannot drift from migrated tools.
const pages = fileURLToPath(new URL("../src/pages/code/", import.meta.url));
export const toolPaths = readdirSync(pages, { recursive: true, withFileTypes: true })
	.filter(entry => entry.isFile() && /\.(astro|html)$/.test(entry.name))
	.map(entry => {
		const path = relative(pages, join(entry.parentPath, entry.name)).replaceAll("\\", "/");
		return `/code/${path.replace(/\.(astro|html)$/, "").replace(/(^|\/)index$/, "")}`.replace(/\/?$/, "/");
	})
	.sort();
export const mainPaths = ["/", "/about/", "/work/", "/colophon/", "/hmmm/", "/work/emfont/", "/work/emtech/", "/work/sitcon-2026/", "/work/omniobserve/"];
export const compatibilityRedirects = Object.fromEntries(
	[
		["/code", "/work/"],
		["/en/code", "/work/"],
		["/code/sign.html", "/code/sign/"],
		["/zh", "/zh-Hant/"],
		...[...mainPaths, ...toolPaths].map(path => [`/en${path === "/" ? "" : path.replace(/\/$/, "")}`, path]),
		...mainPaths.map(path => [`/zh${path === "/" ? "" : path.replace(/\/$/, "")}`, `/zh-Hant${path}`]),
		...["zh", "zh-Hant", "zh-Hans"].flatMap(locale => [[`/${locale}/code`, "/work/"], ...toolPaths.map(path => [`/${locale}${path.replace(/\/$/, "")}`, path])])
	].map(([source, destination]) => [source, { status: 301, destination }])
);
