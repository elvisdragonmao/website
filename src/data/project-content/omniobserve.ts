import type { Locale } from "../../i18n";
import type { ProjectCopy } from "../project-types";

export const omniobserveContent = {
	en: {
		type: "Human–AI interaction research",
		headline: "Find common ground\nbefore speaking up.",
		introduction:
			"OmniObserve explores the moment between having an idea and sharing it in an online meeting. Private idea cards and anonymous AI cues let participants discover compatible views, then decide for themselves whether to bring an idea into the discussion.",
		imageAlt: "OmniObserve’s Lost at Sea interface, showing shared and private rankings alongside editable idea cards with anonymous similarity cues",
		card: {
			type: "Human–AI interaction research",
			summary: "Private idea cards and anonymous AI cues reveal compatible views in online meetings. Participants decide what to share, and when.",
			metric: "TAICHI 2026 poster"
		},
		role: "Research collaborator · system development & study execution",
		status: "Research prototype · TAICHI 2026 poster",
		externalLabel: "Read the research",

		credits: "Research with Shih-Kai Hong, Ethel Yu-Tsen Hsiao, Yi-Jie Chen, Jason Zhi-Jun Chang, and Grace Yu-Chun Yen at NYCU’s HAIX Lab. Interface image: OmniObserve research team, CC BY-SA 4.0.",
		sections: [
			{
				label: "Research question",
				title: "An unspoken idea is still an idea.",
				paragraphs: [
					"People may hold back a tentative opinion because they worry about how others will judge it, or cannot tell whether anyone shares their reasoning. A public meeting transcript captures what was said, but misses ideas that never reach the conversation.",
					"We asked whether private evidence of compatible views could help participants judge when and how to speak, while leaving disclosure in their hands."
				]
			},
			{
				label: "Interaction design",
				title: "A private cue, followed by a choice.",
				paragraphs: [
					"Participants speak privately or type a thought. The system turns it into an editable Idea Block visible only to its author. AI compares blocks about the same task item and signals compatible positions, distinguishing shared reasoning from different reasons for a compatible recommendation.",
					"A cue does not reveal the other participant’s identity or full private note. Its recipient can inspect or dismiss it, exchange a reason with the anonymous counterpart, publish their own block to the meeting chat, or leave it private."
				]
			},
			{
				label: "Contribution & studies",
				title: "Build the system, then examine its tradeoffs.",
				paragraphs: [
					"I contributed foundational software and experimental infrastructure, initially integrating Jitsi, Whisper, and the ChatGPT API, and worked with the team on system design and study execution. The project was presented as a TAICHI 2026 poster.",
					"Two formative studies examined cue and no-cue conditions in group reasoning and visual-design tasks. Some participants found cues reassuring; others saw a matching idea as a reason to wait, or worried about unmatched opinions. The findings made manual release control central to the design: support should help people choose, rather than decide that every private idea must become public."
				]
			}
		]
	},
	"zh-Hant": {
		type: "人機互動研究",
		headline: "在開口前，\n看見相近的想法。",
		introduction: "OmniObserve 探索線上會議中，從「有個想法」到「願意說出口」之間的距離。系統將私下表達的想法整理成卡片，以匿名 AI 提示找出相容的觀點，再由參與者決定是否帶進公開討論。",
		imageAlt: "OmniObserve 的海上求生任務介面，包含公開與私人排序，以及帶有匿名相似性提示的可編輯想法卡片",
		card: {
			type: "人機互動研究",
			summary: "透過私人想法卡片與匿名 AI 提示，發現線上會議中尚未說出口的相容觀點。何時公開、分享哪些內容，仍由參與者決定。",
			metric: "TAICHI 2026 海報發表"
		},
		role: "研究協作・系統開發與實驗執行",
		status: "研究原型 · TAICHI 2026 海報發表",
		externalLabel: "閱讀研究介紹",

		credits: "與陽明交大 HAIX Lab 的 Shih-Kai Hong、Ethel Yu-Tsen Hsiao、Yi-Jie Chen、Jason Zhi-Jun Chang 及 Grace Yu-Chun Yen 共同研究。介面圖片：OmniObserve 研究團隊，CC BY-SA 4.0。",
		sections: [
			{
				label: "研究問題",
				title: "沒有說出口，不代表沒有想法。",
				paragraphs: [
					"在會議中，人們可能擔心尚未成熟的意見遭到否定，也可能不確定是否有人抱持相似的理由，因此選擇暫時沉默。公開逐字稿記錄了說出口的內容，卻看不見那些還留在心裡的想法。",
					"我們想了解：如果能先私下看見他人與自己觀點相容的線索，是否能幫助參與者判斷何時、如何加入討論，同時保有不公開的選擇？"
				]
			},
			{
				label: "互動設計",
				title: "先收到線索，再決定要不要分享。",
				paragraphs: [
					"參與者可以透過私人語音或文字輸入想法，系統將內容整理成只有本人能看見、可以修改的 Idea Block。AI 比對針對同一任務項目的卡片，辨識立場相容的觀點，再區分彼此是理由相同，還是出於不同理由而提出相容的建議。",
					"提示不會揭露對方身分或完整私人內容。收到提示後，參與者可以檢視或忽略、與匿名對象交換相關理由、將自己的卡片發到公開聊天室，也可以繼續保留在私人空間。"
				]
			},
			{
				label: "參與與實驗",
				title: "把系統做出來，也檢視它帶來的取捨。",
				paragraphs: [
					"我參與基礎軟體與實驗環境的建置，初期整合 Jitsi、Whisper 與 ChatGPT API，並與團隊共同進行系統設計及實驗執行。研究以海報形式於 TAICHI 2026 發表。",
					"兩項形成性研究在團體推理與視覺設計任務中，觀察有提示與無提示時的互動。部分參與者因相似觀點而安心，也有人覺得既然想法重複就先不說，或更擔心沒有配對的意見。這些發現讓自主公開成為設計重點：系統提供判斷的依據，而分享的決定留給本人。"
				]
			}
		]
	},
	"zh-Hans": {
		type: "人机交互研究",
		headline: "在开口前，\n看见相近的想法。",
		introduction: "OmniObserve 探索线上会议中，从“有个想法”到“愿意说出口”之间的距离。系统将私下表达的想法整理成卡片，以匿名 AI 提示找出相容的观点，再由参与者决定是否带进公开讨论。",
		imageAlt: "OmniObserve 的海上求生任务界面，包含公开与私人排序，以及带有匿名相似性提示的可编辑想法卡片",
		card: {
			type: "人机交互研究",
			summary: "通过私人想法卡片与匿名 AI 提示，发现线上会议中尚未说出口的相容观点。何时公开、分享哪些内容，仍由参与者决定。",
			metric: "TAICHI 2026 海报展示"
		},
		role: "研究协作・系统开发与实验执行",
		status: "研究原型 · TAICHI 2026 海报发表",
		externalLabel: "阅读研究介绍",

		credits: "与阳明交大 HAIX Lab 的 Shih-Kai Hong、Ethel Yu-Tsen Hsiao、Yi-Jie Chen、Jason Zhi-Jun Chang 及 Grace Yu-Chun Yen 共同研究。界面图片：OmniObserve 研究团队，CC BY-SA 4.0。",
		sections: [
			{
				label: "研究问题",
				title: "没有说出口，不代表没有想法。",
				paragraphs: [
					"在会议中，人们可能担心尚未成熟的意见遭到否定，也可能不确定是否有人抱持相似的理由，因此选择暂时沉默。公开逐字稿记录了说出口的内容，却看不见那些还留在心里的想法。",
					"我们想了解：如果能先私下看见他人与自己观点相容的线索，是否能帮助参与者判断何时、如何加入讨论，同时保有不公开的选择？"
				]
			},
			{
				label: "交互设计",
				title: "先收到线索，再决定要不要分享。",
				paragraphs: [
					"参与者可以通过私人语音或文字输入想法，系统将内容整理成只有本人能看见、可以修改的 Idea Block。AI 比对针对同一任务项目的卡片，识别立场相容的观点，再区分彼此是理由相同，还是出于不同理由而提出相容的建议。",
					"提示不会揭露对方身份或完整私人内容。收到提示后，参与者可以查看或忽略、与匿名对象交换相关理由、将自己的卡片发到公开聊天室，也可以继续保留在私人空间。"
				]
			},
			{
				label: "参与与实验",
				title: "把系统做出来，也检视它带来的取舍。",
				paragraphs: [
					"我参与基础软件与实验环境的搭建，初期整合 Jitsi、Whisper 与 ChatGPT API，并与团队共同进行系统设计及实验执行。研究以海报形式于 TAICHI 2026 展示。",
					"两项形成性研究在团体推理与视觉设计任务中，观察有提示与无提示时的互动。部分参与者因相似观点而安心，也有人觉得既然想法重复就先不说，或更担心没有配对的意见。这些发现让自主公开成为设计重点：系统提供判断的依据，而分享的决定留给本人。"
				]
			}
		]
	}
} satisfies Record<Locale, ProjectCopy>;
