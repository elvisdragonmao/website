import type { Locale } from "../../i18n";
import type { ProjectCopy } from "../project-types";

export const emtechContent = {
	en: {
		type: "TECHNICAL WRITING & WEB ENGINEERING",
		headline: "Helping Lost Developers Through Late Nights Since Middle School.",
		introduction: "A tech blog I’ve been writing since eighth grade, now with over 400,000 characters of content. Sharing technology, design, ideas, and bits of everyday life.",
		imageAlt: "The emtech homepage with its article archive, course navigation and illustrated cover",
		card: {
			type: "Writing & publishing systems",
			summary: "A tech blog I’ve been writing since eighth grade, now with over 400,000 characters of content. Sharing technology, design, ideas, and bits of everyday life.",
			metric: "400K+ Chinese characters"
		},
		role: "Author, designer & full-stack developer",
		status: "Independent publication",
		externalLabel: "Read emtech",
		metric: "400K+",
		metricLabel: "Chinese characters of original writing"
	},
	"zh-Hant": {
		name: "毛哥EM資訊密技",
		type: "技術寫作與網頁工程",
		headline: "從國二開始，陪伴每位無助工程師的夜晚",
		introduction: "從國二寫到現在的技術部落格，累積超過 40 萬字。分享科技、設計、想法與生活。",
		imageAlt: "毛哥EM資訊密技首頁，呈現文章、課程導覽與封面插畫",
		card: {
			type: "技術寫作與內容平台",
			summary: "從國二寫到現在的技術部落格，累積超過 40 萬字。分享科技、設計、想法與生活。",
			metric: "逾 40 萬字原創內容"
		},
		role: "作者、設計與全端開發",
		status: "持續更新與營運中",
		externalLabel: "閱讀毛哥EM資訊密技",
		metric: "40 萬+",
		metricLabel: "原創中文文字"
	},
	"zh-Hans": {
		name: "毛哥EM资讯密技",
		type: "技术写作与网页工程",
		headline: "从国二开始，陪伴每位无助工程师的夜晚",
		introduction: "从国二写到现在的技术博客，累积超过 40 万字。分享科技、设计、想法与生活。",
		imageAlt: "毛哥EM资讯密技首页，呈现文章、课程导航与封面插画",
		card: {
			type: "技术写作与内容平台",
			summary: "从国二写到现在的技术博客，累积超过 40 万字。分享科技、设计、想法与生活。",
			metric: "超过 40 万字原创内容"
		},
		role: "作者、设计与全栈开发",
		status: "持续更新与运营中",
		externalLabel: "阅读毛哥EM资讯密技",
		metric: "40 万+",
		metricLabel: "原创中文文字"
	}
} satisfies Record<Locale, ProjectCopy>;
