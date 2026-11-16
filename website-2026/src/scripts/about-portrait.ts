/** Rebuild the original portrait entirely from colored glyphs at display resolution. */
export function startAboutPortrait(root: HTMLElement, signal: AbortSignal): void {
	const frame = root.querySelector<HTMLElement>('[data-about-art="portrait"]');
	const source = frame?.querySelector<HTMLImageElement>(".portrait-source");
	const canvas = frame?.querySelector<HTMLCanvasElement>("[data-portrait-output]");
	if (!frame || !source || !canvas) return;
	let ready = false;
	let paintFrame = 0;
	const paint = () => {
		paintFrame = 0;
		if (!ready || signal.aborted) return;
		const { width, height } = frame.getBoundingClientRect();
		if (width < 1 || height < 1) return;
		const context = canvas.getContext("2d");
		if (!context) return;
		const ratio = Math.min(devicePixelRatio || 1, 2);
		canvas.width = Math.round(width * ratio);
		canvas.height = Math.round(height * ratio);
		context.setTransform(ratio, 0, 0, ratio, 0, 0);
		context.clearRect(0, 0, width, height);
		const drawHeight = Math.min(height, (width * source.naturalHeight) / source.naturalWidth);
		const drawWidth = (drawHeight * source.naturalWidth) / source.naturalHeight;
		const left = (width - drawWidth) / 2,
			top = (height - drawHeight) / 2;
		const columns = Math.max(112, Math.min(192, Math.round(drawWidth / 2.4)));
		const cellWidth = drawWidth / columns;
		const cellHeight = cellWidth / 0.6;
		const rows = Math.max(1, Math.round(drawHeight / cellHeight));
		const sampler = document.createElement("canvas");
		sampler.width = columns;
		sampler.height = rows;
		const pixelsContext = sampler.getContext("2d", { willReadFrequently: true });
		if (!pixelsContext) return;
		pixelsContext.drawImage(source, 0, 0, columns, rows);
		const pixels = pixelsContext.getImageData(0, 0, columns, rows).data;
		const ramp = " .,:;irsXA253hMHGS#9B&@";
		context.font = `500 ${cellHeight.toFixed(3)}px "IBM Plex Mono", monospace`;
		context.textBaseline = "top";
		context.textAlign = "center";
		for (let y = 0; y < rows; y++)
			for (let x = 0; x < columns; x++) {
				const index = (y * columns + x) * 4;
				const r = pixels[index]!,
					g = pixels[index + 1]!,
					b = pixels[index + 2]!,
					alpha = pixels[index + 3]! / 255;
				const luminance = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;
				if (alpha < 0.1 || luminance < 0.006) continue;
				const tone = Math.min(1, 0.08 + Math.pow(luminance, 0.5) * 0.92);
				const glyph = ramp[Math.min(ramp.length - 1, Math.floor(tone * (ramp.length - 1)))]!;
				context.fillStyle = `rgba(${Math.min(255, r * 0.6 + 94)},${Math.min(255, g * 0.6 + 94)},${Math.min(255, b * 0.6 + 94)},${alpha})`;
				context.fillText(glyph, left + (x + 0.5) * cellWidth, top + y * cellHeight);
			}
		frame.dataset.portraitReady = "true";
		frame.dataset.portraitGrid = `${columns}×${rows}`;
	};
	const schedule = () => {
		if (!paintFrame && !signal.aborted) paintFrame = requestAnimationFrame(paint);
	};
	const observer = new ResizeObserver(schedule);
	observer.observe(frame);
	void Promise.all([source.decode(), document.fonts.load('500 12px "IBM Plex Mono"')])
		.then(() => {
			if (!signal.aborted) {
				ready = true;
				schedule();
			}
		})
		.catch(() => {
			/* Keep the original portrait if glyph rendering is unavailable. */
		});
	signal.addEventListener(
		"abort",
		() => {
			observer.disconnect();
			cancelAnimationFrame(paintFrame);
		},
		{ once: true }
	);
}
