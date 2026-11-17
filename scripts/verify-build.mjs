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
let seoDocuments = 0;
function meta(html, key, attribute = "name") {
	const tag = html.match(/<meta\b[^>]*>/g)?.find(value => value.includes(` ${attribute}="${key}"`));
	return tag?.match(/\bcontent="([^"]*)"/)?.[1];
}
function assertSeo(html, path, locale) {
	const canonical = origin + path;
	assert.equal([...html.matchAll(/<title>/g)].length, 1, `${path}: one document title`);
	assert.ok(meta(html, "description")?.trim(), `${path}: description`);
	assert.equal(meta(html, "og:url", "property"), canonical, `${path}: sharing canonical`);
	const image = meta(html, "og:image", "property");
	assert.equal(meta(html, "twitter:card"), image ? "summary_large_image" : "summary", `${path}: sharing card`);
	assert.equal(meta(html, "twitter:image"), image, `${path}: consistent social image`);
	if (image) {
		assert.ok(image.startsWith("https://"), `${path}: absolute social image`);
		assert.ok(meta(html, "og:image:alt", "property"), `${path}: social image description`);
		const imageUrl = new URL(image);
		if (imageUrl.origin === origin) assert.ok(existsSync(join(dist, decodeURIComponent(imageUrl.pathname))), `${path}: sharing image file`);
	}
	if (["/", "/zh-Hant/", "/zh-Hans/"].includes(path)) assert.equal(image, undefined, `${path}: no homepage social image`);
	const scripts = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
	assert.equal(scripts.length, 1, `${path}: one structured-data graph`);
	const data = JSON.parse(scripts[0][1]);
	assert.equal(data["@context"], "https://schema.org", `${path}: schema context`);
	assert.ok(Array.isArray(data["@graph"]), `${path}: schema graph`);
	const graph = data["@graph"];
	const typeHas = (node, type) => [node["@type"]].flat().includes(type);
	const person = graph.find(node => typeHas(node, "Person"));
	const website = graph.find(node => typeHas(node, "WebSite"));
	const page = graph.find(node => node.url === canonical && node.isPartOf);
	assert.equal(person?.["@id"], `${origin}/#person`, `${path}: stable personal identity`);
	assert.equal(person?.name, "Elvis Dragon Mao", `${path}: public person name`);
	assert.equal(website?.["@id"], `${origin}/#website`, `${path}: stable site identity`);
	assert.equal(page?.inLanguage, locale, `${path}: schema matches document language`);
	assert.equal(page?.isPartOf["@id"], website["@id"], `${path}: page belongs to site`);
	const definitionIds = new Set();
	const referenceIds = [];
	function inspect(value) {
		if (!value || typeof value !== "object") return;
		if (value["@id"]) {
			if (Object.keys(value).length > 1) definitionIds.add(value["@id"]);
			else referenceIds.push(value["@id"]);
		}
		Object.values(value).forEach(child => (Array.isArray(child) ? child.forEach(inspect) : inspect(child)));
	}
	inspect(data);
	for (const id of referenceIds) assert.ok(definitionIds.has(id), `${path}: structured-data reference ${id}`);
	const cleanPath = path.replace(/^\/(zh-Hant|zh-Hans)(?=\/)/, "");
	if (cleanPath === "/about/") {
		assert.ok(typeHas(page, "AboutPage") && typeHas(page, "ProfilePage"), `${path}: person profile`);
		assert.equal(page.mainEntity["@id"], person["@id"], `${path}: profile subject`);
	}
	if (cleanPath === "/work/") {
		const list = graph.find(node => typeHas(node, "ItemList"));
		const renderedIds = [...html.matchAll(/data-work-id="([^"]+)"/g)].map(match => match[1]);
		assert.equal(list?.numberOfItems, catalog.length, `${path}: complete schema catalog`);
		assert.deepEqual(
			list?.itemListElement.map(entry => entry.item["@id"].split("#")[1]),
			renderedIds,
			`${path}: schema follows visible project order`
		);
		assert.deepEqual(
			list?.itemListElement.map(entry => entry.position),
			renderedIds.map((_, index) => index + 1),
			`${path}: ordered project list`
		);
	}
	if (/^\/work\/[^/]+\/$/.test(cleanPath))
		assert.ok(
			graph.some(node => typeHas(node, "CreativeWork") && node.mainEntityOfPage?.["@id"] === page["@id"]),
			`${path}: case study entity`
		);
	const breadcrumbs = graph.find(node => typeHas(node, "BreadcrumbList"));
	if (path !== "/" && path !== "/zh-Hant/" && path !== "/zh-Hans/") assert.equal(breadcrumbs?.itemListElement.at(-1)?.item, canonical, `${path}: current breadcrumb`);
	seoDocuments++;
}
for (const locale of ["en", "zh-Hant", "zh-Hans"]) {
	const prefix = locale === "en" ? "" : `/${locale}`;
	for (const path of mainPaths) {
		const html = htmlAt(prefix + path);
		assertSeo(html, prefix + path, locale);
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
	assert.ok(!html.includes('type="application/ld+json"'), `${file}: no rich-result markup on error pages`);
}
for (const path of toolPaths) {
	const html = htmlAt(path);
	assert.ok(html.includes("<html") || html.includes('http-equiv="refresh"'), `${path}: HTML document`);
	assert.ok(!/hreflang=/.test(html), `${path}: no invented translations`);
	if (!html.includes('http-equiv="refresh"')) {
		const locale = html.match(/<html lang="([^"]+)"/)?.[1];
		assert.ok(locale, `${path}: actual document language`);
		assertSeo(html, path, locale);
	}
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
console.log(
	`Verified ${documents} translated/tool documents, ${Object.keys(compatibilityRedirects).length} compatibility redirects, catalog coverage, ${seoDocuments} complete SEO graphs, sitemap, and local links/assets.`
);
