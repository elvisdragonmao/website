import type { Locale } from "../../i18n";
import type { ProjectCopy } from "../project-types";

export const omniobserveContent = {
	en: {
		type: "Human–AI interaction research",
		headline: "Before You Decide to Speak…",
		introduction:
			"Collaborative research at NYCU using anonymous similarity cues to reveal potentially shared ideas before participants decide whether to speak. Accepted to the TAICHI 2026 Poster Track.",
		imageAlt: "OmniObserve’s Lost at Sea interface, showing shared and private rankings alongside editable idea cards with anonymous similarity cues",
		card: {
			type: "Human–AI interaction research",
			summary:
				"Collaborative research at NYCU using anonymous similarity cues to reveal potentially shared ideas before participants decide whether to speak. Accepted to the TAICHI 2026 Poster Track.",
			metric: "TAICHI 2026 poster"
		},
		role: "Research collaborator · literature, discussions & study support",
		status: "Research prototype · TAICHI 2026 poster",
		externalLabel: "Read the research",
		credits: "Research with Shih-Kai Hong, Ethel Yu-Tsen Hsiao, Yi-Jie Chen, Jason Zhi-Jun Chang, and Grace Yu-Chun Yen at NYCU’s HAIX Lab. Interface image: OmniObserve research team, CC BY-SA 4.0."
	},
	"zh-Hant": {
		type: "人機互動研究",
		headline: "在你決定開口之前……",
		introduction: "陽明交大的協作研究，用匿名相似提示，在參與者決定要不要發言之前，讓他們知道可能有人抱持相近的想法。入選 TAICHI 2026 Poster Track。",
		imageAlt: "OmniObserve 的海上求生任務介面，包含公開與私人排序，以及帶有匿名相似性提示的可編輯想法卡片",
		card: {
			type: "人機互動研究",
			summary: "陽明交大的協作研究，用匿名相似提示，在參與者決定要不要發言之前，讓他們知道可能有人抱持相近的想法。入選 TAICHI 2026 Poster Track。",
			metric: "TAICHI 2026 海報發表"
		},
		role: "研究協作・文獻蒐集、研究討論與實驗支援",
		status: "研究原型 · TAICHI 2026 海報發表",
		externalLabel: "閱讀研究介紹",
		credits: "與陽明交大 HAIX Lab 的 Shih-Kai Hong、Ethel Yu-Tsen Hsiao、Yi-Jie Chen、Jason Zhi-Jun Chang 及 Grace Yu-Chun Yen 共同研究。介面圖片：OmniObserve 研究團隊，CC BY-SA 4.0。"
	},
	"zh-Hans": {
		type: "人机交互研究",
		headline: "在你决定开口之前……",
		introduction: "阳明交大的协作研究，用匿名相似提示，在参与者决定要不要发言之前，让他们知道可能有人抱持相近的想法。入选 TAICHI 2026 Poster Track。",
		imageAlt: "OmniObserve 的海上求生任务界面，包含公开与私人排序，以及带有匿名相似性提示的可编辑想法卡片",
		card: {
			type: "人机交互研究",
			summary: "阳明交大的协作研究，用匿名相似提示，在参与者决定要不要发言之前，让他们知道可能有人抱持相近的想法。入选 TAICHI 2026 Poster Track。",
			metric: "TAICHI 2026 海报展示"
		},
		role: "研究协作・文献搜集、研究讨论与实验支持",
		status: "研究原型 · TAICHI 2026 海报发表",
		externalLabel: "阅读研究介绍",
		credits: "与阳明交大 HAIX Lab 的 Shih-Kai Hong、Ethel Yu-Tsen Hsiao、Yi-Jie Chen、Jason Zhi-Jun Chang 及 Grace Yu-Chun Yen 共同研究。界面图片：OmniObserve 研究团队，CC BY-SA 4.0。"
	}
} satisfies Record<Locale, ProjectCopy>;
