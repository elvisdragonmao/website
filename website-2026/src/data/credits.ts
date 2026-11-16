interface Credit {
	name: string;
	href?: string;
	detail?: string;
	license?: { name: string; href: string };
}

export const creditSections: { title: string; entries: Credit[] }[] = [
	{ title: "Design / Develop by", entries: [{ name: "Elvis Dragon Mao" }] },
	{
		title: "Libraries",
		entries: [
			{ name: "Astro", href: "https://astro.build/", detail: "MIT" },
			{ name: "Three.js", href: "https://threejs.org/", detail: "MIT" },
			{ name: "Lenis", href: "https://lenis.darkroom.engineering/", detail: "MIT" }
		]
	},
	{
		title: "Typeface",
		entries: [
			{ name: "IBM Plex Mono", href: "https://github.com/IBM/plex", detail: "IBM · SIL Open Font License 1.1" },
			{ name: "Fontsource", href: "https://fontsource.org/fonts/ibm-plex-mono" }
		]
	},
	{
		title: "Icons & Logos",
		entries: [
			{ name: "Phosphor Icons", href: "https://phosphoricons.com/", detail: "MIT" },
			{ name: "Simple Icons", href: "https://github.com/simple-icons/simple-icons", detail: "Technology logos, adapted into ASCII · CC0 1.0" }
		]
	},
	{
		title: "Character Model",
		entries: [
			{
				name: "novabeast — joshuasteinhoff6",
				href: "https://sketchfab.com/3d-models/novabeast-64f297c10547454ea4b83860146af56d",
				detail: "Adapted for the web, with gaze controls and blinking.",
				license: { name: "CC BY 4.0", href: "https://creativecommons.org/licenses/by/4.0/" }
			}
		]
	},
	{
		title: "Photography & Artwork",
		entries: [
			{ name: "諾比", detail: "Profile illustration" },
			{ name: "Daisuke Chen", detail: "Furry · 2025 UTFG · CC BY-NC" },
			{
				name: "Kendrick Lamar — Raph_PH",
				href: "https://commons.wikimedia.org/wiki/File:KendrickSZASPurs230725-144_(cropped)_desaturated.jpg",
				detail: "Cut-out and monochrome ASCII adaptation.",
				license: { name: "CC BY 4.0", href: "https://creativecommons.org/licenses/by/4.0/" }
			},
			{ name: "Porter Robinson", href: "https://www.independent.co.uk/arts-entertainment/music/features/porter-robinson-interview-smile-avicii-b2535174.html", detail: "Supplied / The Independent" },
			{ name: "Donald Trump", detail: "Photo by Doug Mills / The New York Times via AP, Pool" }
		]
	},
	{ title: "Map Data", entries: [{ name: "Natural Earth", href: "https://www.naturalearthdata.com/", detail: "Public domain · simplified for the ASCII globe" }] },
	{
		title: "Visual Inspiration",
		entries: [
			{ name: "ASCII Play — Andreas Gysin", href: "https://play.ertdfgcvb.xyz/" },
			{ name: "Heo", href: "https://blog.zhheo.com/" },
			{ name: "btop", href: "https://github.com/aristocratos/btop" },
			{ name: "htop", href: "https://htop.dev/" },
			{ name: "Lusion", href: "https://lusion.co/" }
		]
	},
	{
		title: "Tools",
		entries: [
			{ name: "Blender", href: "https://www.blender.org/" },
			{ name: "glTF Transform", href: "https://gltf-transform.dev/" },
			{ name: "meshoptimizer", href: "https://github.com/zeux/meshoptimizer" },
			{ name: "TypeScript", href: "https://www.typescriptlang.org/" },
			{ name: "Prettier", href: "https://prettier.io/" },
			{ name: "pnpm", href: "https://pnpm.io/" },
			{ name: "Cloudflare Wrangler", href: "https://developers.cloudflare.com/workers/wrangler/" }
		]
	}
];
