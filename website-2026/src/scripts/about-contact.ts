import { startCrtNoise } from "./crt-noise";

export function startAboutContact(root: HTMLElement, signal: AbortSignal): void {
	startCrtNoise(root.querySelector<HTMLCanvasElement>("[data-contact-static]"), signal);
}
