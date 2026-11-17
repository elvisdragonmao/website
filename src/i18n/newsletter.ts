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

		caption: "You can unsubscribe at any time."
	},
	"zh-Hant": {
		title: "交個朋友 — 毛哥EM",
		description: "每個月一封信，聊聊毛哥EM 做的東西、正在探索的想法，以及值得分享的新發現。",
		heading: "Hmmm 電子報",
		intro: "每個月，寄一封信給你。",
		details: "聊聊我做的東西、正在探索的想法、讀到的文章，還有生活中的小發現。想收到的話，就留下你的 Email 吧。",
		name: "名字（選填）",
		namePlaceholder: "我該怎麼稱呼你？",
		email: "電子郵件",
		interest: "有什麼想聽我分享的嗎？（選填）",
		interestPlaceholder: "告訴我你感興趣的事。",
		subscribe: "訂閱",

		caption: "隨時都可以取消訂閱。"
	},
	"zh-Hans": {
		title: "交个朋友 — 毛哥EM",
		description: "每个月一封信，聊聊毛哥EM 做的东西、正在探索的想法，以及值得分享的新发现。",
		heading: "Hmmm 电子报",
		intro: "每个月，寄一封信给你。",
		details: "聊聊我做的东西、正在探索的想法、读到的文章，还有生活中的小发现。想收到的话，就留下你的 Email 吧。",
		name: "名字（选填）",
		namePlaceholder: "我该怎么称呼你？",
		email: "电子邮箱",
		interest: "有什么想听我分享的吗？（选填）",
		interestPlaceholder: "告诉我你感兴趣的事。",
		subscribe: "订阅",

		caption: "随时都可以取消订阅。"
	}
} satisfies Record<Locale, NewsletterCopy>;

const feedback = {
	en: {
		pending: "Sending…",
		pendingLabel: "Sending…",
		success: "You're on the list. Thanks for subscribing!",
		successLabel: "Subscribed",
		error: "We couldn't confirm your subscription. Please try again.",
		validation: "Please check the highlighted fields."
	},
	"zh-Hant": {
		pending: "正在送出⋯",
		pendingLabel: "送出中⋯",
		success: "訂閱成功，謝謝你！",
		successLabel: "已訂閱",
		error: "未能確認訂閱，請稍後再試。",
		validation: "請檢查標示紅色的欄位。"
	},
	"zh-Hans": {
		pending: "正在提交⋯",
		pendingLabel: "提交中⋯",
		success: "订阅成功，谢谢你！",
		successLabel: "已订阅",
		error: "未能确认订阅，请稍后重试。",
		validation: "请检查标红的字段。"
	}
} satisfies Record<Locale, Record<"pending" | "pendingLabel" | "success" | "successLabel" | "error" | "validation", string>>;

export function newsletterFormAttributes(locale: Locale): Record<string, string> {
	const copy = feedback[locale];
	return {
		"data-pending-message": copy.pending,
		"data-pending-label": copy.pendingLabel,
		"data-success-message": copy.success,
		"data-success-label": copy.successLabel,
		"data-error-message": copy.error,
		"data-validation-message": copy.validation
	};
}
