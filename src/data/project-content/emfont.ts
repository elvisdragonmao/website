import type { Locale } from "../../i18n";
import type { ProjectCopy } from "../project-types";

export const emfontContent = {
	en: {
		type: "Open-source webfont service",
		headline: "Words carry emotion. File size shouldn’t hold them back.",
		introduction: "A free, open-source CJK webfont service. Serving millions of requests every day.",
		imageAlt: "The emfont catalog with Chinese typeface previews and font filters",
		card: {
			type: "Open-source webfont service",
			summary: "A free, open-source CJK webfont service. Serving millions of requests every day.",
			metric: "Around 1M requests per day"
		},
		role: "Creator & maintainer",
		status: "Live service",
		metric: "1M+",
		metricLabel: "Font-service requests per day"
	},
	"zh-Hant": {
		type: "開源網頁字型服務",
		headline: "文字是情感的載體，不該被檔案大小限制",
		introduction: "免費開源的 CJK webfont 服務，每日百萬次請求。",
		imageAlt: "emfont 字型目錄中的中文字型預覽與篩選功能",
		card: {
			type: "開源網頁字型服務",
			summary: "免費開源的 CJK webfont 服務，每日百萬次請求。",
			metric: "每日約百萬次請求"
		},
		role: "發起人與維護者",
		status: "持續營運中",
		metric: "100 萬+",
		metricLabel: "每日字型服務請求"
	},
	"zh-Hans": {
		type: "开源网页字体服务",
		headline: "文字是情感的载体，不该被文件大小限制",
		introduction: "免费开源的 CJK webfont 服务，一行 CSS 就能让网站用上 90 多款开源字体，每日百万次请求。",
		imageAlt: "emfont 字体目录中的中文字体预览与筛选功能",
		card: {
			type: "开源网页字体服务",
			summary: "免费开源的 CJK webfont 服务，一行 CSS 就能让网站用上 90 多款开源字体，每日百万次请求。",
			metric: "每日约百万次请求"
		},
		role: "发起人与维护者",
		status: "持续运营中",
		metric: "100 万+",
		metricLabel: "每日字体服务请求"
	}
} satisfies Record<Locale, ProjectCopy>;
