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
		fire: "They say front-end is dead in the AI age.\nGuess that makes me a necromancer.",
		alive: "I make things\nthat feel alive.",
		exploring: "Explore new ways for people\nand technology to communicate.",
		exploringSupport: "Through movement, touch, or even telepathy.",
		why: "No matter what I do,\nI just hope to make this world\na little different.",
		introduction: "Introduction",
		hello: "Hey there, I'm EM.",
		rolesLabel: "What I do",
		developer: "Developer",
		designer: "Designer",
		researcher: "HCI researcher",
		dragon: "Music dragon",
		researchLink: "Read about my research",
		workHeading: "Well, I did some work",
		workIntro: ["For people I'll never meet,", "and people I'll never forget."],
		workLink: "View all projects",
		wild: "Got something wild in mind?",
		cta: "Let's make something happen",
		emailLabel: "Email Elvis Mao",
		keepScrolling: ["Keep scrolling", "to get to know me."],
		about: "About",
		nextPage: "Next page",
		progressLabel: "Continue to About",
		loading: "Waking up the dragon…"
	},
	"zh-Hant": {
		fire: "聽說 AI 世代前端已死，\n看來我是個亡靈法師。",
		alive: "我喜歡創造充滿生命力的東西。",
		exploring: "探索人與科技溝通的各種可能。",
		exploringSupport: "透過動作、肢體接觸，甚至心電感應。",
		why: "無論做些什麼，我只希望能讓這世界\n有一點點不一樣。",
		introduction: "自我介紹",
		hello: "嗨，我是毛哥EM",
		rolesLabel: "我的身分",
		developer: "一位開發者",
		designer: "被設計師",
		researcher: "人機互動研究者",
		dragon: "及一隻音樂龍",
		researchLink: "看看我的研究",
		workHeading: "我做過的一些東西",
		workIntro: ["為了還沒遇見的人，", "也為了不想忘記的人。"],
		workLink: "查看所有專案",
		wild: "有個大膽的想法？",
		cta: "讓我們一起幹大事吧。",
		emailLabel: "寄信給毛哥EM",
		keepScrolling: ["繼續往下滑，", "了解我更多。"],
		about: "關於我",
		nextPage: "下一頁",
		progressLabel: "繼續前往關於我",
		loading: "正在喚醒這隻龍⋯"
	},
	"zh-Hans": {
		fire: "听说 AI 世代前端已死，\n看来我是个亡灵法师。",
		alive: "我喜欢创造充满生命力的东西。",
		exploring: "探索人与科技沟通的各种可能。",
		exploringSupport: "通过动作、肢体接触，甚至心电感应。",
		why: "无论做些什么，我只希望能让这世界\n有一点点不一样。",
		introduction: "自我介绍",
		hello: "嗨，我是毛哥EM",
		rolesLabel: "我的身份",
		developer: "一位开发者",
		designer: "设计师",
		researcher: "人机交互研究者",
		dragon: "及一只音乐龙",
		researchLink: "看看我的研究",
		workHeading: "我做过的一些东西",
		workIntro: ["为了还没遇见的人，", "也为了不想忘记的人。"],
		workLink: "查看所有项目",
		wild: "有个大胆的想法？",
		cta: "让我们一起干大事吧。",
		emailLabel: "给毛哥EM发邮件",
		keepScrolling: ["继续往下滑，", "了解我更多。"],
		about: "关于我",
		nextPage: "下一页",
		progressLabel: "继续前往关于我",
		loading: "正在唤醒这只龙⋯"
	}
} satisfies Record<Locale, HomeCopy>;
