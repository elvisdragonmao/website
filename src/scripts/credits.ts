import { startCrtNoise } from "./crt-noise";

function startCredits(root: HTMLElement, signal: AbortSignal): void {
	const roll = root.querySelector<HTMLElement>("[data-credits-roll]");
	const reel = root.querySelector<HTMLElement>("[data-credits-reel]");
	const button = root.querySelector<HTMLButtonElement>("[data-credits-toggle]");
	if (!roll || !reel || !button) return;
	const page = root.closest<HTMLElement>(".credits-page");
	startCrtNoise(page?.querySelector<HTMLCanvasElement>("[data-credits-static]") ?? null, signal);
	const interference = page?.querySelector<HTMLElement>("[data-credits-interference]");
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const copy = reel.cloneNode(true) as HTMLElement;
	copy.removeAttribute("data-credits-reel");
	copy.setAttribute("aria-hidden", "true");
	copy.querySelectorAll("a").forEach(link => (link.tabIndex = -1));
	roll.append(copy);
	let userPaused = reduced.matches;
	let hovering = false;
	let touching = false;
	let holdUntil = 0;
	let position = roll.scrollTop;
	let written = position;
	let cycle = reel.offsetHeight;
	let last = 0;
	let lastStatic = -Infinity;
	let frame = 0;
	const updateButton = () => {
		button.textContent = userPaused ? root.dataset.play! : root.dataset.pause!;
		button.setAttribute("aria-label", userPaused ? root.dataset.playLabel! : root.dataset.pauseLabel!);
		button.setAttribute("aria-pressed", String(userPaused));
	};
	const tick = (time: number) => {
		frame = 0;
		if (signal.aborted || document.hidden) {
			last = 0;
			return;
		}
		const elapsed = last ? Math.min(64, time - last) : 0;
		last = time;
		const keyboardFocus = roll.matches(":focus-visible") || !!roll.querySelector(":focus-visible");
		const paused = userPaused || hovering || touching || keyboardFocus || time < holdUntil;
		root.dataset.playback = paused ? "paused" : "playing";
		if (!paused) {
			// Keep fractional progress: DOM scrollTop may round subpixel assignments.
			if (Math.abs(roll.scrollTop - written) > 0.5) position = roll.scrollTop;
			position += elapsed * 0.023;
			if (cycle > 0 && position >= cycle) position %= cycle;
			roll.scrollTop = position;
			written = roll.scrollTop;
		}
		if (interference && !reduced.matches && time - lastStatic > 140) {
			lastStatic = time;
			const columns = Math.ceil(innerWidth / 7.2);
			const rows = Math.ceil(innerHeight / 18);
			let seed = Math.floor(time / 140) | 0;
			const random = () => {
				seed ^= seed << 13;
				seed ^= seed >>> 17;
				seed ^= seed << 5;
				return (seed >>> 0) / 4294967296;
			};
			const glyphs = ".:;+-=~";
			interference.textContent = Array.from({ length: rows }, () => {
				const streak = random() > 0.94;
				return Array.from({ length: columns }, () => (random() > (streak ? 0.22 : 0.985) ? glyphs[Math.floor(random() * glyphs.length)] : " ")).join("");
			}).join("\n");
		}
		frame = requestAnimationFrame(tick);
	};
	const wake = () => {
		if (!frame && !document.hidden && !signal.aborted) frame = requestAnimationFrame(tick);
	};
	const resize = new ResizeObserver(() => {
		cycle = reel.offsetHeight;
	});
	resize.observe(reel);
	roll.addEventListener(
		"pointerenter",
		event => {
			if (event.pointerType !== "touch") hovering = true;
		},
		{ signal }
	);
	roll.addEventListener(
		"pointerleave",
		() => {
			hovering = false;
		},
		{ signal }
	);
	roll.addEventListener(
		"wheel",
		() => {
			holdUntil = performance.now() + 1600;
		},
		{ signal, passive: true }
	);
	roll.addEventListener(
		"touchstart",
		() => {
			touching = true;
		},
		{ signal, passive: true }
	);
	const touchEnd = () => {
		touching = false;
		holdUntil = performance.now() + 1600;
	};
	roll.addEventListener("touchend", touchEnd, { signal, passive: true });
	roll.addEventListener("touchcancel", touchEnd, { signal, passive: true });
	button.addEventListener(
		"click",
		() => {
			userPaused = !userPaused;
			updateButton();
		},
		{ signal }
	);
	reduced.addEventListener(
		"change",
		() => {
			if (reduced.matches) userPaused = true;
			updateButton();
		},
		{ signal }
	);
	document.addEventListener("visibilitychange", wake, { signal });
	signal.addEventListener(
		"abort",
		() => {
			cancelAnimationFrame(frame);
			resize.disconnect();
			copy.remove();
			delete root.dataset.creditsMounted;
		},
		{ once: true }
	);
	button.hidden = false;
	updateButton();
	wake();
}

let active: AbortController | undefined;
function mountCredits(): void {
	const root = document.querySelector<HTMLElement>("[data-credits]");
	if (!root || root.dataset.creditsMounted) return;
	active?.abort();
	active = new AbortController();
	root.dataset.creditsMounted = "true";
	startCredits(root, active.signal);
}
document.addEventListener("astro:before-swap", () => active?.abort());
document.addEventListener("astro:page-load", mountCredits);
mountCredits();
