import { startAboutArt } from "./about-art";
import { startAboutPortrait } from "./about-portrait";
import { setupAboutWorkspace, setupTypingTerminal } from "./about-tui";

function setupTalks(root: HTMLElement, signal: AbortSignal): void {
	const monitor = root.querySelector<HTMLElement>("[data-talks-monitor]");
	const search = monitor?.querySelector<HTMLInputElement>("[data-talks-search]");
	const viewport = monitor?.querySelector<HTMLElement>(".talks-table-scroll");
	if (!monitor || !search || !viewport) return;
	const rows = [...monitor.querySelectorAll<HTMLTableRowElement>("[data-talks-row]")];
	const buttons = [...monitor.querySelectorAll<HTMLButtonElement>("[data-talks-year]")];
	const searchText = new Map(rows.map(row => [row, row.textContent?.toLocaleLowerCase() ?? ""]));
	let year: string | null = null;
	let selected: HTMLTableRowElement | undefined = rows[0];
	const select = (row?: HTMLTableRowElement, focus = false) => {
		selected = row;
		for (const candidate of rows) {
			candidate.dataset.selected = String(candidate === row);
			candidate.tabIndex = candidate === row ? 0 : -1;
			if (candidate === row) candidate.setAttribute("aria-current", "true");
			else candidate.removeAttribute("aria-current");
		}
		if (row && focus) {
			row.focus({ preventScroll: true });
			const box = row.getBoundingClientRect(),
				frame = viewport.getBoundingClientRect();
			if (box.top < frame.top + 5) viewport.scrollTop += box.top - frame.top - 5;
			else if (box.bottom > frame.bottom) viewport.scrollTop += box.bottom - frame.bottom;
		}
	};
	const filter = () => {
		const query = search.value.trim().toLocaleLowerCase();
		for (const row of rows) row.hidden = Boolean((year && row.dataset.year !== year) || !searchText.get(row)?.includes(query));
		select(rows.find(row => !row.hidden));
		viewport.scrollTop = 0;
		monitor.dataset.empty = String(!rows.some(row => !row.hidden));
	};
	search.addEventListener("input", filter, { signal });
	search.addEventListener("search", filter, { signal });
	const reset = () => {
		year = null;
		search.value = "";
		for (const button of buttons) button.setAttribute("aria-pressed", "false");
		filter();
	};
	monitor.querySelector<HTMLButtonElement>("[data-talks-reset]")?.addEventListener("click", reset, { signal });
	monitor.addEventListener(
		"keydown",
		event => {
			if (event.ctrlKey || event.metaKey || event.altKey) return;
			if (/^F[1-5]$/.test(event.key)) {
				event.preventDefault();
				const index = Number(event.key.slice(1)) - 1;
				monitor.querySelectorAll<HTMLButtonElement>(".talks-keybar [data-talks-year]")[index]?.click();
				if (viewport.contains(event.target as Node)) {
					if (selected) select(selected, true);
					else viewport.focus({ preventScroll: true });
				}
			} else if (event.key === "Escape") {
				event.preventDefault();
				reset();
				if (viewport.contains(event.target as Node)) select(selected, true);
			}
		},
		{ signal }
	);
	for (const button of buttons)
		button.addEventListener(
			"click",
			() => {
				year = year === button.dataset.talksYear ? null : (button.dataset.talksYear ?? null);
				for (const candidate of buttons) candidate.setAttribute("aria-pressed", String(candidate.dataset.talksYear === year));
				filter();
			},
			{ signal }
		);
	viewport.addEventListener(
		"click",
		event => {
			const row = (event.target as Element).closest<HTMLTableRowElement>("[data-talks-row]");
			if (row && rows.includes(row)) select(row, true);
		},
		{ signal }
	);
	viewport.addEventListener(
		"keydown",
		event => {
			if (!["ArrowDown", "ArrowUp", "Home", "End", "PageDown", "PageUp"].includes(event.key)) return;
			const visible = rows.filter(row => !row.hidden);
			if (!visible.length) return;
			event.preventDefault();
			let index = selected ? visible.indexOf(selected) : 0;
			if (event.key === "Home") index = 0;
			else if (event.key === "End") index = visible.length - 1;
			else index += ({ ArrowDown: 1, ArrowUp: -1, PageDown: 8, PageUp: -8 } as Record<string, number>)[event.key] ?? 0;
			select(visible[Math.max(0, Math.min(visible.length - 1, index))], true);
		},
		{ signal }
	);
	select(selected);
	monitor.dataset.ready = "true";
}

let activeAbout: AbortController | undefined;
function mountAbout(): void {
	const root = document.querySelector<HTMLElement>(".about-page");
	if (!root || root.dataset.aboutMounted) return;
	activeAbout?.abort();
	activeAbout = new AbortController();
	const { signal } = activeAbout;
	root.dataset.aboutMounted = "true";
	setupAboutWorkspace(root, signal);
	startAboutArt(root, signal);
	startAboutPortrait(root, signal);
	setupTalks(root, signal);
	setupTypingTerminal(root, signal);
	signal.addEventListener(
		"abort",
		() => {
			delete root.dataset.aboutMounted;
		},
		{ once: true }
	);
}
document.addEventListener("astro:before-swap", () => activeAbout?.abort());
document.addEventListener("astro:page-load", mountAbout);
mountAbout();
