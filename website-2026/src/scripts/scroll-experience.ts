import Lenis from "lenis";
import "lenis/dist/lenis.css";

declare global {
	interface Window {
		__EM_SCROLL__?: Lenis;
	}
}
const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));
const ease = (v: number) => {
	const t = clamp(v);
	return t * t * (3 - 2 * t);
};

/** One native scroll position drives WebGL, subtitles, and lighter DOM parallax. */
export function setupScrollExperience(signal: AbortSignal): void {
	if (!document.body.classList.contains("home-page")) return;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const next = document.querySelector<HTMLElement>("[data-next-page]");
	const heading = next?.querySelector<HTMLElement>(".next-page-ascii");
	let lenis: Lenis;
	lenis = new Lenis({
		autoRaf: true,
		lerp: 0.085,
		smoothWheel: true,
		syncTouch: true,
		syncTouchLerp: 0.12,
		anchors: true,
		respectReducedMotion: true,
		virtualScroll: data => {
			if (data.deltaY > 0 && heading && !reduced.matches) {
				const top = heading.getBoundingClientRect().top;
				const zoneStart = top + scrollY - innerHeight * 0.94;
				const target = lenis?.targetScroll ?? scrollY;
				const ordinary = Math.max(0, zoneStart - target);
				if (data.deltaY > ordinary) {
					const entrance = ease((innerHeight * 0.94 - top) / (innerHeight * 0.13));
					data.deltaY = ordinary + (data.deltaY - ordinary) * (0.32 - 0.2 * entrance);
				}
			}
			return true;
		}
	});
	if (import.meta.env.DEV) window.__EM_SCROLL__ = lenis;
	const work = document.querySelector<HTMLElement>("#work");
	const gallery = work?.querySelector<HTMLElement>("[data-work-gallery]");
	const cards = [...(work?.querySelectorAll<HTMLElement>(".work-box") ?? [])];
	const footer = document.querySelector<HTMLElement>("#contact .site-footer");
	const absoluteTop = (element: HTMLElement) => {
		let top = 0;
		let node: HTMLElement | null = element;
		while (node) {
			top += node.offsetTop;
			node = node.offsetParent as HTMLElement | null;
		}
		return top;
	};
	let frame = 0,
		last = -1;
	const paint = () => {
		frame = requestAnimationFrame(paint);
		if (last === scrollY) return;
		last = scrollY;
		const h = innerHeight;
		if (work && gallery) {
			const drifts: number[] = [];
			cards.forEach((card, i) => {
				const anchor = absoluteTop(card) - scrollY;
				const raw = (h * 0.6 - anchor) * [0.14, 0.24, 0.19, 0.28][i % 4]!;
				const limit = raw < 0 ? 165 : 180;
				const drift = reduced.matches ? 0 : limit * Math.tanh(raw / limit);
				drifts.push(drift);
				card.style.setProperty("--work-drift", `${drift.toFixed(2)}px`);
			});
			const offset = reduced.matches ? 0 : clamp((h * 0.7 - work.getBoundingClientRect().top) * 0.065, -45, 80);
			work.style.setProperty("--work-heading-drift", `${offset.toFixed(2)}px`);
			const lastDrift = Math.max(0, ...drifts.slice(-2));
			work.style.setProperty("--work-link-drift", `${(lastDrift * ease(lastDrift / 40)).toFixed(2)}px`);
		}
		if (footer) {
			const box = footer.getBoundingClientRect();
			const progress = ease((h - box.top) / (h * 1.2));
			footer.style.setProperty("--footer-drift", `${reduced.matches ? 0 : -progress * 52}px`);
			footer.style.setProperty("--footer-opacity", String(reduced.matches ? 1 : 1 - 0.85 * ease((h * 0.88 - box.bottom) / (h * 0.34))));
		}
	};
	frame = requestAnimationFrame(paint);
	signal.addEventListener(
		"abort",
		() => {
			cancelAnimationFrame(frame);
			lenis.destroy();
			if (import.meta.env.DEV) delete window.__EM_SCROLL__;
		},
		{ once: true }
	);
}
