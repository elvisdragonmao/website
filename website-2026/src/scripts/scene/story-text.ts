import type { StoryRange } from "./journey";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => {
	const t = clamp(value);
	return t * t * (3 - 2 * t);
};
const GLYPHS = "░▒/\\|+:.<>*";
interface TypeLine {
	node: Text;
	source: string;
	delay: number;
	last: string;
}
interface StoryLayer {
	name: string;
	element: HTMLElement;
	lines: TypeLine[];
	links: HTMLAnchorElement[];
	lastOpacity: string;
	active: boolean;
}

/** Scroll owns every transition. The shared world loop owns time and disposal. */
export class StoryText {
	private layers: StoryLayer[];
	private root = document.documentElement;
	private enabled: boolean | null = null;
	private lastTick = -1;
	private lastScroll = Number.NaN;
	private lastFlip = "";
	private scoreboard: HTMLElement | null;

	constructor() {
		this.layers = [...document.querySelectorAll<HTMLElement>("[data-story-layer]")].map(element => ({
			name: element.dataset.storyLayer ?? "",
			element,
			lines: [...element.querySelectorAll<HTMLElement>("[data-story-type]")].flatMap(line => {
				const output = line.querySelector<HTMLElement>("[data-story-output]");
				if (!output) return [];
				// One persistent Text node, updated without replacing spans or accessibility text.
				const source = output.textContent ?? "";
				const node = document.createTextNode(source);
				output.replaceChildren(node);
				return [{ node, source, delay: Number(line.dataset.storyDelay ?? 0), last: source }];
			}),
			links: [...element.querySelectorAll<HTMLAnchorElement>("a[href]")],
			lastOpacity: "",
			active: false
		}));
		this.scoreboard = document.querySelector<HTMLElement>(".story-scoreboard");
	}

	update(scroll: number, height: number, ranges: StoryRange[], time: number, reduced: boolean): void {
		const enabled = !reduced && this.root.classList.contains("art-ready");
		if (enabled !== this.enabled) {
			this.enabled = enabled;
			this.root.classList.toggle("story-text-ready", enabled);
			this.lastScroll = Number.NaN;
		}
		const tick = Math.floor(time * 24);
		if (scroll === this.lastScroll && tick === this.lastTick) return;
		this.lastScroll = scroll;
		this.lastTick = tick;
		for (const layer of this.layers) {
			const range = ranges.find(item => item.name === layer.name);
			if (!enabled || !range) {
				this.setVisible(layer, true, 1);
				for (const line of layer.lines) this.write(line, line.source);
				continue;
			}
			const contact = layer.name === "contact";
			const enter = ease((scroll - range.top + height * (contact ? 0.24 : 0.42)) / (height * (contact ? 0.18 : 0.26)));
			const exitStart = contact ? range.top + height * 0.55 : range.top + range.height - height * 0.64;
			const exit = 1 - ease((scroll - exitStart) / (height * (contact ? 0.25 : 0.36)));
			if (contact) layer.element.style.setProperty("--contact-reveal", ease((scroll - range.top + height * 0.04) / (height * 0.4)).toFixed(3));
			const opacity = enter * exit;
			this.setVisible(layer, opacity > 0.002, opacity);
			// The intro clips fixed content as the ordinary footer enters; clipped links
			// must leave the tab order even while the decorative text finishes fading.
			if (contact) for (const link of layer.links) link.tabIndex = opacity > 0.002 && scroll - range.top < height * 0.25 ? 0 : -1;
			if (opacity <= 0.002) continue;
			const progress = clamp((scroll - range.top + height * 0.2) / Math.max(height * 0.7, range.height * 0.48));
			for (const line of layer.lines) {
				const reveal = ease((progress - line.delay) / 0.67);
				this.write(line, this.decode(line.source, reveal, tick));
			}
			if (layer.name === "why" && this.scoreboard) {
				const flip = ease((scroll - range.top - range.height * 0.5) / (range.height * 0.21));
				const value = flip.toFixed(4);
				if (value !== this.lastFlip) {
					this.scoreboard.style.setProperty("--scoreboard-flip", value);
					this.lastFlip = value;
				}
			}
		}
		if (!enabled && this.scoreboard && this.lastFlip !== "0") {
			this.scoreboard.style.setProperty("--scoreboard-flip", "0");
			this.lastFlip = "0";
		}
	}

	private setVisible(layer: StoryLayer, visible: boolean, opacity: number): void {
		if (visible !== layer.active) {
			layer.active = visible;
			layer.element.dataset.storyActive = String(visible);
			for (const link of layer.links) link.tabIndex = visible ? 0 : -1;
		}
		const value = opacity.toFixed(3);
		if (value !== layer.lastOpacity) {
			layer.element.style.setProperty("--story-opacity", value);
			layer.lastOpacity = value;
		}
	}

	private write(line: TypeLine, value: string): void {
		if (line.last === value) return;
		line.node.data = value;
		line.last = value;
	}

	private decode(source: string, progress: number, tick: number): string {
		if (progress >= 0.999) return source;
		const frontier = progress * (source.length + 7);
		let output = "";
		for (let index = 0; index < source.length; index++) {
			const char = source[index]!;
			if (/\s/.test(char)) {
				output += char;
				continue;
			}
			const distance = frontier - index;
			if (distance >= 7) output += char;
			else if (distance > 0) {
				const hash = (((index + 3) * 73856093) ^ ((tick + 1) * 19349663)) >>> 0;
				output += GLYPHS[hash % GLYPHS.length];
			} else output += "\u00a0";
		}
		return output;
	}

	dispose(): void {
		this.root.classList.remove("story-text-ready");
		for (const layer of this.layers) {
			delete layer.element.dataset.storyActive;
			layer.element.style.removeProperty("--story-opacity");
			layer.element.style.removeProperty("--contact-reveal");
			for (const link of layer.links) link.removeAttribute("tabindex");
			for (const line of layer.lines) this.write(line, line.source);
		}
		this.scoreboard?.style.removeProperty("--scoreboard-flip");
	}
}
