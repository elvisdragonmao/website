import type { Locale } from "../../i18n";
import type { ProjectCopy } from "../project-types";

export const emfontContent = {
	en: {
		type: "Open-source webfont service",
		headline: "Chinese webfonts,\nmade easier to use.",
		introduction:
			"emfont brings free and open-source Chinese fonts to the web through a CSS import or a small JavaScript embed. I built the font catalog, browser integration, and delivery service so developers can choose a typeface without managing font conversion and hosting themselves.",
		imageAlt: "The emfont catalog with Chinese typeface previews and font filters",
		card: {
			type: "Open-source webfont service",
			summary: "Free Chinese webfonts with a simple embed and smaller, reusable font subsets. Built for developers, and for anyone looking for their next typeface.",
			metric: "1.2M+ requests per day"
		},
		role: "Creator & maintainer",
		status: "Live service",
		metric: "1.2M+",
		metricLabel: "Font-service requests per day",
		sections: [
			{
				label: "The problem",
				title: "A typeface should not mean a massive download.",
				paragraphs: [
					"Chinese font files contain thousands of characters, even when a page uses only a few dozen. Loading an entire font can make a small website unexpectedly heavy; preparing smaller files, checking licenses, and hosting them adds work before the design even reaches a browser.",
					"I started emfont to make that process approachable. Its catalog brings together free and open-source fonts with previews and license information, helping students and designers find a typeface as well as giving developers a way to use it."
				]
			},
			{
				label: "How it works",
				title: "Send the characters a page needs.",
				paragraphs: [
					"A CSS import loads reusable font subsets, while the JavaScript integration reads the page’s text and requests the matching glyphs and weights. The service generates WOFF2 files, reuses existing results, and delivers them through Cloudflare R2.",
					"For small, fixed sets of text, an exact dynamic subset can be less than 1% of the original font file. That mode suits headings and logos; reusable subsets make more sense for changing content because adding a character does not require downloading a newly generated file every time."
				]
			},
			{
				label: "In use",
				title: "From student projects to public-facing websites.",
				paragraphs: [
					"emfont now handles more than 1.2 million requests a day. It has been used on websites for Kirin Beer, FIN, universities, SITCON 2026, and FurryTeaParty 2027, alongside the personal projects and design experiments that first motivated the service.",
					"I continue to maintain both sides of it: the catalog people browse when choosing a font, and the generation and delivery system their websites depend on afterward. Keeping those connected makes emfont useful well beyond the first preview."
				]
			}
		]
	},
	"zh-Hant": {
		type: "開源網頁字型服務",
		headline: "讓中文字型，\n更容易用在網頁上。",
		introduction:
			"emfont 將免費、開源的中文字型整理成可直接使用的網頁服務，引入 CSS 或一小段 JavaScript 就能套用。我從字型目錄、瀏覽器端整合到後端傳輸系統一路開發，讓開發者選好字型後，不必再自行處理轉檔與託管。",
		imageAlt: "emfont 字型目錄中的中文字型預覽與篩選功能",
		card: {
			type: "開源網頁字型服務",
			summary: "透過簡單的嵌入方式與可重用的字型子集，讓免費中文字型更容易用在網頁上，也讓學生與設計師更容易找到適合的字型。",
			metric: "每日 120 萬次以上請求"
		},
		role: "發起人與維護者",
		status: "持續營運中",
		metric: "120 萬+",
		metricLabel: "每日字型服務請求",
		sections: [
			{
				label: "問題",
				title: "換個字型，不該讓網頁變得沉重。",
				paragraphs: [
					"一套中文字型包含成千上萬個字，網頁實際使用的卻可能只有幾十個。直接載入完整字型，會讓原本輕量的頁面多出可觀的下載量；若要自行縮減，又得處理字型轉換、授權確認與檔案託管。",
					"我因此開始製作 emfont，把免費、開源字型的預覽與授權資訊放在同一個目錄。它既是開發者套用網頁字型的入口，也是學生與設計師尋找字型時可以反覆使用的工具。"
				]
			},
			{
				label: "實作",
				title: "依照頁面用字，決定傳送哪些字型。",
				paragraphs: [
					"CSS 引入方式會載入可重用的字型子集；JavaScript 整合則會讀取頁面文字，依照需要的字元與字重請求字型。後端產生 WOFF2 檔案，重用已生成的結果，再透過 Cloudflare R2 傳送。",
					"只有少量固定文字時，精確生成的動態子集可以縮到原始字型檔案的 1% 以下，適合標題或標誌。經常變動的內容則更適合可重用的子集，避免每增加一個字，就必須重新生成並下載另一份檔案。"
				]
			},
			{
				label: "使用成果",
				title: "從學生作品，走進活動與企業網站。",
				paragraphs: [
					"emfont 目前每天處理超過 120 萬次請求，曾用於麒麟啤酒、FIN、大專院校、SITCON 2026 與以茶會毛 2027 等網站，也持續支援個人作品與設計實驗。這些不同規模的使用情境，讓字型服務的穩定性成為日常維護的一部分。",
					"我持續維護的不只有大家挑選字型時看到的目錄，也包含套用之後所依賴的生成與傳輸系統。從找字型到正式上線，這兩端都需要有人照顧，工具才會一直有用。"
				]
			}
		]
	},
	"zh-Hans": {
		type: "开源网页字体服务",
		headline: "让中文字体，\n更容易用在网页上。",
		introduction:
			"emfont 将免费、开源的中文字体整理成可直接使用的网页服务，引入 CSS 或一小段 JavaScript 就能应用。我从字体目录、浏览器端集成到后端传输系统一路开发，让开发者选好字体后，不必再自行处理转换与托管。",
		imageAlt: "emfont 字体目录中的中文字体预览与筛选功能",
		card: {
			type: "开源网页字体服务",
			summary: "通过简单的嵌入方式与可复用的字体子集，让免费中文字体更容易用在网页上，也让学生与设计师更容易找到适合的字体。",
			metric: "每日 120 万次以上请求"
		},
		role: "发起人与维护者",
		status: "持续运营中",
		metric: "120 万+",
		metricLabel: "每日字体服务请求",
		sections: [
			{
				label: "问题",
				title: "换个字体，不该让网页变得沉重。",
				paragraphs: [
					"一套中文字体包含成千上万个字，网页实际使用的却可能只有几十个。直接加载完整字体，会让原本轻量的页面多出可观的下载量；若要自行缩减，又得处理字体转换、授权确认与文件托管。",
					"我因此开始制作 emfont，把免费、开源字体的预览与授权信息放在同一个目录。它既是开发者应用网页字体的入口，也是学生与设计师寻找字体时可以反复使用的工具。"
				]
			},
			{
				label: "实现",
				title: "根据页面用字，决定传送哪些字体。",
				paragraphs: [
					"CSS 引入方式会加载可复用的字体子集；JavaScript 集成则会读取页面文字，按照需要的字符与字重请求字体。后端生成 WOFF2 文件，复用已有结果，再通过 Cloudflare R2 传送。",
					"只有少量固定文字时，精确生成的动态子集可以缩到原始字体文件的 1% 以下，适合标题或标志。经常变动的内容则更适合可复用的子集，避免每增加一个字，就必须重新生成并下载另一份文件。"
				]
			},
			{
				label: "使用成果",
				title: "从学生作品，走进活动与企业网站。",
				paragraphs: [
					"emfont 目前每天处理超过 120 万次请求，曾用于麒麟啤酒、FIN、高校、SITCON 2026 与以茶会毛 2027 等网站，也持续支持个人作品与设计实验。这些不同规模的使用场景，让字体服务的稳定性成为日常维护的一部分。",
					"我持续维护的不只有大家挑选字体时看到的目录，也包含应用之后所依赖的生成与传输系统。从找字体到正式上线，这两端都需要有人照顾，工具才会一直有用。"
				]
			}
		]
	}
} satisfies Record<Locale, ProjectCopy>;
