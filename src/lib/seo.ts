import { siteIdentity, type SocialImage } from "../data/seo";
import type { Locale } from "../i18n";

export interface SeoProject {
	slug: string;
	name: string;
	introduction: string;
	image: string;
	imageAlt: string;
	external?: string;
}
export interface SeoCollectionItem {
	id: string;
	title: string;
	description: string;
	projectUrl: string;
	codeUrl: string;
	image: { src: string; width: number; height: number } | null;
}
interface StructuredDataOptions {
	site: URL;
	pathname: string;
	canonical: string;
	locale: Locale;
	title: string;
	description: string;
	image?: SocialImage;
	profileImage: string;
	project?: SeoProject;
	collection?: SeoCollectionItem[];
}

export const ogLocales: Record<Locale, string> = { en: "en_US", "zh-Hant": "zh_TW", "zh-Hans": "zh_CN" };
export const seoLabels = {
	en: {
		home: "Elvis Mao",
		about: "About",
		work: "Projects",
		credits: "Credits",
		newsletter: "The Hmmm Newsletter"
	},
	"zh-Hant": { home: "Elvis Mao", about: "關於我", work: "作品", credits: "致謝", newsletter: "Hmmm 電子報" },
	"zh-Hans": { home: "Elvis Mao", about: "关于我", work: "作品", credits: "致谢", newsletter: "Hmmm 电子报" }
} satisfies Record<Locale, Record<string, string>>;

export function canonicalUrl(pathname: string, site: URL): string {
	const url = new URL(pathname, site);
	url.search = "";
	url.hash = "";
	return url.href;
}

/** Escape HTML-sensitive characters so JSON-LD can never close its script element. */
export function serializeStructuredData(value: unknown): string {
	return JSON.stringify(value)
		.replace(/</g, "\\u003c")
		.replace(/>/g, "\\u003e")
		.replace(/&/g, "\\u0026")
		.replace(/\u2028/g, "\\u2028")
		.replace(/\u2029/g, "\\u2029");
}

export function structuredData(options: StructuredDataOptions): Record<string, unknown> {
	const { site, pathname, canonical, locale, title, description, image, profileImage, project, collection } = options;
	const absolute = (path: string) => new URL(path, site).href;
	const root = new URL("/", site).href;
	const localePath = (path: string) => (locale === "en" ? path : `/${locale}${path}`);
	const personId = `${root}#person`;
	const siteId = `${root}#website`;
	const pageId = `${canonical}#webpage`;
	const imageId = `${canonical}#primaryimage`;
	const labels = seoLabels[locale];
	const graph: Record<string, unknown>[] = [
		{
			"@type": "Person",
			"@id": personId,
			name: siteIdentity.personName,
			alternateName: [...siteIdentity.alternateNames],
			url: root,
			image: absolute(profileImage),
			email: siteIdentity.email,
			sameAs: [...siteIdentity.profiles],
			jobTitle: ["Developer", "Designer", "Human–computer interaction researcher"],
			knowsAbout: ["Web development", "Human–computer interaction", "Interactive systems", "Creative computing", "Public Forum debate"]
		},
		{
			"@type": "WebSite",
			"@id": siteId,
			url: root,
			name: siteIdentity.name,
			alternateName: ["毛哥EM", "Elvis Dragon Mao", "elvismao.com"],
			inLanguage: ["en", "zh-Hant", "zh-Hans"],
			publisher: { "@id": personId }
		}
	];
	const page: Record<string, unknown> = {
		"@type": pathname === "/about/" ? ["AboutPage", "ProfilePage"] : pathname === "/work/" ? "CollectionPage" : "WebPage",
		"@id": pageId,
		url: canonical,
		name: title,
		description,
		inLanguage: locale,
		isPartOf: { "@id": siteId },
		author: { "@id": personId }
	};
	if (image) {
		graph.push({
			"@type": "ImageObject",
			"@id": imageId,
			url: absolute(image.src),
			contentUrl: absolute(image.src),
			caption: image.alt,
			...(image.width && image.height ? { width: image.width, height: image.height } : {})
		});
		page.primaryImageOfPage = { "@id": imageId };
	}

	if (pathname === "/" || pathname === "/about/") page.mainEntity = { "@id": personId };
	if (project) {
		const workId = `${root}#project-${project.slug}`;
		page.mainEntity = { "@id": workId };
		graph.push({
			"@type": "CreativeWork",
			"@id": workId,
			name: project.name,
			description: project.introduction,
			url: project.external ? absolute(project.external) : canonical,
			image: absolute(project.image),
			inLanguage: locale,
			mainEntityOfPage: { "@id": pageId },
			...(["emfont", "emtech"].includes(project.slug) ? { creator: { "@id": personId } } : { contributor: { "@id": personId } })
		});
	}
	if (collection) {
		const listId = `${canonical}#projects`;
		page.mainEntity = { "@id": listId };
		graph.push({
			"@type": "ItemList",
			"@id": listId,
			name: labels.work,
			numberOfItems: collection.length,
			itemListElement: collection.map((item, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "CreativeWork",
					"@id": `${root}#${item.id}`,
					name: item.title,
					description: item.description,
					...(item.projectUrl || item.codeUrl ? { url: absolute(item.projectUrl || item.codeUrl) } : {}),
					...(item.image ? { image: absolute(item.image.src) } : {})
				}
			}))
		});
	}
	if (pathname !== "/") {
		const breadcrumbId = `${canonical}#breadcrumbs`;
		const currentName =
			project?.name ?? (pathname === "/about/" ? labels.about : pathname === "/work/" ? labels.work : pathname === "/colophon/" ? labels.credits : pathname === "/hmmm/" ? labels.newsletter : title);
		const crumbs = [{ name: labels.home, item: absolute(localePath("/")) }, ...(project ? [{ name: labels.work, item: absolute(localePath("/work/")) }] : []), { name: currentName, item: canonical }];
		page.breadcrumb = { "@id": breadcrumbId };
		graph.push({
			"@type": "BreadcrumbList",
			"@id": breadcrumbId,
			itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, ...crumb }))
		});
	}
	graph.push(page);
	return { "@context": "https://schema.org", "@graph": graph };
}
