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
	const singleColumn = matchMedia("(max-width: 760px)");
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
		last = -1,
		lastWidth = -1,
		lastHeight = -1,
		lastReduced = reduced.matches;
	const paint = () => {
		frame = requestAnimationFrame(paint);
		if (last === scrollY && lastWidth === innerWidth && lastHeight === innerHeight && lastReduced === reduced.matches) return;
		last = scrollY;
		lastWidth = innerWidth;
		lastHeight = innerHeight;
		lastReduced = reduced.matches;
		const h = innerHeight;
		if (work && gallery) {
			// Single-column cards share normal document flow; differential drift
			// belongs to the staggered desktop composition and its larger gutters.
			const parallax = !reduced.matches && !singleColumn.matches;
			const drifts: number[] = [];
			cards.forEach((card, i) => {
				let drift = 0;
				if (parallax) {
					const anchor = absoluteTop(card) - scrollY;
					const raw = (h * 0.6 - anchor) * [0.14, 0.24, 0.19, 0.28][i % 4]!;
					const limit = raw < 0 ? 165 : 180;
					drift = limit * Math.tanh(raw / limit);
				}
				drifts.push(drift);
				card.style.setProperty("--work-drift", `${drift.toFixed(2)}px`);
			});
			const offset = parallax ? clamp((h * 0.7 - work.getBoundingClientRect().top) * 0.065, -45, 80) : 0;
			work.style.setProperty("--work-heading-drift", `${offset.toFixed(2)}px`);
			const lastDrift = Math.max(0, ...drifts.slice(-2));
			work.style.setProperty("--work-link-drift", `${(lastDrift * ease(lastDrift / 40)).toFixed(2)}px`);
		}
		if (footer) {
			const box = footer.getBoundingClientRect();
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
