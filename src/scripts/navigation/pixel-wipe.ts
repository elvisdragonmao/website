export interface PixelWipeState {
	covers: number;
	uncovers: number;
	phase: "idle" | "covering" | "covered" | "uncovering";
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const ease = (value: number) => value * value * (3 - 2 * value);

/** Original threshold field: interference rings, diagonal drift and integer XOR.
 * References: play.ertdfgcvb.xyz Mod Xor / Moiré explorer (not copied source).
 */
export class PixelWipe {
	constructor(private readonly debug: PixelWipeState) {}
	private canvas: HTMLCanvasElement | null = null;
	private frame = 0;
	private settle: (() => void) | null = null;
	private amount = 0;
	private direction = 1;
	private width = 0;
	private height = 0;
	private thresholds = new Float32Array(0);
	private columns = 0;
	private rows = 0;
	private cell = 16;
	private seed = 0;
	private generation = 0;

	private surface() {
		const canvas = document.querySelector<HTMLCanvasElement>("#route-pixels");
		if (!canvas) return null;
		if (this.canvas !== canvas) {
			this.canvas = canvas;
			canvas.setAttribute("aria-hidden", "true");
			Object.assign(canvas.style, {
				position: "fixed",
				inset: "0",
				width: "100%",
				height: "100%",
				pointerEvents: "none",
				zIndex: "10000",
				visibility: "hidden"
			});
		}
		if (this.width !== innerWidth || this.height !== innerHeight || !this.thresholds.length) {
			this.width = innerWidth;
			this.height = innerHeight;
			this.cell = innerWidth < 600 ? 13 : 17;
			this.columns = Math.ceil(this.width / this.cell);
			this.rows = Math.ceil(this.height / this.cell);
			const dpr = Math.min(devicePixelRatio || 1, 2);
			canvas.width = Math.ceil(this.width * dpr);
			canvas.height = Math.ceil(this.height * dpr);
			const context = canvas.getContext("2d");
			context?.setTransform(dpr, 0, 0, dpr, 0, 0);
			this.thresholds = new Float32Array(this.columns * this.rows);
			for (let y = 0; y < this.rows; y++) {
				for (let x = 0; x < this.columns; x++) {
					const u = x / this.columns;
					const v = y / this.rows;
					const ringA = Math.hypot(u - 0.18, (v - 0.32) * 0.65);
					const ringB = Math.hypot(u - 0.79, (v - 0.61) * 0.65);
					const interference = (Math.sin(ringA * 72) * Math.cos(ringB * 67) + 1) * 0.5;
					const xor = (((x + y * 3) ^ (x * 3 - y)) & 31) / 31;
					this.thresholds[y * this.columns + x] = clamp((this.direction === 1 ? u : 1 - u) * 0.55 + v * 0.12 + interference * 0.21 + xor * 0.12, 0.006, 0.994);
				}
			}
		}
		return canvas.getContext("2d");
	}

	private draw(amount: number) {
		const context = this.surface();
		if (!context || !this.canvas) return;
		context.clearRect(0, 0, this.width, this.height);
		this.canvas.style.visibility = amount > 0 ? "visible" : "hidden";
		this.canvas.dataset.phase = this.debug.phase;
		if (amount <= 0) return;
		if (reducedMotion()) {
			context.globalAlpha = amount;
			context.fillStyle = "#080b0e";
			context.fillRect(0, 0, this.width, this.height);
			context.globalAlpha = 1;
			return;
		}
		const glyphs = ["┼", "─", "└", "┐", "╱", "+", "·"];
		context.font = `${this.cell - 1}px ui-monospace, SFMono-Regular, Menlo, monospace`;
		context.textAlign = "center";
		context.textBaseline = "middle";
		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.columns; x++) {
				const threshold = this.thresholds[y * this.columns + x]!;
				if (amount < threshold) continue;
				const px = x * this.cell;
				const py = y * this.cell;
				context.fillStyle = "#080b0e";
				context.fillRect(px, py, this.cell + 0.5, this.cell + 0.5);
				const edge = 1 - clamp((amount - threshold) / 0.18);
				if (edge > 0 && amount < 1) {
					context.globalAlpha = edge * 0.72;
					context.fillStyle = ((x ^ y) & 7) < 2 ? "#71b5c6" : "#d8e6e9";
					context.fillText(glyphs[((x + y) ^ (this.seed + x - y)) % glyphs.length] || "·", px + this.cell / 2, py + this.cell / 2);
					context.globalAlpha = 1;
				}
			}
		}
	}

	private stop() {
		cancelAnimationFrame(this.frame);
		this.frame = 0;
		this.settle?.();
		this.settle = null;
	}

	private tween(to: number, duration: number) {
		this.stop();
		const from = this.amount;
		const start = performance.now();
		return new Promise<void>(resolve => {
			this.settle = resolve;
			const tick = (time: number) => {
				const progress = duration ? clamp((time - start) / duration) : 1;
				this.amount = from + (to - from) * ease(progress);
				this.draw(this.amount);
				if (progress < 1) this.frame = requestAnimationFrame(tick);
				else {
					this.frame = 0;
					this.settle = null;
					resolve();
				}
			};
			this.frame = requestAnimationFrame(tick);
		});
	}

	async cover(direction: string) {
		const token = ++this.generation;
		this.direction = direction === "back" ? -1 : 1;
		this.seed++;
		this.thresholds = new Float32Array(0);
		this.debug.phase = "covering";
		this.debug.covers++;
		await this.tween(1, reducedMotion() ? 55 : 520);
		if (token === this.generation && this.amount === 1) {
			this.debug.phase = "covered";
			if (this.canvas) this.canvas.dataset.phase = this.debug.phase;
		}
	}

	async uncover() {
		if (this.debug.phase !== "covered" && this.debug.phase !== "covering") return;
		const token = ++this.generation;
		this.debug.phase = "uncovering";
		this.debug.uncovers++;
		await this.tween(0, reducedMotion() ? 65 : 640);
		if (token === this.generation && this.amount === 0) {
			this.debug.phase = "idle";
			if (this.canvas) this.canvas.dataset.phase = this.debug.phase;
		}
	}

	clear() {
		this.generation++;
		this.stop();
		this.amount = 0;
		this.debug.phase = "idle";
		this.draw(0);
	}

	resize() {
		this.draw(this.amount);
	}
}
