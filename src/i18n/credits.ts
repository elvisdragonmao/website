import type { Locale } from "./index";

interface CreditsCopy {
	title: string;
	description: string;
	region: string;
	play: string;
	pause: string;
	playLabel: string;
	pauseLabel: string;
	sections: Record<"design" | "libraries" | "typeface" | "icons" | "model" | "artwork" | "map" | "inspiration" | "tools", string>;
	details: Record<"simpleIcons" | "novabeast" | "profile" | "furry" | "kendrick" | "porter" | "trump" | "map", string>;
}
const creditsCopy = {
	en: {
		title: "Acknowledgements",
		description: "The people, artwork and tools behind Elvis Mao’s website.",
		region: "Acknowledgements. Scroll to read the credits.",
		play: "[play]",
		pause: "[pause]",
		playLabel: "Play automatic credits",
		pauseLabel: "Pause automatic credits",
		sections: {
			design: "Design / Develop by",
			libraries: "Libraries",
			typeface: "Typeface",
			icons: "Icons & Logos",
			model: "Character Model",
			artwork: "Photography & Artwork",
			map: "Map Data",
			inspiration: "Visual Inspiration",
			tools: "Tools"
		},
		details: {
			simpleIcons: "Technology logos, adapted into ASCII · CC0 1.0",
			novabeast: "Adapted for the web, with gaze controls and blinking.",
			profile: "Profile illustration",
			furry: "Furry · 2025 UTFG · CC BY-NC",
			kendrick: "Cut-out and monochrome ASCII adaptation.",
			porter: "Supplied / The Independent",
			trump: "Photo by Doug Mills / The New York Times via AP, Pool",
			map: "Public domain · simplified for the ASCII globe"
		}
	},
	"zh-Hant": {
		title: "致謝",
		description: "Elvis Mao 網站背後的人們、創作與工具。",
		region: "致謝名單。捲動以閱讀製作團隊與素材來源。",
		play: "[播放]",
		pause: "[暫停]",
		playLabel: "播放自動捲動的致謝名單",
		pauseLabel: "暫停自動捲動的致謝名單",
		sections: {
			design: "設計與開發",
			libraries: "程式函式庫",
			typeface: "字體",
			icons: "圖示與標誌",
			model: "角色模型",
			artwork: "攝影與美術",
			map: "地圖資料",
			inspiration: "視覺靈感",
			tools: "工具"
		},
		details: {
			simpleIcons: "技術標誌，改編為 ASCII · CC0 1.0",
			novabeast: "調整為網頁使用，加入視線控制與眨眼。",
			profile: "個人肖像插畫",
			furry: "獸裝攝影 · 2025 UTFG · CC BY-NC",
			kendrick: "去背並改編為單色 ASCII。",
			porter: "圖片提供 / The Independent",
			trump: "攝影：Doug Mills / The New York Times，經 AP 提供（Pool）",
			map: "公眾領域 · 簡化後用於 ASCII 地球"
		}
	},
	"zh-Hans": {
		title: "致谢",
		description: "Elvis Mao 网站背后的人们、创作与工具。",
		region: "致谢名单。滚动以阅读制作团队与素材来源。",
		play: "[播放]",
		pause: "[暂停]",
		playLabel: "播放自动滚动的致谢名单",
		pauseLabel: "暂停自动滚动的致谢名单",
		sections: { design: "设计与开发", libraries: "程序库", typeface: "字体", icons: "图标与标志", model: "角色模型", artwork: "摄影与美术", map: "地图数据", inspiration: "视觉灵感", tools: "工具" },
		details: {
			simpleIcons: "技术标志，改编为 ASCII · CC0 1.0",
			novabeast: "调整为网页使用，加入视线控制与眨眼。",
			profile: "个人肖像插画",
			furry: "兽装摄影 · 2025 UTFG · CC BY-NC",
			kendrick: "抠图并改编为单色 ASCII。",
			porter: "图片提供 / The Independent",
			trump: "摄影：Doug Mills / The New York Times，经 AP 提供（Pool）",
			map: "公共领域 · 简化后用于 ASCII 地球"
		}
	}
} satisfies Record<Locale, CreditsCopy>;
export const getCreditsCopy = (locale: Locale): CreditsCopy => creditsCopy[locale];
