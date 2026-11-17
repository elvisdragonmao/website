import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const asset = JSON.parse(await readFile(new URL("../src/data/character-asset.json", import.meta.url), "utf8"));
const target = resolve(root, "public", asset.path.slice(1));

function validate(bytes) {
	if (bytes.length !== asset.bytes || bytes.toString("ascii", 0, 4) !== "glTF" || bytes.readUInt32LE(4) !== 2 || bytes.readUInt32LE(8) !== bytes.length) {
		throw new Error("The homepage character must be the expected binary glTF 2.0 asset, not a missing-file HTML response.");
	}
	if (createHash("sha256").update(bytes).digest("hex") !== asset.sha256) throw new Error("Homepage character checksum mismatch. Review the model before updating character-asset.json.");
}

try {
	let bytes;
	if (process.env.CHARACTER_MODEL_SOURCE) {
		bytes = await readFile(resolve(process.env.CHARACTER_MODEL_SOURCE));
	} else {
		try {
			bytes = await readFile(target);
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
			// Clean checkouts have no ignored binary. Reuse the verified, published derivative.
			const url = new URL(asset.path, "https://elvismao.com");
			const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
			if (!response.ok) throw new Error(`Cannot restore ${url}: HTTP ${response.status}`);
			bytes = Buffer.from(await response.arrayBuffer());
		}
	}
	validate(bytes);
	await mkdir(dirname(target), { recursive: true });
	await writeFile(`${target}.tmp`, bytes);
	await rename(`${target}.tmp`, target);
	await writeFile(resolve(dirname(target), "ATTRIBUTION.txt"), await readFile(new URL("./character/ATTRIBUTION.txt", import.meta.url)));
	console.log(`Staged homepage character: ${asset.path} (${bytes.length} bytes, SHA-256 verified).`);
} catch (error) {
	console.error(`${error.message}\nRestore the approved runtime model with CHARACTER_MODEL_SOURCE=/absolute/path/to/dragon.glb. Keep model binaries outside Git.`);
	process.exitCode = 1;
}
