/** Scanline-sculpted typography: the text itself bends, echoes, and briefly tears. */
export function startAboutType(root: HTMLElement, signal: AbortSignal): void {
	const card = root.querySelector<HTMLElement>(".facet-motto");
	const canvas = card?.querySelector<HTMLCanvasElement>("[data-motto-type]");
	if (!card || !canvas) return;
	const lines = [...card.querySelectorAll(".motto-copy span")].map(span => span.textContent ?? "");
	if (lines.length !== 3) return;
	const context = canvas.getContext("2d");
	if (!context) return;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const source = document.createElement("canvas"),
		c = source.getContext("2d");
	if (!c) return;
	let w = 0,
		h = 0,
		ratio = 1,
		frame = 0,
		last = 0,
		visible = false,
		ready = false;
	const pointer = { x: 0, y: 0 };
	const fit = () => {
		const box = canvas.getBoundingClientRect();
		w = box.width;
		h = box.height;
		ratio = Math.min(devicePixelRatio || 1, 2);
		canvas.width = source.width = Math.ceil(w * ratio);
		canvas.height = source.height = Math.ceil(h * ratio);
		c.setTransform(ratio, 0, 0, ratio, 0, 0);
		c.clearRect(0, 0, w, h);
		c.textAlign = "center";
		c.textBaseline = "middle";
		c.fillStyle = "#dedbcc";
		c.font = `italic 500 ${Math.min(22, w / 8)}px "IBM Plex Mono", sans-serif`;
		c.fillText(lines[0]!, w * 0.5, h * 0.23);
		c.font = `italic 500 ${Math.min(76, w / 4.6)}px "IBM Plex Mono", sans-serif`;
		c.lineWidth = 0.8;
		c.strokeStyle = "#91cbd680";
		c.strokeText(lines[1]!, w * 0.5 + 4, h * 0.51 + 5);
		c.fillStyle = "#e4e1d5";
		c.fillText(lines[1]!, w * 0.5, h * 0.51);
		c.font = `italic 500 ${Math.min(30, w / 6.8)}px "IBM Plex Mono", sans-serif`;
		c.fillStyle = "#cedbd4";
		c.fillText(lines[2]!, w * 0.5, h * 0.79);
		paint(reduced.matches ? 0 : performance.now() / 1000);
	};
	const paint = (t: number) => {
		if (!ready || signal.aborted) return;
		context.setTransform(ratio, 0, 0, ratio, 0, 0);
		context.clearRect(0, 0, w, h);
		const intensity = reduced.matches ? 0.28 : 1 + Math.abs(pointer.x) * 0.9;
		// Low-opacity repeated contours leave an elastic trail behind the main glyphs.
		for (let i = 3; i > 0; i--) {
			context.globalAlpha = 0.035 * i;
			context.drawImage(source, 0, 0, source.width, source.height, Math.sin(t * 0.7 + i) * i * 5, Math.cos(t * 0.5 + i) * i * 4, w, h);
		}
		context.globalAlpha = 1;
		for (let y = 0; y < h; y += 3) {
			const zone = 0.4 + 0.6 * Math.sin((y / h) * Math.PI);
			const tear = Math.pow(Math.max(0, Math.sin(t * 1.1 + y * 0.017)), 24);
			const dx = (Math.sin(y * 0.055 + t * 1.5) * 11 + Math.sin(y * 0.13 - t * 0.9) * 5 + tear * 32) * intensity * zone;
			const stretch = 1 + Math.sin(y * 0.035 + t) * 0.055 * intensity;
			const dy = Math.sin(y * 0.04 - t * 0.8) * 3.5 * intensity;
			context.drawImage(source, 0, y * ratio, source.width, Math.min(3 * ratio, source.height - y * ratio), dx - (w * stretch - w) / 2, y + dy, w * stretch, 3);
		}
		context.font = '9px "IBM Plex Mono"';
		context.fillStyle = "#93b8c854";
		for (let i = 0; i < 32; i++) {
			const seed = Math.sin(i * 127.1 + Math.floor(t * 3)) * 43758.54,
				noise = seed - Math.floor(seed);
			if (noise > 0.72) context.fillText(":/+."[i % 4]!, w * (0.08 + ((i * 0.173) % 0.84)), h * (0.1 + noise * 0.8));
		}
	};
	const tick = (ms: number) => {
		frame = 0;
		if (signal.aborted || document.hidden || !visible) return;
		if (ms - last > 70) {
			last = ms;
			paint(reduced.matches ? 0 : ms / 1000);
		}
		if (!reduced.matches) frame = requestAnimationFrame(tick);
	};
	const wake = () => {
		if (!frame && visible && ready && !signal.aborted) frame = requestAnimationFrame(tick);
	};
	const resize = new ResizeObserver(() => {
		if (ready) fit();
	});
	resize.observe(card);
	const observer = new IntersectionObserver(entries => {
		visible = entries.some(e => e.isIntersecting);
		wake();
	});
	observer.observe(card);
	card.addEventListener(
		"pointermove",
		event => {
			const box = card.getBoundingClientRect();
			pointer.x = (event.clientX - box.left) / box.width - 0.5;
			pointer.y = (event.clientY - box.top) / box.height - 0.5;
			wake();
		},
		{ signal, passive: true }
	);
	card.addEventListener(
		"pointerleave",
		() => {
			pointer.x = pointer.y = 0;
			wake();
		},
		{ signal }
	);
	document.addEventListener("visibilitychange", wake, { signal });
	reduced.addEventListener(
		"change",
		() => {
			paint(0);
			wake();
		},
		{ signal }
	);
	void document.fonts.load('italic 500 24px "IBM Plex Mono"').then(() => {
		if (signal.aborted) return;
		ready = true;
		fit();
		card.dataset.typeReady = "true";
		wake();
	});
	signal.addEventListener(
		"abort",
		() => {
			cancelAnimationFrame(frame);
			resize.disconnect();
			observer.disconnect();
		},
		{ once: true }
	);
}
