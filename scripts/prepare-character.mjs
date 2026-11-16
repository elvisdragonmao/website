import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { meshopt } from "@gltf-transform/functions";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
	"meshopt.encoder": MeshoptEncoder,
	"meshopt.decoder": MeshoptDecoder
});
const input = root + "assets/character/source.glb";
const output = root + "public/models/dragon.glb";
const document = await io.read(input);
const digest = image => createHash("sha256").update(image).digest("hex");
function contract(doc) {
	const data = doc.getRoot();
	return {
		triangles: data.listMeshes().reduce((sum, mesh) => sum + mesh.listPrimitives().reduce((n, p) => n + p.getIndices().getCount() / 3, 0), 0),
		textures: data
			.listTextures()
			.map(texture => digest(texture.getImage()))
			.sort(),
		skins: data
			.listNodes()
			.filter(node => node.getSkin())
			.map(node => ({
				name: node.getName(),
				bones: node
					.getSkin()
					.listJoints()
					.map(bone => bone.getName()),
				primitives: node
					.getMesh()
					.listPrimitives()
					.map(p => ({ joints: !!p.getAttribute("JOINTS_0"), weights: !!p.getAttribute("WEIGHTS_0") }))
			})),
		morphs: data
			.listMeshes()
			.map(mesh => ({ weights: mesh.getWeights(), targets: mesh.listPrimitives().map(p => p.listTargets().map(t => ({ name: t.getName(), semantics: t.listSemantics().sort() }))) })),
		controls: data
			.listNodes()
			.filter(node => ["Head", "Eye.L", "Eye.R"].includes(node.getName()))
			.map(node => node.getName())
			.sort(),
		anchors: data
			.listNodes()
			.filter(node => Object.keys(node.getExtras()).length)
			.map(node => ({ name: node.getName(), extras: node.getExtras() }))
	};
}
// Only calibrated runtime coordinates belong in the public derivative. Local
// source paths, construction notes and modeling debug extras stay in assets/.
const runtimeKeys = ["coverAnchor", "gazeOrigin", "gazeForward", "headPivot", "irisCenterThree"];
for (const node of document.getRoot().listNodes()) {
	const extras = node.getExtras();
	node.setExtras(Object.fromEntries(runtimeKeys.filter(key => key in extras).map(key => [key, extras[key]])));
}
const before = contract(document);
if (before.triangles !== 48314 || before.textures.length !== 5 || before.controls.length !== 3) throw new Error("Unexpected character source contract");
if (!before.morphs.some(mesh => mesh.targets.some(targets => targets.some(target => target.name === "Blink")))) throw new Error("Missing Blink morph");
if (before.morphs.some(mesh => mesh.weights.some(weight => weight !== 0))) throw new Error("Character master must export with neutral facial weights");
await document.transform(meshopt({ encoder: MeshoptEncoder, level: "high" }));
await fs.mkdir(root + "public/models", { recursive: true });
await io.write(output, document);
const after = contract(await io.read(output));
if (JSON.stringify(before) !== JSON.stringify(after)) throw new Error("Compression changed textures, morphs, skin or calibrated controls");
const report = {
	input: "assets/character/source.glb",
	output: "public/models/dragon.glb",
	inputBytes: (await fs.stat(input)).size,
	outputBytes: (await fs.stat(output)).size,
	sha256: digest(await fs.readFile(output)),
	triangles: after.triangles,
	originalTextureHashes: after.textures,
	controls: after.controls,
	neutralMorphWeights: after.morphs.map(mesh => mesh.weights),
	texturesPreserved: true,
	skinPreserved: true,
	morphsPreserved: true,
	calibrationPreserved: true
};
await fs.writeFile(root + "assets/character/web-export.json", JSON.stringify(report, null, 2) + "\n");
console.log("Character prepared: " + report.outputBytes + " bytes; original textures, Blink and gaze controls preserved.");
