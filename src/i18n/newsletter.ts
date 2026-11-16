import type { Locale } from "./index";
interface NewsletterCopy {
	title: string;
	description: string;
	heading: string;
	intro: string;
	details: string;
	name: string;
	namePlaceholder: string;
	email: string;
	interest: string;
	interestPlaceholder: string;
	subscribe: string;
	opening: string;
	caption: string;
}
export const newsletterCopy = {
	en: {
		title: "Let's be friends — Elvis Mao",
		description: "A monthly letter from EM about things I've made, ideas I'm exploring, and discoveries worth sharing.",
		heading: "The Hmmm Newsletter",
		intro: "A letter from me, once a month.",
		details: "Things I've made, ideas I'm exploring, articles, and little discoveries. Leave your email if you'd like to hear from me.",
		name: "Name (optional)",
		namePlaceholder: "What should I call you?",
		email: "Email",
		interest: "Anything you'd like to hear about? (optional)",
		interestPlaceholder: "Tell me what interests you.",
		subscribe: "Subscribe",
		opening: "Opening the subscription confirmation in a new tab…",
		caption: "You can unsubscribe at any time. Google Forms will open in a new tab to confirm your submission."
	},
	"zh-Hant": {
		title: "交個朋友 — 毛哥 EM",
		description: "每個月一封信，聊聊毛哥 EM 做的東西、正在探索的想法，以及值得分享的新發現。",
		heading: "Hmmm 電子報",
		intro: "每個月，寄一封信給你。",
		details: "聊聊我做的東西、正在探索的想法、讀到的文章，還有生活中的小發現。想收到的話，就留下你的 Email 吧。",
		name: "名字（選填）",
		namePlaceholder: "我該怎麼稱呼你？",
		email: "電子郵件",
		interest: "有什麼想聽我分享的嗎？（選填）",
		interestPlaceholder: "告訴我你感興趣的事。",
		subscribe: "訂閱",
		opening: "正在新分頁開啟訂閱確認頁面⋯",
		caption: "隨時都可以取消訂閱。送出後會在新分頁開啟 Google 表單，確認是否提交成功。"
	},
	"zh-Hans": {
		title: "交个朋友 — 毛哥 EM",
		description: "每个月一封信，聊聊毛哥 EM 做的东西、正在探索的想法，以及值得分享的新发现。",
		heading: "Hmmm 电子报",
		intro: "每个月，寄一封信给你。",
		details: "聊聊我做的东西、正在探索的想法、读到的文章，还有生活中的小发现。想收到的话，就留下你的 Email 吧。",
		name: "名字（选填）",
		namePlaceholder: "我该怎么称呼你？",
		email: "电子邮箱",
		interest: "有什么想听我分享的吗？（选填）",
		interestPlaceholder: "告诉我你感兴趣的事。",
		subscribe: "订阅",
		opening: "正在新标签页打开订阅确认页面⋯",
		caption: "随时都可以取消订阅。提交后会在新标签页打开 Google 表单，确认是否提交成功。"
	}
} satisfies Record<Locale, NewsletterCopy>;
