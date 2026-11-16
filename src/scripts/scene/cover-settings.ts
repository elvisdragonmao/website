/** Shared by the real homepage and the cover tuning page. Angles are degrees. */
export interface CoverSettings {
	zoom: number;
	distance: number;
	cameraHeight: number;
	lookHeight: number;
	cameraOrbit: number;
	cameraAngle: number;
	headTurn: number;
	headYaw: number;
	headPitch: number;
	eyeYaw: number;
	followSpeed: number;
	asciiCellSize: number;
	view: "ascii" | "colour";
	autoBlink: boolean;
}
export const COVER_STORAGE_KEY = "em-cover-novabeast-fbx-v1";
export const DEFAULT_COVER: Readonly<CoverSettings> = Object.freeze({
	zoom: 2.06,
	distance: 1.7,
	cameraHeight: 0.2,
	lookHeight: -0.01,
	cameraOrbit: -8,
	cameraAngle: 20,
	headTurn: 0,
	headYaw: -12,
	headPitch: -3,
	eyeYaw: 8,
	followSpeed: 4.5,
	asciiCellSize: 14,
	view: "ascii",
	autoBlink: true
});
export const COVER_LIMITS = {
	zoom: [0.65, 2.8],
	distance: [0.8, 5],
	cameraHeight: [-0.5, 1.4],
	lookHeight: [-0.65, 0.65],
	cameraAngle: [-45, 45],
	headTurn: [-45, 45],
	cameraOrbit: [-25, 25],
	headYaw: [-30, 30],
	headPitch: [-18, 18],
	eyeYaw: [-20, 20],
	followSpeed: [0.5, 15],
	asciiCellSize: [6, 28]
} as const;
export function sanitizeCoverSettings(value: unknown): CoverSettings {
	const result = { ...DEFAULT_COVER };
	if (!value || typeof value !== "object") return result;
	const input = value as Record<string, unknown>;
	for (const key of Object.keys(COVER_LIMITS) as (keyof typeof COVER_LIMITS)[]) {
		const n = input[key];
		if (typeof n === "number" && Number.isFinite(n)) {
			const [min, max] = COVER_LIMITS[key];
			result[key] = Math.round(Math.min(max, Math.max(min, n)) * 1000) / 1000;
		}
	}
	if (input.view === "ascii" || input.view === "colour") result.view = input.view;
	if (typeof input.autoBlink === "boolean") result.autoBlink = input.autoBlink;
	return result;
}
export function readCoverSettings(search = location.search): CoverSettings {
	const shared = new URLSearchParams(search).get("cover");
	if (shared) {
		try {
			return sanitizeCoverSettings(JSON.parse(shared));
		} catch {
			/* Fall through to saved settings. */
		}
	}
	try {
		const saved = localStorage.getItem(COVER_STORAGE_KEY);
		if (saved) return sanitizeCoverSettings(JSON.parse(saved));
	} catch {
		/* Storage is optional. */
	}
	return { ...DEFAULT_COVER };
}
export function saveCoverSettings(settings: CoverSettings): boolean {
	try {
		localStorage.setItem(COVER_STORAGE_KEY, JSON.stringify(sanitizeCoverSettings(settings)));
		return true;
	} catch {
		return false;
	}
}
export function coverUrl(settings: CoverSettings, path = "/cover-lab/"): string {
	const url = new URL(path, location.origin);
	url.searchParams.set("cover", JSON.stringify(sanitizeCoverSettings(settings)));
	return url.href;
}
