import type { Locale } from "../../i18n";
import type { ProjectCopy } from "../project-types";

export const sitconContent = {
	en: {
		type: "INTERACTIVE CONFERENCE WEBSITE",
		headline: "Embrace the Chaos of Our Times.",
		introduction: "East Asia’s largest student tech community and conference. I served as development lead and led the website’s design, which was featured on Awwwards.",
		imageAlt: "SITCON 2026's Jam the Chaos website with orbiting geometric objects",
		card: {
			type: "Creative direction & interactive web",
			summary: "East Asia’s largest student tech community and conference. I served as development lead and led the website’s design, which was featured on Awwwards.",
			metric: "Awwwards Nominee"
		},
		role: "Website design & development lead",
		status: "Conference held March 28, 2026",
		externalLabel: "Visit SITCON 2026",
		metric: "Awwwards",
		metricLabel: "Nominee",
		credits: "Created with the SITCON 2026 design and development teams."
	},
	"zh-Hant": {
		type: "互動研討會網站",
		headline: "享受這個混亂的時代。",
		introduction: "全東亞最大學生社群、科技年會。擔任開發組長並主導設計，網站入選 Awwwards。",
		imageAlt: "SITCON 2026 Jam the Chaos 網站與環繞運行的幾何物件",
		card: {
			type: "視覺設計與互動網頁",
			summary: "全東亞最大學生社群、科技年會。擔任開發組長並主導設計，網站入選 Awwwards。",
			metric: "Awwwards 提名"
		},
		role: "網站設計與開發組長",
		status: "活動於 2026 年 3 月 28 日舉行",
		externalLabel: "前往 SITCON 2026",
		metric: "Awwwards",
		metricLabel: "提名作品",
		credits: "與 SITCON 2026 設計組及網站開發團隊共同製作。"
	},
	"zh-Hans": {
		type: "互动技术大会网站",
		headline: "享受这个混乱的时代。",
		introduction: "全东亚最大学生社群、科技年会。担任开发组长并主导设计，网站入选 Awwwards。",
		imageAlt: "SITCON 2026 Jam the Chaos 网站与环绕运行的几何物体",
		card: {
			type: "视觉设计与互动网页",
			summary: "全东亚最大学生社群、科技年会。担任开发组长并主导设计，网站入选 Awwwards。",
			metric: "Awwwards 提名"
		},
		role: "网站设计与开发负责人",
		status: "活动于 2026 年 3 月 28 日举行",
		externalLabel: "访问 SITCON 2026",
		metric: "Awwwards",
		metricLabel: "提名作品",
		credits: "与 SITCON 2026 设计组及网站开发团队共同制作。"
	}
} satisfies Record<Locale, ProjectCopy>;
