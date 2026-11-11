import { defineConfig } from "astro/config";

/** @type {import("astro").AstroIntegration} */
const coverLab = {
	name: "em-cover-lab",
	hooks: {
		"astro:config:setup": ({ command, injectRoute }) => {
			if (command === "dev") {
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
	server: { port: 4326 },
	integrations: [coverLab]
});
