import emfontCover from "../assets/projects/emfont/cover.webp";
import emtechCover from "../assets/projects/emtech/cover.webp";
import omniobserveCover from "../assets/projects/omniobserve/cover.svg";
import sitconCover from "../assets/projects/sitcon-2026/cover.webp";

export interface ProjectSection {
	label: string;
	title: string;
	paragraphs: string[];
}
export interface Project {
	slug: string;
	name: string;
	type: string;
	headline: string;
	introduction: string;
	image: string;
	imageAlt: string;
	card: { type: string; summary: string; metric: string };
	role: string;
	status: string;
	external?: string;
	externalLabel?: string;
	metric?: string;
	metricLabel?: string;
	sections: ProjectSection[];
	credits?: string;
}
export const projects: Project[] = [
	{
		slug: "emfont",
		card: { type: "Open-source infrastructure", summary: "An open-source CJK webfont service.", metric: "1.2M+ requests per day" },
		name: "emfont",
		type: "OPEN-SOURCE INFRASTRUCTURE",
		headline: "More room for\nChinese type.",
		introduction: "An open-source service that helps websites use Chinese fonts without turning font delivery into a project of its own.",
		image: emfontCover.src,
		imageAlt: "The emfont Chinese webfont service website",
		role: "Creator & maintainer",
		status: "Live service",
		external: "https://font.emtech.cc/",
		externalLabel: "Visit emfont",
		metric: "1.2M+",
		metricLabel: "HTTP requests per day",
		sections: [
			{
				label: "THE PROBLEM",
				title: "A font choice shouldn't become an infrastructure project.",
				paragraphs: [
					"Chinese fonts contain a large number of characters. Delivering them efficiently involves decisions about file size, the glyphs a page needs, and what a browser or CDN can reuse.",
					"emfont takes on that delivery work so people can spend more time on the pages they are making."
				]
			},
			{
				label: "MY WORK",
				title: "The type is what you see. Keeping it available is part of my job.",
				paragraphs: [
					"I built and operate the service, from its backend and storage to deployment and content delivery. That includes the ongoing work of maintaining the system as other websites depend on it.",
					"I also worked through the trade-offs between generating glyphs on demand and partitioning fonts into static Unicode ranges: how much to send, what could be cached, and what would remain practical to operate."
				]
			},
			{
				label: "WHY I CARE",
				title: "A less visible part of a more expressive web.",
				paragraphs: [
					"Good type can change the character of a page. I like building the less visible systems that make those choices easier for other people.",
					"The font designers make the letters. emfont helps them reach the page."
				]
			}
		]
	},
	{
		slug: "emtech",
		card: { type: "Writing & teaching", summary: "Original articles and tutorials.", metric: "50K+ views per month" },
		name: "emtech",
		type: "WRITING & TEACHING",
		headline: "Curiosity is\ncontagious.",
		introduction: "Original articles and tutorials about code, design, and things I wanted to understand well enough to explain.",
		image: emtechCover.src,
		imageAlt: "The emtech technical publication website",
		role: "Author & creator",
		status: "Ongoing publication",
		external: "https://emtech.cc/",
		externalLabel: "Read emtech",
		metric: "50K+",
		metricLabel: "Views per month",
		sections: [
			{
				label: "THE IDEA",
				title: "Make the next thing a little easier to try.",
				paragraphs: [
					"emtech is where I write about the things I learn while building. Original technical articles and tutorials turn some of those experiments into something other people can use.",
					"Writing gives me a reason to slow down, look at the details, and explain the choices behind a working result."
				]
			},
			{
				label: "MY WORK",
				title: "From a question to an explanation.",
				paragraphs: [
					"I write and maintain the publication alongside my development and research work. The subject matter follows my interests in web development, creative tools, and the systems behind them.",
					"Most of the publication is in Chinese. The articles remain available on the existing emtech website."
				]
			},
			{
				label: "WHY I CARE",
				title: "A good tutorial can be the start of someone else’s experiment.",
				paragraphs: ["I enjoy helping people get from an idea to something they can actually try. Publishing is one way to make that help available beyond a classroom or a conversation."]
			}
		]
	},
	{
		slug: "sitcon-2026",
		card: { type: "Visual design & development", summary: "Largest student IT conference in East Asia.", metric: "Website development lead" },
		name: "SITCON 2026",
		type: "VISUAL DESIGN & DEVELOPMENT",
		headline: "Jam\nthe Chaos.",
		introduction: "A website for the largest student IT conference in East Asia. Visual and interaction design, alongside leading the website development team.",
		image: sitconCover.src,
		imageAlt: "The SITCON 2026 Jam the Chaos website",
		role: "Website designer & development team lead",
		status: "Conference website",
		external: "https://sitcon.org/2026/",
		externalLabel: "Visit SITCON 2026",
		sections: [
			{
				label: "THE SETTING",
				title: "A community that makes things.",
				paragraphs: [
					"SITCON is a student-led computing conference built around learning, sharing, and open-source culture. The 2026 theme, “Jam the Chaos,” explores finding ways to collaborate amid change.",
					"The website brings together the identity, programme, speakers, and practical information people need to take part."
				]
			},
			{
				label: "MY WORK",
				title: "Designing the experience. Building it together.",
				paragraphs: [
					"I worked on the website's visual and interaction design and led the eight-person development team, collaborating with the conference's design team.",
					"The work connected the creative direction to a functioning conference website: making the interface, information, and interactions feel like parts of the same experience."
				]
			},
			{
				label: "WHY I CARE",
				title: "The website belongs to a much larger effort.",
				paragraphs: [
					"A conference is made by the people who organise, speak, volunteer, and show up. Building its website means creating an entrance to that shared work.",
					"I like projects where the craft of making something becomes a way to help a community meet."
				]
			}
		],
		credits: "Made with the SITCON 2026 design and development teams."
	},
	{
		slug: "omniobserve",
		card: { type: "Human–AI interaction research", summary: "Exploring what goes unsaid in online meetings.", metric: "Collaborative research · HAIX Lab" },
		name: "OmniObserve",
		type: "HUMAN–AI INTERACTION RESEARCH",
		headline: "What\ngoes unsaid?",
		introduction: "An online meeting can contain more agreement than anyone says aloud. OmniObserve explores how people might find that common ground.",
		image: omniobserveCover.src,
		imageAlt: "Concept overview showing private expression and shared perspectives",
		role: "Research collaborator; software & experimental infrastructure",
		status: "Research prototype · TAICHI 2026 poster",
		sections: [
			{
				label: "THE QUESTION",
				title: "What if you knew you weren't the only one thinking it?",
				paragraphs: [
					"People can hesitate to voice an opinion because they are uncertain, expect disagreement, or find the subject difficult to raise. That can leave a group unaware of views its members share.",
					"Our team investigated mechanisms that let participants privately express those opinions and receive indications when other people felt similarly."
				]
			},
			{
				label: "MY CONTRIBUTION",
				title: "Connecting the research question to a system we could study.",
				paragraphs: [
					"I built foundational software and experimental infrastructure using Jitsi, Whisper, and the ChatGPT API. I also participated in system design, implementation, experimental preparation, research discussions, and study execution.",
					"This was collaborative research at the Human-AI & Creative Computing Lab, National Yang Ming Chiao Tung University."
				]
			},
			{
				label: "WHAT THE WORK ASKS",
				title: "How can an interface make room for something people hesitate to say?",
				paragraphs: [
					"With OmniObserve, we explored how private expression and indications of shared views could support communication in online meetings. It is part of my interest in how interfaces shape what people feel able to say.",
					"“OmniObserve: Revealing Hidden Consensus in Online Meetings” was presented as a poster at the Taiwan HCI Conference, TAICHI 2026."
				]
			}
		],
		credits: "Shih-Kai Hong, Ethel Yu-Tsen Hsiao, Yi-Jie Chen, Jason Zhi-Jun Chang, Elvis Dragon Mao, and Grace Yu-Chun Yen."
	}
];
