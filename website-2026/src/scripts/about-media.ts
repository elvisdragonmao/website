type ImageArtwork = {
	element: HTMLElement;
	images: HTMLImageElement[];
	canvas: HTMLCanvasElement;
	ready: boolean;
};

/** One still glyph composition per image/resize. Motion stays in the CSS image treatment. */
export function startAboutMedia(root: HTMLElement, signal: AbortSignal): void {
	const buttons = [...root.querySelectorAll<HTMLButtonElement>("[data-image-mode-button]")];
	const setMode = (mode: "ascii" | "image", updateUrl = false) => {
		root.dataset.imageMode = mode;
		for (const button of buttons) button.setAttribute("aria-pressed", String(button.dataset.imageModeButton === mode));
		if (updateUrl) {
			const url = new URL(location.href);
			url.searchParams.set("media", mode);
			history.replaceState(history.state, "", url);
		}
	};
	setMode(root.dataset.imageMode === "image" ? "image" : "ascii");
	root.dataset.mediaControlsReady = "true";
	for (const button of buttons) button.addEventListener("click", () => setMode(button.dataset.imageModeButton === "image" ? "image" : "ascii", true), { signal });
	const artworks: ImageArtwork[] = [];
	let frame = 0;
	const paint = (art: ImageArtwork) => {
		if (!art.ready || signal.aborted) return;
		const { width, height } = art.element.getBoundingClientRect();
		if (width < 1 || height < 1) return;
		const composition = document.createElement("canvas");
		composition.width = Math.ceil(width * 2);
		composition.height = Math.ceil(height * 2);
		const ctx = composition.getContext("2d", { willReadFrequently: true });
		const output = art.canvas.getContext("2d");
		if (!ctx || !output) return;
		ctx.scale(2, 2);
		const kind = art.element.dataset.imageArt;
		const drawContained = (image: HTMLImageElement, x: number, y: number, w: number, h: number) => {
			const scale = Math.min(w / image.naturalWidth, h / image.naturalHeight);
			const dw = image.naturalWidth * scale,
				dh = image.naturalHeight * scale;
			ctx.drawImage(image, x + (w - dw) / 2, y + h - dh, dw, dh);
		};
		if (kind === "music") {
			drawContained(art.images[0]!, width * 0.38, 0, width * 0.65, height);
			drawContained(art.images[1]!, 0, height * 0.12, width * 0.76, height * 0.88);
		} else if (kind === "furry") {
			const image = art.images[0]!;
			const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
			const w = image.naturalWidth * scale,
				h = image.naturalHeight * scale;
			ctx.drawImage(image, (width - w) / 2, (height - h) / 2, w, h);
		} else drawContained(art.images[0]!, 0, 0, width, height);

		const columns = Math.max(90, Math.min(190, Math.round(width / 2.7)));
		const cell = width / columns,
			lineHeight = cell / 0.6;
		const rows = Math.max(1, Math.round(height / lineHeight));
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
				if (alpha < 0.08 || l < 0.006) continue;
				const tone = Math.min(1, 0.05 + Math.pow(l, 0.64) * 0.95);
				const glyph = ramp[Math.floor(tone * (ramp.length - 1))]!;
				const gray = Math.round(25 + Math.pow(l, 0.7) * 230);
				output.fillStyle = kind === "portrait" ? `rgba(${r * 0.65 + 85},${g * 0.65 + 85},${b * 0.65 + 85},${alpha})` : `rgba(${gray},${gray},${gray},${alpha})`;
				output.fillText(glyph, (x + 0.5) * cell, y * lineHeight);
			}
		art.element.dataset.mediaReady = "true";
		art.element.dataset.mediaGrid = `${columns}×${rows}`;
	};
	const schedule = () => {
		if (!frame && !signal.aborted)
			frame = requestAnimationFrame(() => {
				frame = 0;
				for (const art of artworks) paint(art);
			});
	};
	const observer = new ResizeObserver(schedule);
	for (const element of root.querySelectorAll<HTMLElement>("[data-image-art]")) {
		const images = [...element.querySelectorAll<HTMLImageElement>("img")];
		const canvas = element.querySelector<HTMLCanvasElement>("[data-image-output]");
		if (!canvas || !images.length) continue;
		const art = { element, images, canvas, ready: false };
		artworks.push(art);
		observer.observe(element);
		void Promise.all([...images.map(image => image.decode()), document.fonts.load('500 12px "IBM Plex Mono"')])
			.then(() => {
				if (signal.aborted) return;
				art.ready = true;
				schedule();
			})
			.catch(() => {
				/* Keep the source image when decoding or canvas is unavailable. */
			});
	}
	signal.addEventListener(
		"abort",
		() => {
			observer.disconnect();
			cancelAnimationFrame(frame);
		},
		{ once: true }
	);
}
