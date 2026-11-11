export type LoaderVariant = "bar" | "orbit" | "signal";
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Only measured download progress and explicit setup milestones advance the bar. */
export class SceneLoader {
	private root = document.querySelector<HTMLElement>("[data-scene-loader]");
	private interval = 0;
	private timeout = 0;
	private frame = 0;
	private progress = 0.06;
	private finished = false;
	private label = "Preparing the glyphs…";
	private animation: Animation | undefined;
	private variant: LoaderVariant;
	constructor(variant?: LoaderVariant) {
		const requested = import.meta.env.DEV ? new URLSearchParams(location.search).get("loader") : null;
		this.variant = variant ?? (requested === "orbit" || requested === "signal" ? requested : "bar");
		if (!this.root) return;
		document.documentElement.classList.add("home-loading");
		this.root.style.removeProperty("opacity");
		this.root.dataset.loaderVariant = this.variant;
		this.draw();
		this.interval = window.setInterval(
			() => {
				if (!reduced()) this.frame++;
				this.draw();
			},
			reduced() ? 600 : 100
		);
		// A slow or failed asset must never trap the reader behind a loading screen.
		this.timeout = window.setTimeout(() => this.finish(), 12000);
	}
	setProgress(progress: number, label = "Waking up the dragon…"): void {
		if (this.finished) return;
		this.progress = Math.max(this.progress, Math.min(1, progress));
		this.label = label;
		this.draw();
	}
	private draw(): void {
		const art = this.root?.querySelector<HTMLElement>("[data-loader-art]");
		const label = this.root?.querySelector<HTMLElement>("[data-loader-label]");
		if (label && label.textContent !== this.label) label.textContent = this.label;
		if (!art) return;
		const n = Math.floor(this.progress * 20);
		if (this.variant === "bar") art.textContent = `${["▖", "▘", "▝", "▗"][this.frame % 4]}  [${"█".repeat(n)}${"░".repeat(20 - n)}]`;
		else if (this.variant === "orbit") {
			const cells = Array.from({ length: 5 }, () => Array<string>(11).fill(" "));
			const orbit = [
				[5, 0],
				[8, 1],
				[10, 2],
				[8, 3],
				[5, 4],
				[2, 3],
				[0, 2],
				[2, 1]
			];
			orbit.forEach(([x, y], i) => {
				cells[y!]![x!] = i === this.frame % 8 ? "█" : "·";
			});
			cells[2]![4] = "E";
			cells[2]![6] = "M";
			art.textContent = cells.map(row => row.join("")).join("\n");
		} else
			art.textContent = Array.from({ length: 5 }, (_, y) =>
				Array.from({ length: 25 }, (_, x) => {
					const wave = 2 + Math.sin(x * 0.45 - this.frame * 0.3) * 1.55;
					return Math.abs(y - wave) < 0.52 ? "×" : y === 2 ? "·" : " ";
				}).join("")
			).join("\n");
	}
	finish(): void {
		if (this.finished) return;
		this.setProgress(1, "Hey there.");
		this.finished = true;
		clearTimeout(this.timeout);
		clearInterval(this.interval);
		if (!this.root) return;
		this.root.dataset.loaderState = "complete";
		this.animation = this.root.animate(
			[
				{ opacity: 1, clipPath: "inset(0 0 0 0)" },
				{ opacity: 0, clipPath: "inset(0 0 10% 0)" }
			],
			{ duration: reduced() ? 80 : 650, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" }
		);
		void this.animation.finished.then(() => document.documentElement.classList.remove("home-loading")).catch(() => {});
	}
	dispose(): void {
		clearTimeout(this.timeout);
		clearInterval(this.interval);
		this.animation?.cancel();
		document.documentElement.classList.remove("home-loading");
	}
}
