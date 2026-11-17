import { compactPrimitive } from "@gltf-transform/functions";
import { MeshoptSimplifier } from "meshoptimizer";

const DEFAULTS = { ratio: 0.55, error: 0.003, faceMinY: 3.45 };

function vertexKey(primitive, index) {
	const values = [];
	for (const semantic of primitive.listSemantics().sort()) values.push(semantic, ...primitive.getAttribute(semantic).getElement(index, []));
	for (const target of primitive.listTargets()) {
		values.push(target.getName());
		for (const semantic of target.listSemantics().sort()) values.push(semantic, ...target.getAttribute(semantic).getElement(index, []));
	}
	return JSON.stringify(values);
}

/** Reduce the approved web derivative while retaining its face, eye geometry and every active Blink vertex. */
export async function simplifyCharacter(document, options = {}) {
	const { ratio, error, faceMinY } = { ...DEFAULTS, ...options };
	await MeshoptSimplifier.ready;
	const primitives = [];
	for (const mesh of document.getRoot().listMeshes())
		for (const primitive of mesh.listPrimitives()) {
			const material = primitive.getMaterial()?.getName() ?? "";
			const positions = primitive.getAttribute("POSITION");
			const normals = primitive.getAttribute("NORMAL");
			const uv = primitive.getAttribute("TEXCOORD_0");
			const sourceIndices = primitive.getIndices();
			if (!positions || !normals || !uv || !sourceIndices) throw new Error(`Missing character attributes: ${material}`);
			const beforeTriangles = sourceIndices.getCount() / 3;
			const vertexCount = positions.getCount();
			const locked = new Uint8Array(vertexCount);
			const attributes = new Float32Array(vertexCount * 5);
			for (let i = 0; i < vertexCount; i++) {
				attributes.set(normals.getElement(i, []), i * 5);
				attributes.set(uv.getElement(i, []), i * 5 + 3);
			}
			// The approved master uses glTF +Y up. Preserve the complete body-material face/chest,
			// including tiny seams that the simplifier could otherwise collapse into non-manifold edges.
			if (/^M_Body/.test(material)) for (let i = 0; i < vertexCount; i++) if (positions.getElement(i, [])[1] >= faceMinY) locked[i] = 1;
			for (const target of primitive.listTargets())
				for (const semantic of target.listSemantics()) {
					const accessor = target.getAttribute(semantic),
						array = accessor.getArray(),
						size = accessor.getElementSize();
					for (let i = 0; i < vertexCount; i++) {
						for (let k = 0; k < size; k++) if (Math.abs(array[i * size + k]) > 1e-7) locked[i] = 1;
					}
				}
			const sourceVertices = new Set(),
				protectedVertices = new Set();
			for (let i = 0; i < vertexCount; i++) {
				const key = vertexKey(primitive, i);
				sourceVertices.add(key);
				if (locked[i]) protectedVertices.add(key);
			}
			let measuredError = 0;
			const eye = /^M_Eye[LR]/.test(material);
			if (!eye) {
				const [indices, actualError] = MeshoptSimplifier.simplifyWithAttributes(
					new Uint32Array(sourceIndices.getArray()),
					new Float32Array(positions.getArray()),
					3,
					attributes,
					5,
					[0.15, 0.15, 0.15, 0.5, 0.5],
					locked,
					Math.floor((sourceIndices.getCount() * ratio) / 3) * 3,
					error,
					["LockBorder"]
				);
				primitive.setIndices(document.createAccessor(sourceIndices.getName(), sourceIndices.getBuffer()).setType("SCALAR").setArray(indices));
				measuredError = actualError;
				// This remaps positions, skinning, every UV set and all morph attributes together.
				compactPrimitive(primitive);
			}
			const retained = new Set();
			for (let i = 0; i < primitive.getAttribute("POSITION").getCount(); i++) {
				const key = vertexKey(primitive, i);
				if (!sourceVertices.has(key)) throw new Error(`Character vertex attributes changed: ${material}`);
				retained.add(key);
			}
			for (const key of protectedVertices) if (!retained.has(key)) throw new Error(`Protected face/Blink vertex lost: ${material}`);
			if (eye && beforeTriangles !== primitive.getIndices().getCount() / 3) throw new Error(`Eye topology changed: ${material}`);
			primitives.push({ material, beforeTriangles, afterTriangles: primitive.getIndices().getCount() / 3, protectedVertices: protectedVertices.size, error: measuredError });
		}
	return {
		beforeTriangles: primitives.reduce((sum, p) => sum + p.beforeTriangles, 0),
		afterTriangles: primitives.reduce((sum, p) => sum + p.afterTriangles, 0),
		ratio,
		maxError: error,
		faceMinY,
		primitives,
		faceAndBlinkVerticesPreserved: true,
		vertexAttributesPreserved: true,
		eyeTopologyPreserved: true,
		lowerBodyRemoved: false
	};
}
