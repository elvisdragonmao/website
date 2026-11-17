import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { compatibilityRedirects } from "./scripts/routing.mjs";

/** @type {import("astro").AstroIntegration} */
const devRoutes = {
	name: "em-development-routes",
	hooks: {
		"astro:config:setup": ({ command, injectRoute }) => {
			if (command === "dev") {
				injectRoute({ pattern: "/api/newsletter", entrypoint: new URL("./src/dev/pages/newsletter.ts", import.meta.url) });
				injectRoute({
					pattern: "/cover-lab",
					entrypoint: new URL("./src/dev/pages/cover-lab.astro", import.meta.url)
				});
				injectRoute({ pattern: "/loading-lab", entrypoint: new URL("./src/dev/pages/loading-lab.astro", import.meta.url) });
			}
		}
	}
};

export default defineConfig({
	site: "https://elvismao.com",
	trailingSlash: "always",
	output: "static",
	i18n: { locales: ["en", "zh-Hant", "zh-Hans"], defaultLocale: "en", routing: { prefixDefaultLocale: false } },
	server: { port: 4326 },
	redirects: compatibilityRedirects,
	integrations: [devRoutes, sitemap({ filter: page => !new URL(page).pathname.endsWith("/404/"), i18n: { defaultLocale: "en", locales: { en: "en", "zh-Hant": "zh-Hant", "zh-Hans": "zh-Hans" } } })]
});
