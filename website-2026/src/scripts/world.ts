import * as THREE from "three";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { CHARACTER_MODEL_URL } from "../data/character";
import { WorldAnnotations } from "./scene/annotations";
import { createAsciiSurface } from "./scene/ascii";
import { DEFAULT_COVER, readCoverSettings, sanitizeCoverSettings } from "./scene/cover-settings";
import { CursorGaze } from "./scene/cursor-gaze";
import { createDesk } from "./scene/desk";
import { createEarth } from "./scene/earth";
import { CameraJourney, DESK_OFFSET, EARTH_CENTER, type StoryRange, ease } from "./scene/journey";
import { SceneLoader } from "./scene/loader";
import { StoryText } from "./scene/story-text";

const lifetimes = import.meta.env.DEV
	? ((window as unknown as { __EM_WORLD_LIFETIME__?: { mounts: number; disposals: number; active: number } }).__EM_WORLD_LIFETIME__ ??= { mounts: 0, disposals: 0, active: 0 })
	: { mounts: 0, disposals: 0, active: 0 };
let activeWorld: AbortController | undefined;
function mountWorld(): void {
	const canvas = document.querySelector<HTMLCanvasElement>("#world");
	if (!canvas || canvas.dataset.worldMounted) return;
	activeWorld?.abort();
	activeWorld = new AbortController();
	canvas.dataset.worldMounted = "true";
	void createWorld(canvas, activeWorld.signal);
}
document.addEventListener("astro:before-swap", () => activeWorld?.abort());
document.addEventListener("astro:page-load", mountWorld);
mountWorld();

async function createWorld(canvas: HTMLCanvasElement, signal: AbortSignal): Promise<void> {
	const loader = new SceneLoader();
	let frame = 0,
		stopped = false,
		observer: ResizeObserver | undefined;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const query = new URLSearchParams(import.meta.env.DEV ? location.search : "");
	const modelReview = import.meta.env.DEV && query.get("view") === "model";
	const largeGrain = import.meta.env.DEV && query.get("grain") === "large";
	const forceNative = import.meta.env.DEV && (query.get("view") === "scene" || modelReview);
	let native = forceNative;
	const isLab = import.meta.env.DEV && canvas.hasAttribute("data-cover-lab");
	let coverSettings = import.meta.env.DEV ? readCoverSettings() : { ...DEFAULT_COVER },
		settingsRevision = 0,
		lastSettingsRevision = -1;
	const coverAnchor = new THREE.Vector3(0, 4.2, 0.25);
	const coverPosition = new THREE.Vector3(),
		coverTarget = new THREE.Vector3(),
		coverOffset = new THREE.Vector3();
	const coverLocalAnchor = new THREE.Vector3(),
		framingAnchor = new THREE.Vector3();
	const up = new THREE.Vector3(0, 1, 0),
		neutralPointer = new THREE.Vector2(0.5, 0.5);
	let renderer: THREE.WebGLRenderer;
	try {
		renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
	} catch {
		loader.finish();
		document.documentElement.dataset.artState = "fallback";
		if (import.meta.env.DEV) dispatchEvent(new CustomEvent("em:cover-error"));
		return;
	}
	renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x050809);
	const ambient = new THREE.HemisphereLight(0xe8f5ff, 0x152732, 0.85);
	scene.add(ambient);
	const key = new THREE.DirectionalLight(0xfff3dc, 1.4);
	key.position.set(-3, 7, 5);
	scene.add(key);
	const rim = new THREE.DirectionalLight(0x64c9e4, 0.75);
	rim.position.set(5, 5, -3);
	scene.add(rim);
	const fill = new THREE.DirectionalLight(0x8eb4c9, 0.3);
	fill.position.set(2, 3, 4);
	scene.add(fill);
	const lightColors = { ambient: ambient.color.clone(), ground: ambient.groundColor.clone(), key: key.color.clone(), rim: rim.color.clone(), fill: fill.color.clone() };
	const neutralWhite = new THREE.Color(0xffffff),
		neutralGround = new THREE.Color(0x161616);
	const camera = new THREE.PerspectiveCamera(36, 1, 0.05, 80);
	const art = createAsciiSurface(),
		desk = createDesk(),
		journey = new CameraJourney(),
		annotations = new WorldAnnotations(),
		storyText = new StoryText(),
		earth = createEarth();
	desk.group.position.copy(DESK_OFFSET);
	earth.group.position.copy(EARTH_CENTER);
	earth.group.visible = false;
	scene.add(earth.group);
	scene.add(desk.group);
	desk.group.visible = false;
	let dragon: THREE.Group | undefined, head: THREE.Object3D | undefined, gaze: CursorGaze | undefined;
	const gazeOrigin = new THREE.Vector3(),
		gazeForward = new THREE.Vector3(0, 0, 1);
	let hasGazeOrigin = false;
	let eyes: THREE.Object3D[] = [],
		ears: THREE.Object3D[] = [],
		lids: THREE.Mesh[] = [];
	const restQuaternions = new Map<THREE.Object3D, THREE.Quaternion>();
	const dragonMaterials = new Map<THREE.Material, { opacity: number; transparent: boolean; depthWrite: boolean }>();
	const parentRotation = new THREE.Quaternion(),
		deltaRotation = new THREE.Quaternion(),
		localDelta = new THREE.Quaternion();
	const deltaEuler = new THREE.Euler(0, 0, 0, "YXZ"),
		headForward = new THREE.Vector3(0, 0, 1);
	// glTF nodes may retain Blender's basis rotation. Apply control angles around
	// world axes instead of editing one Euler component of that rotated basis.
	function rotateControl(object: THREE.Object3D, pitch: number, yaw: number, roll: number): void {
		const rest = restQuaternions.get(object);
		if (!rest) return;
		if (object.parent) object.parent.getWorldQuaternion(parentRotation);
		else parentRotation.identity();
		deltaRotation.setFromEuler(deltaEuler.set(pitch, yaw, roll));
		localDelta.copy(parentRotation).invert().multiply(deltaRotation).multiply(parentRotation);
		object.quaternion.copy(localDelta).multiply(rest);
	}
	let loaded = false;
	if (import.meta.env.DEV) {
		lifetimes.mounts++;
		lifetimes.active++;
	}
	const disposeObject = (object: THREE.Object3D | undefined) => {
		const geometries = new Set<THREE.BufferGeometry>(),
			materials = new Set<THREE.Material>(),
			textures = new Set<THREE.Texture>();
		object?.traverse(o => {
			const m = o as THREE.Mesh;
			if (!m.isMesh) return;
			geometries.add(m.geometry);
			for (const material of Array.isArray(m.material) ? m.material : [m.material]) {
				materials.add(material);
				for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value);
			}
		});
		for (const g of geometries) g.dispose();
		for (const m of materials) m.dispose();
		for (const t of textures) t.dispose();
	};
	const cleanup = () => {
		if (stopped) return;
		stopped = true;
		loader.dispose();
		cancelAnimationFrame(frame);
		observer?.disconnect();
		renderer.dispose();
		art.dispose();
		storyText.dispose();
		earth.dispose();
		disposeObject(dragon);
		disposeObject(desk.group);
		delete canvas.dataset.worldMounted;
		delete document.documentElement.dataset.artState;
		document.documentElement.classList.remove("art-ready");
		if (import.meta.env.DEV) delete (window as unknown as { __EM_ART__?: unknown }).__EM_ART__;
		if (import.meta.env.DEV) {
			lifetimes.disposals++;
			lifetimes.active--;
		}
	};
	signal.addEventListener("abort", cleanup, { once: true });
	try {
		loader.setProgress(0.12);
		const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(CHARACTER_MODEL_URL, event => {
			if (event.total > 0) loader.setProgress(0.12 + (0.72 * event.loaded) / event.total);
		});
		if (signal.aborted) {
			disposeObject(gltf.scene);
			return;
		}
		dragon = gltf.scene;
		dragon.traverse(o => {
			const anchor = o.userData.coverAnchor;
			if (!(Array.isArray(anchor) && anchor.length === 3 && anchor.every(n => typeof n === "number" && Number.isFinite(n)))) return;
			coverAnchor.fromArray(anchor);
			for (const [key, target] of [
				["gazeOrigin", gazeOrigin],
				["gazeForward", gazeForward]
			] as const) {
				const value = o.userData[key];
				if (Array.isArray(value) && value.length === 3 && value.every(n => typeof n === "number" && Number.isFinite(n))) {
					target.fromArray(value);
					if (key === "gazeOrigin") hasGazeOrigin = true;
				}
			}
		});
		scene.add(dragon);
		const find = (name: string) => dragon?.getObjectByName(name) ?? dragon?.getObjectByName(name.replaceAll(".", ""));
		head = find("Head");
		eyes = ["Eye.L", "Eye.R"].map(find).filter((o): o is THREE.Object3D => Boolean(o));
		ears = ["Ear.L", "Ear.R"].map(find).filter((o): o is THREE.Object3D => Boolean(o));
		dragon.traverse(o => {
			const m = o as THREE.Mesh;
			if (m.isMesh && m.morphTargetDictionary && Object.keys(m.morphTargetDictionary).some(k => /blink/i.test(k))) lids.push(m);
			if (m.isMesh)
				for (const material of Array.isArray(m.material) ? m.material : [m.material]) {
					if (!dragonMaterials.has(material)) dragonMaterials.set(material, { opacity: material.opacity, transparent: material.transparent, depthWrite: material.depthWrite });
				}
		});
		for (const o of [head, ...eyes, ...ears]) if (o) restQuaternions.set(o, o.quaternion.clone());
		if (head) {
			coverLocalAnchor.copy(coverAnchor);
			head.worldToLocal(coverLocalAnchor);
			headForward.copy(gazeForward).applyQuaternion(head.getWorldQuaternion(new THREE.Quaternion()).invert());
			gaze = new CursorGaze(head, eyes, hasGazeOrigin ? gazeOrigin : coverAnchor, gazeForward);
		}
		loaded = true;
		loader.setProgress(0.92, "Finding the light…");
		document.documentElement.classList.add("art-ready");
		document.documentElement.dataset.artState = "ready";
	} catch (error) {
		if (signal.aborted) return;
		console.warn("Dragon unavailable; showing the static cover.", error);
		loader.finish();
		document.documentElement.dataset.artState = "fallback";
		if (import.meta.env.DEV) dispatchEvent(new CustomEvent("em:cover-error"));
	}
	if (signal.aborted) return;
	let width = 1,
		height = 1,
		ranges: StoryRange[] = [];
	const sections = [...document.querySelectorAll<HTMLElement>("main > section[data-scene]")];
	const narrativePanels = [...document.querySelectorAll<HTMLElement>("[data-story-layer] [data-world-label]")];
	function resize(): void {
		width = innerWidth;
		height = innerHeight;
		renderer.setSize(width, height, false);
		art.resize(width, height, largeGrain);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		ranges = isLab
			? ["cover", "desk", "fire", "alive", "beyond", "why"].map((name, i) => ({ name, top: i * height * 3, height: height * 3 }))
			: sections.map(section => ({ name: section.dataset.scene ?? "", top: section.getBoundingClientRect().top + scrollY, height: section.offsetHeight }));
	}
	resize();
	addEventListener("resize", resize, { passive: true, signal });
	void document.fonts.ready.then(() => {
		if (!signal.aborted) resize();
	});
	observer = new ResizeObserver(resize);
	for (const section of sections) observer.observe(section);
	const pointer = new THREE.Vector2(0.5, 0.5),
		follow = new THREE.Vector2(0.5, 0.5),
		headFollow = new THREE.Vector2(0.5, 0.5);
	let lastPointer = performance.now();
	const idlePointer = new THREE.Vector2(0.5, 0.5);
	addEventListener(
		"pointermove",
		event => {
			if (event.pointerType !== "touch") {
				pointer.set(event.clientX / width, 1 - event.clientY / height);
				lastPointer = performance.now();
			}
		},
		{ passive: true, signal }
	);
	let time = 0;
	let heldPointer: THREE.Vector2 | undefined;
	if (import.meta.env.DEV)
		addEventListener(
			"em:cover-settings",
			event => {
				coverSettings = sanitizeCoverSettings((event as CustomEvent).detail);
				settingsRevision++;
			},
			{ signal }
		);
	if (import.meta.env.DEV)
		addEventListener(
			"em:cover-pointer",
			event => {
				const p = (event as CustomEvent<{ x?: number; y?: number } | null>).detail;
				heldPointer = p && typeof p.x === "number" ? new THREE.Vector2(THREE.MathUtils.clamp(p.x, 0, 1), THREE.MathUtils.clamp(p.y ?? 0.5, 0, 1)) : undefined;
			},
			{ signal }
		);
	if (import.meta.env.DEV)
		addEventListener(
			"em:cover-blink",
			() => {
				blinkReview = null;
				blinkStart = blinkClock;
				nextBlink = blinkClock + 3.1 + Math.random() * 4.4;
				settingsRevision++;
			},
			{ signal }
		);
	addEventListener(
		"pointerdown",
		event => {
			art.uniforms.uImpulse.value.set(event.clientX / width, 1 - event.clientY / height, time);
		},
		{ passive: true, signal }
	);
	let visible = !document.hidden,
		first = 0,
		last = 0,
		lastScroll = -1,
		lastWidth = 0,
		lastHeight = 0,
		lastScene = "";
	let nextBlink = 3.8,
		blinkStart = -20,
		blinkClock = 0,
		blinkWeight = 0,
		sceneCalls = 0,
		sceneTriangles = 0,
		averageFrame = 16;
	let blinkReview: number | null = null;
	let hadSubjects = false;
	const projected = new THREE.Vector3(),
		cameraGoal = new THREE.Vector3(),
		lookFollow = new THREE.Vector3(0, 3.86, 0.25);
	const sceneState = { name: "cover", frames: 0, paints: 0, deskProgress: 0, coverProgress: 0 };
	document.addEventListener(
		"visibilitychange",
		() => {
			visible = !document.hidden;
		},
		{ signal }
	);
	if (import.meta.env.DEV)
		(window as unknown as { __EM_ART__: unknown }).__EM_ART__ = {
			sceneState,
			renderer,
			camera,
			getModel: () => dragon,
			getDesk: () => desk,
			getEarth: () => earth,
			getCoverSettings: () => ({ ...coverSettings }),
			getCoverAnchor: () => coverAnchor.toArray(),
			setBlinkForReview: (value: number | null) => {
				blinkReview = typeof value === "number" && Number.isFinite(value) ? THREE.MathUtils.clamp(value, 0, 1) : null;
				settingsRevision++;
			},
			getStats: () => ({
				loaded,
				model: "novabeast-fbx",
				gaze: gaze?.debug(),
				coverSettings: { ...coverSettings },
				headDirection: head ? headForward.clone().applyQuaternion(head.getWorldQuaternion(new THREE.Quaternion())).toArray() : null,
				sceneCalls,
				sceneTriangles,
				frameMs: averageFrame,
				width,
				height,
				eyes: eyes.length,
				blinkMeshes: lids.length,
				blinkWeight,
				blinkReview,
				camera: camera.position.toArray(),
				look: lookFollow.toArray(),
				framingAnchor: framingAnchor.toArray(),
				deskProgress: journey.deskProgress,
				fireLift: journey.fireLift,
				earthPresence: journey.earthPresence,
				workPresence: journey.workPresence,
				contactPresence: journey.contactPresence,
				fieldCenter: art.uniforms.uFieldCenter.value.toArray()
			})
		};
	if (import.meta.env.DEV && loaded) dispatchEvent(new CustomEvent("em:cover-ready", { detail: { ...coverSettings, canBlink: lids.length > 0 } }));
	function render(ms: number): void {
		if (stopped) return;
		if (!canvas.isConnected) {
			cleanup();
			return;
		}
		frame = requestAnimationFrame(render);
		const dt = Math.min((ms - last) / 1000 || 0.016, 0.06);
		last = ms;
		if (!visible) return;
		if (!first) first = ms;
		time = reduced.matches ? 2 : (ms - first) / 1000;
		// Keep an explicit blink working even when the ambient scene is motion-reduced.
		// The clock pauses in hidden tabs, so returning cannot skip a manual blink.
		blinkClock += dt;
		if (blinkClock > nextBlink && !reduced.matches && coverSettings.autoBlink) {
			blinkStart = blinkClock;
			nextBlink = blinkClock + 3.1 + Math.random() * 4.4;
		}
		const blinkAge = blinkClock - blinkStart;
		const blinkPulse = blinkAge < 0 ? 0 : blinkAge < 0.085 ? ease(blinkAge / 0.085) : blinkAge < 0.115 ? 1 : blinkAge < 0.28 ? 1 - ease((blinkAge - 0.115) / 0.165) : 0;
		const introBlink = coverSettings.autoBlink && !reduced.matches ? 1 - ease((time - 0.12) / 0.85) : 0;
		const nextBlinkWeight = blinkReview ?? Math.max(introBlink, blinkPulse);
		if (nextBlinkWeight !== blinkWeight) settingsRevision++;
		blinkWeight = nextBlinkWeight;
		averageFrame = averageFrame * 0.96 + dt * 1000 * 0.04;
		const idle = reduced.matches ? 0 : ease((ms - lastPointer - 3000) / 2500);
		idlePointer.copy(pointer).lerp(new THREE.Vector2(0.5 + Math.sin(time * 0.27) * 0.11 + Math.sin(time * 0.61) * 0.025, 0.5 + Math.sin(time * 0.33 + 0.7) * 0.065), idle);
		const gazePointer = heldPointer ?? idlePointer;
		follow.lerp(gazePointer, 1 - Math.exp(-dt * 8));
		headFollow.lerp(gazePointer, 1 - Math.exp(-dt * coverSettings.followSpeed));
		if (head) {
			head.updateWorldMatrix(true, false);
			framingAnchor.copy(coverLocalAnchor).applyMatrix4(head.matrixWorld);
		} else framingAnchor.copy(coverAnchor);
		coverTarget.copy(framingAnchor);
		coverTarget.y += coverSettings.lookHeight;
		coverOffset.set(0, coverSettings.cameraHeight, coverSettings.distance);
		coverOffset.applyAxisAngle(up, THREE.MathUtils.degToRad(coverSettings.cameraAngle + (reduced.matches ? 0 : (follow.x - 0.5) * 2 * coverSettings.cameraOrbit)));
		coverPosition.copy(coverAnchor).add(coverOffset);
		journey.setCoverStart(coverPosition, coverTarget);
		journey.frame(isLab ? 0 : scrollY, height, width, ranges, time, neutralPointer, reduced.matches);
		const coverPresence = isLab ? 1 : 1 - ease(journey.coverProgress / 0.78);
		if (isLab) {
			journey.position.copy(coverPosition);
			journey.look.copy(coverTarget);
		}
		ambient.color.copy(lightColors.ambient).lerp(neutralWhite, coverPresence);
		ambient.groundColor.copy(lightColors.ground).lerp(neutralGround, coverPresence);
		key.color.copy(lightColors.key).lerp(neutralWhite, coverPresence);
		rim.color.copy(lightColors.rim).lerp(neutralWhite, coverPresence);
		fill.color.copy(lightColors.fill).lerp(neutralWhite, coverPresence);
		const deskZoom = 1;
		const zoom = THREE.MathUtils.lerp(deskZoom, coverSettings.zoom, coverPresence);
		if (Math.abs(camera.zoom - zoom) > 0.0001) {
			camera.zoom = zoom;
			camera.updateProjectionMatrix();
		}
		native = forceNative || (coverPresence > 0.05 && coverSettings.view === "colour");
		const name = journey.phase,
			changed = name !== lastScene;
		sceneState.name = name;
		sceneState.frames++;
		sceneState.deskProgress = journey.deskProgress;
		sceneState.coverProgress = journey.coverProgress;
		document.documentElement.dataset.scene = name;
		if (!isLab) storyText.update(scrollY, height, ranges, time, reduced.matches);
		const readingRange = ranges.find(r => r.name === name);
		const fullyCovered = name === "about" && readingRange && scrollY >= readingRange.top && scrollY + height <= readingRange.top + readingRange.height;
		if (!native && fullyCovered) {
			camera.position.copy(journey.position);
			lookFollow.copy(journey.look);
			lastScene = name;
			return;
		}
		if (reduced.matches && !changed && lastScroll === scrollY && lastWidth === width && lastHeight === height && lastSettingsRevision === settingsRevision) return;
		lastSettingsRevision = settingsRevision;
		lastScroll = scrollY;
		lastWidth = width;
		lastHeight = height;
		lastScene = name;
		cameraGoal.copy(journey.position);
		if (modelReview) {
			cameraGoal.set(3.2, 4.2, 5.3);
			journey.look.set(0, 3.8, 0);
		}
		if (sceneState.paints === 0 || reduced.matches) {
			camera.position.copy(cameraGoal);
			lookFollow.copy(journey.look);
		} else {
			const blend = 1 - Math.exp(-dt * 19);
			camera.position.lerp(cameraGoal, blend);
			lookFollow.lerp(journey.look, blend);
		}
		camera.lookAt(lookFollow);
		camera.rotateZ(journey.roll);
		camera.updateMatrixWorld();
		const headPresence = isLab ? 1 : 1 - ease(journey.coverProgress / 0.78);
		// Once leaving the cover, keep the rig's neutral anatomy instead of aiming
		// the head at a camera flying over/behind its neck.
		gaze?.update(camera, gazePointer, coverSettings, dt, headPresence, reduced.matches);
		ears.forEach((ear, i) => rotateControl(ear, 0, 0, reduced.matches ? 0 : (headFollow.x - 0.5) * 0.045 + Math.sin(time * 0.65 + i) * 0.008));
		for (const lid of lids)
			for (const [key, index] of Object.entries(lid.morphTargetDictionary ?? {})) if (/blink/i.test(key) && lid.morphTargetInfluences) lid.morphTargetInfluences[index] = blinkWeight;
		desk.animate(time, journey.deskProgress, reduced.matches);
		desk.group.visible = !isLab && journey.coverProgress > 0.28 && scrollY < (ranges.find(r => r.name === "alive")?.top ?? 0);
		const dragonFade = isLab || modelReview ? 1 : 1 - ease((journey.coverProgress - 0.025) / 0.43);
		if (dragon) {
			dragon.visible = dragonFade > 0.001;
			dragon.position.y = -0.3 * (1 - dragonFade) + (reduced.matches ? 0 : Math.sin(time * 1.05) * 0.009 * dragonFade);
			dragon.position.z = 0.18 * (1 - dragonFade);
			dragon.rotation.z = reduced.matches ? 0 : Math.sin(time * 0.58) * 0.0025 * dragonFade;
			for (const [material, rest] of dragonMaterials) {
				const transparent = rest.transparent || dragonFade < 0.999;
				if (material.transparent !== transparent) {
					material.transparent = transparent;
					material.needsUpdate = true;
				}
				material.opacity = rest.opacity * Math.pow(dragonFade, 2.2);
				material.depthWrite = rest.depthWrite && dragonFade > 0.99;
			}
		}
		earth.group.visible = !isLab && journey.earthPresence > 0.001;
		earth.update(time, journey.earthProgress, reduced.matches, journey.earthPresence);
		if (reduced.matches) art.fire.warmUp(time, 1);
		else art.fire.update(time, dt, 1);
		const fireRange = ranges.find(r => r.name === "fire");
		art.uniforms.uFireReveal.value = fireRange ? ease((scrollY + height * 0.9 - fireRange.top) / (height * 0.9)) : 0;
		art.uniforms.uFireLift.value = isLab ? 0 : journey.fireLift;
		art.uniforms.uWorkPresence.value = isLab ? 0 : journey.workPresence;
		art.uniforms.uContactPresence.value = isLab ? 0 : journey.contactPresence;
		art.uniforms.uTime.value = time;
		art.uniforms.uStory.value = (scrollY / height) * 0.7;
		art.uniforms.uPointer.value.copy(follow);
		art.uniforms.uWeights.value.lerp(journey.weights, 1 - Math.exp(-dt * 9));
		art.uniforms.uBrightness.value = 0.91;
		projected.set(4.15, 2.55, -1.15).project(camera);
		art.uniforms.uFireOrigin.value.set(THREE.MathUtils.clamp(projected.x * 0.5 + 0.5, 0.15, 0.85), THREE.MathUtils.clamp(projected.y * 0.5 + 0.5, 0.08, 0.4));
		art.uniforms.uFieldCenter.value.set(0.5, 0.5);
		scene.updateMatrixWorld();
		const cell = coverPresence > 0.05 ? coverSettings.asciiCellSize : width < 600 ? 8.5 : largeGrain ? 20 : 14;
		art.uniforms.uGrid.value.set(Math.ceil(width / cell), Math.ceil(height / (cell * 1.5)));
		annotations.update(camera, desk.anchors, ranges, isLab ? 0 : scrollY, width, height, time, reduced.matches, journey.deskProgress);
		annotations.updateCover(follow, journey.coverProgress, reduced.matches);
		art.uniforms.uLabelFocus.value.copy(annotations.focus);
		const narrativePanel = narrativePanels.find(panel => {
			const layer = panel.closest<HTMLElement>("[data-story-layer]");
			return layer?.dataset.storyActive === "true" && Number(layer.style.getPropertyValue("--story-opacity")) > 0.35;
		});
		if (narrativePanel) {
			const rect = narrativePanel.getBoundingClientRect();
			art.uniforms.uLabelFocus.value.set((rect.left + rect.width / 2) / width, 1 - (rect.top + rect.height / 2) / height, (rect.width * 0.55) / width, (rect.height * 0.62) / height);
		}
		const subjectsVisible = Boolean(dragon?.visible || desk.group.visible || earth.group.visible);
		if (native || subjectsVisible || hadSubjects || changed) {
			renderer.setRenderTarget(native ? null : art.source);
			renderer.render(scene, camera);
			sceneCalls = renderer.info.render.calls;
			sceneTriangles = renderer.info.render.triangles;
		}
		hadSubjects = subjectsVisible;
		if (!native) {
			renderer.setRenderTarget(null);
			renderer.render(art.scene, art.camera);
		}
		sceneState.paints++;
		if (sceneState.paints === 1) loader.finish();
	}
	frame = requestAnimationFrame(render);
	addEventListener("pagehide", cleanup, { once: true, signal });
	addEventListener(
		"pageshow",
		event => {
			if (event.persisted) mountWorld();
		},
		{ signal }
	);
}
