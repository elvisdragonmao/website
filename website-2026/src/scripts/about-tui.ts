const NS = "http://www.w3.org/2000/svg";
/** Glyph frames follow each panel's actual reflowed dimensions. */
export function setupAboutWorkspace(root: HTMLElement, signal: AbortSignal): void {
	const panels = [...root.querySelectorAll<HTMLElement>(".about-facet, .about-section, .about-statement")];
	const frames = new Map<HTMLElement, SVGSVGElement>();
	const sizes = new Map<HTMLElement, string>();
	let frame = 0;
	for (const panel of panels) {
		panel.classList.add("tui-panel");
		const svg = document.createElementNS(NS, "svg");
		svg.classList.add("tui-frame");
		svg.setAttribute("aria-hidden", "true");
		svg.setAttribute("preserveAspectRatio", "none");
		panel.append(svg);
		frames.set(panel, svg);
	}
	const draw = () => {
		frame = 0;
		if (signal.aborted) return;
		const [tl, tr, bl, br, side, rail] = ["╭", "╮", "╰", "╯", "│", "─"];
		for (const panel of panels) {
			const width = panel.clientWidth,
				height = panel.clientHeight;
			const key = `${width}:${height}`;
			if (sizes.get(panel) === key || !width || !height) continue;
			sizes.set(panel, key);
			const svg = frames.get(panel)!;
			const cols = Math.max(6, Math.round(width / 8)),
				rows = Math.max(4, Math.round(height / 16));
			svg.setAttribute("viewBox", `0 0 ${cols * 8} ${rows * 16}`);
			const nodes: SVGTextElement[] = [];
			for (let row = 0; row < rows; row++) {
				const text = document.createElementNS(NS, "text");
				text.setAttribute("x", "0");
				text.setAttribute("y", String(row * 16 + 13));
				text.setAttribute("textLength", String(cols * 8));
				text.setAttribute("lengthAdjust", "spacingAndGlyphs");
				text.setAttribute("xml:space", "preserve");
				text.textContent = row === 0 ? tl + rail!.repeat(cols - 2) + tr : row === rows - 1 ? bl + rail!.repeat(cols - 2) + br : side + " ".repeat(cols - 2) + side;
				nodes.push(text);
			}
			svg.replaceChildren(...nodes);
		}
		root.dataset.framesReady = "true";
	};
	const schedule = () => {
		if (!frame && !signal.aborted) frame = requestAnimationFrame(draw);
	};
	const observer = new ResizeObserver(schedule);
	for (const panel of panels) observer.observe(panel);
	draw();
	signal.addEventListener(
		"abort",
		() => {
			cancelAnimationFrame(frame);
			observer.disconnect();
		},
		{ once: true }
	);
}

/** Keep the readable source in the layout while its glyph output is being typed. */
export function setupTypingTerminal(root: HTMLElement, signal: AbortSignal): void {
	const terminal = root.querySelector<HTMLElement>("[data-typing-terminal]");
	if (!terminal) return;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const lines = [...terminal.querySelectorAll<HTMLElement>(".terminal-line")];
	const source = lines.map(line => line.querySelector<HTMLElement>(".terminal-source")?.textContent ?? "");
	const outputs = lines.map(line => {
		const output = document.createElement("span");
		output.className = "terminal-output";
		output.setAttribute("aria-hidden", "true");
		line.append(output);
		return output;
	});
	let started = false,
		frame = 0,
		start = 0;
	const finish = () => {
		cancelAnimationFrame(frame);
		terminal.classList.remove("terminal-typing");
		for (const output of outputs) {
			output.textContent = "";
			delete output.dataset.cursor;
		}
		terminal.dataset.typingState = "complete";
	};
	const paint = (now: number) => {
		if (signal.aborted) return;
		if (reduced.matches) {
			finish();
			return;
		}
		if (!start) start = now;
		let remaining = Math.floor((now - start) / 24);
		let current = -1;
		for (let i = 0; i < outputs.length; i++) {
			const text = source[i]!;
			const length = Math.max(0, Math.min(text.length, remaining));
			outputs[i]!.textContent = text.slice(0, length);
			delete outputs[i]!.dataset.cursor;
			if (remaining >= 0 && remaining <= text.length + 12) current = i;
			remaining -= text.length + 13;
		}
		if (current >= 0) outputs[current]!.dataset.cursor = "true";
		if (remaining > 0) finish();
		else frame = requestAnimationFrame(paint);
	};
	const observer = new IntersectionObserver(
		entries => {
			if (started || !entries.some(e => e.isIntersecting)) return;
			started = true;
			observer.disconnect();
			if (reduced.matches) {
				finish();
				return;
			}
			terminal.classList.add("terminal-typing");
			terminal.dataset.typingState = "typing";
			frame = requestAnimationFrame(paint);
		},
		{ threshold: 0.3 }
	);
	observer.observe(terminal);
	reduced.addEventListener(
		"change",
		() => {
			if (reduced.matches) finish();
		},
		{ signal }
	);
	signal.addEventListener(
		"abort",
		() => {
			cancelAnimationFrame(frame);
			observer.disconnect();
		},
		{ once: true }
	);
}
