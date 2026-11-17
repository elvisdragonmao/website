import type { Locale } from "../../i18n";
import type { ProjectCopy } from "../project-types";

/** Publishing history supplied by EM; current architecture: https://emtech.cc/p/emtech-2026/ */
export const emtechContent = {
	en: {
		type: "TECHNICAL WRITING & WEB ENGINEERING",
		headline: "Writing the guides.\nBuilding the platform.",
		introduction:
			"A Chinese-language technology publication with over 1.4 million characters of original writing, supported by a publishing platform I design, build and operate—from individual tutorials to structured courses and discussion.",
		imageAlt: "The emtech homepage with its article archive, course navigation and illustrated cover",
		card: {
			type: "Writing & publishing systems",
			summary: "Original Chinese tech tutorials on a platform I build for search, courses and discussion.",
			metric: "1.4M+ Chinese characters"
		},
		role: "Author, designer & full-stack developer",
		status: "Independent publication",
		externalLabel: "Read emtech",
		metric: "1.4M+",
		metricLabel: "Chinese characters of original writing",
		sections: [
			{
				label: "THE WRITING",
				title: "Useful Chinese guidance for tools people want to try.",
				paragraphs: [
					"I started the blog in eighth grade after repeatedly finding software with little Chinese-language guidance. I write step-by-step explanations of software, self-built tools and development techniques, including the details a reader new to the subject needs to get started.",
					"The archive has grown beyond 1.4 million Chinese characters. Questions from teachers, students and people using these tools at work reveal where an explanation needs another example, a clearer step or a different approach."
				]
			},
			{
				label: "THE PLATFORM",
				title: "A publishing system that grew beyond individual articles.",
				paragraphs: [
					"After Hugo, I wrote emblog, a small Node.js generator with custom page transitions and reading features. Its tightly connected design eventually made new content formats harder to add, so the 2026 rebuild moved the publishing foundation to Astro and TypeScript.",
					"The current site combines Pagefind full-text search, ordered courses with account-free reading progress, and a separate Cloudflare Workers/D1 comment service. I design the interface and reading flow while using established tools for content generation and navigation."
				]
			},
			{
				label: "THE OUTCOME",
				title: "Writing that supports the tools behind it.",
				paragraphs: [
					"The publication receives tens of thousands of page views each month. Its advertising revenue covers the server and domain costs of my open-source projects, keeping both the articles and those tools available.",
					"My CSS and JavaScript series for the 2023 iThome Ironman Challenge led to an invitation from a publisher to write a book. In 2024, my series received an Honorable Mention in the competition's DevOps category."
				]
			}
		]
	},
	"zh-Hant": {
		name: "毛哥EM資訊密技",
		type: "技術寫作與網頁工程",
		headline: "寫下教學，\n也打造承載它的平台。",
		introduction: "從國二開始經營的中文技術網站，累積逾140萬字原創內容。我負責寫作、設計與開發，讓零散的教學文章逐步成長為具備全文搜尋、系列課程與留言討論的平台。",
		imageAlt: "毛哥EM資訊密技首頁，呈現文章、課程導覽與封面插畫",
		card: {
			type: "技術寫作與內容平台",
			summary: "逾140萬字中文技術教學，以及為搜尋、課程與討論打造的自有平台。",
			metric: "逾140萬字原創內容"
		},
		role: "作者、設計與全端開發",
		status: "持續更新與營運中",
		externalLabel: "閱讀毛哥EM資訊密技",
		metric: "140萬+",
		metricLabel: "原創中文文字",
		sections: [
			{
				label: "內容",
				title: "讓想嘗試的工具，有一份讀得懂的中文說明。",
				paragraphs: [
					"自學時，我常遇到好用的軟體，卻找不到足夠清楚的中文資源，因此從國二開始經營這個部落格。我把軟體操作、自製工具與開發技術整理成可跟著實作的文章，也補上初次接觸時容易卡住的細節。",
					"原創內容累積超過140萬字，也持續收到教師、學生與工作使用者的提問。這些實際問題讓我知道，哪裡需要多一個例子、拆細一個步驟，或換個方式解釋。"
				]
			},
			{
				label: "平台",
				title: "從刊登文章，走向能循序學習的內容系統。",
				paragraphs: [
					"離開 Hugo 後，我以 Node.js 開發 emblog，實作自訂轉場與閱讀功能。隨著需求增加，彼此緊密耦合的程式開始限制擴充，於是在2026年將網站重建為 Astro 與 TypeScript 架構。",
					"新版整合 Pagefind 全文搜尋、有章節順序與免帳號閱讀進度的課程，以及獨立運作的 Cloudflare Workers／D1 留言服務。我持續設計介面與閱讀動線，並將內容生成、頁面導覽交給成熟工具處理。"
				]
			},
			{
				label: "成果",
				title: "讓寫作，也成為開源專案能持續運作的基礎。",
				paragraphs: [
					"網站每月有數萬次瀏覽，廣告收入已能支應我所有開源專案的伺服器與網域費用，讓文章與工具得以持續提供使用。",
					"2023年，我在 iThome 鐵人賽撰寫 CSS 與 JavaScript 教學系列，因而收到出版社的書籍寫作邀請；2024年則獲得鐵人賽 DevOps 組佳作。"
				]
			}
		]
	},
	"zh-Hans": {
		name: "毛哥EM资讯密技",
		type: "技术写作与网页工程",
		headline: "写下教程，\n也打造承载它的平台。",
		introduction: "从初二开始经营的中文技术网站，积累超过140万字原创内容。我负责写作、设计与开发，让分散的教程文章逐步发展为具备全文搜索、系列课程与留言讨论的平台。",
		imageAlt: "毛哥EM资讯密技首页，呈现文章、课程导航与封面插画",
		card: {
			type: "技术写作与内容平台",
			summary: "超过140万字中文技术教程，以及为搜索、课程与讨论打造的自有平台。",
			metric: "超过140万字原创内容"
		},
		role: "作者、设计与全栈开发",
		status: "持续更新与运营中",
		externalLabel: "阅读毛哥EM资讯密技",
		metric: "140万+",
		metricLabel: "原创中文文字",
		sections: [
			{
				label: "内容",
				title: "让想尝试的工具，有一份读得懂的中文说明。",
				paragraphs: [
					"自学时，我常遇到好用的软件，却找不到足够清楚的中文资源，因此从初二开始经营这个博客。我把软件操作、自制工具与开发技术整理成可跟着实践的文章，也补上初次接触时容易卡住的细节。",
					"原创内容积累超过140万字，也持续收到教师、学生与工作使用者的提问。这些实际问题让我知道，哪里需要多一个例子、拆细一个步骤，或换种方式解释。"
				]
			},
			{
				label: "平台",
				title: "从刊登文章，走向能循序学习的内容系统。",
				paragraphs: [
					"离开 Hugo 后，我用 Node.js 开发 emblog，实现自定义转场与阅读功能。随着需求增加，彼此紧密耦合的代码开始限制扩展，于是在2026年将网站重建为 Astro 与 TypeScript 架构。",
					"新版整合 Pagefind 全文搜索、有章节顺序与免账号阅读进度的课程，以及独立运行的 Cloudflare Workers／D1 留言服务。我持续设计界面与阅读流程，并将内容生成、页面导航交给成熟工具处理。"
				]
			},
			{
				label: "成果",
				title: "让写作，也成为开源项目能持续运行的基础。",
				paragraphs: [
					"网站每月有数万次浏览，广告收入已能承担我所有开源项目的服务器与域名费用，让文章与工具得以持续提供使用。",
					"2023年，我在 iThome 铁人赛撰写 CSS 与 JavaScript 教程系列，因此收到出版社的书籍写作邀请；2024年则获得铁人赛 DevOps 组佳作。"
				]
			}
		]
	}
} satisfies Record<Locale, ProjectCopy>;
