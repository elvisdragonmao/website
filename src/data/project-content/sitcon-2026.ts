import type { Locale } from "../../i18n";
import type { ProjectCopy } from "../project-types";

/** Interaction details checked against https://github.com/sitcon-tw/2026. */
export const sitconContent = {
	en: {
		type: "INTERACTIVE CONFERENCE WEBSITE",
		headline: "Jam\nthe Chaos.",
		introduction:
			"A website that turns SITCON 2026's theme of improvisation and collaboration into something visitors can play with: a draggable 3D vortex, a personal agenda with physics, and an explorable venue map.",
		imageAlt: "SITCON 2026's Jam the Chaos website with orbiting geometric objects",
		card: {
			type: "Creative direction & interactive web",
			summary:
				"The largest student community in East Asia. From dynamic vortexes to modeling the Academia Sinica venue, the project features complex 3D effects and a variety of creative special effects.",
			metric: "Awwwards Nominee"
		},
		role: "Visual & interaction design, website development lead",
		status: "Conference held March 28, 2026",
		externalLabel: "Visit SITCON 2026",
		metric: "Awwwards",
		metricLabel: "Nominee",
		credits: "Created with the SITCON 2026 design and development teams.",
		sections: [
			{
				label: "THE DIRECTION",
				title: "Give the audience a part to play.",
				paragraphs: [
					"Jam the Chaos draws on musical improvisation to explore collaboration in a world reshaped by AI. The website gives that idea a physical form: metallic shapes and light trails share a rising vortex, with room for the visitor to interrupt their rhythm.",
					"The opening scene runs in Three.js. Scrolling changes its rotation and camera framing, while individual objects can be grabbed and moved out of orbit. The composition keeps changing through the visitor's actions, carrying the theme beyond a title and a static key visual."
				]
			},
			{
				label: "THE INTERACTIONS",
				title: "Let useful features join the jam.",
				paragraphs: [
					"Attendees can bookmark sessions and share a personal Jam. In its sharing panel, the selected speakers' portraits become colliding circles simulated with Cannon.js. Dragging the panel changes their momentum; on supported phones, tilting the device changes gravity. A routine sharing action becomes a small, responsive instrument.",
					"The venue guide uses 3D for orientation: visitors can separate the building's floors, select a room and move the camera toward it, or switch to a 2D map. These interactions connect the site's visual language to the practical work of choosing sessions and finding where to go."
				]
			},
			{
				label: "THE DELIVERY",
				title: "An expressive site, built together for a real event.",
				paragraphs: [
					"I contributed visual and interaction design and led an eight-person website development team, working with the conference's design team to bring motion, 3D and event information into one experience. The result belongs to that collaboration, from the opening scene to the programme and venue tools.",
					"The hero reduces its object count on smaller screens, pauses rendering when it leaves the viewport and respects reduced-motion preferences. That attention supports the more ambitious effects on a site people also need for everyday event information. Jam the Chaos received an Awwwards nomination."
				]
			}
		]
	},
	"zh-Hant": {
		type: "互動研討會網站",
		headline: "Jam\nthe Chaos.",
		introduction: "把 SITCON 2026 關於即興與協作的主題，變成能親手參與的網站：可拖曳的 3D 漩渦、帶有物理互動的個人議程，以及能逐層探索的會場地圖。",
		imageAlt: "SITCON 2026 Jam the Chaos 網站與環繞運行的幾何物件",
		card: {
			type: "視覺設計與互動網頁",
			summary: "​學生計算機年會 2026 官網，全​東​亞​最​大​的​學​生​社​群。從動態旋渦到建模中研院會場，複雜的 3D 與各種充滿創意特效。",
			metric: "Awwwards 提名"
		},
		role: "視覺與互動設計、網站開發組長",
		status: "活動於 2026 年 3 月 28 日舉行",
		externalLabel: "前往 SITCON 2026",
		metric: "Awwwards",
		metricLabel: "提名作品",
		credits: "與 SITCON 2026 設計組及網站開發團隊共同製作。",
		sections: [
			{
				label: "設計方向",
				title: "讓觀眾，也成為即興演奏的一員。",
				paragraphs: [
					"Jam the Chaos 以音樂即興合奏為出發點，探討 AI 改變世界之後，人們如何找到新的合作方式。我們讓金屬幾何物件與光帶沿著漩渦向上盤旋，形成共同的節奏，也留下能被訪客打亂的空間。",
					"開場場景以 Three.js 即時呈現。捲動會改變漩渦的旋轉與鏡頭構圖，訪客也可以直接抓住物件，將它拖離軌道。主視覺因此持續回應人的動作，讓即興的概念成為能操作的體驗。"
				]
			},
			{
				label: "互動實作",
				title: "連實用功能，都能一起 Jam。",
				paragraphs: [
					"參加者可以收藏議程，組成並分享自己的 Jam。分享面板會把選中講者的頭像轉為圓球，以 Cannon.js 模擬碰撞；拖動面板會帶動圓球，在支援的手機上傾斜裝置，還能改變重力方向。原本單純的分享動作，因而多了一段隨手就能玩的互動。",
					"會場導覽則讓 3D 協助辨認空間：可以拆開建築樓層、選取房間並讓鏡頭聚焦，也能切回平面地圖。這些互動把網站的視覺語言帶進挑選議程、尋找會場等實際需求。"
				]
			},
			{
				label: "團隊交付",
				title: "一起把大膽的互動，做成活動當天用得上的網站。",
				paragraphs: [
					"我參與視覺與互動設計，並帶領八人的網站開發團隊，與大會設計組共同整合動態效果、3D 場景與活動資訊。從開場到議程及場地工具，都是團隊協作完成的成果。",
					"開場場景會在小螢幕減少物件數量、離開可視範圍時暫停渲染，並回應減少動態效果的系統偏好。這些細節支撐了較大膽的視覺效果，也兼顧查閱活動資訊的使用情境。Jam the Chaos 獲得 Awwwards 提名。"
				]
			}
		]
	},
	"zh-Hans": {
		type: "互动技术大会网站",
		headline: "Jam\nthe Chaos.",
		introduction: "把 SITCON 2026 关于即兴与协作的主题，变成能亲手参与的网站：可拖动的 3D 漩涡、带有物理互动的个人日程，以及能逐层探索的会场地图。",
		imageAlt: "SITCON 2026 Jam the Chaos 网站与环绕运行的几何物体",
		card: {
			type: "视觉设计与互动网页",
			summary: "学生计算机年会 2026 官网，全东亚最大的学生社群。从动态旋涡到建模中研院会场，复杂的 3D 与各种充满创意特效。",
			metric: "Awwwards 提名"
		},
		role: "视觉与交互设计、网站开发负责人",
		status: "活动于 2026 年 3 月 28 日举行",
		externalLabel: "访问 SITCON 2026",
		metric: "Awwwards",
		metricLabel: "提名作品",
		credits: "与 SITCON 2026 设计组及网站开发团队共同制作。",
		sections: [
			{
				label: "设计方向",
				title: "让观众，也成为即兴演奏的一员。",
				paragraphs: [
					"Jam the Chaos 以音乐即兴合奏为出发点，探讨 AI 改变世界之后，人们如何找到新的合作方式。我们让金属几何物体与光带沿着漩涡向上盘旋，形成共同的节奏，也留下能被访客打乱的空间。",
					"开场场景以 Three.js 实时呈现。滚动会改变漩涡的旋转与镜头构图，访客也可以直接抓住物体，将它拖离轨道。主视觉因此持续回应人的动作，让即兴的概念成为能操作的体验。"
				]
			},
			{
				label: "互动实现",
				title: "连实用功能，都能一起 Jam。",
				paragraphs: [
					"参会者可以收藏议程，组成并分享自己的 Jam。分享面板会把选中讲者的头像转为圆球，以 Cannon.js 模拟碰撞；拖动面板会带动圆球，在支持的手机上倾斜设备，还能改变重力方向。原本单纯的分享动作，因此多了一段随手就能玩的互动。",
					"会场导览则让 3D 协助辨认空间：可以拆开建筑楼层、选取房间并让镜头聚焦，也能切回平面地图。这些互动把网站的视觉语言带进挑选议程、寻找会场等实际需求。"
				]
			},
			{
				label: "团队交付",
				title: "一起把大胆的互动，做成活动当天用得上的网站。",
				paragraphs: [
					"我参与视觉与交互设计，并带领八人的网站开发团队，与大会设计组共同整合动态效果、3D 场景与活动信息。从开场到议程及场地工具，都是团队协作完成的成果。",
					"开场场景会在小屏幕减少物体数量、离开可视范围时暂停渲染，并响应减少动态效果的系统偏好。这些细节支撑了较大胆的视觉效果，也兼顾查阅活动信息的使用场景。Jam the Chaos 获得 Awwwards 提名。"
				]
			}
		]
	}
} satisfies Record<Locale, ProjectCopy>;
