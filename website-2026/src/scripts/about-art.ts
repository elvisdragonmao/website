type Kind = "portrait" | "touch" | "paws" | "code" | "music" | "hardware" | "camera" | "broadcast";
type Artwork = {
	element: HTMLElement;
	output: HTMLPreElement;
	kind: Kind;
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;
	columns: number;
	rows: number;
	pointer: { x: number; y: number };
	portrait?: Float32Array;
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
		art.columns = art.kind === "portrait" ? 88 : clamp(Math.floor(bounds.width / 6), 24, 82);
		art.rows = art.kind === "portrait" ? 47 : clamp(Math.floor(bounds.height / 11.2), 10, 24);
		art.canvas.width = art.columns * 2;
		art.canvas.height = art.rows * 2;
		const size = Math.min(bounds.width / (art.columns * 0.6), bounds.height / (art.rows * (art.kind === "portrait" ? 1.02 : 1.12)), art.kind === "portrait" ? 7.5 : 10);
		art.output.style.fontSize = `${size.toFixed(2)}px`;
		art.output.style.lineHeight = art.kind === "portrait" ? "1.02" : "1.12";
	};
	const render = (art: Artwork, time: number) => {
		const { context: ctx, canvas, columns, rows, kind, pointer } = art;
		let pixels: Uint8ClampedArray | undefined;
		if (kind !== "portrait" && kind !== "touch") {
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
			const circle = (x: number, y: number, r: number) => {
				ctx.beginPath();
				ctx.arc(x, y, r, 0, Math.PI * 2);
				ctx.stroke();
			};
			if (kind === "paws") {
				ctx.translate(pointer.x * 14, Math.sin(time * 0.7) * 5 + pointer.y * 8);
				ctx.beginPath();
				ctx.ellipse(244, 174, 70, 52, -0.12, 0, Math.PI * 2);
				ctx.fill();
				for (const [x, y, r, angle] of [
					[151, 125, 25, -0.45],
					[204, 76, 31, -0.16],
					[271, 70, 31, 0.2],
					[327, 113, 26, 0.5]
				]) {
					ctx.beginPath();
					ctx.ellipse(x!, y!, r! * 0.75, r!, angle!, 0, Math.PI * 2);
					ctx.fill();
				}
			} else if (kind === "code") {
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
			} else if (kind === "music") {
				circle(143, 125, 99);
				circle(143, 125, 70);
				circle(143, 125, 37);
				circle(143, 125, 10);
				const angle = time * 0.65 + pointer.x * 0.4;
				line([
					[143 + Math.cos(angle) * 45, 125 + Math.sin(angle) * 45],
					[143 + Math.cos(angle) * 86, 125 + Math.sin(angle) * 86]
				]);
				line([
					[318, 40],
					[390, 40],
					[367, 139],
					[327, 169]
				]);
				for (let i = 0; i < 9; i++) {
					const h = 14 + (Math.sin(time * 1.8 + i * 1.3) * 0.5 + 0.5) * 68;
					ctx.fillRect(275 + i * 20, 240 - h, 10, h);
				}
			} else if (kind === "hardware") {
				ctx.strokeRect(36, 64, 160, 144);
				ctx.strokeRect(71, 96, 90, 80);
				for (let i = 0; i < 4; i++) {
					const y = 84 + i * 35,
						x = 55 + i * 36;
					line([
						[15, y],
						[36, y]
					]);
					line([
						[196, y],
						[217, y]
					]);
					line([
						[x, 44],
						[x, 64]
					]);
					line([
						[x, 208],
						[x, 229]
					]);
				}
				const angle = time * 0.18 + pointer.x * 0.2;
				const vertices = Array.from({ length: 8 }, (_, i) => {
					const x = i & 1 ? 65 : -65,
						y = i & 2 ? 65 : -65,
						z = i & 4 ? 65 : -65;
					const rx = x * Math.cos(angle) - z * Math.sin(angle),
						rz = x * Math.sin(angle) + z * Math.cos(angle);
					return [345 + rx, 130 + y * 0.78 + rz * 0.4];
				});
				for (let i = 0; i < 8; i++) for (const bit of [1, 2, 4]) if (!(i & bit)) line([vertices[i]!, vertices[i | bit]!]);
			} else if (kind === "camera") {
				line([
					[45, 78],
					[148, 78],
					[173, 40],
					[291, 40],
					[317, 78],
					[432, 78],
					[432, 236],
					[45, 236],
					[45, 78]
				]);
				circle(236, 152, 65);
				circle(236, 152, 42);
				circle(236 + pointer.x * 8, 152 + pointer.y * 8, 15);
				ctx.strokeRect(352, 103, 48, 24);
				line([
					[72, 104],
					[118, 104]
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
		if (kind === "portrait" && !art.portrait) return;
		const ramp = kind === "portrait" ? " .,:;irsXA253hMHGS#9B&@" : " .:+*#@";
		const output: string[] = [];
		for (let y = 0; y < rows; y++) {
			let row = "";
			for (let x = 0; x < columns; x++) {
				let value = 0;
				if (kind === "portrait") value = art.portrait![y * columns + x]! * (1 + Math.sin(time * 0.65) * 0.018);
				else if (kind === "touch") {
					const px = (x / columns - 0.5) * 2 - pointer.x * 0.17;
					const py = (y / rows - 0.5) * 2 - pointer.y * 0.17;
					const a = Math.atan2(py, px),
						r = Math.hypot(px, py);
					const breath = Math.sin(time * 0.9) * 0.05;
					const contour = 0.56 + Math.sin(a * 3 + time * 0.3) * 0.1 + Math.cos(a * 5 - time * 0.2) * 0.04 + breath;
					const distance = Math.min(Math.abs(r - contour), Math.abs(r - contour * 0.58), Math.abs(r - contour * 1.32) + 0.025);
					value = clamp(1 - distance / 0.065, 0, 1) * (0.6 + Math.sin(a * 2 + time) * 0.2);
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
		if (art.kind === "portrait" && element.dataset.artSrc) {
			const image = new Image();
			image.src = element.dataset.artSrc;
			void image
				.decode()
				.then(() => {
					if (signal.aborted) return;
					const source = document.createElement("canvas");
					source.width = 88;
					source.height = 47;
					const ctx = source.getContext("2d", { willReadFrequently: true });
					if (!ctx) return;
					ctx.drawImage(image, 260, 0, 1100, 1000, 0, 0, 88, 47);
					const pixels = ctx.getImageData(0, 0, 88, 47).data;
					art.portrait = Float32Array.from({ length: 88 * 47 }, (_, i) => clamp(((pixels[i * 4]! * 0.2126 + pixels[i * 4 + 1]! * 0.7152 + pixels[i * 4 + 2]! * 0.0722) / 255 - 0.11) / 0.89, 0, 1));
					render(art, 0);
				})
				.catch(() => {
					/* The server-rendered glyph portrait remains available. */
				});
		} else render(art, 0);
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
