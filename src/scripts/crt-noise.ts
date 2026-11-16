/** Low-resolution television grain, independent of readable page content. */
export function startCrtNoise(canvas: HTMLCanvasElement | null, signal: AbortSignal): void {
	if (!canvas) return;
	const context = canvas.getContext("2d");
	if (!context) return;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	let pixels: ImageData,
		visible = false,
		frame = 0,
		last = -Infinity;
	const paint = (time: number) => {
		if (!pixels || signal.aborted) return;
		let seed = (Math.floor(time / 110) + 1) | 0;
		for (let i = 0; i < pixels.data.length; i += 4) {
			seed ^= seed << 13;
			seed ^= seed >>> 17;
			seed ^= seed << 5;
			const value = seed & 255;
			pixels.data[i] = value * 0.76;
			pixels.data[i + 1] = value * 0.87;
			pixels.data[i + 2] = value;
			pixels.data[i + 3] = 210;
		}
		context.putImageData(pixels, 0, 0);
		canvas.dataset.staticReady = "true";
	};
	const fit = () => {
		const box = canvas.getBoundingClientRect();
		canvas.width = Math.max(32, Math.min(300, Math.round(box.width / 4)));
		canvas.height = Math.max(24, Math.round(box.height / 4));
		pixels = context.createImageData(canvas.width, canvas.height);
		paint(reduced.matches ? 0 : performance.now());
	};
	const tick = (time: number) => {
		frame = 0;
		if (signal.aborted || document.hidden || !visible) return;
		if (time - last >= 110) {
			last = time;
			paint(reduced.matches ? 0 : time);
		}
		if (!reduced.matches) frame = requestAnimationFrame(tick);
	};
	const wake = () => {
		if (!frame && visible && !signal.aborted) frame = requestAnimationFrame(tick);
	};
	const observer = new IntersectionObserver(entries => {
		visible = entries.some(e => e.isIntersecting);
		wake();
	});
	observer.observe(canvas);
	const resize = new ResizeObserver(fit);
	resize.observe(canvas);
	reduced.addEventListener(
		"change",
		() => {
			paint(0);
			wake();
		},
		{ signal }
	);
	document.addEventListener("visibilitychange", wake, { signal });
	fit();
	signal.addEventListener(
		"abort",
		() => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			resize.disconnect();
		},
		{ once: true }
	);
}
