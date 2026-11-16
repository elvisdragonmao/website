import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export interface CreativeDesk {
	group: THREE.Group;
	anchors: Record<string, THREE.Object3D>;
	animate(time: number, progress: number, reduced: boolean): void;
}

/** A long working surface, intended to be discovered with a close lateral camera move. */
export function createDesk(): CreativeDesk {
	const group = new THREE.Group();
	group.name = "EM.CreativeDesk";
	const stationary: THREE.Mesh[] = [];
	const m = {
		surface: new THREE.MeshBasicMaterial({ color: 0x000000 }),
		edge: new THREE.MeshStandardMaterial({ color: 0x34484d, roughness: 0.75, emissive: 0x4e7881, emissiveIntensity: 0.1 }),
		case: new THREE.MeshStandardMaterial({ color: 0x24353e, roughness: 0.74, emissive: 0x3c7585, emissiveIntensity: 0.2 }),
		black: new THREE.MeshStandardMaterial({ color: 0x05090c, roughness: 0.74 }),
		white: new THREE.MeshStandardMaterial({ color: 0xe5e7dc, roughness: 0.62 }),
		cyan: new THREE.MeshStandardMaterial({ color: 0x62baca, roughness: 0.5, emissive: 0x62baca, emissiveIntensity: 0.12 }),
		blue: new THREE.MeshStandardMaterial({ color: 0x377fa8, roughness: 0.64, emissive: 0x377fa8, emissiveIntensity: 0.14 }),
		gold: new THREE.MeshStandardMaterial({ color: 0xddbd75, roughness: 0.6, emissive: 0xddbd75, emissiveIntensity: 0.1 }),
		metal: new THREE.MeshStandardMaterial({ color: 0x99a9a7, roughness: 0.46, metalness: 0.25 }),
		code: new THREE.MeshBasicMaterial({ color: 0x7bc7ce }),
		paper: new THREE.MeshStandardMaterial({ color: 0xb2b6ad, roughness: 0.98 })
	};
	type Mat = THREE.Material;
	function mesh(geometry: THREE.BufferGeometry, material: Mat, parent: THREE.Object3D = group, dynamic = false): THREE.Mesh {
		const object = new THREE.Mesh(geometry, material);
		parent.add(object);
		if (!dynamic) stationary.push(object);
		return object;
	}
	function block(w: number, h: number, d: number, x: number, y: number, z: number, material: Mat = m.case, parent: THREE.Object3D = group, radius = 0.035, dynamic = false): THREE.Mesh {
		const object = mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(radius, h * 0.45, w * 0.2, d * 0.2)), material, parent, dynamic);
		object.position.set(x, y, z);
		return object;
	}
	function oval(rx: number, ry: number, rz: number, x: number, y: number, z: number, material: Mat = m.white, parent: THREE.Object3D = group): THREE.Mesh {
		const object = mesh(new THREE.SphereGeometry(1, 20, 12), material, parent);
		object.scale.set(rx, ry, rz);
		object.position.set(x, y, z);
		return object;
	}
	function rod(a: THREE.Vector3, b: THREE.Vector3, radius: number, material: Mat, parent: THREE.Object3D = group): THREE.Mesh {
		const delta = b.clone().sub(a);
		const object = mesh(new THREE.CylinderGeometry(radius, radius, delta.length(), 10), material, parent);
		object.position.copy(a).add(b).multiplyScalar(0.5);
		object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
		return object;
	}
	function cable(points: number[][], radius: number, material: Mat, parent: THREE.Object3D = group): THREE.Mesh {
		return mesh(
			new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...(point as [number, number, number])))), Math.max(24, points.length * 8), radius, 6, false),
			material,
			parent
		);
	}
	function circle(radius: number, tube: number, x: number, y: number, z: number, material: Mat, rotationX = Math.PI / 2, parent: THREE.Object3D = group): THREE.Mesh {
		const object = mesh(new THREE.TorusGeometry(radius, tube, 6, 32), material, parent);
		object.position.set(x, y, z);
		object.rotation.x = rotationX;
		return object;
	}
	function assembly(name: string, x: number, z: number): THREE.Group {
		const object = new THREE.Group();
		object.name = name;
		object.position.set(x, 2.18, z);
		group.add(object);
		return object;
	}
	function anchor(name: string, x: number, y: number, z: number): THREE.Object3D {
		const object = new THREE.Object3D();
		object.name = `Desk.Anchor.${name}`;
		object.position.set(x, y, z);
		group.add(object);
		return object;
	}
	const anchors = {
		developer: anchor("developer", -3.45, 2.5, -1.12),
		designer: anchor("designer", -1.1, 2.42, -1.2),
		dragon: anchor("dragon", 3.65, 2.48, -1.0),
		researcher: anchor("researcher", 1.25, 2.48, -1.15)
	};

	// The table is a dark solid material, with its thin edge catching the light.
	block(10.8, 0.14, 2.85, 0, 2.1, -1.35, m.surface, group, 0.05);
	block(10.72, 0.025, 0.035, 0, 2.16, 0.055, m.edge, group, 0.01);
	block(10.72, 0.025, 0.035, 0, 2.16, -2.755, m.edge, group, 0.01);
	for (const x of [-5.34, 5.34]) block(0.035, 0.025, 2.78, x, 2.16, -1.35, m.edge, group, 0.01);

	// Developer: a deep-bezel monitor, compact keyboard, and a softly sculpted mouse.
	const developer = assembly("Desk.Developer", -3.5, -1.1);
	const monitor = new THREE.Group();
	monitor.position.set(0, 0.88, -1.0);
	monitor.rotation.x = -0.1;
	developer.add(monitor);
	block(1.7, 1.0, 0.095, 0, 0, 0, m.case, monitor, 0.06);
	block(1.57, 0.85, 0.018, 0, 0.035, 0.057, m.black, monitor, 0.02);
	for (let line = 0; line < 8; line++) {
		const widths = [0.43, 0.77, 0.61, 0.36, 0.85, 0.57, 0.67, 0.29];
		const indent = line === 2 || line === 3 || line === 5 ? 0.1 : 0;
		block(widths[line], 0.02, 0.006, -0.49 + widths[line] / 2 + indent, 0.32 - line * 0.082, 0.069, line % 3 === 0 ? m.gold : m.code, monitor, 0.002);
	}
	block(0.1, 0.47, 0.1, 0, 0.28, -1.0, m.metal, developer);
	block(0.64, 0.035, 0.4, 0, 0.025, -0.95, m.case, developer);
	block(1.62, 0.075, 0.63, -0.13, 0.055, 0.43, m.case, developer, 0.03);
	for (let row = 0; row < 4; row++)
		for (let col = 0; col < 12; col++) {
			const isSpace = row === 3 && col > 2 && col < 8;
			if (isSpace && col !== 3) continue;
			block(isSpace ? 0.62 : 0.105, 0.03, 0.102, -0.82 + col * 0.123 + (isSpace ? 0.25 : 0), 0.112, 0.22 + row * 0.125, col === 0 || (row === 0 && col > 8) ? m.blue : m.white, developer, 0.009);
		}
	oval(0.16, 0.1, 0.25, 1.02, 0.11, 0.37, m.white, developer);
	cable(
		[
			[1.02, 0.205, 0.16],
			[1.02, 0.211, 0.29],
			[1.02, 0.211, 0.43]
		],
		0.004,
		m.case,
		developer
	);
	const wheel = mesh(new THREE.CylinderGeometry(0.037, 0.037, 0.025, 14), m.black, developer);
	wheel.rotation.z = Math.PI / 2;
	wheel.position.set(1.02, 0.208, 0.27);
	cable(
		[
			[1.02, 0.06, 0.1],
			[1.17, 0.018, -0.17],
			[0.97, 0.015, -0.51],
			[0.55, 0.02, -0.75]
		],
		0.009,
		m.edge,
		developer
	);
	cable(
		[
			[0.4, 0.03, 0.16],
			[0.6, 0.02, -0.04],
			[0.59, 0.019, -0.31],
			[0.23, 0.019, -0.56]
		],
		0.009,
		m.edge,
		developer
	);
	const screenLed = new THREE.MeshBasicMaterial({ color: 0x83c8d6 });
	oval(0.013, 0.013, 0.01, 0.71, -0.44, 0.054, screenLed, monitor);

	// Designer: broad inset drawing surface, one flowing stroke, a pen hovering above it.
	const designer = assembly("Desk.Designer", -1.12, -1.2);
	designer.rotation.y = -0.09;
	block(1.65, 0.075, 1.19, 0, 0.04, 0, m.case, designer, 0.035);
	block(1.47, 0.015, 1.02, 0.025, 0.087, 0, m.black, designer, 0.008);
	cable(
		[
			[-0.5, 0.1, 0.21],
			[-0.27, 0.105, -0.22],
			[0.04, 0.1, -0.25],
			[0.35, 0.1, 0.17],
			[0.57, 0.1, -0.13]
		],
		0.014,
		m.cyan,
		designer
	);
	cable(
		[
			[-0.49, 0.1, 0.28],
			[-0.25, 0.1, 0.11],
			[0.09, 0.1, 0.29],
			[0.41, 0.1, 0.23]
		],
		0.009,
		m.blue,
		designer
	);
	for (let i = 0; i < 4; i++) block(0.025, 0.014, 0.07, -0.775, 0.083, -0.3 + i * 0.17, i === 0 ? m.cyan : m.metal, designer, 0.005);
	const pen = new THREE.Group();
	pen.name = "Desk.Stylus";
	pen.position.set(0.36, 0.27, 0.15);
	pen.rotation.set(0.75, -0.24, -0.53);
	designer.add(pen);
	mesh(new THREE.CylinderGeometry(0.027, 0.037, 0.68, 12), m.white, pen, true);
	const penGrip = mesh(new THREE.CylinderGeometry(0.041, 0.041, 0.21, 12), m.case, pen, true);
	penGrip.position.y = -0.16;
	const penTip = mesh(new THREE.ConeGeometry(0.035, 0.115, 12), m.gold, pen, true);
	penTip.rotation.z = Math.PI;
	penTip.position.y = -0.393;
	const penClip = mesh(new RoundedBoxGeometry(0.012, 0.19, 0.02, 2, 0.004), m.blue, pen, true);
	penClip.position.set(0.032, 0.15, 0);
	block(0.65, 0.009, 0.86, -0.65, 0.013, -0.87, m.paper, designer, 0.002).rotation.y = -0.18;
	for (let i = 0; i < 3; i++)
		cable(
			[
				[-0.87, 0.023, -1.1 + i * 0.1],
				[-0.64, 0.024, -1.08 + i * 0.11],
				[-0.45, 0.023, -1.12 + i * 0.1]
			],
			0.003,
			m.edge,
			designer
		);

	// Music / dragon: an actual piano key pattern, encoder knobs, and a stereo monitor pair.
	const music = assembly("Desk.Music", 3.65, -0.95);
	music.rotation.y = 0.045;
	block(1.87, 0.13, 0.92, 0, 0.075, 0, m.case, music, 0.05);
	const keys: { object: THREE.Mesh; rest: number; phase: number }[] = [];
	for (let i = 0; i < 14; i++) {
		const key = block(0.114, 0.055, 0.56, -0.83 + i * 0.127, 0.165, 0.145, m.white, music, 0.012, true);
		keys.push({ object: key, rest: key.position.y, phase: i * 0.71 });
		if ([0, 1, 3, 4, 5].includes(i % 7)) block(0.067, 0.075, 0.34, -0.77 + i * 0.127, 0.215, 0.02, m.black, music, 0.008);
	}
	for (let i = 0; i < 6; i++) {
		const knob = mesh(new THREE.CylinderGeometry(0.045, 0.048, 0.058, 12), i === 0 ? m.cyan : m.black, music);
		knob.position.set(-0.7 + i * 0.24, 0.175, -0.305);
		block(0.008, 0.003, 0.024, -0.7 + i * 0.24, 0.207, -0.315, m.white, music, 0.001);
	}
	block(0.24, 0.012, 0.095, 0.68, 0.147, -0.3, m.black, music, 0.005);
	for (let i = 0; i < 4; i++) block(0.025, 0.003, 0.045, 0.59 + i * 0.045, 0.156, -0.3, m.cyan, music, 0.002);
	for (const side of [-1, 1]) {
		const speaker = assembly(`Desk.Speaker.${side < 0 ? "Left" : "Right"}`, music.position.x + side * 0.98, -2.05);
		block(0.49, 0.77, 0.42, 0, 0.385, 0, m.case, speaker, 0.04);
		for (const [y, r] of [
			[0.29, 0.155],
			[0.6, 0.068]
		]) {
			const speakerFace = mesh(new THREE.CylinderGeometry(r, r, 0.018, 32), m.black, speaker);
			speakerFace.rotation.x = Math.PI / 2;
			speakerFace.position.set(0, y, 0.222);
			circle(r * 0.77, 0.009, 0, y, 0.236, m.metal, 0, speaker);
			oval(r * 0.35, r * 0.35, 0.021, 0, y, 0.248, m.case, speaker);
		}
	}
	cable(
		[
			[1.94, 2.2, -2.1],
			[1.95, 2.2, -1.75],
			[1.7, 2.2, -1.43]
		],
		0.011,
		m.edge
	);

	// Research: a wearable strap, a breakout board, an antenna, and exposed signal traces.
	const research = assembly("Desk.Research", 1.26, -1.14);
	const strap = mesh(new THREE.TorusGeometry(0.285, 0.058, 8, 48), m.case, research);
	strap.rotation.x = Math.PI / 2;
	strap.position.set(-0.15, 0.08, 0.1);
	block(0.3, 0.12, 0.24, -0.15, 0.17, -0.16, m.white, research, 0.045);
	block(0.21, 0.009, 0.15, -0.15, 0.235, -0.16, m.black, research, 0.012);
	const pulseMaterial = new THREE.MeshBasicMaterial({ color: 0x6dbac6 });
	const pulse = mesh(new THREE.TorusGeometry(0.047, 0.007, 5, 24), pulseMaterial, research, true);
	pulse.rotation.x = Math.PI / 2;
	pulse.position.set(-0.15, 0.244, -0.16);
	block(0.59, 0.047, 0.4, 0.55, 0.054, -0.25, m.blue, research, 0.014);
	block(0.25, 0.028, 0.19, 0.49, 0.092, -0.25, m.black, research, 0.009);
	block(0.095, 0.018, 0.16, 0.77, 0.087, -0.24, m.metal, research, 0.008);
	for (let i = 0; i < 8; i++) for (const z of [-0.465, -0.035]) block(0.016, 0.055, 0.016, 0.31 + i * 0.058, 0.086, z, m.gold, research, 0.003);
	for (let i = 0; i < 5; i++) block(0.043, 0.012, 0.019, 0.29 + i * 0.07, 0.085, -0.4, m.white, research, 0.003);
	cable(
		[
			[0.25, 0.09, -0.31],
			[0.04, 0.08, -0.54],
			[-0.19, 0.11, -0.4],
			[-0.15, 0.2, -0.28]
		],
		0.011,
		m.gold,
		research
	);
	cable(
		[
			[0.26, 0.08, -0.18],
			[0.05, 0.03, -0.68],
			[-0.36, 0.025, -0.52],
			[-0.25, 0.12, -0.24]
		],
		0.01,
		m.cyan,
		research
	);
	cable(
		[
			[0.32, 0.08, -0.05],
			[0.55, 0.05, 0.31],
			[0.2, 0.025, 0.51],
			[-0.15, 0.025, 0.38]
		],
		0.01,
		m.edge,
		research
	);
	rod(new THREE.Vector3(0.76, 0.1, -0.35), new THREE.Vector3(0.91, 0.49, -0.52), 0.012, m.case, research);
	oval(0.025, 0.025, 0.025, 0.91, 0.49, -0.52, m.gold, research);
	const stylizedHand = new THREE.Group();
	research.add(stylizedHand);
	stylizedHand.position.set(-0.7, 0.14, 0.38);
	stylizedHand.rotation.y = -0.36;
	oval(0.17, 0.055, 0.24, 0, 0, 0, m.paper, stylizedHand);
	for (let i = 0; i < 4; i++) {
		const length = [0.29, 0.36, 0.34, 0.25][i];
		const x = -0.12 + i * 0.082;
		cable(
			[
				[x, 0, -0.12],
				[x + 0.008, 0.018, -0.28],
				[x + 0.015, 0.015, -0.12 - length]
			],
			0.035,
			m.paper,
			stylizedHand
		);
	}
	cable(
		[
			[-0.12, 0, 0.02],
			[-0.25, 0.01, -0.04],
			[-0.3, 0.018, -0.15]
		],
		0.047,
		m.paper,
		stylizedHand
	);
	// An exploded component is held above the workbench and gently follows scroll.
	const sensor = new THREE.Group();
	sensor.name = "Desk.Sensor";
	research.add(sensor);
	sensor.position.set(0.45, 0.39, 0.45);
	block(0.22, 0.025, 0.19, 0, 0, 0, m.case, sensor, 0.01, true);
	const sensorLens = mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.014, 20), m.cyan, sensor, true);
	sensorLens.position.y = 0.023;
	for (const x of [-0.07, 0.07]) block(0.02, 0.012, 0.06, x, 0.023, -0.025, m.gold, sensor, 0.004, true);

	// Bake all fixed transforms once and merge by material. Animated parts and anchors stay editable.
	group.updateMatrixWorld(true);
	const batches = new Map<THREE.Material, THREE.BufferGeometry[]>();
	for (const object of stationary) {
		const material = object.material as THREE.Material;
		const geometry = object.geometry.index ? object.geometry.toNonIndexed() : object.geometry.clone();
		geometry.deleteAttribute("uv");
		geometry.applyMatrix4(object.matrixWorld);
		if (!batches.has(material)) batches.set(material, []);
		batches.get(material)!.push(geometry);
		object.removeFromParent();
		object.geometry.dispose();
	}
	for (const [material, geometries] of batches) {
		const geometry = mergeGeometries(geometries, false);
		if (geometry) {
			const batch = new THREE.Mesh(geometry, material);
			batch.name = "Desk.Static." + material.uuid.slice(0, 6);
			group.add(batch);
		}
		geometries.forEach(geometry => geometry.dispose());
	}
	const penRest = pen.rotation.clone();
	const sensorRest = sensor.position.clone();
	return {
		group,
		anchors,
		animate(time, progress, reduced) {
			const t = reduced ? 0 : time;
			pen.position.y = 0.27 + (reduced ? 0 : Math.sin(t * 0.83) * 0.025) + Math.sin(progress * Math.PI) * 0.035;
			pen.rotation.z = penRest.z + (reduced ? 0 : Math.sin(t * 0.51) * 0.022) + Math.sin(progress * Math.PI * 2) * 0.07;
			pen.rotation.x = penRest.x + Math.sin(progress * Math.PI) * 0.06;
			for (const key of keys) {
				const strike = reduced ? 0 : Math.pow(Math.max(0, Math.sin(t * 1.45 - key.phase)), 18);
				key.object.position.y = key.rest - strike * 0.022;
			}
			sensor.position.y = sensorRest.y + (reduced ? 0 : Math.sin(t * 0.72) * 0.022) + Math.sin(progress * Math.PI) * 0.045;
			sensor.rotation.y = (reduced ? 0 : Math.sin(t * 0.43) * 0.04) + progress * 0.12;
			pulse.scale.setScalar(1 + (reduced ? 0 : Math.sin(t * 1.7) * 0.08));
			pulseMaterial.color.setRGB(0.3, 0.6 + (reduced ? 0 : Math.sin(t * 1.7) * 0.08), 0.68);
			screenLed.color.setRGB(0.4, 0.7 + (reduced ? 0 : Math.sin(t * 0.9) * 0.035), 0.76);
		}
	};
}
