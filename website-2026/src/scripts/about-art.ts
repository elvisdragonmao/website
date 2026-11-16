type Kind = "touch" | "code" | "type" | "hardware" | "camera" | "broadcast";
type Artwork = {
	element: HTMLElement;
	output: HTMLPreElement;
	kind: Kind;
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;
	columns: number;
	rows: number;
	pointer: { x: number; y: number };
};
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/** Small local glyph fields. No terminal emulator, WebGL context or animation library. */
export function startAboutArt(root: HTMLElement, signal: AbortSignal): void {
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const artworks: Artwork[] = [];
	const visible = new Set<Artwork>();
	let frame = 0;
	let lastPaint = -Infinity;
	const resize = (art: Artwork) => {
		const bounds = art.element.getBoundingClientRect();
		const typography = art.kind === "type";
		art.columns = clamp(Math.floor(bounds.width / (typography ? 4 : 6)), 24, 82);
		art.rows = clamp(Math.floor(bounds.height / (typography ? 6 : 11.2)), 10, typography ? 36 : 24);
		art.canvas.width = art.columns * 2;
		art.canvas.height = art.rows * 2;
		const size = Math.min(bounds.width / (art.columns * 0.6), bounds.height / (art.rows * 1.12), 10);
		art.output.style.fontSize = `${size.toFixed(2)}px`;
		art.output.style.lineHeight = "1.12";
	};
	const render = (art: Artwork, time: number) => {
		const { context: ctx, canvas, columns, rows, kind, pointer } = art;
		let pixels: Uint8ClampedArray | undefined;
		if (kind !== "touch" && kind !== "hardware") {
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.scale(canvas.width / 480, canvas.height / 270);
			ctx.strokeStyle = "white";
			ctx.fillStyle = "white";
			ctx.lineWidth = 8;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			const line = (points: number[][]) => {
				ctx.beginPath();
				points.forEach(([x, y], i) => (i ? ctx.lineTo(x!, y!) : ctx.moveTo(x!, y!)));
				ctx.stroke();
			};
			if (kind === "code") {
				ctx.strokeRect(40, 30, 400, 180);
				line([
					[175, 84],
					[142, 118],
					[175, 152]
				]);
				line([
					[305, 84],
					[338, 118],
					[305, 152]
				]);
				line([
					[257, 72],
					[224, 166]
				]);
				line([
					[200, 210],
					[200, 240],
					[280, 240],
					[280, 210]
				]);
				line([
					[160, 244],
					[320, 244]
				]);
				ctx.globalAlpha = 0.55 + 0.3 * Math.sin(time * 1.4);
				ctx.fillRect(371, 165, 15, 8);
				ctx.globalAlpha = 1;
			} else if (kind === "type") {
				// A single designed glyph, displaced by narrow scan slices rather than random noise.
				ctx.font = '600 226px "PingFang TC", "Heiti TC", sans-serif';
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				for (let y = 0; y < 270; y += 9) {
					ctx.save();
					ctx.beginPath();
					ctx.rect(0, y, 480, 9);
					ctx.clip();
					const pulse = Math.pow(Math.max(0, Math.sin(time * 1.4 + y * 0.025)), 22);
					ctx.translate(240 + Math.sin(y * 0.08 + time * 3) * pulse * 17 + pointer.x * 8, 142);
					ctx.scale(1.35, 1);
					ctx.fillText("字", 0, 0);
					ctx.restore();
				}
			} else if (kind === "camera") {
				const x = 240 + pointer.x * 95,
					y = 115 + pointer.y * 55;
				ctx.lineWidth = 6;
				line([
					[0, y],
					[x - 27, y]
				]);
				line([
					[x + 27, y],
					[480, y]
				]);
				line([
					[x, 0],
					[x, y - 27]
				]);
				line([
					[x, y + 27],
					[x, 270]
				]);
				ctx.strokeRect(x - 23, y - 23, 46, 46);
				ctx.fillRect(x - 2, y - 2, 4, 4);
				for (const [cx, cy, dx, dy] of [
					[20, 15, 1, 1],
					[460, 15, -1, 1],
					[20, 255, 1, -1],
					[460, 255, -1, -1]
				])
					line([
						[cx!, cy! + dy! * 18],
						[cx!, cy!],
						[cx! + dx! * 18, cy!]
					]);
			} else if (kind === "broadcast") {
				for (let i = 0; i < 7; i++) {
					const x = 58 + i * 60,
						y = 87 + Math.sin(time * 0.55 + i * 1.6) * 36;
					line([
						[x, 24],
						[x, 184]
					]);
					ctx.fillRect(x - 14, y - 5, 28, 10);
					const h = 10 + (Math.sin(time * 1.6 + i) * 0.5 + 0.5) * 35;
					ctx.fillRect(x - 8, 250 - h, 16, h);
				}
			}
			pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
		}
		// Project the cube once per frame; sample its edge distance at every glyph.
		const angle = time * 0.28 + pointer.x * 0.8 + 0.6;
		const tilt = 0.45 + pointer.y * 0.6 + Math.sin(time * 0.23) * 0.12;
		const vertices = Array.from({ length: 8 }, (_, i) => {
			const x = i & 1 ? 0.63 : -0.63,
				y = i & 2 ? 0.63 : -0.63,
				z = i & 4 ? 0.63 : -0.63;
			const rx = x * Math.cos(angle) - z * Math.sin(angle),
				rz = x * Math.sin(angle) + z * Math.cos(angle);
			const ry = y * Math.cos(tilt) - rz * Math.sin(tilt),
				depth = y * Math.sin(tilt) + rz * Math.cos(tilt);
			const perspective = 2.7 / (3 + depth);
			return [rx * perspective, ry * perspective];
		});
		const edgeDistance = (x: number, y: number) => {
			let distance = Infinity;
			for (let i = 0; i < 8; i++)
				for (const bit of [1, 2, 4])
					if (!(i & bit)) {
						const [ax, ay] = vertices[i]!,
							[bx, by] = vertices[i | bit]!;
						const dx = bx! - ax!,
							dy = by! - ay!;
						const h = clamp(((x - ax!) * dx + (y - ay!) * dy) / (dx * dx + dy * dy), 0, 1);
						distance = Math.min(distance, Math.hypot(x - ax! - dx * h, y - ay! - dy * h));
					}
			return distance;
		};
		const ramp = kind === "hardware" ? " .-=+abcdX" : " .:+*#@";
		const output: string[] = [];
		for (let y = 0; y < rows; y++) {
			let row = "";
			for (let x = 0; x < columns; x++) {
				let value = 0;
				if (kind === "touch") {
					const px = (x / columns - 0.5) * 2 - pointer.x * 0.17;
					const py = (y / rows - 0.5) * 2 - pointer.y * 0.17;
					const a = Math.atan2(py, px),
						r = Math.hypot(px, py);
					const breath = Math.sin(time * 0.9) * 0.05;
					const contour = 0.56 + Math.sin(a * 3 + time * 0.3) * 0.1 + Math.cos(a * 5 - time * 0.2) * 0.04 + breath;
					const distance = Math.min(Math.abs(r - contour), Math.abs(r - contour * 0.58), Math.abs(r - contour * 1.32) + 0.025);
					value = clamp(1 - distance / 0.065, 0, 1) * (0.6 + Math.sin(a * 2 + time) * 0.2);
				} else if (kind === "hardware") {
					const px = (x / columns - 0.5) * 3,
						py = (y / rows - 0.5) * 2.15;
					value = Math.exp(-edgeDistance(px, py) * (23 - pointer.x * 12));
				} else if (pixels) {
					for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) value += pixels[((y * 2 + dy) * canvas.width + x * 2 + dx) * 4 + 3]! / 1020;
				}
				row += ramp[Math.floor(clamp(value, 0, 1) * (ramp.length - 1))];
			}
			output.push(row);
		}
		art.output.textContent = output.join("\n");
	};
	const paint = (ms: number) => {
		frame = 0;
		if (signal.aborted || document.hidden) return;
		if (ms - lastPaint >= 70) {
			lastPaint = ms;
			for (const art of visible) render(art, reduced.matches ? 0 : ms / 1000);
		}
		if (!reduced.matches && visible.size) frame = requestAnimationFrame(paint);
	};
	const schedule = () => {
		if (!frame && !signal.aborted) frame = requestAnimationFrame(paint);
	};
	for (const element of root.querySelectorAll<HTMLElement>("[data-about-art]")) {
		const output = element.querySelector<HTMLPreElement>("[data-art-output]");
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d", { willReadFrequently: true });
		if (!output || !context) continue;
		const art: Artwork = { element, output, kind: element.dataset.aboutArt as Kind, canvas, context, columns: 0, rows: 0, pointer: { x: 0, y: 0 } };
		resize(art);
		artworks.push(art);
		element.addEventListener(
			"pointermove",
			event => {
				const box = element.getBoundingClientRect();
				art.pointer.x = (event.clientX - box.left) / box.width - 0.5;
				art.pointer.y = (event.clientY - box.top) / box.height - 0.5;
				schedule();
			},
			{ passive: true, signal }
		);
		element.addEventListener(
			"pointerleave",
			() => {
				art.pointer.x = art.pointer.y = 0;
				schedule();
			},
			{ passive: true, signal }
		);
		render(art, 0);
	}
	const observer = new IntersectionObserver(
		entries => {
			for (const entry of entries) {
				const art = artworks.find(a => a.element === entry.target);
				if (!art) continue;
				if (entry.isIntersecting) {
					visible.add(art);
					render(art, 0);
				} else visible.delete(art);
			}
			schedule();
		},
		{ rootMargin: "60px" }
	);
	const resizeObserver = new ResizeObserver(entries => {
		for (const entry of entries) {
			const art = artworks.find(a => a.element === entry.target);
			if (art) {
				resize(art);
				render(art, 0);
			}
		}
		schedule();
	});
	for (const art of artworks) {
		observer.observe(art.element);
		resizeObserver.observe(art.element);
	}
	root.dataset.aboutArtReady = "true";
	document.addEventListener("visibilitychange", schedule, { signal });
	reduced.addEventListener(
		"change",
		() => {
			lastPaint = -Infinity;
			schedule();
		},
		{ signal }
	);
	signal.addEventListener(
		"abort",
		() => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			resizeObserver.disconnect();
		},
		{ once: true }
	);
}
