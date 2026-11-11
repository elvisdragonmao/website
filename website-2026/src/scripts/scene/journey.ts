import * as THREE from "three";

export interface StoryRange {
	name: string;
	top: number;
	height: number;
}
export const clamp01 = (n: number) => THREE.MathUtils.clamp(n, 0, 1);
export const ease = (n: number) => {
	const t = clamp01(n);
	return t * t * (3 - 2 * t);
};
export const DESK_OFFSET = new THREE.Vector3(3.5, 0, -2.7);
export const EARTH_CENTER = new THREE.Vector3(8.9, 3.6, -4.1);
// The flyover is a short change of scene, ending at the first workstation.
const flyPosition = new THREE.CatmullRomCurve3(
	[new THREE.Vector3(0, 4.25, 1.55), new THREE.Vector3(0.02, 4.8, 0.78), new THREE.Vector3(0.03, 5.08, -0.18), new THREE.Vector3(0.04, 4.76, -1.25), new THREE.Vector3(0.05, 4.3, -1.55)],
	false,
	"centripetal"
);
const flyLook = new THREE.CatmullRomCurve3(
	[new THREE.Vector3(0, 3.9, 0.12), new THREE.Vector3(0, 4.45, -0.05), new THREE.Vector3(0, 4.25, -0.8), new THREE.Vector3(0.02, 2.9, -3.9), new THREE.Vector3(0.05, 2.55, -4.05)],
	false,
	"centripetal"
);
export class CameraJourney {
	position = new THREE.Vector3();
	look = new THREE.Vector3();
	deskProgress = 0;
	coverProgress = 0;
	localProgress = 0;
	roll = 0;
	phase = "cover";
	weights = new THREE.Vector3();
	presence = 1;
	fireLift = 0;
	workPresence = 0;
	contactPresence = 0;
	earthPresence = 0;
	earthProgress = 0;
	private target = new THREE.Vector3();
	frame(scroll: number, height: number, width: number, ranges: StoryRange[], _time: number, _pointer: THREE.Vector2, reduced: boolean): void {
		const range = (name: string) => ranges.find(r => r.name === name) ?? { name, top: 0, height };
		const desk = range("desk"),
			fire = range("fire"),
			alive = range("alive"),
			beyond = range("beyond"),
			work = range("work"),
			why = range("why"),
			contact = range("contact");
		const eyeLine = scroll + height * 0.48;
		this.phase = (ranges.find(r => eyeLine >= r.top && eyeLine < r.top + r.height) ?? ranges.at(-1))?.name ?? "cover";
		const progress = (r: StoryRange) => clamp01((scroll - r.top + height * 0.48) / Math.max(height * 0.6, r.height - height * 0.2));
		this.localProgress = progress(range(this.phase));
		const deskStart = Math.max(height * 0.65, desk.top - height * 0.15);
		const deskEnd = desk.top + desk.height - height * 0.75;
		this.coverProgress = clamp01(scroll / deskStart);
		this.deskProgress = clamp01((scroll - deskStart) / Math.max(height, deskEnd - deskStart));
		if (scroll < deskStart) {
			flyPosition.getPoint(this.coverProgress, this.position);
			flyLook.getPoint(this.coverProgress, this.look);
		} else {
			const d = this.deskProgress;
			this.position.set(THREE.MathUtils.lerp(0.05, 7.25, d), 4.3 + Math.sin(d * Math.PI) * 0.07, -1.55 - d * 0.15);
			this.look.set(THREE.MathUtils.lerp(0.05, 7.25, d), 2.55, -4.05);
		}
		const fireEnter = ease((scroll - fire.top + height * 0.65) / (height * 0.65));
		if (fireEnter > 0) {
			this.position.lerp(this.target.set(7.55, 4.45, -1.7), fireEnter);
			this.look.lerp(this.target.set(7.35, 2.75, -4), fireEnter);
		}
		// Procedural scenes share a stationary stage. Their animation belongs to time,
		// pointer and the wipe, rather than an incidental moving 3D camera.
		const fieldEnter = ease((scroll - alive.top + height * 0.8) / (height * 0.8));
		if (fieldEnter > 0) {
			this.position.lerp(this.target.set(8.6, 4.5, -1.8), fieldEnter);
			this.look.lerp(this.target.set(8.4, 3.45, -4), fieldEnter);
		}
		const whyEnter = ease((scroll - why.top + height * 0.75) / (height * 0.75));
		if (whyEnter > 0) {
			const distance = width < 700 ? Math.max(5.4, 2 / (Math.tan(Math.PI / 10) * (width / height))) : 5.4;
			this.position.lerp(this.target.set(EARTH_CENTER.x, EARTH_CENTER.y + 0.12, EARTH_CENTER.z + distance), whyEnter);
			this.look.lerp(EARTH_CENTER, whyEnter);
		}
		this.presence = 1 - ease(this.coverProgress / 0.6);
		this.roll = reduced ? 0 : Math.sin(this.deskProgress * Math.PI) * -0.008;
		const weight = (r: StoryRange) => ease((eyeLine - r.top + height * 0.15) / (height * 0.55)) * (1 - ease((eyeLine - (r.top + r.height - height * 0.25)) / (height * 0.65)));
		this.fireLift = ease((scroll - alive.top + height * 0.72) / (height * 0.9));
		const fireWeight = fireEnter * (1 - ease((this.fireLift - 0.94) / 0.06));
		const aliveWeight = ease((scroll - alive.top + height * 0.85) / (height * 0.5)) * (1 - ease((scroll - beyond.top + height * 0.35) / (height * 0.7)));
		this.weights.set(fireWeight, aliveWeight, weight(beyond));
		this.workPresence = ease((scroll - work.top + height * 0.55) / (height * 0.6)) * (1 - ease((scroll - why.top + height * 0.5) / (height * 0.8)));
		this.contactPresence = ease((scroll - contact.top + height * 0.5) / (height * 0.8));
		this.earthProgress = clamp01((scroll - why.top + height * 0.55) / Math.max(height, why.height));
		this.earthPresence = ease((scroll - why.top + height * 0.55) / (height * 0.85)) * (1 - ease((scroll - contact.top + height * 0.3) / (height * 0.65)));
		if (reduced && this.phase === "desk") {
			this.position.set(3.7, 7.2, -2.4);
			this.look.set(3.5, 2.3, -4);
		}
	}
}
