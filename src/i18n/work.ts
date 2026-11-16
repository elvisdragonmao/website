import catalog from "../data/work-projects.json";
import type { Locale } from "./index";

type ProjectText = { title: string; description: string };
const zhHant = {
	"project-2228b65ade6c": ["emfont", "免費、開源的中日韓網頁字型服務，每日處理超過 120 萬次請求。"],
	"project-94188e5ad55a": ["emtech", "分享程式設計、設計與生活經驗的文章和教學。"],
	"project-7ae453884cff": ["SITCON 2026", "東亞最大的學生資訊年會官方網站，結合豐富的動畫，獲 Awwwards 提名。"],
	"project-fe415b2716d8": ["WinstonBot", "檢查中文用詞、拼字與專有名詞大小寫的網站及 Discord 機器人。"],
	"project-10d74e054fe0": ["SITCON 影片播放器", "在瀏覽器中自動循環播放指定的 SITCON 開場影片，供會場使用。"],
	"project-27d85eef1a82": ["因材網影片搜尋機器人", "透過 LINE 搜尋、觀看因材網教學影片的機器人。"],
	"project-80b7c9cfbe60": ["請隨手關門", "以 micro:bit 製作的門未關警報器，開門超過五秒就會發出提示音。"],
	"project-83f195f132e9": ["文字格式整理工具", "移除複製文字中多餘的空白、換行及指定字元。"],
	"project-9b1f7bbab098": ["食物人格測驗", "透過輕鬆有趣的性格測驗，找出與你最相似的食物。"],
	"project-36a3dfcb20be": ["NiceFormat", "將圖片拖曳至桌面執行檔，即可轉換為 WebP 格式。"],
	"project-3495c881bc5f": ["QR Code 產生器", "將文字或連結轉換成 QR Code，並即時預覽結果。"],
	"project-0698d55ac00d": ["CSS 濾鏡產生器", "找出能將圖示調整為指定顏色的 CSS 濾鏡。"],
	"project-a7f09cab2b51": ["螢幕錄影工具", "直接在瀏覽器中錄製螢幕，無須安裝應用程式。"],
	"project-bbe906460d8b": ["StandBy", "以 iOS 待機模式為靈感的瀏覽器時鐘。"],
	"project-3779ca464d7d": ["西苑高中上下課倒數", "即時顯示西苑高中距離上課、下課的剩餘時間。"],
	"project-1098f31e41f8": ["EM Linkbot", "快速搜尋維基百科及其他網路資料的 LINE 機器人。"],
	"project-487bd86c692c": ["EM-SFW 攝影機檢視器", "在瀏覽器中查看攝影機畫面，並調整畫面翻轉方向。"],
	"project-b9feb9da4f97": ["ClipCC", "以 Scratch 為基礎的程式編輯器，支援擴充功能、可調整的影格率與更多繪圖功能。"],
	"project-5f786bfed363": ["303 班數位畢業紀念冊", "收錄 303 班照片與共同回憶的數位畢業紀念冊。"],
	"project-06657ed6b0e5": ["iPhone 3D Touch 電子秤", "利用 iPhone 觸控壓力感測來估算重量的實驗。"],
	"project-cb7a9658ea31": ["Fullstack", "以 HTML 核取方塊製作的小型堆疊遊戲。"],
	"project-c6d7fc22ad42": ["黃金比例配色產生器", "利用黃金比例產生配色方案。"],
	"project-87a114165314": ["背景配色實驗室", "以整個瀏覽器視窗預覽純色與漸層背景。"],
	"project-35275112e415": ["數位時鐘", "以大型漸層數字顯示時間的全螢幕數位時鐘。"],
	"project-18609bf2f330": ["叫號顯示器", "在瀏覽器中顯示排隊號碼的簡易叫號工具。"],
	"project-75914510164a": ["辯論計時器", "支援聲音提示的瀏覽器辯論發言計時器。"],
	"project-0df77c226f99": ["LINE Flex 訊息傳送工具", "透過瀏覽器介面編輯、分享 LINE Flex 訊息。"],
	"project-9e9d2d2f89fc": ["電桿牌猜猜看", "練習在 GeoGuessr 中判讀臺灣電桿牌座標的小遊戲。"],
	"project-c77481a40d29": ["macOS 螢幕使用時間分析", "將 macOS 應用程式使用紀錄呈現為每日使用時段、時間軸與統計資料。"],
	"project-82786e1906be": ["座位表產生器", "產生座位表、隨機排列，並透過拖曳調整座位。"],
	"project-1d56cfca60fd": ["簡易文字展示", "以簡潔的全螢幕瀏覽器畫面展示短訊息。"],
	"project-0e9ec486c444": ["色彩倒數計時", "透過背景顏色的變化呈現時間流逝的倒數計時器。"],
	"project-b6e203c6ac06": ["少年殺人事件 — Album OS", "結合可拖曳視窗、歌詞、維基與匿名聊天室的專輯網站。"],
	"project-94104dbc37f0": ["FurryTeaParty 2027", "FurryTeaParty 2027 活動的官方網站與內容管理系統。"],
	"project-ae5f91956fce": ["HUAN 讙", "遠端管理多台裝置播放內容與排程的媒體播放及數位看板系統。"],
	"project-bb0858634f4b": ["superfile", "提供現代化介面的終端機檔案管理器，讓檔案瀏覽與整理更方便。"],
	"project-8c9b08ac27af": ["nycu.club 網域控制台", "讓授權社團成員管理所屬 nycu.club 命名空間內 DNS 紀錄的網域控制台。"],
	"project-3dd80f2af055": ["EM3", "以更簡潔的介面整合課程、教材、作業與成績的 Moodle 用戶端。"],
	"project-6cd36fddb0fe": ["Netstamp", "透過自行掌控的探測節點收集測量資料的開源網路監測平台。"],
	"project-69bd61cb6abe": ["olowo", "第三方 oloo 用戶端，整合站點地圖、電池資訊、租車與騎乘紀錄。"],
	"project-24f31af8f06d": ["embate", "協助辯論裁判整理論點、連結回應，並記錄發言與準備時間的工具。"],
	"project-14511a6af22d": ["Spotify Soloist Display", "以全螢幕呈現 Spotify 專輯動態封面、播放資訊與同步歌詞。"],
	"project-4c0c3250e9df": ["開發者工具集", "收集可重用的 Git 設定、GitHub Actions、格式設定與專案建置筆記。"],
	"project-54fe1cd4bad7": ["oloo 在哪裡？", "分析陽明交大各校區 oloo 共享電動機車的可借用情況。"],
	"project-472f51d9a1f8": ["SITCON Tickets", "SITCON 活動的報名系統。"],
	"project-ae70aa908c38": ["Mac 設定指南", "協助設定與配置新 Mac 的實用指南。"],
	"project-049519487d24": ["本機逐字稿工具", "在本機轉錄音訊、辨識說話者，並將 AI 產生的筆記整理至 Obsidian 的工作流程。"],
	"project-9fea674d9967": ["MR18 Launchpad", "以 Raspberry Pi 將 Novation Launchpad Mini 轉為 MIDAS MR18 混音器控制介面的橋接工具。"],
	"project-d31167a3a983": ["emvnc", "用於連線遠端桌面的原生開源 macOS VNC 檢視器。"],
	"project-ed830934a1ee": ["公開簡報", "收錄 Elvis Mao 的公開演講簡報。"],
	"project-5529aba06913": ["BambooFox 收據寄送工具", "根據 CSV 名單，以電子郵件寄送社費收據的命令列工具。"],
	"project-64cecdd0b208": ["Linyao Design System", "整合共用設計變數、主題與無障礙互動模式的 React 元件庫。"],
	"project-abff1a3fc6ef": ["SCAICT Discord 機器人", "為 SCAICT 社群製作的貓咪主題 Discord 機器人。"],
	"project-51bfe7c46457": ["SCAICT 官方網站", "SCAICT 學生資訊社群的官方網站。"],
	"project-0748b0d0dc54": ["emjudge", "支援提交前端作業並自動評分的平台。"],
	"project-a8b3c30480c7": ["BambooFox 官方網站", "整合活動、資安教學、解題紀錄與社團資訊的 BambooFox 社群網站。"],
	"project-79858acd18e3": ["SDC 核心系統", "為陽明交大 SDC 製作的表單平台，提供登入、資料提交與管理後台。"],
	"project-ab951dc179f1": ["陽明交大失物招領", "收集陽明交大失物招領公告的爬蟲。"],
	"project-4a74b39175ef": ["SCAICT 2024 聯合寒訓", "SCAICT 2024 年聯合寒訓的活動網站。"],
	"project-ac37cee64589": ["SITCON 2026 閃電秀", "讓觀眾用手機將頭像球發射至共用物理模擬畫面的互動系統。"],
	"project-2f26531f26ce": ["SITCON 2026 大會遊戲", "為 SITCON 2026 參加者製作的網頁遊戲。"],
	"project-f87ee59b24cf": ["陽明交大圖書館空間查詢", "查詢陽明交大圖書館空間空位與預約研讀空間的替代介面。"],
	"project-d6a0e601c207": ["embox", "提供檔案上傳與下載的簡易網站。"],
	"project-43aba731ab2f": ["The Ambivalent Facade", "為個展 The Ambivalent Facade 製作的網站。"],
	"project-91e46c059b9c": ["SITCON 2026 贊助計畫", "SITCON 2026 贊助方案的網頁版介紹。"],
	"project-b6b9d42170bc": ["SITCON Camp 2025 點數交易所", "為 SITCON Camp 2025 製作的虛擬點數交易系統，整合市場圖表、排行榜與 Telegram 機器人。"],
	"project-e6b511d9fccd": ["語音轉 Telegram", "透過 Whisper 將麥克風音訊轉為文字，並傳送至 Telegram 群組。"],
	"project-b43b1bbe2d8a": ["SITCON Camp 2025 遊樂場", "為 SITCON Camp 2025 製作的瀏覽器小遊戲集。"],
	"project-342adcf0b644": ["SITCON Camp 2025", "SITCON Camp 2025 的活動網站專案。"],
	"project-26d29d982dc9": ["emblog", "採用單頁介面、已停止維護的靜態部落格產生器。"],
	"project-82bc1e3cea91": ["關鍵評論網文章下載器", "下載關鍵評論網文章的工具。"],
	"project-280207174884": ["TOTP4All", "在瀏覽器中管理限時一次性驗證碼的輕量工具。"],
	"project-1ad35048e71c": ["NCS 下載器", "下載 NCS 音樂並附上曲目資訊與封面圖片的網頁工具。"],
	"project-88b4543707a1": ["emstatus", "以 Google Apps Script 收集網站上線狀態，並將結果儲存於 GitHub 的監測儀表板。"],
	"project-63680dd9d5b8": ["SCAICT 113 寒訓", "為 SCAICT 寒訓製作的網站專案。"],
	"project-85ccf3e5f1c2": ["CrossDown", "將預覽內容顯示於獨立視窗、方便簡報使用的輕量 Markdown 編輯器。"],
	"project-649da6a06b80": ["實體 CTF", "讓參加者提交實體奪旗活動中取得之旗標的網頁介面。"],
	"project-28125393fb03": ["點名系統", "記錄班級出席狀況的點名系統。"],
	"project-91ae64f61773": ["SCAICT 條碼挑戰", "為 HITCON 製作的互動遊戲，挑戰玩家用冰棒棍重現 EAN-8 條碼。"],
	"project-54ce6928d5f2": ["Arduino 桌上曲棍球", "以 Arduino Uno、兩支搖桿與小型 LCD 螢幕製作的雙人桌上曲棍球遊戲。"],
	"project-249c11c62f07": ["Sparduino", "在 Arduino 上顯示 Spotify 目前播放曲目的專案。"],
	"project-147b4062050f": ["AWP for ClipCC", "支援 Google Fonts 與自訂字型，能繪製樣式化文字的 ClipCC 擴充功能。"]
} satisfies Record<string, readonly [string, string]>;

export type WorkProjectId = keyof typeof zhHant;
const zhHans = {
	"project-2228b65ade6c": ["emfont", "免费、开源的中日韩网页字体服务，每日处理超过 120 万次请求。"],
	"project-94188e5ad55a": ["emtech", "分享编程、设计与生活经验的文章和教程。"],
	"project-7ae453884cff": ["SITCON 2026", "东亚最大的学生信息技术年会官方网站，结合丰富的动画，获 Awwwards 提名。"],
	"project-fe415b2716d8": ["WinstonBot", "检查中文用词、拼写与专有名词大小写的网站及 Discord 机器人。"],
	"project-10d74e054fe0": ["SITCON 视频播放器", "在浏览器中自动循环播放指定的 SITCON 开场视频，供会场使用。"],
	"project-27d85eef1a82": ["因材网视频搜索机器人", "通过 LINE 搜索、观看因材网教学视频的机器人。"],
	"project-80b7c9cfbe60": ["请随手关门", "以 micro:bit 制作的门未关报警器，开门超过五秒就会发出提示音。"],
	"project-83f195f132e9": ["文本格式整理工具", "移除复制文本中多余的空格、换行及指定字符。"],
	"project-9b1f7bbab098": ["食物人格测试", "通过轻松有趣的性格测试，找出与你最相似的食物。"],
	"project-36a3dfcb20be": ["NiceFormat", "将图片拖放至桌面可执行文件，即可转换为 WebP 格式。"],
	"project-3495c881bc5f": ["二维码生成器", "将文本或链接转换成二维码，并实时预览结果。"],
	"project-0698d55ac00d": ["CSS 滤镜生成器", "找出能将图标调整为指定颜色的 CSS 滤镜。"],
	"project-a7f09cab2b51": ["屏幕录制工具", "直接在浏览器中录制屏幕，无须安装应用程序。"],
	"project-bbe906460d8b": ["StandBy", "以 iOS 待机模式为灵感的浏览器时钟。"],
	"project-3779ca464d7d": ["西苑高中上下课倒计时", "实时显示西苑高中距离上课、下课的剩余时间。"],
	"project-1098f31e41f8": ["EM Linkbot", "快速搜索维基百科及其他网络资料的 LINE 机器人。"],
	"project-487bd86c692c": ["EM-SFW 摄像头查看器", "在浏览器中查看摄像头画面，并调整画面翻转方向。"],
	"project-b9feb9da4f97": ["ClipCC", "以 Scratch 为基础的编程编辑器，支持扩展功能、可调整的帧率与更多绘图功能。"],
	"project-5f786bfed363": ["303 班数字毕业纪念册", "收录 303 班照片与共同回忆的数字毕业纪念册。"],
	"project-06657ed6b0e5": ["iPhone 3D Touch 电子秤", "利用 iPhone 触控压力传感来估算重量的实验。"],
	"project-cb7a9658ea31": ["Fullstack", "以 HTML 复选框制作的小型堆叠游戏。"],
	"project-c6d7fc22ad42": ["黄金比例配色生成器", "利用黄金比例生成配色方案。"],
	"project-87a114165314": ["背景配色实验室", "以整个浏览器窗口预览纯色与渐变背景。"],
	"project-35275112e415": ["数字时钟", "以大型渐变数字显示时间的全屏数字时钟。"],
	"project-18609bf2f330": ["叫号显示器", "在浏览器中显示排队号码的简易叫号工具。"],
	"project-75914510164a": ["辩论计时器", "支持声音提示的浏览器辩论发言计时器。"],
	"project-0df77c226f99": ["LINE Flex 消息发送工具", "通过浏览器界面编辑、分享 LINE Flex 消息。"],
	"project-9e9d2d2f89fc": ["电线杆牌猜猜看", "练习在 GeoGuessr 中判读台湾电线杆牌坐标的小游戏。"],
	"project-c77481a40d29": ["macOS 屏幕使用时间分析", "将 macOS 应用程序使用记录呈现为每日使用时段、时间轴与统计数据。"],
	"project-82786e1906be": ["座位表生成器", "生成座位表、随机排列，并通过拖动调整座位。"],
	"project-1d56cfca60fd": ["简易文本展示", "以简洁的全屏浏览器画面展示短消息。"],
	"project-0e9ec486c444": ["色彩倒计时", "通过背景颜色的变化呈现时间流逝的倒计时工具。"],
	"project-b6e203c6ac06": ["少年杀人事件 — Album OS", "结合可拖动窗口、歌词、维基与匿名聊天室的专辑网站。"],
	"project-94104dbc37f0": ["FurryTeaParty 2027", "FurryTeaParty 2027 活动的官方网站与内容管理系统。"],
	"project-ae5f91956fce": ["HUAN 讙", "远程管理多台设备播放内容与日程的媒体播放及数字标牌系统。"],
	"project-bb0858634f4b": ["superfile", "提供现代化界面的终端文件管理器，让文件浏览与整理更方便。"],
	"project-8c9b08ac27af": ["nycu.club 域名控制台", "让授权社团成员管理所属 nycu.club 命名空间内 DNS 记录的域名控制台。"],
	"project-3dd80f2af055": ["EM3", "以更简洁的界面整合课程、教材、作业与成绩的 Moodle 客户端。"],
	"project-6cd36fddb0fe": ["Netstamp", "通过自行掌控的探测节点收集测量数据的开源网络监测平台。"],
	"project-69bd61cb6abe": ["olowo", "第三方 oloo 客户端，整合站点地图、电池信息、租车与骑行记录。"],
	"project-24f31af8f06d": ["embate", "协助辩论裁判整理论点、关联回应，并记录发言与准备时间的工具。"],
	"project-14511a6af22d": ["Spotify Soloist Display", "以全屏呈现 Spotify 专辑动态封面、播放信息与同步歌词。"],
	"project-4c0c3250e9df": ["开发者工具集", "收集可复用的 Git 设置、GitHub Actions、格式配置与项目搭建笔记。"],
	"project-54fe1cd4bad7": ["oloo 在哪里？", "分析阳明交大各校区 oloo 共享电动摩托车的可借用情况。"],
	"project-472f51d9a1f8": ["SITCON Tickets", "SITCON 活动的报名系统。"],
	"project-ae70aa908c38": ["Mac 设置指南", "协助设置与配置新 Mac 的实用指南。"],
	"project-049519487d24": ["本地转录工具", "在本地转录音频、识别说话人，并将 AI 生成的笔记整理至 Obsidian 的工作流程。"],
	"project-9fea674d9967": ["MR18 Launchpad", "以 Raspberry Pi 将 Novation Launchpad Mini 转为 MIDAS MR18 调音台控制界面的桥接工具。"],
	"project-d31167a3a983": ["emvnc", "用于连接远程桌面的原生开源 macOS VNC 查看器。"],
	"project-ed830934a1ee": ["公开演示文稿", "收录 Elvis Mao 的公开演讲幻灯片。"],
	"project-5529aba06913": ["BambooFox 收据发送工具", "根据 CSV 名单，通过电子邮件发送社费收据的命令行工具。"],
	"project-64cecdd0b208": ["Linyao Design System", "整合共用设计变量、主题与无障碍交互模式的 React 组件库。"],
	"project-abff1a3fc6ef": ["SCAICT Discord 机器人", "为 SCAICT 社区制作的猫咪主题 Discord 机器人。"],
	"project-51bfe7c46457": ["SCAICT 官方网站", "SCAICT 学生信息技术社区的官方网站。"],
	"project-0748b0d0dc54": ["emjudge", "支持提交前端作业并自动评分的平台。"],
	"project-a8b3c30480c7": ["BambooFox 官方网站", "整合活动、网络安全教程、解题记录与社团信息的 BambooFox 社区网站。"],
	"project-79858acd18e3": ["SDC 核心系统", "为阳明交大 SDC 制作的表单平台，提供登录、数据提交与管理后台。"],
	"project-ab951dc179f1": ["阳明交大失物招领", "收集阳明交大失物招领公告的爬虫。"],
	"project-4a74b39175ef": ["SCAICT 2024 联合冬令营", "SCAICT 2024 年联合冬令营的活动网站。"],
	"project-ac37cee64589": ["SITCON 2026 闪电演讲", "让观众用手机将头像球发射至共用物理模拟画面的交互系统。"],
	"project-2f26531f26ce": ["SITCON 2026 大会游戏", "为 SITCON 2026 参与者制作的网页游戏。"],
	"project-f87ee59b24cf": ["阳明交大图书馆空间查询", "查询阳明交大图书馆空间空位与预约自习空间的替代界面。"],
	"project-d6a0e601c207": ["embox", "提供文件上传与下载的简易网站。"],
	"project-43aba731ab2f": ["The Ambivalent Facade", "为个展 The Ambivalent Facade 制作的网站。"],
	"project-91e46c059b9c": ["SITCON 2026 赞助计划", "SITCON 2026 赞助方案的网页版介绍。"],
	"project-b6b9d42170bc": ["SITCON Camp 2025 点数交易所", "为 SITCON Camp 2025 制作的虚拟点数交易系统，整合市场图表、排行榜与 Telegram 机器人。"],
	"project-e6b511d9fccd": ["语音转 Telegram", "通过 Whisper 将麦克风音频转为文本，并发送至 Telegram 群组。"],
	"project-b43b1bbe2d8a": ["SITCON Camp 2025 游戏厅", "为 SITCON Camp 2025 制作的浏览器小游戏集。"],
	"project-342adcf0b644": ["SITCON Camp 2025", "SITCON Camp 2025 的活动网站项目。"],
	"project-26d29d982dc9": ["emblog", "采用单页界面、已停止维护的静态博客生成器。"],
	"project-82bc1e3cea91": ["关键评论网文章下载器", "下载关键评论网文章的工具。"],
	"project-280207174884": ["TOTP4All", "在浏览器中管理限时一次性验证码的轻量工具。"],
	"project-1ad35048e71c": ["NCS 下载器", "下载 NCS 音乐并附上曲目信息与封面图片的网页工具。"],
	"project-88b4543707a1": ["emstatus", "以 Google Apps Script 收集网站在线状态，并将结果存储于 GitHub 的监测仪表盘。"],
	"project-63680dd9d5b8": ["SCAICT 113 冬令营", "为 SCAICT 冬令营制作的网站项目。"],
	"project-85ccf3e5f1c2": ["CrossDown", "将预览内容显示于独立窗口、方便演示使用的轻量 Markdown 编辑器。"],
	"project-649da6a06b80": ["实体 CTF", "让参与者提交实体夺旗活动中取得的 Flag 的网页界面。"],
	"project-28125393fb03": ["点名系统", "记录班级出勤情况的点名系统。"],
	"project-91ae64f61773": ["SCAICT 条码挑战", "为 HITCON 制作的交互游戏，挑战玩家用冰棒棍重现 EAN-8 条码。"],
	"project-54ce6928d5f2": ["Arduino 桌上曲棍球", "以 Arduino Uno、两支摇杆与小型 LCD 屏幕制作的双人桌上曲棍球游戏。"],
	"project-249c11c62f07": ["Sparduino", "在 Arduino 上显示 Spotify 当前播放曲目的项目。"],
	"project-147b4062050f": ["AWP for ClipCC", "支持 Google Fonts 与自定义字体，能绘制样式化文本的 ClipCC 扩展功能。"]
} satisfies Record<WorkProjectId, readonly [string, string]>;

// The shared catalog owns images, links, order, and English copy. Fail the build
// when its stable IDs and the translation dictionaries drift apart.
const catalogIds = new Set(catalog.map(project => project.id));
const translatedIds = Object.keys(zhHant);
if (catalogIds.size !== catalog.length || catalogIds.size !== translatedIds.length || translatedIds.some(id => !catalogIds.has(id))) {
	throw new Error("Project translations must cover every unique work-projects.json ID exactly once.");
}
const english = Object.fromEntries(catalog.map(({ id, title, description }) => [id, { title, description }])) as Record<WorkProjectId, ProjectText>;
export function projectText(id: string, locale: Locale): ProjectText {
	if (!Object.hasOwn(zhHant, id)) throw new Error(`Missing project translation: ${id}`);
	const projectId = id as WorkProjectId;
	if (locale === "en") return english[projectId];
	const [title, description] = (locale === "zh-Hant" ? zhHant : zhHans)[projectId];
	return { title, description };
}

interface WorkCopy {
	title: string;
	description: string;
	heading: string;
	intro: readonly [string, string];
	categoriesLabel: string;
	featured: string;
	categories: Record<"events" | "websites" | "tools" | "experiments", string>;
	showAll: (count: number) => string;
	showLess: string;
	view: string;
	code: string;
	viewProject: (title: string) => string;
	viewCode: (title: string) => string;
}
const copy = {
	en: {
		title: "Projects — Elvis Mao",
		description: "Websites, events, tools, and experiments by Elvis Mao.",
		heading: "Projects",
		intro: ["For people I'll never meet,", "and people I'll never forget."],
		categoriesLabel: "Project categories",
		featured: "Featured",
		categories: { events: "Events", websites: "Websites", tools: "Tools", experiments: "Experiments" },
		showAll: (count: number) => `Show all (${count})`,
		showLess: "Show less",
		view: "View",
		code: "Code",
		viewProject: (title: string) => `View ${title}`,
		viewCode: (title: string) => `${title} code`
	},
	"zh-Hant": {
		title: "作品 — Elvis Mao",
		description: "Elvis Mao 的網站、活動、工具與實驗作品。",
		heading: "作品",
		intro: ["獻給素未謀面的人，", "也獻給永遠不會忘記的人。"],
		categoriesLabel: "作品分類",
		featured: "精選作品",
		categories: { events: "活動", websites: "網站", tools: "工具", experiments: "實驗" },
		showAll: (count: number) => `展開全部（${count}）`,
		showLess: "收合",
		view: "查看",
		code: "原始碼",
		viewProject: (title: string) => `查看 ${title}`,
		viewCode: (title: string) => `${title} 原始碼`
	},
	"zh-Hans": {
		title: "作品 — Elvis Mao",
		description: "Elvis Mao 的网站、活动、工具与实验作品。",
		heading: "作品",
		intro: ["献给素未谋面的人，", "也献给永远不会忘记的人。"],
		categoriesLabel: "作品分类",
		featured: "精选作品",
		categories: { events: "活动", websites: "网站", tools: "工具", experiments: "实验" },
		showAll: (count: number) => `展开全部（${count}）`,
		showLess: "收起",
		view: "查看",
		code: "源代码",
		viewProject: (title: string) => `查看 ${title}`,
		viewCode: (title: string) => `${title} 源代码`
	}
} satisfies Record<Locale, WorkCopy>;
export const workCopy = (locale: Locale): WorkCopy => copy[locale];
