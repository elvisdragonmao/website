import type { Project, ProjectSlug } from "../data/projects";
import type { Locale } from "./index";

type ProjectTranslation = Pick<Project, "type" | "headline" | "introduction" | "imageAlt" | "card" | "role" | "status" | "sections"> &
	Partial<Pick<Project, "externalLabel" | "metricLabel" | "credits">>;

export const projectTranslations = {
	"zh-Hant": {
		emfont: {
			type: "開源基礎建設",
			headline: "讓中文字體\n有更多可能。",
			introduction: "一個開源服務，讓網站輕鬆使用中文字體，不必為了傳送字型，另外打造一套基礎建設。",
			imageAlt: "emfont 中文網頁字型服務網站",
			card: { type: "開源基礎建設", summary: "開源的中日韓網頁字型服務。", metric: "每日超過 120 萬次請求" },
			role: "創作者與維護者",
			status: "持續營運中",
			externalLabel: "前往 emfont",
			metricLabel: "每日 HTTP 請求",
			sections: [
				{
					label: "問題",
					title: "選一套字體，不該變成一項基礎建設工程。",
					paragraphs: [
						"中文字型包含大量字元。要有效率地將字型送到瀏覽器，得考量檔案大小、頁面需要哪些字，以及瀏覽器和 CDN 能重複使用哪些內容。",
						"emfont 處理這些傳送工作，讓製作網站的人把時間留給自己的頁面。"
					]
				},
				{
					label: "我的工作",
					title: "你看見的是字體，讓它持續可用也是我的工作。",
					paragraphs: [
						"我建置並營運這項服務，從後端、儲存、部署到內容傳遞，也持續維護其他網站所依賴的系統。",
						"我也在隨需產生字元和依 Unicode 範圍切分靜態字型之間，逐一評估傳輸量、快取效率，以及長期營運的可行性。"
					]
				},
				{
					label: "為什麼在意",
					title: "讓網頁更有表情的幕後工作。",
					paragraphs: ["好的字體能改變頁面的個性。我喜歡打造那些不太顯眼、卻能讓別人更容易做出選擇的系統。", "字型設計師創造文字的樣貌，emfont 幫助它們出現在網頁上。"]
				}
			]
		},
		emtech: {
			type: "寫作與教學",
			headline: "好奇心\n會傳染。",
			introduction: "關於程式、設計，以及那些我想弄懂、也想好好解釋的事：原創文章與教學。",
			imageAlt: "emtech 技術文章網站",
			card: { type: "寫作與教學", summary: "原創技術文章與教學。", metric: "每月超過 5 萬次瀏覽" },
			role: "作者與創作者",
			status: "持續寫作中",
			externalLabel: "閱讀 emtech",
			metricLabel: "每月瀏覽次數",
			sections: [
				{
					label: "想法",
					title: "讓下一件想試的事，更容易開始。",
					paragraphs: ["emtech 是我記錄實作中所學的地方。透過原創技術文章與教學，我把部分實驗整理成別人也用得上的內容。", "寫作讓我有理由慢下來，仔細看清細節，也解釋一個成果背後的選擇。"]
				},
				{
					label: "我的工作",
					title: "從一個問題，到一個說得清楚的答案。",
					paragraphs: ["在開發與研究之外，我持續撰寫與維護這個網站。內容隨著我對網頁開發、創作工具，以及背後系統的興趣而展開。", "大部分文章以中文撰寫，仍可在既有的 emtech 網站上閱讀。"]
				},
				{ label: "為什麼在意", title: "一篇好的教學，可以成為另一個人開始實驗的起點。", paragraphs: ["我喜歡幫助人們把想法變成真正能試的東西。寫作讓這份幫助走出教室與對話，傳到更遠的地方。"] }
			]
		},
		"sitcon-2026": {
			type: "視覺設計與開發",
			headline: "Jam\nthe Chaos.",
			introduction: "為東亞最大的學生資訊年會打造網站。我負責視覺與互動設計，並帶領網站開發團隊。",
			imageAlt: "SITCON 2026 Jam the Chaos 網站",
			card: { type: "視覺設計與開發", summary: "東亞最大的學生資訊年會。", metric: "網站開發組組長" },
			role: "網站設計與開發組組長",
			status: "年會網站",
			externalLabel: "前往 SITCON 2026",
			credits: "與 SITCON 2026 設計組及開發組共同製作。",
			sections: [
				{
					label: "背景",
					title: "一個動手做事的社群。",
					paragraphs: [
						"SITCON 是由學生籌辦的資訊年會，重視學習、分享與開源文化。2026 年主題「Jam the Chaos」探索如何在變動之中找到合作的方法。",
						"網站整合年會識別、議程、講者，以及參與活動所需的實用資訊。"
					]
				},
				{
					label: "我的工作",
					title: "設計體驗，一起把它做出來。",
					paragraphs: ["我參與網站的視覺與互動設計，帶領八人的開發團隊，並與年會設計組合作。", "這份工作把創意方向轉化為能實際使用的年會網站，讓介面、資訊與互動成為同一段體驗。"]
				},
				{
					label: "為什麼在意",
					title: "網站是一場更大協作的一部分。",
					paragraphs: ["一場年會由籌辦者、講者、志工和每位參與者共同完成。製作網站，就是為這份共同的努力打造入口。", "我喜歡透過製作的過程，幫助一個社群相遇。"]
				}
			]
		},
		omniobserve: {
			type: "人機與人工智慧互動研究",
			headline: "那些\n沒說出口的話？",
			introduction: "線上會議裡，可能存在比說出口更多的共識。OmniObserve 探索人們如何發現這些共同的想法。",
			imageAlt: "呈現私下表達與共享觀點的互動機制概念圖",
			card: { type: "人機與人工智慧互動研究", summary: "探索線上會議中沒說出口的想法。", metric: "TAICHI 2026 海報 · HAIX Lab" },
			role: "研究合作；軟體與實驗基礎建設",
			status: "研究原型 · TAICHI 2026 海報",
			credits: "Shih-Kai Hong、Ethel Yu-Tsen Hsiao、Yi-Jie Chen、Jason Zhi-Jun Chang、Elvis Dragon Mao、Grace Yu-Chun Yen。",
			sections: [
				{
					label: "研究問題",
					title: "如果你知道，不只自己這麼想呢？",
					paragraphs: [
						"人們可能因為不確定、預期會被反對，或覺得話題難以啟齒，而猶豫是否表達意見。團體因此可能不知道，成員其實有共同的想法。",
						"我們研究讓參與者私下表達意見、並在他人有相似感受時得到提示的機制。"
					]
				},
				{
					label: "我的貢獻",
					title: "把研究問題接到可以實際研究的系統。",
					paragraphs: [
						"我使用 Jitsi、Whisper 與 ChatGPT API 建置基礎軟體及實驗環境，也參與系統設計、實作、實驗準備、研究討論與實驗執行。",
						"這是國立陽明交通大學 Human-AI & Creative Computing Lab 的合作研究。"
					]
				},
				{
					label: "這份研究的提問",
					title: "介面如何為那些難以說出口的話，留一點空間？",
					paragraphs: [
						"透過 OmniObserve，我們探索私下表達，以及共同觀點的提示，如何支持線上會議中的溝通。這也延續了我對介面如何影響人們表達意願的興趣。",
						"「OmniObserve: Revealing Hidden Consensus in Online Meetings」於臺灣人機互動研討會 TAICHI 2026 以海報發表。"
					]
				}
			]
		}
	},
	"zh-Hans": {
		emfont: {
			type: "开源基础设施",
			headline: "让中文字体\n有更多可能。",
			introduction: "一个开源服务，让网站轻松使用中文字体，不必为了传送字体，另外打造一套基础设施。",
			imageAlt: "emfont 中文网页字体服务网站",
			card: { type: "开源基础设施", summary: "开源的中日韩网页字体服务。", metric: "每日超过 120 万次请求" },
			role: "创作者与维护者",
			status: "持续运营中",
			externalLabel: "前往 emfont",
			metricLabel: "每日 HTTP 请求",
			sections: [
				{
					label: "问题",
					title: "选一套字体，不该变成一项基础设施工程。",
					paragraphs: [
						"中文字体包含大量字符。要高效地将字体送到浏览器，需要考虑文件大小、页面需要哪些字，以及浏览器和 CDN 能重复使用哪些内容。",
						"emfont 处理这些传送工作，让制作网站的人把时间留给自己的页面。"
					]
				},
				{
					label: "我的工作",
					title: "你看见的是字体，让它持续可用也是我的工作。",
					paragraphs: [
						"我构建并运营这项服务，从后端、存储、部署到内容分发，也持续维护其他网站所依赖的系统。",
						"我也在按需生成字符和按 Unicode 范围拆分静态字体之间，逐一评估传输量、缓存效率，以及长期运营的可行性。"
					]
				},
				{
					label: "为什么在意",
					title: "让网页更有表情的幕后工作。",
					paragraphs: ["好的字体能改变页面的个性。我喜欢打造那些不太显眼、却能让别人更容易做出选择的系统。", "字体设计师创造文字的样貌，emfont 帮助它们出现在网页上。"]
				}
			]
		},
		emtech: {
			type: "写作与教学",
			headline: "好奇心\n会传染。",
			introduction: "关于代码、设计，以及那些我想弄懂、也想好好解释的事：原创文章与教程。",
			imageAlt: "emtech 技术文章网站",
			card: { type: "写作与教学", summary: "原创技术文章与教程。", metric: "每月超过 5 万次浏览" },
			role: "作者与创作者",
			status: "持续写作中",
			externalLabel: "阅读 emtech",
			metricLabel: "每月浏览次数",
			sections: [
				{
					label: "想法",
					title: "让下一件想试的事，更容易开始。",
					paragraphs: ["emtech 是我记录实践中所学的地方。通过原创技术文章与教程，我把部分实验整理成别人也用得上的内容。", "写作让我有理由慢下来，仔细看清细节，也解释一个成果背后的选择。"]
				},
				{
					label: "我的工作",
					title: "从一个问题，到一个说得清楚的答案。",
					paragraphs: ["在开发与研究之外，我持续撰写与维护这个网站。内容随着我对网页开发、创作工具，以及背后系统的兴趣而展开。", "大部分文章以中文撰写，仍可在既有的 emtech 网站上阅读。"]
				},
				{ label: "为什么在意", title: "一篇好的教程，可以成为另一个人开始实验的起点。", paragraphs: ["我喜欢帮助人们把想法变成真正能试的东西。写作让这份帮助走出教室与对话，传到更远的地方。"] }
			]
		},
		"sitcon-2026": {
			type: "视觉设计与开发",
			headline: "Jam\nthe Chaos.",
			introduction: "为东亚最大的学生信息技术年会打造网站。我负责视觉与交互设计，并带领网站开发团队。",
			imageAlt: "SITCON 2026 Jam the Chaos 网站",
			card: { type: "视觉设计与开发", summary: "东亚最大的学生信息技术年会。", metric: "网站开发组组长" },
			role: "网站设计与开发组组长",
			status: "年会网站",
			externalLabel: "前往 SITCON 2026",
			credits: "与 SITCON 2026 设计组及开发组共同制作。",
			sections: [
				{
					label: "背景",
					title: "一个动手做事的社区。",
					paragraphs: [
						"SITCON 是由学生筹办的信息技术年会，重视学习、分享与开源文化。2026 年主题「Jam the Chaos」探索如何在变动之中找到合作的方法。",
						"网站整合年会视觉形象、议程、讲者，以及参与活动所需的实用信息。"
					]
				},
				{
					label: "我的工作",
					title: "设计体验，一起把它做出来。",
					paragraphs: ["我参与网站的视觉与交互设计，带领八人的开发团队，并与年会设计组合作。", "这份工作把创意方向转化为能实际使用的年会网站，让界面、信息与交互成为同一段体验。"]
				},
				{
					label: "为什么在意",
					title: "网站是一场更大协作的一部分。",
					paragraphs: ["一场年会由筹办者、讲者、志愿者和每位参与者共同完成。制作网站，就是为这份共同的努力打造入口。", "我喜欢通过制作的过程，帮助一个社区相遇。"]
				}
			]
		},
		omniobserve: {
			type: "人机与人工智能交互研究",
			headline: "那些\n没说出口的话？",
			introduction: "线上会议里，可能存在比说出口更多的共识。OmniObserve 探索人们如何发现这些共同的想法。",
			imageAlt: "呈现私下表达与共享观点的交互机制概念图",
			card: { type: "人机与人工智能交互研究", summary: "探索线上会议中没说出口的想法。", metric: "TAICHI 2026 海报 · HAIX Lab" },
			role: "研究合作；软件与实验基础设施",
			status: "研究原型 · TAICHI 2026 海报",
			credits: "Shih-Kai Hong、Ethel Yu-Tsen Hsiao、Yi-Jie Chen、Jason Zhi-Jun Chang、Elvis Dragon Mao、Grace Yu-Chun Yen。",
			sections: [
				{
					label: "研究问题",
					title: "如果你知道，不只自己这么想呢？",
					paragraphs: [
						"人们可能因为不确定、预期会被反对，或觉得话题难以启齿，而犹豫是否表达意见。团体因此可能不知道，成员其实有共同的想法。",
						"我们研究让参与者私下表达意见、并在他人有相似感受时得到提示的机制。"
					]
				},
				{
					label: "我的贡献",
					title: "把研究问题接到可以实际研究的系统。",
					paragraphs: [
						"我使用 Jitsi、Whisper 与 ChatGPT API 构建基础软件及实验环境，也参与系统设计、实现、实验准备、研究讨论与实验执行。",
						"这是国立阳明交通大学 Human-AI & Creative Computing Lab 的合作研究。"
					]
				},
				{
					label: "这份研究的提问",
					title: "界面如何为那些难以说出口的话，留一点空间？",
					paragraphs: [
						"通过 OmniObserve，我们探索私下表达，以及共同观点的提示，如何支持线上会议中的沟通。这也延续了我对界面如何影响人们表达意愿的兴趣。",
						"「OmniObserve: Revealing Hidden Consensus in Online Meetings」于台湾人机交互研讨会 TAICHI 2026 以海报发表。"
					]
				}
			]
		}
	}
} satisfies Record<Exclude<Locale, "en">, Record<ProjectSlug, ProjectTranslation>>;

const projectPageCopy = {
	en: { allWork: "All work", project: "PROJECT", role: "MY ROLE", status: "STATUS", credits: "CREDITS", next: "NEXT PROJECT", concept: "Concept overview of the interaction mechanism." },
	"zh-Hant": { allWork: "所有作品", project: "專案", role: "我的角色", status: "狀態", credits: "製作團隊", next: "下一個專案", concept: "互動機制的概念示意圖。" },
	"zh-Hans": { allWork: "所有作品", project: "项目", role: "我的角色", status: "状态", credits: "制作团队", next: "下一个项目", concept: "交互机制的概念示意图。" }
} satisfies Record<Locale, Record<string, string>>;
export const getProjectPageCopy = (locale: Locale) => projectPageCopy[locale];
