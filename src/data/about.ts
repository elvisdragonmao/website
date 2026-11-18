export const experiences = [
	{ id: "debate", years: "2026 — Present", role: "English Debate Instructor & Adjudicator", organization: "Ascent Academy" },
	{ id: "haix", years: "2025 — Present", role: "System Administrator & Undergraduate Researcher", organization: "HAIX Lab, NYCU" },
	{ id: "independent", years: "2023 — Present", role: "Independent Developer & Designer" },
	{ id: "sitcon", years: "2025 — 2026", role: "Development Team Lead", organization: "SITCON" },
	{ id: "bamboofox", years: "2026 — Present", role: "President", organization: "NYCU BambooFox Cybersecurity Club" },
	{ id: "awwwards", years: "2026 — Present", role: "Young Jury", organization: "Awwwards" }
] as const;

export const researchInterests = "Human–AI Interaction · Interactive Systems · Speech Interfaces · Computer Vision · Wearable & Embedded Computing · Creative Support Tools";

export const selectedResearchAuthors = ["Shih-Kai Hong, Ethel Yu-Tsen Hsiao, Yi-Jie Chen, Jason Zhi-Jun Chang, ", "Elvis Dragon Mao", ", and Grace Yu-Chun Yen."] as const;

export const talks = [
	{ id: "react", year: 2026, title: "Introduction to React Frontend Development", context: "NYCU Spring, 2 credits" },
	{ id: "monthly-workshops", year: 2026, title: "Monthly Technical & Creative Workshops", context: "NYCU ICT" },
	{ id: "frontend-workshop", year: 2026, title: "Frontend Development Workshop", context: "NYHU Institute of Service Science" },
	{ id: "more-than-css", year: 2025, title: "More than CSS", context: "SITCON Camp, Elective Tracks" },
	{ id: "frontend-math", year: 2025, title: "Frontend Effect: Middle School Math", context: "SITCON" },
	{ id: "scaict-open-source", year: 2024, title: "The Path to Freedom: The Open Source Journey of SCAICT", context: "COSCUP" },
	{ id: "iphone-programming", year: 2024, title: "From Shortcuts to Terminal: The Programming Journey on iPhone", context: "SITCON" },
	{ id: "community", year: 2024, title: "Community Management", context: "AIS3 Club" },
	{ id: "python-camp", year: 2024, title: "Python Camp", context: "SYTV K12EA, Ministry of Education" },
	{ id: "line-bot", year: 2024, title: "Line Bot", context: "SCAICT Junior High Course" },
	{ id: "arduino", year: 2024, title: "Having Fun with Arduino", context: "SYTV K12EA, Ministry of Education" },
	{ id: "phishing", year: 2024, title: "Art Direction & Phishing Website Workshop", context: "SCAICT Winter Camp" },
	{ id: "digital-notes", year: 2023, title: "Digital Note-Taking Skills", context: "Apple Stright A" },
	{ id: "scraping", year: 2023, title: "Web Scraping", context: "SCAICT United Orientation" },
	{ id: "web-design", year: 2023, title: "Web Design", context: "SCAICT October Theme Course" },
	{ id: "web-microcourse", year: 2023, title: "Web Design Microcourse", context: "Shi-Yuan Senior High School" },
	{ id: "debate-host", year: 2023, title: "English Debate Station Host", context: "Taichung Youth Program" },
	{ id: "web-workshop", year: 2023, title: "Web Design Workshop", context: "SYTV K12EA, Ministry of Education" },
	{ id: "python-scraping", year: 2023, title: "Python Web Scraping Workshop", context: "SYTV K12EA, Ministry of Education" },
	{ id: "css-animation", year: 2022, title: "Playing with CSS: Creating Stunning Animations", context: "Stella Matutina Girls' High School" },
	{ id: "advanced-c", year: 2022, title: "Advanced C Programming Camp", context: "SYTV" },
	{ id: "iot", year: 2022, title: "IoT Applications", context: "SYTV" }
] as const;

export const awards = [
	{
		year: "2026",
		items: [
			{ id: "omniobserve", title: "Honorable Mention", context: "NYCU CS Undergraduate Project Contest,", project: "OmniObserve" },
			{ id: "sitcon-website", title: "Awwwards Nominee", context: "SITCON 2026 Website" },
			{ id: "pitch", title: "Bronze Medal", context: "NYCU Pitch Hackathon" }
		]
	},
	{
		year: "2025",
		items: [
			{ id: "hitcon", title: "Champion", context: "HITCON CTF Exhibition, BambooFox" },
			{ id: "policy-hack", title: "Creativity Award", context: "Hsinchu Policy Hackathon" },
			{ id: "pf-champion", title: "Champion, Public Forum Debate", context: "Hsinchu Chung Hsin Foundation Speech Debate Open Invitational" },
			{ id: "pf-team", title: "Winning Team & Honorable Mention Debater", context: "National High School English Public Forum Debate, Central Regional Tournament" }
		]
	},
	{
		year: "2024",
		items: [
			{ id: "awwwards", title: "Awwwards Honorable Mention", context: "elvismao.com" },
			{ id: "sitcon-hack", title: "Best Technical Award", context: "SITCON Hackathon" },
			{ id: "ironman-devops", title: "Honorable Mention, DevOps", context: "iThome Ironman" },
			{ id: "outstanding-youth", title: "Taichung City Outstanding Youth" },
			{ id: "science", title: "Bronze Medal", context: "Yangwang Cup National Science HomeRun Competition" },
			{ id: "pf-judge", title: "Judge's Choice Award & Honorable Mention Debater", context: "National High School English Public Forum Debate, Central Regional Tournament" }
		]
	},
	{ year: "2023", items: [{ id: "ironman-css", title: "iThome Ironman", context: "Cool Without Libraries: Fun with CSS & JS Effects" }] }
] as const;

export const otherRecognition = ["CSSREELS — Featured", "CSS Light — Featured of the Day", "TopDesignKing — King of the Day", "Top CSS Gallery", "Web Guru Award — Guru of the Day"];
