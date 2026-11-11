import { navigate, type TransitionBeforePreparationEvent } from "astro:transitions/client";

/** Page-only interactions. ClientRouter retains ownership of normal link navigation. */
type ExperienceDebug = {
	version: string;
	pageInitializations: number;
	pageCleanups: number;
	covers: number;
	uncovers: number;
	reveals: number;
	activeReveals: number;
	activeObservers: number;
	bottomNavigations: number;
	nativeNewsletterSubmissions: number;
	phase: "idle" | "covering" | "covered" | "uncovering";
	bottomProgress: number;
};
declare global {
	interface Window {
		__EM_PAGE_EXPERIENCE__?: ExperienceDebug;
	}
}
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
		reveals: 0,
		activeReveals: 0,
		activeObservers: 0,
		bottomNavigations: 0,
		nativeNewsletterSubmissions: 0,
		phase: "idle",
		bottomProgress: 0
	};
	if (import.meta.env.DEV) window.__EM_PAGE_EXPERIENCE__ = debug;

	/** Original threshold field: interference rings, diagonal drift and integer XOR.
	 * References: play.ertdfgcvb.xyz Mod Xor / Moiré explorer (not copied source).
	 */
	class PixelWipe {
		private canvas: HTMLCanvasElement | null = null;
		private frame = 0;
		private settle: (() => void) | null = null;
		private amount = 0;
		private direction = 1;
		private width = 0;
		private height = 0;
		private thresholds = new Float32Array(0);
		private columns = 0;
		private rows = 0;
		private cell = 16;
		private seed = 0;
		private generation = 0;

		private surface() {
			const canvas = document.querySelector<HTMLCanvasElement>("#route-pixels");
			if (!canvas) return null;
			if (this.canvas !== canvas) {
				this.canvas = canvas;
				canvas.setAttribute("aria-hidden", "true");
				Object.assign(canvas.style, {
					position: "fixed",
					inset: "0",
					width: "100%",
					height: "100%",
					pointerEvents: "none",
					zIndex: "10000",
					visibility: "hidden"
				});
			}
			if (this.width !== innerWidth || this.height !== innerHeight || !this.thresholds.length) {
				this.width = innerWidth;
				this.height = innerHeight;
				this.cell = innerWidth < 600 ? 13 : 17;
				this.columns = Math.ceil(this.width / this.cell);
				this.rows = Math.ceil(this.height / this.cell);
				const dpr = Math.min(devicePixelRatio || 1, 2);
				canvas.width = Math.ceil(this.width * dpr);
				canvas.height = Math.ceil(this.height * dpr);
				const context = canvas.getContext("2d");
				context?.setTransform(dpr, 0, 0, dpr, 0, 0);
				this.thresholds = new Float32Array(this.columns * this.rows);
				for (let y = 0; y < this.rows; y++) {
					for (let x = 0; x < this.columns; x++) {
						const u = x / this.columns;
						const v = y / this.rows;
						const ringA = Math.hypot(u - 0.18, (v - 0.32) * 0.65);
						const ringB = Math.hypot(u - 0.79, (v - 0.61) * 0.65);
						const interference = (Math.sin(ringA * 72) * Math.cos(ringB * 67) + 1) * 0.5;
						const xor = (((x + y * 3) ^ (x * 3 - y)) & 31) / 31;
						this.thresholds[y * this.columns + x] = clamp((this.direction === 1 ? u : 1 - u) * 0.55 + v * 0.12 + interference * 0.21 + xor * 0.12, 0.006, 0.994);
					}
				}
			}
			return canvas.getContext("2d");
		}

		private draw(amount: number) {
			const context = this.surface();
			if (!context || !this.canvas) return;
			context.clearRect(0, 0, this.width, this.height);
			this.canvas.style.visibility = amount > 0 ? "visible" : "hidden";
			this.canvas.dataset.phase = debug.phase;
			if (amount <= 0) return;
			if (reducedMotion()) {
				context.globalAlpha = amount;
				context.fillStyle = "#080b0e";
				context.fillRect(0, 0, this.width, this.height);
				context.globalAlpha = 1;
				return;
			}
			const glyphs = ["┼", "─", "└", "┐", "╱", "+", "·"];
			context.font = `${this.cell - 1}px ui-monospace, SFMono-Regular, Menlo, monospace`;
			context.textAlign = "center";
			context.textBaseline = "middle";
			for (let y = 0; y < this.rows; y++) {
				for (let x = 0; x < this.columns; x++) {
					const threshold = this.thresholds[y * this.columns + x]!;
					if (amount < threshold) continue;
					const px = x * this.cell;
					const py = y * this.cell;
					context.fillStyle = "#080b0e";
					context.fillRect(px, py, this.cell + 0.5, this.cell + 0.5);
					const edge = 1 - clamp((amount - threshold) / 0.18);
					if (edge > 0 && amount < 1) {
						context.globalAlpha = edge * 0.72;
						context.fillStyle = ((x ^ y) & 7) < 2 ? "#71b5c6" : "#d8e6e9";
						context.fillText(glyphs[((x + y) ^ (this.seed + x - y)) % glyphs.length] || "·", px + this.cell / 2, py + this.cell / 2);
						context.globalAlpha = 1;
					}
				}
			}
		}

		private stop() {
			cancelAnimationFrame(this.frame);
			this.frame = 0;
			this.settle?.();
			this.settle = null;
		}

		private tween(to: number, duration: number) {
			this.stop();
			const from = this.amount;
			const start = performance.now();
			return new Promise<void>(resolve => {
				this.settle = resolve;
				const tick = (time: number) => {
					const progress = duration ? clamp((time - start) / duration) : 1;
					this.amount = from + (to - from) * ease(progress);
					this.draw(this.amount);
					if (progress < 1) this.frame = requestAnimationFrame(tick);
					else {
						this.frame = 0;
						this.settle = null;
						resolve();
					}
				};
				this.frame = requestAnimationFrame(tick);
			});
		}

		async cover(direction: string) {
			const token = ++this.generation;
			this.direction = direction === "back" ? -1 : 1;
			this.seed++;
			this.thresholds = new Float32Array(0);
			debug.phase = "covering";
			debug.covers++;
			await this.tween(1, reducedMotion() ? 55 : 350);
			if (token === this.generation && this.amount === 1) {
				debug.phase = "covered";
				if (this.canvas) this.canvas.dataset.phase = debug.phase;
			}
		}

		async uncover() {
			if (debug.phase !== "covered" && debug.phase !== "covering") return;
			const token = ++this.generation;
			debug.phase = "uncovering";
			debug.uncovers++;
			await this.tween(0, reducedMotion() ? 65 : 420);
			if (token === this.generation && this.amount === 0) {
				debug.phase = "idle";
				if (this.canvas) this.canvas.dataset.phase = debug.phase;
			}
		}

		clear() {
			this.generation++;
			this.stop();
			this.amount = 0;
			debug.phase = "idle";
			this.draw(0);
		}

		resize() {
			this.draw(this.amount);
		}
	}

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

	function pixelReveals(scope: PageScope) {
		const wrappers = [...document.querySelectorAll<HTMLElement>("[data-pixel-reveal]")];
		if (!wrappers.length) return;
		const active = new Set<HTMLElement>();
		const frames = new Set<number>();
		const cancelers: Array<() => void> = [];
		let observer: IntersectionObserver | undefined;
		let disposed = false;

		const reveal = async (wrapper: HTMLElement) => {
			if (active.has(wrapper) || disposed) return;
			active.add(wrapper);
			observer?.unobserve(wrapper);
			const img = wrapper.querySelector<HTMLImageElement>("img");
			if (!img) return;
			try {
				await img.decode();
			} catch {
				/* Keep the original image on decode/network failure. */
			}
			if (disposed || !img.complete || !img.naturalWidth) return;
			if (reducedMotion()) {
				debug.reveals++;
				return;
			}
			const box = img.getBoundingClientRect();
			if (box.width < 1 || box.height < 1) return;
			const wrapperBox = wrapper.getBoundingClientRect();
			const originalPosition = wrapper.style.position;
			const originalOpacity = img.style.opacity;
			const positioned = getComputedStyle(wrapper).position === "static";
			if (positioned) wrapper.style.position = "relative";
			const canvas = document.createElement("canvas");
			canvas.setAttribute("aria-hidden", "true");
			canvas.dataset.pixelRevealCanvas = "";
			canvas.width = Math.ceil(box.width);
			canvas.height = Math.ceil(box.height);
			Object.assign(canvas.style, {
				position: "absolute",
				left: `${box.left - wrapperBox.left}px`,
				top: `${box.top - wrapperBox.top}px`,
				width: `${box.width}px`,
				height: `${box.height}px`,
				pointerEvents: "none",
				borderRadius: getComputedStyle(img).borderRadius,
				zIndex: "1"
			});
			const context = canvas.getContext("2d");
			const sample = document.createElement("canvas");
			const sampled = sample.getContext("2d");
			if (!context || !sampled) return;
			let frame = 0;
			let ended = false;
			const finish = () => {
				if (ended) return;
				ended = true;
				cancelAnimationFrame(frame);
				frames.delete(frame);
				canvas.remove();
				img.style.opacity = originalOpacity;
				if (positioned) wrapper.style.position = originalPosition;
				debug.activeReveals--;
			};
			cancelers.push(finish);
			wrapper.append(canvas);
			debug.activeReveals++;
			const start = performance.now();
			const style = getComputedStyle(img);
			// Match the actual CSS image crop, including cover/contain, without reading its pixels.
			const width = box.width;
			const height = box.height;
			const imageRatio = img.naturalWidth / img.naturalHeight;
			const boxRatio = width / height;
			const contain = style.objectFit === "contain" || style.objectFit === "scale-down";
			let drawWidth = width;
			let drawHeight = height;
			if (style.objectFit !== "fill") {
				if (imageRatio > boxRatio === contain) drawHeight = width / imageRatio;
				else drawWidth = height * imageRatio;
			}
			const position = style.objectPosition.split(" ").map(part => Number.parseFloat(part) / 100);
			const offsetX = (width - drawWidth) * (Number.isFinite(position[0]) ? position[0]! : 0.5);
			const offsetY = (height - drawHeight) * (Number.isFinite(position[1]) ? position[1]! : 0.5);
			const tick = (time: number) => {
				frames.delete(frame);
				if (disposed) return finish();
				const progress = clamp((time - start) / 900);
				const pixelSize = Math.max(1, Math.round(34 * Math.pow(1 - ease(progress), 2.2)));
				sample.width = Math.max(1, Math.ceil(width / pixelSize));
				sample.height = Math.max(1, Math.ceil(height / pixelSize));
				sampled.imageSmoothingEnabled = true;
				sampled.clearRect(0, 0, sample.width, sample.height);
				sampled.drawImage(img, (offsetX / width) * sample.width, (offsetY / height) * sample.height, (drawWidth / width) * sample.width, (drawHeight / height) * sample.height);
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.imageSmoothingEnabled = false;
				context.drawImage(sample, 0, 0, canvas.width, canvas.height);
				img.style.opacity = "0";
				if (progress < 1) {
					frame = requestAnimationFrame(tick);
					frames.add(frame);
				} else {
					debug.reveals++;
					finish();
				}
			};
			frame = requestAnimationFrame(tick);
			frames.add(frame);
		};
		if ("IntersectionObserver" in window) {
			observer = new IntersectionObserver(
				entries => {
					for (const entry of entries) if (entry.isIntersecting) void reveal(entry.target as HTMLElement);
				},
				{ threshold: 0.12, rootMargin: "0px 0px 24px 0px" }
			);
			debug.activeObservers++;
			wrappers.forEach(wrapper => observer!.observe(wrapper));
		} else wrappers.forEach(wrapper => void reveal(wrapper));
		scope.add(() => {
			disposed = true;
			if (observer) {
				observer.disconnect();
				debug.activeObservers--;
			}
			frames.forEach(cancelAnimationFrame);
			cancelers.forEach(cancel => cancel());
		});
	}

	function nextPage(scope: PageScope) {
		const link = document.querySelector<HTMLAnchorElement>("a[data-next-page]");
		if (!link) return;
		const meter = link.querySelector<HTMLElement>("[data-next-progress]");
		const threshold = 650;
		let amount = 0;
		let lastInput = 0;
		let lastFrame = 0;
		let frame = 0;
		let touchY: number | null = null;
		let pending = false;
		let impulses = 0;
		const eligible = () => {
			const box = link.getBoundingClientRect();
			const bottom = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - innerHeight - scrollY;
			return bottom <= 4 && box.top < innerHeight && box.bottom > 0;
		};
		const paint = () => {
			const progress = clamp(amount / threshold);
			debug.bottomProgress = progress;
			link.style.setProperty("--next-progress", String(progress));
			link.style.setProperty("--next-stretch", `${reducedMotion() ? 0 : progress * 14}px`);
			link.dataset.nextState = pending ? "opening" : progress > 0 ? "pulling" : "ready";
			meter?.style.setProperty("--progress", String(progress));
			if (meter) {
				meter.style.transform = `scaleX(${progress})`;
				meter.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
			}
		};
		const release = () => {
			amount = 0;
			impulses = 0;
			lastInput = 0;
			paint();
		};
		const animate = (time: number) => {
			frame = 0;
			const dt = Math.min((time - (lastFrame || time)) / 1000, 0.05);
			lastFrame = time;
			if (!eligible() && !pending) release();
			if (time - lastInput > 220 && !pending) {
				amount = Math.max(0, amount - dt * 380);
				if (amount === 0) impulses = 0;
				paint();
			}
			if (amount > 0 && !pending) frame = requestAnimationFrame(animate);
		};
		const push = (delta: number, event: Event) => {
			if (delta <= 0) {
				if (delta < 0) release();
				return;
			}
			if (!eligible() || pending) return;
			// Keep ordinary wheel/touch scrolling everywhere except this end-of-page resistance.
			if (event.cancelable) event.preventDefault();
			const now = performance.now();
			if (now - lastInput > 110) impulses++;
			lastInput = now;
			amount += Math.min(delta, 110);
			paint();
			if (amount >= threshold && impulses >= 3) {
				pending = true;
				paint();
				debug.bottomNavigations++;
				void navigate(link.href).catch(() => {
					pending = false;
					release();
				});
			} else if (!frame) {
				lastFrame = now;
				frame = requestAnimationFrame(animate);
			}
		};
		const signal = scope.abort.signal;
		window.addEventListener(
			"wheel",
			event => {
				if (event.ctrlKey || event.metaKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
				const target = event.target instanceof Element ? event.target : null;
				if (target?.closest('input, textarea, select, [contenteditable="true"], [data-native-scroll]')) return;
				push(event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1), event);
			},
			{ passive: false, signal }
		);
		window.addEventListener(
			"touchstart",
			event => {
				touchY = event.touches.length === 1 ? event.touches[0]!.clientY : null;
			},
			{ passive: true, signal }
		);
		window.addEventListener(
			"touchmove",
			event => {
				if (touchY === null || event.touches.length !== 1) return;
				const y = event.touches[0]!.clientY;
				const delta = touchY - y;
				touchY = y;
				push(delta * 2, event);
			},
			{ passive: false, signal }
		);
		window.addEventListener(
			"touchend",
			() => {
				touchY = null;
			},
			{ passive: true, signal }
		);
		window.addEventListener(
			"touchcancel",
			() => {
				touchY = null;
				release();
			},
			{ passive: true, signal }
		);
		window.addEventListener(
			"scroll",
			() => {
				if (!eligible() && !pending) release();
			},
			{ passive: true, signal }
		);
		scope.add(() => {
			cancelAnimationFrame(frame);
			release();
		});
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
					if (referrer) referrer.value = location.href;
					const status = form.querySelector<HTMLOutputElement>("[data-status]");
					if (status) status.textContent = "Opening subscription confirmation…";
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
			const darkStory = document.body.classList.contains("home-page");
			document.documentElement.dataset.navTone = !darkStory && f && f.top < y && f.bottom > y ? "light" : "dark";
		};
		window.addEventListener("scroll", update, { passive: true, signal: scope.abort.signal });
		window.addEventListener("resize", update, { passive: true, signal: scope.abort.signal });
		update();
	}

	const wipe = new PixelWipe();
	let page: PageScope | undefined;
	let navigation = 0;
	let afterSwapFrame = 0;
	const initialize = () => {
		page?.dispose();
		page = new PageScope();
		debug.pageInitializations++;
		pixelReveals(page);
		nextPage(page);
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
