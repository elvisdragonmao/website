import type { Locale } from "./index";

// Every message declares all supported locales; missing translations are a type error.
const messages = {
	seoTitle: ["About Elvis Mao — Developer, Designer & HCI Researcher", "關於毛哥EM — 開發者、設計師與人機互動研究者", "关于毛哥EM — 开发者、设计师与人机交互研究者"],
	seoDescription: [
		"Meet Elvis Dragon Mao (毛哥EM), a developer, designer and HCI researcher at NYCU. Explore his research, teaching, open-source projects and creative work.",
		"認識毛哥EM（Elvis Dragon Mao）：開發者、設計師與陽明交大人機互動研究者。探索我的研究、教學、開源專案、創作與經歷。",
		"认识毛哥EM（Elvis Dragon Mao）：开发者、设计师与阳明交大人机交互研究者。探索我的研究、教学、开源项目、创作与经历。"
	],
	roles: ["Developer · Designer · Researcher · Debater", "開發者 · 設計師 · 研究者 · 辯士", "开发者 · 设计师 · 研究者 · 辩手"],
	alias: ["a.k.a. 毛哥EM, EM, Elvis Mao.", "也可以叫我毛哥EM、EM、Elvis Mao。", "也可以叫我毛哥EM、EM、Elvis Mao。"],
	resume: ["resume", "履歷", "简历"],
	touchTitle: ["Touch, I need something more.", "觸碰，讓互動不只如此。", "触碰，让交互不止于此。"],
	touchDescription: [
		"HCI researcher exploring new ways for people and technology to connect. Through movement, touch, and interfaces that go beyond the screen.",
		"我研究人機互動，透過動作、觸覺，以及超越螢幕的介面，探索人與科技連結的新方式。",
		"我研究人机交互，通过动作、触觉，以及超越屏幕的界面，探索人与科技连接的新方式。"
	],
	researchLink: ["Explore my research", "看看我的研究", "看看我的研究"],
	furryTitle: ["Eww! Furry!", "噁！是獸控！", "咦！是兽控！"],
	furryBefore: ["I'm a ", "我是個", "我是个"],
	furryLink: ["furry", "獸控", "兽控"],
	furryAfter: [". I love this wonderfully creative and welcoming community.", "。我喜歡這個充滿創意又友善的社群。", "。我喜欢这个充满创意又友善的社群。"],
	stackTitle: ["Full-Stack Dragon.", "全端龍龍。", "全栈龙龙。"],
	stackDescription: ["I build complex systems and stunning web experiences.", "我打造複雜的系統，也設計讓人眼睛一亮的網頁體驗。", "我打造复杂的系统，也设计让人眼前一亮的网页体验。"],
	workLink: ["Explore my work", "看看我的作品", "看看我的作品"],
	sourceTitle: ["❤️ Open Source.", "❤️ 開源。", "❤️ 开源。"],
	sourceBefore: ["Creator of ", "我開發了 ", "我开发了 "],
	sourceAfter: [", an open-source CJK webfont service.", "，一個開源的中日韓網頁字型服務。", "，一个开源的中日韩网页字体服务。"],
	sourceMetric: ["1.2M+ requests/day.", "每天處理超過 120 萬次請求。", "每天处理超过 120 万次请求。"],
	github: ["View on GitHub", "在 GitHub 上查看", "在 GitHub 上查看"],
	musicTitle: ["EDM / Hip-Hop", "電音 / 嘻哈", "电音 / 嘻哈"],
	musicDescription: [
		"Porter Robinson, Skrillex, Kendrick Lamar, and a lot more.",
		"Porter Robinson、Skrillex、Kendrick Lamar，還有好多好多。",
		"Porter Robinson、Skrillex、Kendrick Lamar，还有好多好多。"
	],
	hardwareTitle: ["Embedded / IoT / 3D Design", "嵌入式 / 物聯網 / 3D 設計", "嵌入式 / 物联网 / 3D 设计"],
	hardwareDescription: [
		"Love working with ESP32, Arduino, sensors, and anything I can solder together.",
		"喜歡玩 ESP32、Arduino、感測器，還有各種能焊在一起的東西。",
		"喜欢玩 ESP32、Arduino、传感器，还有各种能焊在一起的东西。"
	],
	motto: ["motto", "座右銘", "座右铭"],
	mottoFirst: ["Because It's", "因為", "因为"],
	mottoSecond: ["Absurd,", "荒謬，", "荒谬，"],
	mottoThird: ["I Believe.", "所以我相信。", "所以我相信。"],
	cameraTitle: ["I Shoot People.", "我拍人。", "我拍人。"],
	cameraDescription: ["With cameras, capture every touching moment.", "用相機，留住每個動人的瞬間。", "用相机，留住每个动人的瞬间。"],
	debateTitle: ["I argue with people.", "我和人辯論。", "我和人辩论。"],
	debateDescription: [
		"Public Forum debate instructor and adjudicator. Also done Policy, WS, BP, and Extemp.",
		"擔任公共論壇式辯論教練與評審，也參與過政策辯論、世界學校制、英國議會制與即席演講。",
		"担任公共论坛式辩论教练与评审，也参与过政策辩论、世界学校制、英国议会制与即席演讲。"
	],
	broadcastTitle: ["Behind the Screens.", "螢幕背後的我。", "屏幕背后的我。"],
	broadcastDescription: ["I do PA and live broadcasting for event I love.", "為我喜歡的活動負責現場音響與直播。", "为我喜欢的活动负责现场音响与直播。"],
	statementFirst: ["When I learned to truly love myself,", "當我學會真正愛自己，", "当我学会真正爱自己，"],
	statementSecond: ["I stopped chasing grand futures.", "我不再追逐宏大的未來。", "我不再追逐宏大的未来。"],
	statementThird: ["I simply do what I love, my way, at my own rhythm.", "只是用自己的方式與步調，做喜歡的事。", "只是用自己的方式与步调，做喜欢的事。"],
	experience: ["Experience", "經歷", "经历"],
	fullCV: ["Full CV", "完整履歷", "完整简历"],
	research: ["Selected Research", "研究選集", "研究选集"],
	interests: [
		"Human–AI Interaction · Interactive Systems · Speech Interfaces · Computer Vision · Wearable & Embedded Computing · Creative Support Tools",
		"人與 AI 互動 · 互動系統 · 語音介面 · 電腦視覺 · 穿戴式與嵌入式運算 · 創意支援工具",
		"人与 AI 交互 · 交互系统 · 语音界面 · 计算机视觉 · 可穿戴与嵌入式计算 · 创意支持工具"
	],
	paper: ["OmniObserve: Revealing Hidden Consensus in Online Meetings", "OmniObserve：揭示線上會議中隱藏的共識", "OmniObserve：揭示线上会议中隐藏的共识"],
	poster: ["TAICHI 2026 · Poster", "TAICHI 2026 · 海報論文", "TAICHI 2026 · 海报论文"],
	currentResearch: ["Current Research", "進行中的研究", "进行中的研究"],
	policeResearch: [
		"AI Assistance for Police Workflows (ft. Hsinchu Criminal Investigation Corps)",
		"以 AI 輔助警察工作流程（與新竹刑事警察大隊合作）",
		"以 AI 辅助警察工作流程（与新竹刑事警察大队合作）"
	],
	fursuitResearch: ["Fursuit Identity Retrieval and Recognition from 2D Images", "從 2D 影像檢索與辨識獸裝身分", "从 2D 图像检索与识别兽装身份"],
	awards: ["Honors & Awards", "榮譽與獎項", "荣誉与奖项"],
	otherAwards: ["Other Web Design Awards", "其他網頁設計獎項", "其他网页设计奖项"],
	talks: ["Talks & Teaching", "演講與教學", "演讲与教学"],
	filterYear: ["Filter by year", "依年份篩選", "按年份筛选"],
	filterYearHint: ["Filter {year}; select again to show all years", "篩選 {year} 年；再次選取可顯示所有年份", "筛选 {year} 年；再次选择可显示所有年份"],
	searchTalks: ["Search talks and teaching", "搜尋演講與教學", "搜索演讲与教学"],
	year: ["Year", "年份", "年份"],
	course: ["Talk / Course", "演講 / 課程", "演讲 / 课程"],
	venue: ["Venue", "場合", "场合"],
	shortcuts: ["Teaching monitor shortcuts", "演講與教學表格快捷鍵", "演讲与教学表格快捷键"],
	reset: ["Reset filters", "重設篩選條件", "重置筛选条件"],
	contactTitle: ["What's up bro!", "嗨，朋友！", "嗨，朋友！"],
	verse: ["--2 Samuel 20:9", "——撒母耳記下 20:9", "——撒母耳记下 20:9"],
	contact: ["Feel free to reach out for research, commission, or just to say hi!", "歡迎找我聊研究、委託合作，或只是打個招呼！", "欢迎找我聊研究、委托合作，或只是打个招呼！"],
	people: ["Color the passing ASCII people with the crosshair", "用準星替經過的 ASCII 小人上色", "用准星替经过的 ASCII 小人上色"],
	colorPerson: ["Color person {number}", "替第 {number} 個小人上色", "给第 {number} 个小人上色"],
	coloredPerson: ["Person {number}, in color", "第 {number} 個小人，已上色", "第 {number} 个小人，已上色"],
	coloredStatus: ["{count} of {total} people in color.", "已替 {total} 個小人中的 {count} 個上色。", "已给 {total} 个小人中的 {count} 个上色。"]
} satisfies Record<string, [string, string, string]>;

export function aboutText(locale: Locale, key: keyof typeof messages, params: Record<string, string | number> = {}): string {
	const value = messages[key][locale === "en" ? 0 : locale === "zh-Hant" ? 1 : 2];
	return value.replace(/\{(\w+)\}/g, (_, name: string) => String(params[name] ?? `{${name}}`));
}
