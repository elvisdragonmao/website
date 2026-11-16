/** Responsive glyph boxes and replayable image sampling. Original rendering code;
 * visual reference: ertdfgcvb's Box fun (equal glyph boxes + character shadows).
 */
let disposeGallery: (() => void) | undefined;
const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function drawOutline(card: HTMLElement) {
	const svg = card.querySelector<SVGSVGElement>("[data-box-outline]");
	if (!svg) return;
	const cols = Math.max(20, Math.floor(card.clientWidth / 8));
	const rows = Math.max(15, Math.floor(card.clientHeight / 16));
	const depth = 3;
	const signature = `${cols}:${rows}`;
	if (svg.dataset.grid === signature) return;
	svg.dataset.grid = signature;
	svg.setAttribute("viewBox", `0 0 ${cols * 8} ${rows * 16}`);
	const grid = Array.from({ length: rows }, () => Array<string>(cols).fill(" "));
	const put = (x: number, y: number, glyph: string) => {
		if (grid[y]?.[x] !== undefined) grid[y]![x] = glyph;
	};
	for (let x = depth + 1; x < cols - 1; x++) put(x, 0, "─");
	for (let x = 1; x < cols - depth - 1; x++) {
		put(x, depth, "═");
		put(x, rows - 1, "═");
	}
	for (let y = depth + 1; y < rows - 1; y++) {
		put(0, y, "║");
		put(cols - depth - 1, y, "║");
	}
	for (let y = 1; y < rows - depth - 1; y++) put(cols - 1, y, "│");
	for (let x = cols - depth; x < cols - 1; x++) for (let y = depth + 1; y < rows - depth; y++) put(x, y, "░");
	for (let d = 1; d < depth; d++) {
		put(depth - d, d, "╱");
		put(cols - 1 - d, d, "╱");
		put(cols - 1 - d, rows - depth - 1 + d, "╱");
	}
	put(depth, 0, "┌");
	put(cols - 1, 0, "┐");
	put(0, depth, "╔");
	put(cols - depth - 1, depth, "╗");
	put(0, rows - 1, "╚");
	put(cols - depth - 1, rows - 1, "╝");
	put(cols - 1, rows - depth - 1, "┘");
	const fragment = document.createDocumentFragment();
	grid.forEach((row, y) => {
		const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
		text.setAttribute("x", "0");
		text.setAttribute("y", String(y * 16 + 12));
		text.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
		text.style.setProperty("--glyph-row-delay", `${y * 9}ms`);
		text.textContent = row.join("");
		fragment.append(text);
	});
	svg.replaceChildren(fragment);
}

function mountGallery() {
	disposeGallery?.();
	const galleries = [...document.querySelectorAll<HTMLElement>("[data-work-gallery]")];
	if (!galleries.length) {
		disposeGallery = undefined;
		return;
	}
	const controller = new AbortController();
	const signal = controller.signal;
	let disposed = false;
	const cleanups: Array<() => void> = [];
	const cards = galleries.flatMap(gallery => [...gallery.querySelectorAll<HTMLAnchorElement>(".work-box")]);
	const resize = new ResizeObserver(entries => entries.forEach(entry => drawOutline(entry.target as HTMLElement)));
	const revealers = new Map<Element, { enter: () => void; exit: () => void }>();
	const observer = new IntersectionObserver(
		entries => {
			for (const entry of entries) {
				if (entry.isIntersecting && entry.intersectionRatio > 0.05) revealers.get(entry.target)?.enter();
				else if (!entry.isIntersecting) revealers.get(entry.target)?.exit();
			}
		},
		{ threshold: [0, 0.06, 0.18] }
	);
	for (const card of cards) {
		card.dataset.workAnimated = "true";
		card.dataset.workVisible = "false";
		drawOutline(card);
		resize.observe(card);
		const wrapper = card.querySelector<HTMLElement>("[data-work-image]");
		const img = wrapper?.querySelector<HTMLImageElement>("img");
		if (!wrapper || !img) continue;
		const media: HTMLElement = wrapper;
		const image: HTMLImageElement = img;
		let generation = 0,
			frame = 0;
		let canvas: HTMLCanvasElement | undefined;
		const originalOpacity = image.style.opacity;
		const stop = () => {
			cancelAnimationFrame(frame);
			frame = 0;
			canvas?.remove();
			canvas = undefined;
			image.style.opacity = originalOpacity;
			media.dataset.revealState = "clear";
			delete media.dataset.pixelSize;
		};
		const replay = async () => {
			const token = ++generation;
			stop();
			if (reducedMotion()) return;
			try {
				await image.decode();
			} catch {
				return;
			}
			if (disposed || token !== generation || !image.naturalWidth) return;
			const width = media.clientWidth,
				height = media.clientHeight;
			if (!width || !height) return;
			const layer = document.createElement("canvas");
			layer.setAttribute("aria-hidden", "true");
			layer.dataset.workPixelCanvas = "";
			layer.width = Math.ceil(width);
			layer.height = Math.ceil(height);
			const context = layer.getContext("2d");
			const sample = document.createElement("canvas"),
				sampled = sample.getContext("2d");
			if (!context || !sampled) return;
			canvas = layer;
			media.append(layer);
			image.style.opacity = "0";
			media.dataset.revealState = "sampling";
			media.dataset.revealCount = String(Number(media.dataset.revealCount || 0) + 1);
			const style = getComputedStyle(image);
			const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
			const drawWidth = image.naturalWidth * scale,
				drawHeight = image.naturalHeight * scale;
			const position = style.objectPosition.split(" ");
			const fraction = (s: string | undefined) =>
				s === "top" || s === "left" ? 0 : s === "bottom" || s === "right" ? 1 : s === "center" ? 0.5 : Number.isFinite(parseFloat(s || "")) ? parseFloat(s!) / 100 : 0.5;
			const x = (width - drawWidth) * fraction(position[0]),
				y = (height - drawHeight) * fraction(position[1]);
			const start = performance.now();
			const levels = [42, 30, 22, 15, 10, 6, 3, 2, 1];
			const tick = (time: number) => {
				if (disposed || token !== generation) return;
				const progress = clamp((time - start) / 780, 0, 1);
				const index = Math.min(levels.length - 1, Math.floor(progress * levels.length));
				const cell = levels[index]!;
				media.dataset.pixelSize = String(cell);
				sample.width = Math.max(1, Math.ceil(width / cell));
				sample.height = Math.max(1, Math.ceil(height / cell));
				sampled.imageSmoothingEnabled = true;
				sampled.fillStyle = "#132024";
				sampled.fillRect(0, 0, sample.width, sample.height);
				sampled.drawImage(image, (x / width) * sample.width, (y / height) * sample.height, (drawWidth / width) * sample.width, (drawHeight / height) * sample.height);
				context.imageSmoothingEnabled = false;
				context.clearRect(0, 0, width, height);
				context.drawImage(sample, 0, 0, width, height);
				if (progress < 1) frame = requestAnimationFrame(tick);
				else stop();
			};
			tick(start);
		};
		const enter = () => {
			if (card.dataset.workVisible === "true") return;
			card.dataset.workVisible = "true";
			void replay();
		};
		const exit = () => {
			generation++;
			stop();
			card.dataset.workVisible = "false";
		};
		card.addEventListener(
			"pointerenter",
			() => {
				card.dataset.workVisible = "true";
				void replay();
			},
			{ signal }
		);
		card.addEventListener(
			"focus",
			() => {
				card.dataset.workVisible = "true";
				void replay();
			},
			{ signal }
		);
		revealers.set(card, { enter, exit });
		observer.observe(card);
		cleanups.push(() => {
			generation++;
			stop();
			delete card.dataset.workAnimated;
			delete card.dataset.workVisible;
		});
	}
	disposeGallery = () => {
		disposed = true;
		controller.abort();
		observer.disconnect();
		resize.disconnect();
		cleanups.forEach(cleanup => cleanup());
		revealers.clear();
	};
}
document.addEventListener("astro:before-swap", () => {
	disposeGallery?.();
	disposeGallery = undefined;
});
document.addEventListener("astro:page-load", mountGallery);
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountGallery, { once: true });
else mountGallery();
