import { selectedResearchAuthors } from "../data/about";
import { getAboutData } from "../data/about-localized";
import { getProjects } from "../data/projects";
import { siteIdentity } from "../data/seo";
import { stackIcons } from "../data/stack";
import { workSections, type WorkProject } from "../data/work";
import { defaultLocale, localeLabels, locales, localizePath, t, type Locale } from "../i18n";
import { aboutText } from "../i18n/about";
import { homeCopy } from "../i18n/home";
import { newsletterCopy } from "../i18n/newsletter";
import { workCopy } from "../i18n/work";

interface DocumentContext {
	site: URL;
	locale: Locale;
}

const heading = (text: string, depth: number) => `${"#".repeat(depth)} ${text}`;
const blocks = (...parts: string[]) => parts.join("\n\n");
const list = (items: string[]) => items.map(item => `- ${item}`).join("\n");
const quote = (text: string) =>
	text
		.split("\n")
		.map(line => `> ${line}`)
		.join("\n");
const link = (label: string, href: string) => `[${label.replace(/[\\[\]]/g, "\\$&")}](${href.replace(/\(/g, "%28").replace(/\)/g, "%29")})`;
const email = link(siteIdentity.email, `mailto:${siteIdentity.email}`);

function siteLinks({ site, locale }: DocumentContext) {
	return (label: string, path: string, lang = locale) => link(label, new URL(localizePath(path, lang), site).href);
}

function projectHighlights(context: DocumentContext) {
	const page = siteLinks(context);
	return list(getProjects(context.locale).map(project => `${page(project.name, `/work/${project.slug}/`)} — ${project.card.summary} ${project.card.metric}`));
}

function homepage(context: DocumentContext, depth: number) {
	const copy = homeCopy[context.locale];
	const page = siteLinks(context);
	return blocks(
		heading(copy.hello, depth),
		list([copy.developer, copy.designer, copy.researcher, copy.dragon]),
		copy.fire,
		copy.alive,
		[copy.exploring, copy.exploringSupport].join("\n"),
		page(copy.researchLink, "/about/#research"),
		heading(copy.workHeading, depth + 1),
		copy.workIntro.join("\n"),
		projectHighlights(context),
		page(copy.workLink, "/work.md"),
		copy.why,
		copy.wild,
		heading(copy.cta, depth + 1),
		email
	);
}

function biography(context: DocumentContext) {
	const { locale } = context;
	const text = (key: Parameters<typeof aboutText>[1]) => aboutText(locale, key);
	const page = siteLinks(context);
	const { experiences, talks, awards, otherRecognition } = getAboutData(locale);
	const section = (key: Parameters<typeof aboutText>[1], ...body: string[]) => blocks(heading(text(key), 3), ...body);
	const resume = "https://resume.elvismao.com/";

	return blocks(
		text("alias"),
		text("roles"),
		list([link(text("resume"), resume), link("/now", "https://emtech.cc/p/now/")]),
		section("touchTitle", text("touchDescription"), page(text("researchLink"), "/about/#research")),
		section("furryTitle", text("furryBefore") + link(text("furryLink"), "https://emtech.cc/p/furry-intro/") + text("furryAfter")),
		section("stackTitle", text("stackDescription"), stackIcons.map(icon => icon.label).join(" · "), page(text("workLink"), "/work.md")),
		section(
			"sourceTitle",
			text("sourceBefore") + "**emfont**" + text("sourceAfter"),
			text("sourceMetric"),
			list([link("emfont", "https://font.emtech.cc/"), link(text("github"), "https://github.com/elvisdragonmao/emfont")])
		),
		section("musicTitle", text("musicDescription"), link("Last.fm", "https://www.last.fm/user/elvisdragonmao")),
		section("hardwareTitle", text("hardwareDescription")),
		section("motto", quote([text("mottoFirst"), text("mottoSecond"), text("mottoThird")].join("\n"))),
		section("cameraTitle", text("cameraDescription")),
		section("debateTitle", text("debateDescription")),
		section("broadcastTitle", text("broadcastDescription")),
		quote([text("statementFirst"), text("statementSecond"), text("statementThird")].join("\n")),
		section("experience", list(experiences.map(item => [item.years, item.role, item.organization].filter(Boolean).join(" — "))), link(text("fullCV"), resume)),
		section(
			"research",
			text("interests"),
			heading(page(text("paper"), "/work/omniobserve/"), 4),
			selectedResearchAuthors.join(""),
			text("poster"),
			heading(text("currentResearch"), 4),
			list([text("policeResearch"), text("fursuitResearch")])
		),
		section("talks", list(talks.map(talk => `${talk.year} — ${talk.title} — ${talk.context}`))),
		section(
			"awards",
			...awards.map(group =>
				blocks(heading(group.year, 4), list(group.items.map(item => [item.title, [item.context, "project" in item ? item.project : ""].filter(Boolean).join(" ")].filter(Boolean).join(" — "))))
			),
			heading(text("otherAwards"), 4),
			list(otherRecognition)
		),
		section("contactTitle", text("verse"), text("contact"), email)
	);
}

function portfolio(context: DocumentContext) {
	const { locale, site } = context;
	const copy = workCopy(locale);
	const caseStudies = { en: "Case studies", "zh-Hant": "作品詳介", "zh-Hans": "作品详介" }[locale];
	const { featured, categories } = workSections(locale);
	const entry = (project: WorkProject) => {
		const links = [project.projectUrl && link(copy.view, new URL(project.projectUrl, site).href), project.codeUrl && link(copy.code, new URL(project.codeUrl, site).href)].filter(Boolean);
		return [`**${project.title}** — ${project.description}`, ...links].join(" · ");
	};

	return blocks(
		heading(copy.heading, 1),
		copy.intro.join("\n"),
		heading(copy.featured, 2),
		list(featured.map(entry)),
		...categories.map(({ id, projects }) => blocks(heading(copy.categories[id], 2), list(projects.map(entry)))),
		heading(caseStudies, 2),
		projectHighlights(context)
	);
}

export const markdownDocuments = {
	index: (context: DocumentContext) => blocks(homepage(context, 1), siteLinks(context)(homeCopy[context.locale].about, "/about.md")),
	about: (context: DocumentContext) =>
		blocks(heading(siteIdentity.personName, 1), heading(homeCopy[context.locale].introduction, 2), homepage(context, 3), heading(homeCopy[context.locale].about, 2), biography(context)),
	work: portfolio
};

export function llmsIndex(context: DocumentContext): string {
	const { locale } = context;
	const page = siteLinks(context);
	return blocks(
		heading(`${siteIdentity.personName} (EM)`, 1),
		quote(aboutText(locale, "seoDescription")),
		t(locale, "site.description"),
		heading(t(locale, "nav.about"), 2),
		list([`${page(homeCopy[locale].about, "/about.md")}: ${aboutText(locale, "touchDescription")}`]),
		heading(t(locale, "nav.work"), 2),
		list([`${page(workCopy(locale).heading, "/work.md")}: ${workCopy(locale).description}`]),
		heading(t(locale, "nav.language"), 2),
		list(locales.filter(other => other !== locale).map(other => page(localeLabels[other], "/llms.txt", other))),
		heading("Optional", 2),
		list([
			page(homeCopy[locale].introduction, "/index.md"),
			page(t(locale, "nav.home"), "/"),
			link(t(locale, "nav.blog"), "https://emtech.cc/"),
			page(newsletterCopy[locale].heading, "/hmmm/"),
			page(t(locale, "footer.credits"), "/colophon/")
		])
	);
}

export function textDocument(body: string, locale: Locale): Response {
	return new Response(body + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8", "Content-Language": locale } });
}

export const textDocumentLocales = locales.map(locale => ({
	params: { locale: locale === defaultLocale ? undefined : locale },
	props: { locale }
}));
