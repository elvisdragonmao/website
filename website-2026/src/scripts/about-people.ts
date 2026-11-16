/** A tiny paint game. Native buttons keep every walker usable with touch and keyboard. */
export function setupPeopleField(root: HTMLElement, signal: AbortSignal): void {
	const field = root.querySelector<HTMLElement>("[data-people-field]");
	const reticle = field?.querySelector<HTMLPreElement>("[data-people-reticle]");
	const status = field?.querySelector<HTMLOutputElement>("[data-people-status]");
	if (!field || !reticle) return;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const people = [...field.querySelectorAll<HTMLButtonElement>("[data-walker]")].map((button, i) => ({
		button,
		glyph: button.querySelector("span")!,
		x: 0,
		y: 0,
		step: -1,
		phase: i / 5,
		speed: 18 + i * 4,
		colored: false
	}));
	let width = 0,
		height = 0,
		visible = false,
		frame = 0,
		lastPaint = 0,
		flashTimer = 0;
	const start = performance.now();
	const aim = { x: 0.5, y: 0.5 };
	const drawReticle = () => {
		const columns = Math.max(10, Math.floor(width / 6)),
			rows = Math.max(4, Math.floor(height / 12));
		const cx = Math.round(aim.x * (columns - 1)),
			cy = Math.round(aim.y * (rows - 1));
		const lines = Array.from({ length: rows }, (_, y) =>
			Array.from({ length: columns }, (_, x) => {
				if (x === cx && y === cy) return "+";
				if (y === cy && Math.abs(x - cx) > 2) return x % 2 ? "-" : " ";
				if (x === cx && Math.abs(y - cy) > 1) return "|";
				if (Math.abs(x - cx) === 2 && Math.abs(y - cy) <= 1) return y === cy ? " " : "·";
				return " ";
			}).join("")
		);
		reticle.textContent = lines.join("\n");
	};
	const draw = (time: number) => {
		for (let i = 0; i < people.length; i++) {
			const person = people[i]!;
			const travel = width + 80;
			if (!person.button.matches(":focus-visible")) {
				person.x = ((person.phase * travel + time * person.speed) % travel) - 20;
				person.y = height * (0.38 + (i % 3) * 0.12) + Math.sin(time * 3 + i) * 1.5;
			}
			person.button.style.transform = `translate(${person.x - 22}px,${person.y - 32}px)`;
			const step = reduced.matches ? 0 : Math.floor(time * 3.5 + i) % 4;
			if (step !== person.step) {
				person.step = step;
				person.glyph.textContent = [" o \n/|\\\n/ \\", " o \n\\|/\n | ", " o \n/|\\\n\\ /", " o \n-|/\n | "][step]!;
			}
		}
	};
	const resize = () => {
		width = field.clientWidth;
		height = field.clientHeight;
		draw(reduced.matches ? 0 : (performance.now() - start) / 1000);
		drawReticle();
	};
	const animate = (ms: number) => {
		frame = 0;
		if (signal.aborted || document.hidden || !visible) return;
		if (ms - lastPaint >= 65) {
			lastPaint = ms;
			draw(reduced.matches ? 0 : (ms - start) / 1000);
		}
		if (!reduced.matches) frame = requestAnimationFrame(animate);
	};
	const wake = () => {
		if (!frame && !signal.aborted && visible) frame = requestAnimationFrame(animate);
	};
	const point = (event: PointerEvent | MouseEvent) => {
		const box = field.getBoundingClientRect();
		aim.x = Math.max(0, Math.min(1, (event.clientX - box.left) / width));
		aim.y = Math.max(0, Math.min(1, (event.clientY - box.top) / height));
		drawReticle();
	};
	field.addEventListener("pointermove", point, { signal, passive: true });
	field.addEventListener(
		"focusin",
		event => {
			const person = people.find(person => person.button === event.target);
			if (!person?.button.matches(":focus-visible")) return;
			// A keyboard target stays reachable even when its walk would carry it offscreen.
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
			if (person) {
				person.colored = true;
				person.button.dataset.colored = "true";
				person.button.setAttribute("aria-label", `Person ${Number(person.button.dataset.walker) + 1}, in color`);
				if (event.detail === 0) {
					aim.x = person.x / width;
					aim.y = person.y / height;
					drawReticle();
				}
				const count = people.filter(p => p.colored).length;
				field.dataset.coloredCount = String(count);
				if (status) status.textContent = `${count} of ${people.length} people in color.`;
			}
			field.dataset.flash = "true";
			window.clearTimeout(flashTimer);
			flashTimer = window.setTimeout(() => {
				delete field.dataset.flash;
			}, 180);
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
			window.clearTimeout(flashTimer);
			observer.disconnect();
			resizer.disconnect();
		},
		{ once: true }
	);
}
