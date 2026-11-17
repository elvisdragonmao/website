import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const blender = process.env.BLENDER_BIN || (process.platform === "darwin" ? "/Applications/Blender.app/Contents/MacOS/Blender" : "blender");
const value = name => {
	const index = process.argv.indexOf(name);
	if (index < 0) return undefined;
	const argument = process.argv[index + 1];
	if (!argument || argument.startsWith("--")) throw new Error(`Missing value for ${name}`);
	return resolve(root, argument);
};
const source = value("--source") ?? resolve(root, "assets/character/source.blend");
const exported = value("--output") ?? resolve(root, "assets/character/source.glb");
const runtime = value("--runtime-output") ?? resolve(root, "public/models/dragon.glb");
const result = spawnSync(blender, ["--background", "--factory-startup", "--python-exit-code", "1", "--python", "scripts/export-character.py", "--", "--source", source, "--output", exported], {
	cwd: root,
	stdio: "inherit"
});
if (result.error) {
	console.error("Cannot start Blender. Set BLENDER_BIN to its executable path.");
	process.exit(1);
}
if (result.status !== 0) process.exit(result.status ?? 1);
const args = ["scripts/prepare-character.mjs", "--input", exported, "--output", runtime];
const report = value("--report");
if (report) args.push("--report", report);
const prepared = spawnSync(process.execPath, args, { cwd: root, stdio: "inherit" });
process.exit(prepared.status ?? 1);
