import { getRelativeLocaleUrl } from "astro:i18n";
import { ui, type UIKey } from "./ui";

export const locales = ["en", "zh-Hant", "zh-Hans"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const localeLabels: Record<Locale, string> = { en: "English", "zh-Hant": "繁體中文", "zh-Hans": "简体中文" };

const translatedPaths = new Set(["/", "/about/", "/work/", "/colophon/", "/hmmm/", "/work/emfont/", "/work/emtech/", "/work/sitcon-2026/", "/work/omniobserve/"]);

export function isLocale(value: string): value is Locale {
	return (locales as readonly string[]).includes(value);
}

/** Only a complete first path segment is a locale, never a prefix such as /english/. */
export function getLocale(pathname: string): Locale {
	const segment = pathname.split(/[?#]/, 1)[0]!.split("/")[1] ?? "";
	return isLocale(segment) ? segment : defaultLocale;
}

export function stripLocalePath(pathname: string): string {
	const match = pathname.match(/^\/(en|zh-Hant|zh-Hans)(?=\/|$)/);
	const path = match ? pathname.slice(match[0].length) : pathname;
	return path || "/";
}

/** Localize site page paths while keeping query/hash data and external destinations intact. */
export function localizePath(path: string, locale: Locale): string {
	if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#|\?)/i.test(path)) return path;
	const match = path.match(/^([^?#]*)([?#].*)?$/)!;
	const pathname = stripLocalePath("/" + match[1]!.replace(/^\/+/, ""));
	const url = getRelativeLocaleUrl(locale, pathname.replace(/^\//, ""), { normalizeLocale: false });
	const normalized = /\.[^/]+$/.test(pathname) ? url : url.replace(/\/?$/, "/");
	return normalized + (match[2] ?? "");
}

/** Alternate links must describe pages actually generated in all three languages. */
export function availableLocalesForPath(pathname: string): readonly Locale[] {
	const path = stripLocalePath(pathname.split(/[?#]/, 1)[0]!);
	const normalized = path === "/" ? path : path.replace(/\/?$/, "/");
	return translatedPaths.has(normalized) ? locales : [defaultLocale];
}

export function t(locale: Locale, key: UIKey, params: Record<string, string | number> = {}): string {
	const value: string = ui[locale][key];
	return value.replace(/\{(\w+)\}/g, (_, name: string) => {
		if (!(name in params)) throw new Error(`Missing i18n parameter "${name}" for "${key}"`);
		return String(params[name]);
	});
}
