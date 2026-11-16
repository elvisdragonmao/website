import { getCreditsCopy } from "../i18n/credits";
import type { Locale } from "../i18n/index";

export interface Credit {
	name: string;
	href?: string;
	detail?: string;
	license?: { name: string; href: string };
}

interface CreditSection {
	id: keyof ReturnType<typeof getCreditsCopy>["sections"];
	title: string;
	entries: Credit[];
}
export const creditSections: CreditSection[] = [
	{ id: "design", title: "Design / Develop by", entries: [{ name: "Elvis Dragon Mao" }] },
	{
		id: "libraries",
		title: "Libraries",
		entries: [
			{ name: "Astro", href: "https://astro.build/", detail: "MIT" },
			{ name: "Three.js", href: "https://threejs.org/", detail: "MIT" },
			{ name: "Lenis", href: "https://lenis.darkroom.engineering/", detail: "MIT" }
		]
	},
	{
		id: "typeface",
		title: "Typeface",
		entries: [
			{ name: "IBM Plex Mono", href: "https://github.com/IBM/plex", detail: "IBM · SIL Open Font License 1.1" },
			{ name: "Fontsource", href: "https://fontsource.org/fonts/ibm-plex-mono" }
		]
	},
	{
		id: "icons",
		title: "Icons & Logos",
		entries: [
			{ name: "Phosphor Icons", href: "https://phosphoricons.com/", detail: "MIT" },
			{ name: "Simple Icons", href: "https://github.com/simple-icons/simple-icons", detail: "Technology logos, adapted into ASCII · CC0 1.0" }
		]
	},
	{
		id: "model",
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
		id: "artwork",
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
	{ id: "map", title: "Map Data", entries: [{ name: "Natural Earth", href: "https://www.naturalearthdata.com/", detail: "Public domain · simplified for the ASCII globe" }] },
	{
		id: "inspiration",
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
		id: "tools",
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

/** Keep attribution identities, license names and source URLs identical in every locale. */
export function getCreditSections(locale: Locale): CreditSection[] {
	const copy = getCreditsCopy(locale);
	const details: Record<string, string> = {
		"Simple Icons": copy.details.simpleIcons,
		"novabeast — joshuasteinhoff6": copy.details.novabeast,
		諾比: copy.details.profile,
		"Daisuke Chen": copy.details.furry,
		"Kendrick Lamar — Raph_PH": copy.details.kendrick,
		"Porter Robinson": copy.details.porter,
		"Donald Trump": copy.details.trump,
		"Natural Earth": copy.details.map
	};
	return creditSections.map(section => ({
		...section,
		title: copy.sections[section.id],
		entries: section.entries.map(entry => ({ ...entry, detail: details[entry.name] ?? entry.detail }))
	}));
}
