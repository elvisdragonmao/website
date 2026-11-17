/** Public identity facts and sharing defaults, shared by all document shells. */
export const siteIdentity = {
	name: "Elvis Mao",
	personName: "Elvis Dragon Mao",
	alternateNames: ["Elvis Mao", "EM", "毛哥 EM"],
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

export const defaultSocialImage = {
	src: "/images/og/home.png",
	width: 1200,
	height: 630,
	type: "image/png"
} as const;
