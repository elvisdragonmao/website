// @ts-check
import sitemap from "@astrojs/sitemap";
import { filterSitemapByDefaultLocale, i18n } from "astro-i18n-aut/integration";
import { defineConfig } from "astro/config";

const defaultLocale = "en";
const locales = {
	en: "en-US", // the `defaultLocale` value must present in `locales` keys
	"zh-Hant": "zh-Hant",
	"zh-Hans": "zh-Hans"
};

export default defineConfig({
	site: "https://elvismao.com",
	trailingSlash: "always",
	build: {
		format: "directory"
	},
	redirects: {
		"/zh": {
			status: 301,
			destination: "/zh-Hant/"
		}
	},
	integrations: [
		i18n({
			locales,
			defaultLocale,
			redirectDefaultLocale: true
		}),
		sitemap({
			i18n: {
				locales,
				defaultLocale
			},
			filter: filterSitemapByDefaultLocale({ defaultLocale })
		})
	]
});
