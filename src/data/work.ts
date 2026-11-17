import type { Locale } from "../i18n";
import { projectText } from "../i18n/work";
import catalog from "./work-projects.json";

export const workCategories = ["events", "websites", "tools", "experiments"] as const;
export type WorkCategory = (typeof workCategories)[number];
export interface WorkProject {
	id: string;
	title: string;
	description: string;
	category: WorkCategory;
	featured: boolean;
	projectUrl: string;
	codeUrl: string;
	image: { src: string; width: number; height: number } | null;
}

export const workProjects: WorkProject[] = catalog.map(project => {
	const category = project.category.toLowerCase();
	if (!workCategories.includes(category as WorkCategory)) throw new Error(`Unknown project category: ${project.category}`);
	return { ...project, category: category as WorkCategory };
});

export function localizedWorkProjects(locale: Locale): WorkProject[] {
	return workProjects.map(project => ({ ...project, ...projectText(project.id, locale) }));
}
