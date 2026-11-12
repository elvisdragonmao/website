import * as THREE from "three";
import type { StoryRange } from "./journey";
import { ease } from "./journey";

export class WorldAnnotations {
	private labels = [...document.querySelectorAll<HTMLElement>("[data-anchor]")];
	private cover = document.querySelector<HTMLElement>("[data-cover-label]");
	private point = new THREE.Vector3();
	private projected = new THREE.Vector3();
	focus = new THREE.Vector4(-1, -1, 0, 0);
	focusOpacity = 0;
	constructor() {
		for (const label of this.labels) label.style.removeProperty("opacity");
	}

	update(
		camera: THREE.PerspectiveCamera,
		anchors: Record<string, THREE.Object3D>,
		ranges: StoryRange[],
		scroll: number,
		width: number,
		height: number,
		time: number,
		reduced: boolean,
		deskProgress: number
	): void {
		this.focus.set(-1, -1, 0, 0);
		this.focusOpacity = 0;
		if (reduced) return;
		const margin = width < 600 ? 22 : 36;
		const closestAnchor = Object.entries(anchors).sort(
			(a, b) => Math.abs(a[1].getWorldPosition(new THREE.Vector3()).x - camera.position.x) - Math.abs(b[1].getWorldPosition(new THREE.Vector3()).x - camera.position.x)
		)[0]?.[0];
		for (const label of this.labels) {
			const key = label.dataset.anchor ?? label.dataset.worldLabel ?? "";
			const desk = Boolean(label.dataset.anchor);
			const range = ranges.find(r => r.name === (desk ? "desk" : key));
			if (!range) continue;
			const viewport = label.closest<HTMLElement>(".scene-viewport");
			const rect = viewport?.getBoundingClientRect();
			if (!rect) continue;
			const enter = ease((scroll + height * 0.72 - range.top) / (height * 0.55));
			const exit = 1 - ease((scroll - (range.top + range.height - height * 0.7)) / (height * 0.55));
			const sectionVisibility = enter * exit * ease((scroll - range.top + height * 0.42) / (height * 0.3));
			if (!desk) {
				label.style.opacity = String(sectionVisibility);
				label.style.pointerEvents = sectionVisibility > 0.15 ? "auto" : "none";
				const actual = label.getBoundingClientRect();
				if (sectionVisibility > 0) {
					this.focus.set((actual.left + actual.width / 2) / width, 1 - (actual.top + actual.height / 2) / height, (actual.width * 0.52) / width, (actual.height * 0.54) / height);
					this.focusOpacity = sectionVisibility;
				}
				continue;
			}

			// Only the role list belongs to the desk's 3D coordinate system.
			// Narrative subtitles above keep their own cinematic screen position.
			if (anchors[key]) {
				anchors[key].getWorldPosition(this.point);
				this.point.y += 0.42 + Math.sin(time * 0.65 + this.point.x) * 0.045;
			} else continue;
			this.projected.copy(this.point).project(camera);
			const cameraDistance = camera.position.distanceTo(this.point);
			let scale = THREE.MathUtils.clamp(3.1 / cameraDistance, 0.72, 1.14);
			// Keep annotations readable on a small screen; depth still comes from
			// their projected position, leader and motion rather than tiny type.
			if (width < 700) scale = 1;
			const ndc = this.projected;
			const onScreen = (1 - ease((Math.abs(ndc.x) - 0.78) / 0.42)) * (1 - ease((Math.abs(ndc.y) - 0.9) / 0.5));
			const behind = ndc.z > 1 || ndc.z < -1;
			const mobileVisibility = width < 700 && desk ? (key === closestAnchor ? 1 : onScreen * 0.18) : onScreen;
			const opacity = behind ? 0 : sectionVisibility * (desk ? mobileVisibility : 1);
			const labelWidth = label.offsetWidth * scale;
			const labelHeight = label.offsetHeight * scale;
			let x = (ndc.x * 0.5 + 0.5) * width + (key === "developer" ? 95 : 55) * scale;
			let y = (-ndc.y * 0.5 + 0.5) * height - 25 * scale - rect.top;
			x = THREE.MathUtils.clamp(x, margin, Math.max(margin, width - labelWidth - margin));
			y = THREE.MathUtils.clamp(y, width < 600 ? 105 : 80, Math.max(110, height - labelHeight - 50));
			const angle = desk ? -3 + deskProgress * 0.8 + Math.sin(time * 0.24 + key.length) * 0.6 : Math.sin(time * 0.18 + key.length) * 1.6;
			label.style.setProperty("--label-x", `${x.toFixed(2)}px`);
			label.style.setProperty("--label-y", `${y.toFixed(2)}px`);
			label.style.setProperty("--label-scale", scale.toFixed(4));
			label.style.setProperty("--label-opacity", opacity.toFixed(3));
			label.style.setProperty("--label-rotation", `${angle.toFixed(2)}deg`);
			label.style.setProperty("--leader-length", `${THREE.MathUtils.clamp(42 * scale, 24, 54).toFixed(1)}px`);
			label.style.pointerEvents = opacity > 0.15 ? "auto" : "none";
			if (opacity > 0 && (!desk || key === closestAnchor)) {
				this.focus.set((x + labelWidth * 0.5) / width, 1 - (y + labelHeight * 0.5 + rect.top) / height, (labelWidth * 0.5) / width, (labelHeight * 0.5) / height);
				this.focusOpacity = opacity;
			}
		}
	}

	updateCover(_pointer: THREE.Vector2, progress: number, reduced: boolean): void {
		if (!this.cover || reduced) return;
		const visibility = 1 - ease((progress - 0.12) / 0.3);
		this.cover.style.opacity = visibility.toFixed(3);
		this.cover.style.removeProperty("transform");
	}
}
