/** Thin project cards and double-line homepage cubes share the same geometry. */
export function workBoxFrame(cols: number, rows: number, depth = 2): string[] {
	return boxFrame(cols, rows, depth, false);
}

export function galleryBoxFrame(cols: number, rows: number, depth = 3): string[] {
	return boxFrame(cols, rows, depth, true);
}

function boxFrame(cols: number, rows: number, depth: number, shadow: boolean): string[] {
	const grid = Array.from({ length: rows }, () => Array<string>(cols).fill(" "));
	const put = (x: number, y: number, glyph: string) => {
		if (grid[y]?.[x] !== undefined) grid[y]![x] = glyph;
	};
	for (let x = depth + 1; x < cols - 1; x++) put(x, 0, "─");
	for (let x = 1; x < cols - depth - 1; x++) {
		put(x, depth, shadow ? "═" : "─");
		put(x, rows - 1, shadow ? "═" : "─");
	}
	for (let y = depth + 1; y < rows - 1; y++) {
		put(0, y, shadow ? "║" : "│");
		put(cols - depth - 1, y, shadow ? "║" : "│");
	}
	for (let y = 1; y < rows - depth - 1; y++) put(cols - 1, y, "│");
	if (shadow) for (let x = cols - depth; x < cols - 1; x++) for (let y = depth + 1; y < rows - depth; y++) put(x, y, "░");
	for (let d = 1; d < depth; d++) {
		put(depth - d, d, "╱");
		put(cols - 1 - d, d, "╱");
		put(cols - 1 - d, rows - depth - 1 + d, "╱");
	}
	put(depth, 0, "┌");
	put(cols - 1, 0, "┐");
	put(0, depth, shadow ? "╔" : "┌");
	put(cols - depth - 1, depth, shadow ? "╗" : "┐");
	put(0, rows - 1, shadow ? "╚" : "└");
	put(cols - depth - 1, rows - 1, shadow ? "╝" : "┘");
	put(cols - 1, rows - depth - 1, "┘");
	return grid.map(row => row.join(""));
}
