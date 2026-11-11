import * as THREE from "three";

/** Original implementation of the classic Doom cellular flame algorithm.
 * Reference: Andreas Gysin, ASCII Play / Doom Flame (full color)
 * https://play.ertdfgcvb.xyz/#/src/demos/doom_flame_full_color
 * Each cell receives heat from the cell BELOW, with lateral drift and cooling.
 * The source is always the viewport floor; scrolling never moves that source.
 */
export function createDoomFire(columns = 120, rows = 64) {
	let width = 0,
		height = 0,
		heat = new Float32Array(),
		next = new Float32Array(),
		pixels = new Uint8Array();
	let accumulator = 0,
		randomState = 0xdecafbad;
	const random = () => {
		randomState ^= randomState << 13;
		randomState ^= randomState >>> 17;
		randomState ^= randomState << 5;
		return (randomState >>> 0) / 4294967296;
	};
	const texture = new THREE.DataTexture(new Uint8Array(4), 1, 1, THREE.RGBAFormat);
	texture.minFilter = texture.magFilter = THREE.NearestFilter;
	texture.generateMipmaps = false;
	texture.colorSpace = THREE.NoColorSpace;
	function reset() {
		heat.fill(0);
		next.fill(0);
		pixels.fill(0);
		accumulator = 0;
		texture.needsUpdate = true;
	}
	function resize(cols: number, rowCount: number) {
		const w = Math.max(8, Math.min(240, Math.round(cols))),
			h = Math.max(8, Math.min(160, Math.round(rowCount)));
		if (w === width && h === height) return;
		width = w;
		height = h;
		heat = new Float32Array(w * h);
		next = new Float32Array(w * h);
		pixels = new Uint8Array(w * h * 4);
		// WebGL2 uses immutable texture storage; a size change needs fresh storage.
		texture.dispose();
		texture.image = { data: pixels, width: w, height: h };
		reset();
	}
	function step(time: number, energy: number) {
		// Slow, spatially coherent fuel creates distinct tongues and cold channels.
		// Row zero is the floor (DataTexture's UV origin is bottom-left).
		const maxHeat = height * 1.15;
		for (let x = 0; x < width; x++) {
			const a = Math.sin(x * 0.125 + time * 1.8),
				b = Math.sin(x * 0.273 - time * 1.13),
				c = Math.sin(x * 0.061 - time * 0.71);
			const fuel = THREE.MathUtils.clamp(0.47 + a * 0.28 + b * 0.15 + c * 0.22, 0, 1);
			next[x] = maxHeat * fuel * energy;
		}
		for (let y = 1; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const drift = Math.floor(random() * 3) - 1;
				const below = (y - 1) * width + Math.max(0, Math.min(width - 1, x + drift));
				// A little stochastic cooling gives the characteristic broken tip cells.
				next[y * width + x] = Math.max(0, heat[below] - random() * 2.05 - 0.08);
			}
		}
		[heat, next] = [next, heat];
	}
	function upload() {
		const scale = height * 0.8;
		for (let i = 0; i < heat.length; i++) {
			pixels[i * 4] = Math.min(255, Math.round((heat[i] / scale) * 255));
			pixels[i * 4 + 1] = (Math.floor(heat[i]) % 10) * 25;
			pixels[i * 4 + 2] = 0;
			pixels[i * 4 + 3] = 255;
		}
		texture.needsUpdate = true;
	}
	resize(columns, rows);
	return {
		texture,
		resize,
		reset,
		/** Seed a complete still field for reduced motion or an immediate reveal. */
		warmUp(time = 0, energy = 1) {
			for (let i = 0; i < height + 12; i++) step(time - (height + 12 - i) / 30, THREE.MathUtils.clamp(energy, 0, 1.3));
			upload();
		},
		/** Fixed 30 Hz propagation is independent of display refresh rate. */
		update(time: number, dt: number, energy = 1) {
			accumulator += Math.min(Math.max(dt, 0), 0.12);
			let steps = 0;
			while (accumulator >= 1 / 30 && steps < 4) {
				step(time - accumulator, THREE.MathUtils.clamp(energy, 0, 1.3));
				accumulator -= 1 / 30;
				steps++;
			}
			if (steps) upload();
		},
		dispose() {
			texture.dispose();
		}
	};
}
