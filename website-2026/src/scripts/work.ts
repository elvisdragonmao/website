import { workBoxFrame } from "../lib/work-box";

let disposeWork: (() => void) | undefined;

function mountWork() {
	disposeWork?.();
	const root = document.querySelector<HTMLElement>(".projects-page");
	if (!root) return;
	const controller = new AbortController();
	const cards = [...root.querySelectorAll<HTMLElement>(".work-card")];
	let revealObserver: IntersectionObserver | undefined;
	if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
		revealObserver = new IntersectionObserver(
			entries => {
				for (const entry of entries) {
					const card = entry.target as HTMLElement;
					if (entry.isIntersecting && entry.intersectionRatio >= 0.08) card.dataset.visible = "true";
					else if (!entry.isIntersecting) card.dataset.visible = "false";
				}
			},
			{ threshold: [0, 0.08], rootMargin: "0px 0px -24px 0px" }
		);
		for (const card of cards) {
			card.dataset.workReveal = "";
			card.dataset.visible = "false";
			revealObserver.observe(card);
			card.addEventListener(
				"focusin",
				() => {
					card.dataset.visible = "true";
				},
				{ signal: controller.signal }
			);
		}
	}
	root.querySelectorAll<HTMLImageElement>(".work-card-media img").forEach(image => {
		const media = image.closest<HTMLElement>(".work-card-media")!;
		image.addEventListener(
			"error",
			() => {
				media.dataset.imageFailed = "";
			},
			{ signal: controller.signal }
		);
		image.addEventListener(
			"load",
			() => {
				delete media.dataset.imageFailed;
			},
			{ signal: controller.signal }
		);
		if (image.complete && !image.naturalWidth) media.dataset.imageFailed = "";
	});
	const observer = new ResizeObserver(entries => {
		for (const entry of entries) {
			const card = entry.target as HTMLElement;
			const svg = card.querySelector<SVGSVGElement>(".work-cube-outline");
			if (!svg) continue;
			const cols = Math.max(20, Math.floor(card.clientWidth / 8));
			const rows = Math.max(15, Math.floor(card.clientHeight / 16));
			const key = `${cols}:${rows}`;
			if (svg.dataset.grid === key) continue;
			svg.dataset.grid = key;
			svg.setAttribute("viewBox", `0 0 ${cols * 8} ${rows * 16}`);
			const fragment = document.createDocumentFragment();
			workBoxFrame(cols, rows).forEach((line, y) => {
				const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
				text.setAttribute("x", "0");
				text.setAttribute("y", String(y * 16 + 12));
				text.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
				text.textContent = line;
				fragment.append(text);
			});
			svg.replaceChildren(fragment);
		}
	});
	root.querySelectorAll<HTMLElement>("[data-work-cube]").forEach(card => observer.observe(card));
	root.querySelectorAll<HTMLButtonElement>(".collection-toggle").forEach(button => {
		button.addEventListener(
			"click",
			() => {
				const section = button.closest<HTMLElement>(".work-collection");
				if (!section) return;
				const expanded = section.dataset.expanded !== "true";
				const scrolledIntoSection = section.getBoundingClientRect().top < 0;
				section.dataset.expanded = String(expanded);
				button.setAttribute("aria-expanded", String(expanded));
				button.textContent = expanded ? "Show less" : `Show all (${button.dataset.total})`;
				if (!expanded && scrolledIntoSection) section.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
			},
			{ signal: controller.signal }
		);
	});
	disposeWork = () => {
		controller.abort();
		observer.disconnect();
		revealObserver?.disconnect();
		for (const card of cards) {
			delete card.dataset.workReveal;
			delete card.dataset.visible;
		}
	};
}

document.addEventListener("astro:before-swap", () => {
	disposeWork?.();
	disposeWork = undefined;
});
document.addEventListener("astro:page-load", mountWork);
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountWork, { once: true });
else mountWork();
