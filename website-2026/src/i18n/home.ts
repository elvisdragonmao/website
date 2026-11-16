import type { Locale } from "./index";

interface HomeCopy {
	fire: string;
	alive: string;
	exploring: string;
	exploringSupport: string;
	why: string;
	introduction: string;
	hello: string;
	rolesLabel: string;
	developer: string;
	designer: string;
	researcher: string;
	dragon: string;
	researchLink: string;
	workHeading: string;
	workIntro: [string, string];
	workLink: string;
	wild: string;
	cta: string;
	emailLabel: string;
	keepScrolling: [string, string];
	about: string;
	nextPage: string;
	progressLabel: string;
	loading: string;
}
export const homeCopy = {
	en: {
		fire: "People said front-end is dead.\nGuess I'm now a necromancer.",
		alive: "I make things\nthat feel alive.",
		exploring: "Explore new ways for people\nand technology to communicate.",
		exploringSupport: "Through movement, touch, or even telepathy.",
		why: "No matter what I do,\nI just hope to make this world\na little different.",
		introduction: "Introduction",
		hello: "Hey there, I'm EM.",
		rolesLabel: "What I do",
		developer: "Developer",
		designer: "Designer",
		researcher: "Researcher",
		dragon: "Dragon",
		researchLink: "Read about my research",
		workHeading: "Well, I did some work",
		workIntro: ["For people I'll never meet,", "and people I'll never forget."],
		workLink: "View all projects",
		wild: "Let's make something wild.",
		cta: "Let's make something happen",
		emailLabel: "Email Elvis Mao",
		keepScrolling: ["Keep scrolling", "to get to know me."],
		about: "About",
		nextPage: "Next page",
		progressLabel: "Continue to About",
		loading: "Waking up the dragon…"
	},
	"zh-Hant": {
		fire: "大家都說前端已死。\n看來我現在是死靈法師了。",
		alive: "我做的東西，\n有自己的生命。",
		exploring: "探索人與科技\n溝通的全新方式。",
		exploringSupport: "透過動作、觸碰，甚至心電感應。",
		why: "無論在做什麼，\n我只是希望讓這個世界\n有一點不一樣。",
		introduction: "自我介紹",
		hello: "嗨，我是毛哥 EM。",
		rolesLabel: "我的身分",
		developer: "開發者",
		designer: "設計師",
		researcher: "研究者",
		dragon: "龍",
		researchLink: "看看我的研究",
		workHeading: "我做過的一些東西",
		workIntro: ["獻給素未謀面的人，", "以及永遠不會忘記的人。"],
		workLink: "查看所有專案",
		wild: "一起做點瘋狂的事吧。",
		cta: "讓想法成真",
		emailLabel: "寄信給毛哥 EM",
		keepScrolling: ["繼續往下，", "多認識我一點。"],
		about: "關於我",
		nextPage: "下一頁",
		progressLabel: "繼續前往關於我",
		loading: "正在喚醒這隻龍⋯"
	},
	"zh-Hans": {
		fire: "大家都说前端已死。\n看来我现在是死灵法师了。",
		alive: "我做的东西，\n有自己的生命。",
		exploring: "探索人与科技\n沟通的全新方式。",
		exploringSupport: "通过动作、触碰，甚至心电感应。",
		why: "无论在做什么，\n我只是希望让这个世界\n有一点不一样。",
		introduction: "自我介绍",
		hello: "嗨，我是毛哥 EM。",
		rolesLabel: "我的身份",
		developer: "开发者",
		designer: "设计师",
		researcher: "研究者",
		dragon: "龙",
		researchLink: "看看我的研究",
		workHeading: "我做过的一些东西",
		workIntro: ["献给素未谋面的人，", "以及永远不会忘记的人。"],
		workLink: "查看所有项目",
		wild: "一起做点疯狂的事吧。",
		cta: "让想法成真",
		emailLabel: "给毛哥 EM 发邮件",
		keepScrolling: ["继续往下，", "多认识我一点。"],
		about: "关于我",
		nextPage: "下一页",
		progressLabel: "继续前往关于我",
		loading: "正在唤醒这只龙⋯"
	}
} satisfies Record<Locale, HomeCopy>;
