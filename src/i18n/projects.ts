import type { Locale } from "./index";

const projectPageCopy = {
	en: {
		allWork: "All work",
		onThisPage: "On this page",
		project: "PROJECT",
		role: "MY ROLE",
		status: "STATUS",
		credits: "CREDITS",
		next: "NEXT PROJECT",
		media: "Interface image: OmniObserve research team",
		video: "OmniObserve demonstration",
		source: "Research and image source"
	},
	"zh-Hant": {
		allWork: "所有作品",
		onThisPage: "本頁內容",
		project: "專案",
		role: "我的角色",
		status: "狀態",
		credits: "製作團隊",
		next: "下一個專案",
		media: "介面圖片：OmniObserve 研究團隊",
		video: "OmniObserve 系統示範",
		source: "研究與圖片來源"
	},
	"zh-Hans": {
		allWork: "所有作品",
		onThisPage: "本页内容",
		project: "项目",
		role: "我的角色",
		status: "状态",
		credits: "制作团队",
		next: "下一个项目",
		media: "界面图片：OmniObserve 研究团队",
		video: "OmniObserve 系统演示",
		source: "研究与图片来源"
	}
} satisfies Record<Locale, Record<string, string>>;
export const getProjectPageCopy = (locale: Locale) => projectPageCopy[locale];
