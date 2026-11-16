/** A restrained version of the homepage's glyph cube, shared by SSR and resize. */
export function workBoxFrame(cols: number, rows: number, depth = 2): string[] {
	const grid = Array.from({ length: rows }, () => Array<string>(cols).fill(" "));
	const put = (x: number, y: number, glyph: string) => {
		if (grid[y]?.[x] !== undefined) grid[y]![x] = glyph;
	};
	for (let x = depth + 1; x < cols - 1; x++) put(x, 0, "─");
	for (let x = 1; x < cols - depth - 1; x++) {
		put(x, depth, "─");
		put(x, rows - 1, "─");
	}
	for (let y = depth + 1; y < rows - 1; y++) {
		put(0, y, "│");
		put(cols - depth - 1, y, "│");
	}
	for (let y = 1; y < rows - depth - 1; y++) put(cols - 1, y, "│");
	for (let d = 1; d < depth; d++) {
		put(depth - d, d, "╱");
		put(cols - 1 - d, d, "╱");
		put(cols - 1 - d, rows - depth - 1 + d, "╱");
	}
	put(depth, 0, "┌");
	put(cols - 1, 0, "┐");
	put(0, depth, "┌");
	put(cols - depth - 1, depth, "┐");
	put(0, rows - 1, "└");
	put(cols - depth - 1, rows - 1, "┘");
	put(cols - 1, rows - depth - 1, "┘");
	return grid.map(row => row.join(""));
}
