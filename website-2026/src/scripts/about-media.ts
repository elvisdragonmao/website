type ImageArtwork = {
	element: HTMLElement;
	images: HTMLImageElement[];
	canvas: HTMLCanvasElement;
	ready: boolean;
};
const hash = (n: number) => {
	const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
	return v - Math.floor(v);
};

/** Still high-resolution glyphs plus a separate, cheap animated atmosphere layer. */
export function startAboutMedia(root: HTMLElement, signal: AbortSignal): void {
	const artworks: ImageArtwork[] = [];
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const portrait = root.querySelector<HTMLElement>('[data-image-art="portrait"]');
	const cloud = portrait?.querySelector<HTMLCanvasElement>("[data-image-atmosphere]");
	let resizeFrame = 0,
		animationFrame = 0,
		lastPaint = 0,
		visible = false;
	const paint = (art: ImageArtwork) => {
		if (!art.ready || signal.aborted) return;
		const { width, height } = art.element.getBoundingClientRect();
		if (width < 1 || height < 1) return;
		const composition = document.createElement("canvas");
		composition.width = Math.ceil(width * 2);
		composition.height = Math.ceil(height * 2);
		const ctx = composition.getContext("2d");
		const output = art.canvas.getContext("2d");
		if (!ctx || !output) return;
		ctx.scale(2, 2);
		const kind = art.element.dataset.imageArt;
		const drawSoft = (image: HTMLImageElement, x: number, y: number, w: number, h: number, zoom = 1, feather = false, topAligned = false) => {
			const scale = Math.min(w / image.naturalWidth, h / image.naturalHeight) * zoom;
			const dw = image.naturalWidth * scale,
				dh = image.naturalHeight * scale;
			const left = x + (w - dw) / 2,
				top = topAligned ? y : y + h - dh;
			const layer = document.createElement("canvas");
			layer.width = composition.width;
			layer.height = composition.height;
			const c = layer.getContext("2d");
			if (!c) return;
			c.scale(2, 2);
			c.drawImage(image, left, top, dw, dh);
			if (feather) {
				c.globalCompositeOperation = "destination-in";
				const fade = c.createLinearGradient(0, top, 0, top + dh);
				fade.addColorStop(0, "transparent");
				fade.addColorStop(0.06, "white");
				fade.addColorStop(0.64, "white");
				fade.addColorStop(1, "transparent");
				c.fillStyle = fade;
				c.fillRect(0, 0, width, height);
			}
			ctx.drawImage(layer, 0, 0, width, height);
		};
		if (kind === "music") {
			drawSoft(art.images[0]!, width * 0.28, height * 0.03, width * 0.84, height * 1.15, 1.05, true, true);
			drawSoft(art.images[1]!, -width * 0.22, height * 0.13, width * 1.16, height * 0.93, 1.06, true);
		} else if (kind === "debate") drawSoft(art.images[0]!, width * 0.07, height * 0.02, width * 0.86, height * 0.84, 1, false, true);
		else drawSoft(art.images[0]!, 0, -height * 0.18, width, height * 1.42, 1, false, true);
		if (kind === "music" || kind === "debate") {
			ctx.globalCompositeOperation = "destination-in";
			const dissolve = ctx.createLinearGradient(0, 0, 0, height);
			dissolve.addColorStop(0, "transparent");
			dissolve.addColorStop(0.04, "white");
			dissolve.addColorStop(0.58, "white");
			dissolve.addColorStop(0.98, "transparent");
			ctx.fillStyle = dissolve;
			ctx.fillRect(0, 0, width, height);
			const sides = ctx.createLinearGradient(0, 0, width, 0);
			sides.addColorStop(0, "transparent");
			sides.addColorStop(0.08, "white");
			sides.addColorStop(0.87, "white");
			sides.addColorStop(1, "transparent");
			ctx.fillStyle = sides;
			ctx.fillRect(0, 0, width, height);
		}
		const columns = Math.max(110, Math.min(210, Math.round(width / 2.7)));
		const cell = width / columns,
			lineHeight = cell / 0.6,
			rows = Math.max(1, Math.round(height / lineHeight));
		const sampler = document.createElement("canvas");
		sampler.width = columns;
		sampler.height = rows;
		const sample = sampler.getContext("2d", { willReadFrequently: true });
		if (!sample) return;
		sample.drawImage(composition, 0, 0, columns, rows);
		const pixels = sample.getImageData(0, 0, columns, rows).data;
		const ratio = Math.min(devicePixelRatio || 1, 2);
		art.canvas.width = Math.round(width * ratio);
		art.canvas.height = Math.round(height * ratio);
		output.setTransform(ratio, 0, 0, ratio, 0, 0);
		output.font = `500 ${lineHeight.toFixed(3)}px "IBM Plex Mono", monospace`;
		output.textBaseline = "top";
		output.textAlign = "center";
		const ramp = " .,:;irsXA253hMHGS#9B&@";
		for (let y = 0; y < rows; y++)
			for (let x = 0; x < columns; x++) {
				const i = (y * columns + x) * 4;
				const r = pixels[i]!,
					g = pixels[i + 1]!,
					b = pixels[i + 2]!,
					alpha = pixels[i + 3]! / 255;
				const l = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;
				if (alpha < 0.04 || l < 0.006) continue;
				const tone = Math.min(1, 0.05 + Math.pow(l, 0.64) * 0.95);
				const glyph = ramp[Math.floor(tone * (ramp.length - 1))]!;
				const gray = Math.round(25 + Math.pow(l, 0.7) * 230);
				output.fillStyle = kind === "music" ? `rgba(${gray},${gray},${gray},${alpha})` : `rgba(${r * 0.78 + 60},${g * 0.78 + 60},${b * 0.78 + 60},${alpha})`;
				output.fillText(glyph, (x + 0.5) * cell, y * lineHeight);
			}
		art.element.dataset.mediaReady = "true";
		art.element.dataset.mediaGrid = `${columns}×${rows}`;
		const halo = art.element.querySelector<HTMLCanvasElement>("[data-image-halo]");
		if (halo) {
			halo.width = art.canvas.width;
			halo.height = art.canvas.height;
			halo.getContext("2d")?.drawImage(art.canvas, 0, 0);
		}
	};
	const paintCloud = (time: number) => {
		if (!cloud || !portrait) return;
		const { width: w, height: h } = portrait.getBoundingClientRect();
		const ratio = Math.min(devicePixelRatio || 1, 1.5);
		if (cloud.width !== Math.round(w * ratio) || cloud.height !== Math.round(h * ratio)) {
			cloud.width = Math.round(w * ratio);
			cloud.height = Math.round(h * ratio);
		}
		const c = cloud.getContext("2d");
		if (!c) return;
		c.setTransform(ratio, 0, 0, ratio, 0, 0);
		c.clearRect(0, 0, w, h);
		c.globalCompositeOperation = "source-over";
		for (let i = 0; i < 5; i++) {
			const angle = i * 1.256 + time * 0.07;
			const x = w * (0.5 + Math.cos(angle) * 0.24),
				y = h * (0.5 + Math.sin(angle) * 0.27);
			const radius = w * (0.12 + 0.025 * Math.sin(time * 0.3 + i));
			const glow = c.createRadialGradient(x, y, 0, x, y, radius);
			glow.addColorStop(0, i % 2 ? "#a87deb26" : "#38c8f22c");
			glow.addColorStop(1, "transparent");
			c.fillStyle = glow;
			c.fillRect(x - radius, y - radius, radius * 2, radius * 2);
		}
		c.font = '9px "IBM Plex Mono",monospace';
		const glyphs = ".:+*░";
		for (let i = 0; i < 650; i++) {
			const phase = hash(i) * Math.PI * 2 + time * (0.025 + hash(i + 8) * 0.025);
			const radius = 0.72 + hash(i + 1) * 0.36 + Math.sin(phase * 3 + time * 0.28) * 0.09;
			const x = w * (0.5 + Math.cos(phase) * radius * 0.43) + Math.sin(time * 0.25 + i) * 10;
			const y = h * (0.5 + Math.sin(phase) * radius * 0.47) + Math.cos(time * 0.18 + i) * 8;
			const edge = Math.max(0, Math.min(x / 35, (w - x) / 35, y / 35, (h - y) / 35, 1));
			const alpha = edge * (0.08 + hash(i + 2) * 0.32) * (0.65 + 0.35 * Math.sin(time * 0.45 + i));
			c.fillStyle = `hsla(${190 + hash(i + 3) * 95},75%,${55 + hash(i + 4) * 25}%,${alpha})`;
			c.fillText(glyphs[Math.floor(hash(i + 5) * glyphs.length)]!, x, y);
		}
	};
	const animate = (ms: number) => {
		animationFrame = 0;
		if (signal.aborted || document.hidden || !visible) return;
		if (ms - lastPaint > 85) {
			lastPaint = ms;
			paintCloud(reduced.matches ? 0 : ms / 1000);
		}
		if (!reduced.matches) animationFrame = requestAnimationFrame(animate);
	};
	const wake = () => {
		if (!animationFrame && !signal.aborted && visible) animationFrame = requestAnimationFrame(animate);
	};
	const schedule = () => {
		if (!resizeFrame && !signal.aborted)
			resizeFrame = requestAnimationFrame(() => {
				resizeFrame = 0;
				for (const art of artworks) paint(art);
				paintCloud(reduced.matches ? 0 : performance.now() / 1000);
			});
	};
	const resize = new ResizeObserver(schedule);
	for (const element of root.querySelectorAll<HTMLElement>("[data-image-art]")) {
		const images = [...element.querySelectorAll<HTMLImageElement>("img")];
		const canvas = element.querySelector<HTMLCanvasElement>("[data-image-output]");
		if (!canvas) {
			void Promise.all(images.map(image => image.decode()))
				.then(() => {
					if (!signal.aborted) element.dataset.mediaReady = "true";
				})
				.catch(() => {});
			continue;
		}
		const art = { element, images, canvas, ready: false };
		artworks.push(art);
		resize.observe(element);
		void Promise.all([...images.map(image => image.decode()), document.fonts.load('500 12px "IBM Plex Mono"')])
			.then(() => {
				if (signal.aborted) return;
				art.ready = true;
				schedule();
			})
			.catch(() => {
				/* The original image remains the progressive fallback. */
			});
	}
	const visibility = new IntersectionObserver(
		entries => {
			visible = entries.some(e => e.isIntersecting);
			wake();
		},
		{ rootMargin: "40px" }
	);
	if (portrait) visibility.observe(portrait);
	document.addEventListener("visibilitychange", wake, { signal });
	reduced.addEventListener(
		"change",
		() => {
			lastPaint = 0;
			wake();
		},
		{ signal }
	);
	signal.addEventListener(
		"abort",
		() => {
			resize.disconnect();
			visibility.disconnect();
			cancelAnimationFrame(resizeFrame);
			cancelAnimationFrame(animationFrame);
		},
		{ once: true }
	);
}
