/** Public identity facts and optional social-image types, shared by document shells. */
export const siteIdentity = {
	name: "Elvis Mao",
	personName: "Elvis Dragon Mao",
	alternateNames: ["Elvis Mao", "EM", "毛哥EM"],
	email: "info@elvismao.com",
	profiles: ["https://github.com/elvisdragonmao", "https://www.instagram.com/elvisdragonmao/", "https://t.me/elvisdragonmao"]
} as const;

export interface SocialImage {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	type?: string;
}
