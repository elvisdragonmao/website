import type { Locale } from "../i18n/index";
import { awards, experiences, otherRecognition, talks } from "./about";

type Pair = readonly [string, string];
const experienceCopy = {
	debate: { role: ["英語辯論教練與評審", "英语辩论教练与评审"], organization: ["Ascent Academy", "Ascent Academy"] },
	haix: { role: ["系統管理員暨大學部研究員", "系统管理员暨本科生研究员"], organization: ["國立陽明交通大學 HAIX Lab", "国立阳明交通大学 HAIX Lab"] },
	independent: { role: ["獨立開發者與設計師", "独立开发者与设计师"] },
	sitcon: { role: ["開發組組長", "开发组组长"], organization: ["SITCON", "SITCON"] },
	bamboofox: { role: ["社長", "社长"], organization: ["陽明交大 BambooFox 資安社", "阳明交大 BambooFox 信息安全社"] },
	awwwards: { role: ["青年評審", "青年评审"], organization: ["Awwwards", "Awwwards"] }
} satisfies Record<(typeof experiences)[number]["id"], { role: Pair; organization?: Pair }>;

const talkCopy = {
	react: { title: ["React 前端開發入門", "React 前端开发入门"], context: ["陽明交大春季課程，2 學分", "阳明交大春季课程，2 学分"] },
	"monthly-workshops": { title: ["每月技術與創作工作坊", "每月技术与创作工作坊"], context: ["陽明交大資傳社", "阳明交大资传社"] },
	"frontend-workshop": { title: ["前端開發工作坊", "前端开发工作坊"], context: ["清華大學服務科學研究所", "清华大学服务科学研究所"] },
	"more-than-css": { title: ["不只是 CSS", "不只是 CSS"], context: ["SITCON 夏令營，選修課程", "SITCON 夏令营，选修课程"] },
	"frontend-math": { title: ["前端特效：國中數學就夠了", "前端特效：初中数学就够了"], context: ["SITCON", "SITCON"] },
	"scaict-open-source": { title: ["通往自由之路：SCAICT 的開源旅程", "通往自由之路：SCAICT 的开源旅程"], context: ["COSCUP", "COSCUP"] },
	"iphone-programming": { title: ["從捷徑到終端機：iPhone 上的程式設計之旅", "从快捷指令到终端：iPhone 上的编程之旅"], context: ["SITCON", "SITCON"] },
	community: { title: ["社群經營", "社群经营"], context: ["AIS3 Club", "AIS3 Club"] },
	"python-camp": { title: ["Python 程式營", "Python 编程营"], context: ["SYTV，教育部國教署", "SYTV，教育部国教署"] },
	"line-bot": { title: ["LINE 機器人", "LINE 机器人"], context: ["SCAICT 國中課程", "SCAICT 初中课程"] },
	arduino: { title: ["玩轉 Arduino", "玩转 Arduino"], context: ["SYTV，教育部國教署", "SYTV，教育部国教署"] },
	phishing: { title: ["美術設計與釣魚網站工作坊", "美术设计与钓鱼网站工作坊"], context: ["SCAICT 寒訓", "SCAICT 冬季训练营"] },
	"digital-notes": { title: ["數位筆記技巧", "数字笔记技巧"], context: ["Apple Straight A", "Apple Straight A"] },
	scraping: { title: ["網頁爬蟲", "网页爬虫"], context: ["SCAICT 聯合迎新", "SCAICT 联合迎新"] },
	"web-design": { title: ["網頁設計", "网页设计"], context: ["SCAICT 十月主題課程", "SCAICT 十月主题课程"] },
	"web-microcourse": { title: ["網頁設計微課程", "网页设计微课程"], context: ["市立西苑高中", "市立西苑高中"] },
	"debate-host": { title: ["英語辯論關主", "英语辩论关卡主持"], context: ["臺中青年計畫", "台中青年计划"] },
	"web-workshop": { title: ["網頁設計工作坊", "网页设计工作坊"], context: ["SYTV，教育部國教署", "SYTV，教育部国教署"] },
	"python-scraping": { title: ["Python 網頁爬蟲工作坊", "Python 网页爬虫工作坊"], context: ["SYTV，教育部國教署", "SYTV，教育部国教署"] },
	"css-animation": { title: ["玩轉 CSS：打造驚豔動畫", "玩转 CSS：打造惊艳动画"], context: ["曉明女中", "晓明女中"] },
	"advanced-c": { title: ["進階 C 語言程式營", "进阶 C 语言编程营"], context: ["SYTV", "SYTV"] },
	iot: { title: ["物聯網應用", "物联网应用"], context: ["SYTV", "SYTV"] }
} satisfies Record<(typeof talks)[number]["id"], { title: Pair; context: Pair }>;

const awardCopy = {
	omniobserve: { title: ["佳作", "佳作"], context: ["陽明交大資工專題競賽，", "阳明交大计算机科学专题竞赛，"] },
	"sitcon-website": { title: ["Awwwards 入圍", "Awwwards 入围"], context: ["SITCON 2026 官網", "SITCON 2026 官网"] },
	pitch: { title: ["銅牌", "铜牌"], context: ["陽明交大 Pitch 黑客松", "阳明交大 Pitch 黑客松"] },
	hitcon: { title: ["冠軍", "冠军"], context: ["HITCON CTF 表演賽，BambooFox", "HITCON CTF 表演赛，BambooFox"] },
	"policy-hack": { title: ["創意獎", "创意奖"], context: ["新竹政策黑客松", "新竹政策黑客松"] },
	"pf-champion": { title: ["公共論壇式辯論冠軍", "公共论坛式辩论冠军"], context: ["新竹中信基金會演講辯論公開邀請賽", "新竹中信基金会演讲辩论公开邀请赛"] },
	"pf-team": { title: ["優勝隊伍暨優良辯士", "优胜队伍暨优秀辩手"], context: ["全國高中英語公共論壇式辯論比賽，中區賽", "全国高中英语公共论坛式辩论比赛，中区赛"] },
	awwwards: { title: ["Awwwards 榮譽獎", "Awwwards 荣誉奖"], context: ["elvismao.com", "elvismao.com"] },
	"sitcon-hack": { title: ["最佳技術獎", "最佳技术奖"], context: ["SITCON 黑客松", "SITCON 黑客松"] },
	"ironman-devops": { title: ["DevOps 組佳作", "DevOps 组佳作"], context: ["iThome 鐵人賽", "iThome 铁人赛"] },
	"outstanding-youth": { title: ["臺中市優秀青年", "台中市优秀青年"] },
	science: { title: ["銅牌", "铜牌"], context: ["仰望盃全國科學 HomeRun 競賽", "仰望杯全国科学 HomeRun 竞赛"] },
	"pf-judge": { title: ["評審特別獎暨優良辯士", "评审特别奖暨优秀辩手"], context: ["全國高中英語公共論壇式辯論比賽，中區賽", "全国高中英语公共论坛式辩论比赛，中区赛"] },
	"ironman-css": { title: ["iThome 鐵人賽", "iThome 铁人赛"], context: ["不用套件也很酷：玩轉 CSS 與 JS 特效", "不用套件也很酷：玩转 CSS 与 JS 特效"] }
} satisfies Record<(typeof awards)[number]["items"][number]["id"], { title: Pair; context?: Pair }>;

const recognitionCopy: readonly Pair[] = [
	["CSSREELS — 精選作品", "CSSREELS — 精选作品"],
	["CSS Light — 每日精選", "CSS Light — 每日精选"],
	["TopDesignKing — 每日之王", "TopDesignKing — 每日之王"],
	["Top CSS Gallery", "Top CSS Gallery"],
	["Web Guru Award — 每日達人", "Web Guru Award — 每日达人"]
];

/** Dates, ordering, IDs and project references remain shared with the English data. */
export function getAboutData(locale: Locale) {
	const pick = (text: Pair) => text[locale === "zh-Hant" ? 0 : 1];
	return {
		experiences: experiences.map(item => {
			const copy: { role: Pair; organization?: Pair } = experienceCopy[item.id];
			return {
				...item,
				years: locale === "en" ? item.years : item.years.replace("Present", "至今"),
				role: locale === "en" ? item.role : pick(copy.role),
				organization: locale === "en" ? ("organization" in item ? item.organization : undefined) : copy.organization ? pick(copy.organization) : undefined
			};
		}),
		talks: talks.map(item => ({ ...item, title: locale === "en" ? item.title : pick(talkCopy[item.id].title), context: locale === "en" ? item.context : pick(talkCopy[item.id].context) })),
		awards: awards.map(group => ({
			...group,
			items: group.items.map(item => {
				const copy: { title: Pair; context?: Pair } = awardCopy[item.id];
				return {
					...item,
					title: locale === "en" ? item.title : pick(copy.title),
					context: locale === "en" ? ("context" in item ? item.context : undefined) : copy.context ? pick(copy.context) : undefined
				};
			})
		})),
		otherRecognition: locale === "en" ? otherRecognition : recognitionCopy.map(pick)
	};
}
