import { navigate, type TransitionBeforePreparationEvent } from "astro:transitions/client";
import { PixelWipe, type PixelWipeState } from "./navigation/pixel-wipe";
import { setupScrollExperience } from "./scroll-experience";

/** Page-only interactions. ClientRouter retains ownership of normal link navigation. */
type ExperienceDebug = PixelWipeState & {
	version: string;
	pageInitializations: number;
	pageCleanups: number;
	bottomNavigations: number;
	nativeNewsletterSubmissions: number;
	bottomProgress: number;
};
declare global {
	interface Window {
		__EM_PAGE_EXPERIENCE__?: ExperienceDebug;
	}
}
const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const ease = (value: number) => value * value * (3 - 2 * value);

// The module is bundled once and remains alive across Astro document swaps.
if (!import.meta.env.DEV || !window.__EM_PAGE_EXPERIENCE__) {
	const debug: ExperienceDebug = {
		version: "1.0.0",
		pageInitializations: 0,
		pageCleanups: 0,
		covers: 0,
		uncovers: 0,
		bottomNavigations: 0,
		nativeNewsletterSubmissions: 0,
		phase: "idle",
		bottomProgress: 0
	};
	if (import.meta.env.DEV) window.__EM_PAGE_EXPERIENCE__ = debug;

	class PageScope {
		readonly abort = new AbortController();
		private cleanups: Array<() => void> = [];
		add(cleanup: () => void) {
			this.cleanups.push(cleanup);
		}
		dispose() {
			this.abort.abort();
			this.cleanups.splice(0).forEach(cleanup => cleanup());
			debug.pageCleanups++;
			debug.bottomProgress = 0;
		}
	}

	function nextPage(scope: PageScope) {
		const link = document.querySelector<HTMLAnchorElement>("a[data-next-page]");
		const heading = link?.querySelector<HTMLElement>(".next-page-ascii");
		const meter = link?.querySelector<HTMLElement>("[data-next-progress]");
		if (!link || !heading) return;
		let start = 0,
			end = 0,
			pending = false,
			lastInput = 0,
			intent = 0,
			touchY: number | null = null;
		let frame = 0;
		const measure = () => {
			end = document.documentElement.scrollHeight - innerHeight - 3;
			start = Math.min(end - 80, heading.getBoundingClientRect().top + scrollY - innerHeight * 0.94);
		};
		const paint = () => {
			frame = 0;
			const progress = clamp((scrollY - start) / Math.max(1, end - start));
			const entrance = ease(clamp((innerHeight * 0.94 - heading.getBoundingClientRect().top) / (innerHeight * 0.13)));
			debug.bottomProgress = progress;
			link.style.setProperty("--next-progress", String(progress));
			link.style.setProperty("--next-enter", String(entrance));
			link.dataset.nextState = pending ? "opening" : progress > 0 ? "pulling" : "ready";
			meter?.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
			if (scrollY < start) {
				intent = 0;
			}
			if (progress >= 0.998 && intent > 180 && performance.now() - lastInput < 1800 && !pending) {
				pending = true;
				debug.bottomNavigations++;
				void navigate(link.href).catch(() => {
					pending = false;
					intent = 0;
				});
			}
		};
		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(paint);
		};
		const observeIntent = (delta: number) => {
			if (delta <= 0) {
				intent = 0;
				return;
			}
			if (heading.getBoundingClientRect().top < innerHeight * 0.94 + Math.min(delta, innerHeight)) {
				intent += Math.min(delta, 160);
				lastInput = performance.now();
				schedule();
			}
		};
		const signal = scope.abort.signal;
		window.addEventListener(
			"wheel",
			e => {
				if (e.ctrlKey || e.metaKey || e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
				const target = e.target instanceof Element ? e.target : null;
				if (target?.closest('input,textarea,select,[contenteditable="true"],[data-native-scroll]')) return;
				observeIntent(e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1));
			},
			{ passive: true, signal }
		);
		window.addEventListener(
			"touchstart",
			e => {
				touchY = e.touches.length === 1 ? e.touches[0]!.clientY : null;
			},
			{ passive: true, signal }
		);
		window.addEventListener(
			"touchmove",
			e => {
				if (touchY === null || e.touches.length !== 1) return;
				const y = e.touches[0]!.clientY;
				observeIntent((touchY - y) * 2);
				touchY = y;
			},
			{ passive: true, signal }
		);
		window.addEventListener(
			"touchend",
			() => {
				touchY = null;
			},
			{ passive: true, signal }
		);
		window.addEventListener("scroll", schedule, { passive: true, signal });
		window.addEventListener(
			"resize",
			() => {
				measure();
				schedule();
			},
			{ passive: true, signal }
		);
		const observer = new ResizeObserver(() => {
			measure();
			schedule();
		});
		observer.observe(document.body);
		scope.add(() => {
			cancelAnimationFrame(frame);
			observer.disconnect();
		});
		measure();
		paint();
	}

	function newsletters(scope: PageScope) {
		document.querySelectorAll<HTMLFormElement>("form[data-newsletter]").forEach(form => {
			form.addEventListener(
				"submit",
				() => {
					// The configured backend uses its native confirmation page. No blind no-cors
					// fetch, background subscription, fabricated success, or swallowed submission.
					if (!form.checkValidity()) return;
					const referrer = form.querySelector<HTMLInputElement>('[name="entry.1137316312"]');
					if (referrer) referrer.value = new URLSearchParams(location.search).get("f") || location.href;
					const status = form.querySelector<HTMLOutputElement>("[data-status]");
					if (status) status.textContent = form.dataset.openingMessage ?? "";
					debug.nativeNewsletterSubmissions++;
				},
				{ signal: scope.abort.signal }
			);
		});
	}

	function navContrast(scope: PageScope) {
		const footer = document.querySelector<HTMLElement>(".site-footer.has-newsletter");
		const nav = document.querySelector<HTMLElement>(".site-nav");
		const update = () => {
			const f = footer?.getBoundingClientRect(),
				n = nav?.getBoundingClientRect();
			const y = n ? n.top + n.height * 0.5 : 40;
			const darkStory = document.body.classList.contains("home-page") || Boolean(footer?.classList.contains("ascii-footer"));
			document.documentElement.dataset.navTone = !darkStory && f && f.top < y && f.bottom > y ? "light" : "dark";
		};
		window.addEventListener("scroll", update, { passive: true, signal: scope.abort.signal });
		window.addEventListener("resize", update, { passive: true, signal: scope.abort.signal });
		update();
	}

	const wipe = new PixelWipe(debug);
	let page: PageScope | undefined;
	let navigation = 0;
	let afterSwapFrame = 0;
	const initialize = () => {
		page?.dispose();
		page = new PageScope();
		debug.pageInitializations++;
		nextPage(page);
		setupScrollExperience(page.abort.signal);
		newsletters(page);
		navContrast(page);
		if (debug.phase === "covered") void wipe.uncover();
	};
	document.addEventListener("astro:before-preparation", rawEvent => {
		const event = rawEvent as TransitionBeforePreparationEvent;
		if (event.from.pathname === event.to.pathname && event.from.search === event.to.search) return;
		cancelAnimationFrame(afterSwapFrame);
		const token = ++navigation;
		const originalLoader = event.loader;
		const onAbort = () => {
			if (token === navigation) wipe.clear();
		};
		event.signal.addEventListener("abort", onAbort, { once: true });
		event.loader = async () => {
			try {
				await Promise.all([originalLoader(), wipe.cover(event.direction)]);
				if (event.defaultPrevented && token === navigation) wipe.clear();
			} catch (error) {
				if (token === navigation) wipe.clear();
				throw error;
			} finally {
				event.signal.removeEventListener("abort", onAbort);
			}
		};
	});
	document.addEventListener("astro:before-swap", () => {
		page?.dispose();
		page = undefined;
	});
	document.addEventListener("astro:after-swap", () => {
		cancelAnimationFrame(afterSwapFrame);
		afterSwapFrame = requestAnimationFrame(() => {
			void wipe.uncover();
		});
	});
	document.addEventListener("astro:page-load", initialize);
	window.addEventListener("resize", () => wipe.resize(), { passive: true });
	// Initial module evaluation can occur either before or after Astro's first page-load.
	if (document.readyState === "loading")
		document.addEventListener(
			"DOMContentLoaded",
			() => {
				if (!page) initialize();
			},
			{ once: true }
		);
	else initialize();
}
