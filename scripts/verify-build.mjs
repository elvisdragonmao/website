import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { compatibilityRedirects, mainPaths, toolPaths } from "./routing.mjs";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const catalog = JSON.parse(readFileSync(new URL("../src/data/work-projects.json", import.meta.url), "utf8"));
const origin = "https://elvismao.com";
const htmlAt = path => readFileSync(join(dist, path === "/" ? "index.html" : `${path.replace(/^\//, "")}index.html`), "utf8");
let documents = 0;
for (const locale of ["en", "zh-Hant", "zh-Hans"]) {
	const prefix = locale === "en" ? "" : `/${locale}`;
	for (const path of mainPaths) {
		const html = htmlAt(prefix + path);
		assert.ok(html.includes(`<html lang="${locale}">`), `${prefix}${path}: lang`);
		assert.ok(html.includes(`<link rel="canonical" href="${origin}${prefix}${path}"`), `${prefix}${path}: canonical`);
		for (const lang of ["en", "zh-Hant", "zh-Hans", "x-default"]) {
			const target = lang === "en" || lang === "x-default" ? path : `/${lang}${path}`;
			assert.ok(html.includes(`hreflang="${lang}" href="${origin}${target}"`), `${prefix}${path}: alternate ${lang}`);
		}
		if (path === "/work/") {
			assert.equal([...html.matchAll(/data-work-id=/g)].length, catalog.length, `${locale}: complete catalog`);
			assert.equal([...html.matchAll(/class="work-card-media"/g)].length, catalog.length, `${locale}: image placeholders`);
		}
		documents++;
	}
}
for (const locale of ["en", "zh-Hant", "zh-Hans"]) {
	const file = locale === "en" ? "404.html" : `${locale}/404.html`;
	const html = readFileSync(join(dist, file), "utf8");
	assert.ok(html.includes(`<html lang="${locale}">`), `${file}: localized error page`);
	assert.ok(html.includes('name="robots" content="noindex"'), `${file}: exclude error pages from indexing`);
}
for (const path of toolPaths) {
	const html = htmlAt(path);
	assert.ok(html.includes("<html") || html.includes('http-equiv="refresh"'), `${path}: HTML document`);
	assert.ok(!/hreflang=/.test(html), `${path}: no invented translations`);
	documents++;
}
for (const [source, { destination }] of Object.entries(compatibilityRedirects)) {
	const html = htmlAt(source + "/");
	assert.ok(html.includes(`url=${destination}"`), `${source}: compatibility target`);
}
function scan(directory) {
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) {
			scan(path);
			continue;
		}
		if (!entry.name.endsWith(".html")) continue;
		const html = readFileSync(path, "utf8");
		if (/http-equiv="refresh"/.test(html)) continue;
		for (const [, value] of html.matchAll(/(?:href|src)=["']([^"']+)/g)) {
			if (!value.startsWith("/") || value.startsWith("//")) continue;
			const target = join(dist, decodeURIComponent(new URL(value, origin).pathname));
			assert.ok((existsSync(target) && statSync(target).isFile()) || existsSync(join(target, "index.html")), `${path}: missing ${value}`);
		}
	}
}
scan(dist);
const sitemap = readFileSync(join(dist, "sitemap-0.xml"), "utf8");
assert.ok(!/<loc>[^<]*\/(?:en|zh)\//.test(sitemap), "Sitemap excludes redirected locale aliases");
assert.ok(!/<loc>[^<]*\/404(?:\/|\.html)</.test(sitemap), "Sitemap excludes error pages");
assert.ok(!JSON.stringify(catalog).includes("website-old/"), "Catalog source links use the final repository structure");
assert.equal(catalog.find(project => project.projectUrl?.includes("furryteaparty.com"))?.codeUrl, "", "Private project source stays unpublished");
console.log(`Verified ${documents} translated/tool documents, ${Object.keys(compatibilityRedirects).length} compatibility redirects, catalog coverage, sitemap, and local links/assets.`);
