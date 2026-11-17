import { NodeIO, VertexLayout } from "@gltf-transform/core";
import { ALL_EXTENSIONS, EXTTextureWebP } from "@gltf-transform/extensions";
import { meshopt } from "@gltf-transform/functions";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { simplifyCharacter } from "./character/simplify.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const argument = name => {
	const index = process.argv.indexOf(name);
	if (index < 0) return undefined;
	const value = process.argv[index + 1];
	if (!value || value.startsWith("--")) throw new Error(`Missing value for ${name}`);
	return value;
};
const input = resolve(root, argument("--input") ?? "assets/character/source.glb");
const output = resolve(root, argument("--output") ?? "public/models/dragon.glb");
const reportPath = resolve(root, argument("--report") ?? resolve(dirname(input), "web-export.json"));
assert.notEqual(input, output, "The runtime derivative must not overwrite the editable master");
const runtimeKeys = ["coverAnchor", "gazeOrigin", "gazeForward", "headPivot", "irisCenterThree"];
const digest = data => createHash("sha256").update(data).digest("hex");
await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready]);
// Separate raw accessors avoid exceeding WebGL's vertex-stride limit before compression.
const io = new NodeIO().setVertexLayout(VertexLayout.SEPARATE).registerExtensions(ALL_EXTENSIONS).registerDependencies({
	"meshopt.encoder": MeshoptEncoder,
	"meshopt.decoder": MeshoptDecoder
});

function triangles(document) {
	return document
		.getRoot()
		.listMeshes()
		.reduce((sum, mesh) => sum + mesh.listPrimitives().reduce((n, p) => n + p.getIndices().getCount() / 3, 0), 0);
}
function contract(document) {
	return document
		.getRoot()
		.listNodes()
		.map(node => ({
			name: node.getName(),
			translation: node.getTranslation(),
			rotation: node.getRotation(),
			scale: node.getScale(),
			children: node.listChildren().map(child => child.getName()),
			joints: node
				.getSkin()
				?.listJoints()
				.map(joint => joint.getName()),
			extras: node.getExtras(),
			...(node.getMesh()
				? {
						mesh: {
							weights: node.getMesh().getWeights(),
							primitives: node
								.getMesh()
								.listPrimitives()
								.map(p => ({
									material: p.getMaterial()?.getName(),
									semantics: p.listSemantics().sort(),
									targets: p.listTargets().map(t => ({ name: t.getName(), semantics: t.listSemantics().sort() }))
								}))
						}
					}
				: {})
		}));
}

const sourceBytes = await fs.readFile(input).catch(error => {
	if (error.code === "ENOENT") throw new Error("Character masters are stored outside Git; pass --input /path/to/source.glb or restore the local master.", { cause: error });
	throw error;
});
const document = await io.readBinary(sourceBytes);
const source = document.getRoot();
assert.equal(triangles(document), 48314, "Inspect a changed character master before updating its optimization contract");
assert.equal(source.listTextures().length, 5, "Expected five original base-color maps");
for (const name of ["Head", "Eye.L", "Eye.R"])
	assert.ok(
		source.listNodes().some(node => node.getName() === name),
		`Missing calibrated control: ${name}`
	);
assert.ok(
	source.listMeshes().every(mesh => mesh.getWeights().every(weight => weight === 0)),
	"Export the character with neutral facial weights"
);
assert.ok(
	source.listMeshes().some(mesh => mesh.listPrimitives().some(p => p.listTargets().some(t => t.getName() === "Blink"))),
	"Missing Blink morph"
);
// Local source paths and modeling notes do not belong in the public derivative.
for (const node of source.listNodes()) {
	const extras = node.getExtras();
	node.setExtras(Object.fromEntries(runtimeKeys.filter(key => key in extras).map(key => [key, extras[key]])));
}
const before = contract(document);
const geometry = await simplifyCharacter(document);
const textures = [];
document.createExtension(EXTTextureWebP).setRequired(true);
for (const texture of source.listTextures()) {
	assert.equal(texture.getMimeType(), "image/png", "Review texture settings when the master format changes");
	const original = texture.getImage();
	const originalInfo = await sharp(original).metadata();
	const limit = texture.getName().startsWith("M_Body") ? 2048 : 1024;
	const { data, info } = await sharp(original)
		.resize({ width: limit, height: limit, fit: "inside", withoutEnlargement: true })
		.webp({ quality: 78, alphaQuality: 100, effort: 6 })
		.toBuffer({ resolveWithObject: true });
	texture.setImage(data).setMimeType("image/webp");
	textures.push({
		name: texture.getName(),
		beforeBytes: original.length,
		afterBytes: data.length,
		originalWidth: originalInfo.width,
		originalHeight: originalInfo.height,
		width: info.width,
		height: info.height,
		sha256: digest(data)
	});
}
await document.transform(meshopt({ encoder: MeshoptEncoder, level: "high" }));
const binary = await io.writeBinary(document);
const roundTrip = await io.readBinary(binary);
assert.deepEqual(contract(roundTrip), before, "Optimization changed the scene hierarchy, skin bindings, morph semantics or calibrated controls");
assert.equal(triangles(roundTrip), geometry.afterTriangles, "Final compression changed triangle count");
assert.deepEqual(
	roundTrip
		.getRoot()
		.listTextures()
		.map(texture => digest(texture.getImage()))
		.sort(),
	textures.map(texture => texture.sha256).sort(),
	"Final compression changed prepared texture payloads"
);
assert.equal(digest(await fs.readFile(input)), digest(sourceBytes), "The editable GLB must stay untouched");
await fs.mkdir(dirname(output), { recursive: true });
// Replace only after the complete binary has passed a read-back validation.
await fs.writeFile(output + ".tmp", binary);
await fs.rename(output + ".tmp", output);
const report = {
	input: basename(input),
	output: basename(output),
	inputBytes: sourceBytes.length,
	outputBytes: binary.length,
	sha256: digest(binary),
	geometry,
	textures,
	hierarchyPreserved: true,
	skinPreserved: true,
	morphsPreserved: true,
	calibrationPreserved: true,
	masterPreserved: true,
	textureSettings: { bodyMaxSize: 2048, otherMaxSize: 1024, quality: 78, alphaQuality: 100 }
};
await fs.writeFile(reportPath, JSON.stringify(report, null, 2) + "\n");
console.log(
	`Character prepared: ${sourceBytes.length} → ${binary.length} bytes; ${geometry.beforeTriangles} → ${geometry.afterTriangles} triangles. Face, eyes, Blink, skin and calibration preserved.`
);
