import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const blender = process.env.BLENDER_BIN || (process.platform === "darwin" ? "/Applications/Blender.app/Contents/MacOS/Blender" : "blender");
const result = spawnSync(blender, ["--background", "--factory-startup", "--python-exit-code", "1", "--python", "scripts/export-character.py"], { cwd: root, stdio: "inherit" });
if (result.error) {
	console.error("Cannot start Blender. Set BLENDER_BIN to its executable path.");
	process.exit(1);
}
if (result.status !== 0) process.exit(result.status ?? 1);
const prepared = spawnSync(process.execPath, ["scripts/prepare-character.mjs"], { cwd: root, stdio: "inherit" });
process.exit(prepared.status ?? 1);
