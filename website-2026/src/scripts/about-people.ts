/** ASCII paint targets with a centre-out charging reticle, inspired by the old 404. */
export function setupPeopleField(root: HTMLElement, signal: AbortSignal): void {
	const field = root.querySelector<HTMLElement>("[data-people-field]");
	const reticle = field?.querySelector<HTMLPreElement>("[data-people-reticle]");
	const status = field?.querySelector<HTMLOutputElement>("[data-people-status]");
	if (!field || !reticle) return;
	const burst = document.createElement("canvas");
	burst.className = "people-burst";
	burst.setAttribute("aria-hidden", "true");
	field.append(burst);
	const ctx = burst.getContext("2d");
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const people = [...field.querySelectorAll<HTMLButtonElement>("[data-walker]")].map((button, i) => ({
		button,
		glyph: button.querySelector("span")!,
		x: 0,
		y: 0,
		step: -1,
		phase: i / field.querySelectorAll("[data-walker]").length,
		speed: 30 + i * 3,
		colored: false,
		cycle: 0
	}));
	let width = 0,
		height = 0,
		visible = false,
		frame = 0,
		lastPaint = 0,
		fireAt = -Infinity,
		hit = false,
		resetTimer = 0;
	const start = performance.now(),
		aim = { x: 0.5, y: 0.5 },
		shot = { x: 0.5, y: 0.5 };
	const countColors = () => {
		const count = people.filter(p => p.colored).length;
		field.dataset.coloredCount = String(count);
		if (status) status.textContent = `${count} of ${people.length} people in color.`;
	};
	const drawReticle = (now = performance.now()) => {
		const cols = Math.max(10, Math.floor(width / 6)),
			rows = Math.max(4, Math.floor(height / 12));
		const cx = Math.round(aim.x * (cols - 1)),
			cy = Math.round(aim.y * (rows - 1));
		const age = now - fireAt,
			active = age >= 0 && age < 800;
		const progress = reduced.matches ? 1 : Math.min(1, age / 300);
		const reach = Math.max(aim.x * width, (1 - aim.x) * width, aim.y * height, (1 - aim.y) * height) * progress;
		const fade = age < 550 ? 1 : Math.max(0, (800 - age) / 250);
		const warm = hit ? [255, 177, 160] : [156, 239, 255];
		const rowsHtml = Array.from({ length: rows }, (_, y) =>
			Array.from({ length: cols }, (_, x) => {
				const gx = x - cx,
					gy = y - cy,
					dx = gx * 6,
					dy = gy * 12;
				let glyph = " ";
				if (gx === 0 && gy === 0) glyph = "+";
				else if (Math.abs(gx) === 4 && Math.abs(gy) === 2) glyph = gy < 0 ? (gx < 0 ? "┌" : "┐") : gx < 0 ? "└" : "┘";
				else if (gy === 0 && Math.abs(gx) > 2) glyph = Math.abs(gx) % 2 ? "-" : " ";
				else if (gx === 0 && Math.abs(gy) > 1) glyph = Math.abs(gy) % 2 ? "|" : " ";
				if (glyph === " " || !active) return glyph;
				const blend = Math.max(0, Math.min(1, (reach - Math.hypot(dx, dy) + 12) / 24)) * fade;
				if (blend <= 0.005) return glyph;
				const base = [186, 214, 233],
					rgb = base.map((v, i) => Math.round(v + (warm[i]! - v) * blend));
				return `<span class="reticle-lit" style="color:rgb(${rgb.join(",")});text-shadow:0 0 ${5 * blend}px currentColor">${glyph}</span>`;
			}).join("")
		).join("\n");
		reticle.innerHTML = rowsHtml;
		field.dataset.aim = `${aim.x.toFixed(2)},${aim.y.toFixed(2)}`;
		if (active) field.dataset.chargeProgress = Math.max(0, progress).toFixed(2);
	};

	const draw = (time: number) => {
		let recycled = false;
		for (let i = 0; i < people.length; i++) {
			const person = people[i]!,
				travel = width + 80;
			if (!person.button.matches(":focus-visible")) {
				const unwrapped = person.phase * travel + time * person.speed,
					cycle = Math.floor(unwrapped / travel);
				if (cycle !== person.cycle) {
					person.cycle = cycle;
					person.colored = false;
					delete person.button.dataset.colored;
					person.button.setAttribute("aria-label", `Color person ${i + 1}`);
					recycled = true;
				}
				person.x = (unwrapped % travel) - 20;
				person.y = height * (0.32 + (i % 3) * 0.17) + Math.sin(time * 3 + i) * 1.5;
			}
			person.button.style.transform = `translate(${person.x - 22}px,${person.y - 32}px)`;
			const step = reduced.matches ? 0 : Math.floor(time * 3.5 + i) % 4;
			if (step !== person.step) {
				person.step = step;
				person.glyph.textContent = [" o \n/|\\\n/ \\", " o \n\\|/\n | ", " o \n/|\\\n\\ /", " o \n-|/\n | "][step]!;
			}
		}
		if (recycled) countColors();
	};
	const paintShot = (ms: number) => {
		const elapsed = ms - fireAt,
			p = elapsed / 440;
		if (!ctx) return;
		ctx.clearRect(0, 0, width, height);
		if (p < 0 || p >= 1) {
			delete field.dataset.flash;
			return;
		}
		const x = shot.x * width,
			y = shot.y * height;
		if (reduced.matches) return;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = '500 12px "IBM Plex Mono"';
		for (let i = 0; i < 24; i++) {
			const a = (i / 24) * Math.PI * 2,
				d = (1 - Math.pow(1 - p, 3)) * (38 + (i % 4) * 17);
			ctx.fillStyle = hit ? `hsla(${(i * 43) % 360},90%,78%,${(1 - p) * 0.95})` : `rgba(170,230,255,${(1 - p) * 0.8})`;
			ctx.fillText(["+", "*", ":", "."][i % 4]!, x + Math.cos(a) * d, y + Math.sin(a) * d);
		}
	};
	const animate = (ms: number) => {
		frame = 0;
		if (signal.aborted || document.hidden || !visible) return;
		if (ms - lastPaint >= 65) {
			lastPaint = ms;
			draw(reduced.matches ? 0 : (ms - start) / 1000);
		}
		if (ms - fireAt < 800) {
			paintShot(ms);
			drawReticle(ms);
		}
		if (!reduced.matches) frame = requestAnimationFrame(animate);
	};
	const wake = () => {
		if (!frame && !signal.aborted && visible) frame = requestAnimationFrame(animate);
	};
	const resize = () => {
		width = field.clientWidth;
		height = field.clientHeight;
		const ratio = Math.min(devicePixelRatio || 1, 2);
		burst.width = Math.round(width * ratio);
		burst.height = Math.round(height * ratio);
		ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
		draw(reduced.matches ? 0 : (performance.now() - start) / 1000);
		drawReticle();
	};
	const point = (event: PointerEvent | MouseEvent) => {
		const box = field.getBoundingClientRect();
		aim.x = Math.max(0, Math.min(1, (event.clientX - box.left) / width));
		aim.y = Math.max(0, Math.min(1, (event.clientY - box.top) / height));
		drawReticle();
	};
	field.addEventListener("pointermove", point, { signal, passive: true });
	field.addEventListener(
		"pointerleave",
		() => {
			aim.x = aim.y = 0.5;
			drawReticle();
		},
		{ signal }
	);
	field.addEventListener(
		"focusin",
		event => {
			const person = people.find(p => p.button === event.target);
			if (!person?.button.matches(":focus-visible")) return;
			person.x = Math.max(24, Math.min(width - 24, person.x));
			person.y = Math.max(32, Math.min(height - 32, person.y));
			field.scrollLeft = field.scrollTop = 0;
			draw(reduced.matches ? 0 : (performance.now() - start) / 1000);
		},
		{ signal }
	);
	field.addEventListener(
		"click",
		event => {
			const target = event.target instanceof Element ? event.target.closest<HTMLButtonElement>("[data-walker]") : null;
			let person = people.find(p => p.button === target);
			if (event.detail !== 0) point(event);
			if (!person) person = people.find(p => Math.abs(p.x - aim.x * width) < 24 && Math.abs(p.y - aim.y * height) < 32);
			hit = !!person;
			if (person) {
				person.colored = true;
				person.button.dataset.colored = "true";
				person.button.setAttribute("aria-label", `Person ${Number(person.button.dataset.walker) + 1}, in color`);
				if (event.detail === 0) {
					aim.x = person.x / width;
					aim.y = person.y / height;
					drawReticle();
				}
				countColors();
			}
			shot.x = aim.x;
			shot.y = aim.y;
			fireAt = performance.now();
			field.dataset.flash = "true";
			field.dataset.chargeProgress = "0";
			paintShot(fireAt);
			drawReticle(fireAt);
			wake();
			window.clearTimeout(resetTimer);
			resetTimer = window.setTimeout(() => {
				ctx?.clearRect(0, 0, width, height);
				delete field.dataset.flash;
				delete field.dataset.chargeProgress;
				drawReticle();
			}, 820);
		},
		{ signal }
	);
	const observer = new IntersectionObserver(
		entries => {
			visible = entries.some(e => e.isIntersecting);
			wake();
		},
		{ rootMargin: "40px" }
	);
	observer.observe(field);
	const resizer = new ResizeObserver(resize);
	resizer.observe(field);
	document.addEventListener("visibilitychange", wake, { signal });
	reduced.addEventListener(
		"change",
		() => {
			resize();
			wake();
		},
		{ signal }
	);
	resize();
	field.dataset.peopleReady = "true";
	field.dataset.coloredCount = "0";
	signal.addEventListener(
		"abort",
		() => {
			cancelAnimationFrame(frame);
			window.clearTimeout(resetTimer);
			observer.disconnect();
			resizer.disconnect();
			burst.remove();
		},
		{ once: true }
	);
}
