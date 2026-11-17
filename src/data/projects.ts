import type { ImageMetadata } from "astro";
import emfontCover from "../assets/projects/emfont/cover.webp";
import emtechCover from "../assets/projects/emtech/cover.webp";
import omniobserveCover from "../assets/projects/omniobserve/cover.webp";
import omniobserveThumbnail from "../assets/projects/omniobserve/thumbnail.webp";
import sitconCover from "../assets/projects/sitcon-2026/cover.webp";
import type { Locale } from "../i18n";
import { emfontContent } from "./project-content/emfont";
import { emtechContent } from "./project-content/emtech";
import { omniobserveContent } from "./project-content/omniobserve";
import { sitconContent } from "./project-content/sitcon-2026";
import { projectSlugs, type LocalizedProjectCopy, type ProjectCopy, type ProjectSlug } from "./project-types";
export { projectSlugs, type ProjectSection, type ProjectSlug } from "./project-types";

export interface Project extends ProjectCopy {
	slug: ProjectSlug;
	name: string;
	image: string;
	imageWidth: number;
	imageHeight: number;
	imageFormat: string;
	external: string;
	video?: string;
	imageSource?: string;
	thumbnail?: ImageMetadata;
}
interface ProjectDefinition {
	name: string;
	cover: ImageMetadata;
	external: string;
	content: LocalizedProjectCopy;
	video?: string;
	imageSource?: string;
	thumbnail?: ImageMetadata;
}
const definitions = {
	emfont: { name: "emfont", cover: emfontCover, external: "https://font.emtech.cc/", content: emfontContent },
	emtech: { name: "emtech", cover: emtechCover, external: "https://emtech.cc/", content: emtechContent },
	"sitcon-2026": { name: "SITCON 2026", cover: sitconCover, external: "https://sitcon.org/2026/", content: sitconContent },
	omniobserve: {
		name: "OmniObserve",
		cover: omniobserveCover,
		external: "https://skyhong.tw/omniobserve/",
		content: omniobserveContent,
		video: "https://www.youtube-nocookie.com/embed/l1eS5ZlEzFM?rel=0",
		imageSource: "https://skyhong.tw/omniobserve/",
		thumbnail: omniobserveThumbnail
	}
} satisfies Record<ProjectSlug, ProjectDefinition>;

/** Stable identities, URLs and media are shared; each case owns its typed editorial copy. */
export function getProjects(locale: Locale): Project[] {
	return projectSlugs.map(slug => {
		const { name, cover, content, external, ...media }: ProjectDefinition = definitions[slug];
		return { slug, name, image: cover.src, imageWidth: cover.width, imageHeight: cover.height, imageFormat: cover.format, external, ...media, ...content[locale] };
	});
}
