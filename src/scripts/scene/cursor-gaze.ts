import * as THREE from "three";
import type { CoverSettings } from "./cover-settings";

const UP = new THREE.Vector3(0, 1, 0),
	ZERO = new THREE.Vector3();
const wrap = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle));

/** A calibrated source-facing direction, not an assumption about a joint's local Z. */
class AimJoint {
	private rest: THREE.Quaternion;
	private forwardLocal: THREE.Vector3;
	private neutralBasis: THREE.Quaternion;
	private parent = new THREE.Quaternion();
	private worldGoal = new THREE.Quaternion();
	private localGoal = new THREE.Quaternion();
	private basis = new THREE.Matrix4();
	private orientation = new THREE.Quaternion();
	private direction = new THREE.Vector3();
	constructor(
		readonly joint: THREE.Object3D,
		worldForward: THREE.Vector3
	) {
		this.rest = joint.quaternion.clone();
		this.forwardLocal = worldForward.clone().applyQuaternion(joint.getWorldQuaternion(new THREE.Quaternion()).invert());
		this.neutralBasis = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(worldForward, ZERO, UP)).invert();
	}
	aim(direction: THREE.Vector3, amount: number, blend: number): void {
		this.worldGoal.setFromRotationMatrix(this.basis.lookAt(direction, ZERO, UP)).multiply(this.neutralBasis);
		this.orientation.identity().slerp(this.worldGoal, amount);
		if (this.joint.parent) this.joint.parent.getWorldQuaternion(this.parent);
		else this.parent.identity();
		this.localGoal.copy(this.parent).invert().multiply(this.orientation).multiply(this.parent).multiply(this.rest);
		this.joint.quaternion.slerp(this.localGoal, blend);
	}
	/** Eyes inherit the head's motion before adding their residual aim. */
	aimResidual(direction: THREE.Vector3, horizontalLimit: number, verticalLimit: number, blend: number): void {
		if (this.joint.parent) this.joint.parent.getWorldQuaternion(this.parent);
		else this.parent.identity();
		this.orientation.copy(this.parent).multiply(this.rest);
		this.direction.copy(this.forwardLocal).applyQuaternion(this.orientation).normalize();
		const baseYaw = Math.atan2(this.direction.x, this.direction.z),
			basePitch = Math.asin(THREE.MathUtils.clamp(this.direction.y, -1, 1));
		const yaw = baseYaw + THREE.MathUtils.clamp(wrap(Math.atan2(direction.x, direction.z) - baseYaw), -horizontalLimit, horizontalLimit);
		const pitch = basePitch + THREE.MathUtils.clamp(Math.asin(THREE.MathUtils.clamp(direction.y, -1, 1)) - basePitch, -verticalLimit, verticalLimit);
		this.direction.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
		this.worldGoal.setFromRotationMatrix(this.basis.lookAt(this.direction, ZERO, UP));
		// Build the current rest-facing basis, including the animated parent.
		this.direction.copy(this.forwardLocal).applyQuaternion(this.orientation).normalize();
		this.orientation.setFromRotationMatrix(this.basis.lookAt(this.direction, ZERO, UP)).invert();
		this.worldGoal.multiply(this.orientation);
		this.localGoal.copy(this.parent).invert().multiply(this.worldGoal).multiply(this.parent).multiply(this.rest);
		this.joint.quaternion.slerp(this.localGoal, blend);
	}
	forward(out: THREE.Vector3): THREE.Vector3 {
		return out.copy(this.forwardLocal).applyQuaternion(this.joint.getWorldQuaternion(this.orientation)).normalize();
	}
}

export class CursorGaze {
	readonly target = new THREE.Vector3();
	readonly origin = new THREE.Vector3();
	readonly desired = new THREE.Vector3();
	readonly actual = new THREE.Vector3();
	private headAim: AimJoint;
	private eyeAims: AimJoint[];
	private localOrigin: THREE.Vector3;
	private ray = new THREE.Raycaster();
	private plane = new THREE.Plane();
	private planeOrigin = new THREE.Vector3();
	private cameraForward = new THREE.Vector3();
	private towardCamera = new THREE.Vector3();
	private eyeOrigin = new THREE.Vector3();
	private eyeDirection = new THREE.Vector3();
	private ndc = new THREE.Vector2();
	private neutralForward: THREE.Vector3;
	private halfEyeSeparation = 0;
	private nativeEyeOffsets: number[] = [];
	errorDegrees = 0;
	constructor(head: THREE.Object3D, eyes: THREE.Object3D[], origin: THREE.Vector3, forward: THREE.Vector3) {
		this.neutralForward = forward.clone().normalize();
		this.headAim = new AimJoint(head, this.neutralForward);
		this.eyeAims = eyes.map(eye => {
			const value = eye.userData.gazeForward;
			const forward = Array.isArray(value) && value.length === 3 ? new THREE.Vector3().fromArray(value).normalize() : this.neutralForward;
			this.nativeEyeOffsets.push(Math.abs(wrap(Math.atan2(forward.x, forward.z) - Math.atan2(this.neutralForward.x, this.neutralForward.z))));
			return new AimJoint(eye, forward);
		});
		this.localOrigin = head.worldToLocal(origin.clone());
		if (eyes.length >= 2) this.halfEyeSeparation = eyes[0].getWorldPosition(new THREE.Vector3()).distanceTo(eyes[1].getWorldPosition(new THREE.Vector3())) * 0.5;
	}
	update(camera: THREE.PerspectiveCamera, pointer: THREE.Vector2, settings: CoverSettings, dt: number, presence: number, reduced: boolean): void {
		const head = this.headAim.joint;
		head.updateWorldMatrix(true, false);
		this.origin.copy(this.localOrigin).applyMatrix4(head.matrixWorld);
		camera.getWorldDirection(this.cameraForward);
		// A cursor point on a screen-parallel plane between the face and viewer.
		// Keeping it near the viewer gives meaningful depth and bounded neck motion.
		const distance = camera.position.distanceTo(this.origin);
		this.planeOrigin.copy(camera.position).addScaledVector(this.cameraForward, Math.max(0.25, distance * 0.55));
		this.plane.setFromNormalAndCoplanarPoint(this.cameraForward, this.planeOrigin);
		this.ndc.set(reduced ? 0 : pointer.x * 2 - 1, reduced ? 0 : pointer.y * 2 - 1);
		this.ray.setFromCamera(this.ndc, camera);
		if (!this.ray.ray.intersectPlane(this.plane, this.target)) this.target.copy(camera.position);
		this.desired.subVectors(this.target, this.origin).normalize();
		this.towardCamera.subVectors(camera.position, this.origin).normalize();
		const baseYaw = Math.atan2(this.towardCamera.x, this.towardCamera.z);
		const yawLimit = THREE.MathUtils.degToRad(Math.abs(settings.headYaw));
		const pointerYaw = THREE.MathUtils.clamp(wrap(Math.atan2(this.desired.x, this.desired.z) - baseYaw), -yawLimit, yawLimit);
		// Negative is the existing follow convention. It controls the residual
		// response; the face still aligns with the moving camera at screen centre.
		const yaw = baseYaw + pointerYaw * (settings.headYaw <= 0 ? 1 : -1) + THREE.MathUtils.degToRad(settings.headTurn);
		const pitch = THREE.MathUtils.clamp(Math.asin(this.desired.y) - THREE.MathUtils.degToRad(settings.headPitch), -0.65, 0.65);
		this.desired.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
		const blend = reduced ? 1 : 1 - Math.exp(-dt * settings.followSpeed);
		this.headAim.aim(this.desired, presence, blend);
		for (const [index, eye] of this.eyeAims.entries()) {
			eye.joint.getWorldPosition(this.eyeOrigin);
			this.eyeDirection.subVectors(this.target, this.eyeOrigin).normalize();
			// Binocular convergence is separate from the user-controlled cursor
			// excursion. Otherwise a close target consumes the whole 8° budget.
			const convergence = Math.atan2(this.halfEyeSeparation, Math.max(0.05, this.target.distanceTo(this.origin)));
			const horizontalLimit = Math.min(THREE.MathUtils.degToRad(30), THREE.MathUtils.degToRad(Math.abs(settings.eyeYaw)) + convergence + (this.nativeEyeOffsets[index] ?? 0));
			eye.aimResidual(this.eyeDirection, horizontalLimit, THREE.MathUtils.degToRad(14), reduced ? 1 : 1 - Math.exp(-dt * settings.followSpeed * 2.2));
		}
		this.headAim.forward(this.actual);
		head.updateWorldMatrix(true, false);
		this.origin.copy(this.localOrigin).applyMatrix4(head.matrixWorld);
		this.desired.subVectors(this.target, this.origin).normalize();
		this.errorDegrees = THREE.MathUtils.radToDeg(this.actual.angleTo(this.desired));
	}
	debug(): object {
		return {
			target: this.target.toArray(),
			origin: this.origin.toArray(),
			actualDirection: this.actual.toArray(),
			targetDirection: this.desired.toArray(),
			headErrorDegrees: this.errorDegrees,
			eyes: this.eyeAims.map(eye => {
				eye.joint.getWorldPosition(this.eyeOrigin);
				this.eyeDirection.subVectors(this.target, this.eyeOrigin).normalize();
				return { name: eye.joint.name, direction: eye.forward(new THREE.Vector3()).toArray(), errorDegrees: THREE.MathUtils.radToDeg(eye.forward(new THREE.Vector3()).angleTo(this.eyeDirection)) };
			})
		};
	}
}
