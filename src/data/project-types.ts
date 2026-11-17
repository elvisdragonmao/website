import type { Locale } from "../i18n";

export const projectSlugs = ["emfont", "emtech", "sitcon-2026", "omniobserve"] as const;
export type ProjectSlug = (typeof projectSlugs)[number];
export interface ProjectSection {
	label: string;
	title: string;
	paragraphs: string[];
}
/** Editorial content, separate from shared identity, assets and URLs. */
export interface ProjectCopy {
	type: string;
	headline: string;
	introduction: string;
	imageAlt: string;
	card: { type: string; summary: string; metric: string };
	role: string;
	status: string;
	sections: ProjectSection[];
	name?: string;
	externalLabel?: string;
	metric?: string;
	metricLabel?: string;
	credits?: string;
}
export type LocalizedProjectCopy = Record<Locale, ProjectCopy>;
