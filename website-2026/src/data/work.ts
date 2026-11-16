import catalog from "./work-projects.json";

export interface WorkProject {
	id: string;
	title: string;
	description: string;
	category: string;
	featured: boolean;
	projectUrl: string;
	codeUrl: string;
	image: { src: string; width: number; height: number } | null;
}

export const workProjects: WorkProject[] = catalog;
export const workCategories = ["Events", "Websites", "Tools", "Experiments"];
