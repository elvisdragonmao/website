import type { CoverSettings } from "../../scripts/scene/cover-settings";
import { COVER_LIMITS, DEFAULT_COVER, coverUrl, readCoverSettings, sanitizeCoverSettings, saveCoverSettings } from "../../scripts/scene/cover-settings";

type NumericKey = keyof typeof COVER_LIMITS;
type ReadyDetail = Partial<CoverSettings> & { canBlink?: boolean };
type RuntimeStats = { loaded?: boolean; blinkMeshes?: number; eyes?: number };
type RuntimeWindow = Window & { __EM_ART__?: { getStats?: () => RuntimeStats } };
let activeLab: AbortController | undefined;

function mountCoverLab(): void {
	const foundPanel = document.querySelector<HTMLDetailsElement>("[data-cover-panel]");
	if (!foundPanel || foundPanel.dataset.coverLabMounted) return;
	const panel: HTMLDetailsElement = foundPanel;
	activeLab?.abort();
	const lifetime = new AbortController();
	activeLab = lifetime;
	const { signal } = lifetime;
	panel.dataset.coverLabMounted = "true";
	signal.addEventListener(
		"abort",
		() => {
			delete panel.dataset.coverLabMounted;
		},
		{ once: true }
	);
	let settings: CoverSettings = readCoverSettings();
	const values = panel.querySelector<HTMLTextAreaElement>("[data-cover-values]")!;
	const shareInput = panel.querySelector<HTMLInputElement>("[data-cover-share-url]")!;
	const actionStatus = panel.querySelector<HTMLOutputElement>("[data-cover-action-status]")!;
	const modelStatus = panel.querySelector<HTMLElement>("[data-cover-status]")!;
	const blinkButton = panel.querySelector<HTMLButtonElement>("[data-cover-blink]")!;
	const autoBlink = panel.querySelector<HTMLInputElement>("[data-cover-autoblink]")!;
	const blinkNote = panel.querySelector<HTMLElement>("[data-cover-blink-note]")!;
	const numericInputs = [...panel.querySelectorAll<HTMLInputElement>("[data-cover-range], [data-cover-number]")];
	const fallback = document.querySelector<HTMLImageElement>(".cover-lab-root #world-fallback");
	fallback?.addEventListener(
		"error",
		() => {
			fallback.style.visibility = "hidden";
		},
		{ signal }
	);
	if (fallback?.complete && fallback.naturalWidth === 0) fallback.style.visibility = "hidden";
	if (matchMedia("(max-width: 700px)").matches) panel.open = false;

	const announce = (message: string): void => {
		actionStatus.textContent = message;
	};
	const dispatch = (): void => {
		window.dispatchEvent(new CustomEvent<CoverSettings>("em:cover-settings", { detail: { ...settings } }));
	};
	function sync(skip?: HTMLInputElement): void {
		for (const input of numericInputs) {
			if (input === skip) continue;
			const key = (input.dataset.coverRange ?? input.dataset.coverNumber) as NumericKey;
			const n = settings[key];
			if (input.type === "number") {
				const step = Number(input.step);
				input.value = n.toFixed(step < 0.1 ? 2 : step < 1 ? 1 : 0);
			} else input.value = String(n);
		}
		for (const button of panel.querySelectorAll<HTMLButtonElement>("[data-cover-view]")) button.setAttribute("aria-pressed", String(button.dataset.coverView === settings.view));
		for (const label of panel.querySelectorAll<HTMLElement>("[data-cover-zoom-label]")) label.textContent = `${settings.zoom.toFixed(2)}×`;
		autoBlink.checked = settings.autoBlink && !autoBlink.disabled;
		values.value = JSON.stringify(settings, null, 2);
		shareInput.value = coverUrl(settings);
	}

	function ready(detail?: ReadyDetail): void {
		panel.dataset.modelState = "ready";
		modelStatus.textContent = "預覽已就緒";
		let stats: RuntimeStats | undefined;
		try {
			stats = (window as RuntimeWindow).__EM_ART__?.getStats?.();
		} catch {
			/* Optional runtime inspection. */
		}
		const canBlink = detail?.canBlink ?? Boolean(stats && (stats.blinkMeshes ?? 0) > 0);
		autoBlink.disabled = !canBlink;
		autoBlink.checked = settings.autoBlink && canBlink;
		blinkButton.disabled = !canBlink;
		blinkNote.textContent = canBlink ? "可用「眨一下」確認眼皮閉合。" : "這個角色沒有眨眼表情，其他調整照常可用。";
		const eyeField = panel.querySelector<HTMLElement>('[data-cover-field="eyeYaw"]');
		const eyeNote = panel.querySelector<HTMLElement>("[data-cover-eye-note]");
		if (stats?.eyes === 0 && eyeField && eyeNote) {
			eyeField.querySelectorAll<HTMLInputElement>("input").forEach(input => {
				input.disabled = true;
			});
			eyeNote.hidden = false;
			eyeNote.textContent = "這個版本使用整個頭部跟隨，眼睛不會獨立轉動。";
		}
	}
	function failed(): void {
		panel.dataset.modelState = "error";
		modelStatus.textContent = "角色暫時無法載入，仍可先調整與複製參數。";
		blinkButton.disabled = true;
		autoBlink.disabled = true;
		blinkNote.textContent = "角色載入後，才可測試表情。";
	}

	for (const input of numericInputs) {
		const applyNumeric = (commit: boolean): void => {
			const key = input.dataset.coverRange ?? input.dataset.coverNumber;
			if (!key || !(key in COVER_LIMITS)) return;
			if (input.value.trim() === "" || !Number.isFinite(input.valueAsNumber)) {
				if (commit) sync();
				return;
			}
			settings = sanitizeCoverSettings({ ...settings, [key]: input.valueAsNumber });
			sync(input.type === "number" && !commit ? input : undefined);
			dispatch();
		};
		input.addEventListener("input", () => applyNumeric(false), { signal });
		input.addEventListener("change", () => applyNumeric(true), { signal });
	}
	panel.querySelectorAll<HTMLButtonElement>("[data-cover-view]").forEach(button =>
		button.addEventListener(
			"click",
			() => {
				settings = sanitizeCoverSettings({ ...settings, view: button.dataset.coverView });
				sync();
				dispatch();
			},
			{ signal }
		)
	);
	autoBlink.addEventListener(
		"change",
		() => {
			settings.autoBlink = autoBlink.checked;
			sync();
			dispatch();
		},
		{ signal }
	);
	blinkButton.addEventListener("click", () => window.dispatchEvent(new CustomEvent("em:cover-blink")), { signal });

	panel.querySelectorAll<HTMLButtonElement>("[data-cover-pose]").forEach(button =>
		button.addEventListener(
			"click",
			() => {
				const pose = button.dataset.coverPose;
				const detail = pose === "live" ? null : { x: pose === "left" ? 0.12 : pose === "right" ? 0.88 : 0.5, y: 0.5 };
				window.dispatchEvent(new CustomEvent("em:cover-pointer", { detail }));
				panel.querySelectorAll<HTMLButtonElement>("[data-cover-pose]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
			},
			{ signal }
		)
	);

	panel.querySelector<HTMLButtonElement>("[data-cover-reset]")!.addEventListener(
		"click",
		() => {
			settings = { ...DEFAULT_COVER };
			sync();
			dispatch();
			panel.querySelector<HTMLButtonElement>('[data-cover-pose="live"]')?.click();
			announce("已回到預設預覽；按「套用到首頁」才會儲存。");
		},
		{ signal }
	);
	panel.querySelector<HTMLButtonElement>("[data-cover-apply]")!.addEventListener(
		"click",
		() => {
			if (saveCoverSettings(settings)) announce("已儲存在這個瀏覽器，首頁會使用這組設定。");
			else announce("瀏覽器無法儲存。請複製設定或分享網址保留這個版本。");
		},
		{ signal }
	);

	async function copy(text: string, field: HTMLInputElement | HTMLTextAreaElement, success: string): Promise<void> {
		try {
			if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
			await navigator.clipboard.writeText(text);
			if (!signal.aborted) announce(success);
		} catch {
			if (signal.aborted) return;
			const details = field.closest<HTMLDetailsElement>("details.lab-export");
			if (details) details.open = true;
			field.focus();
			field.select();
			announce("已選取文字，請使用複製快捷鍵。");
		}
	}
	panel.querySelector<HTMLButtonElement>("[data-cover-copy]")!.addEventListener(
		"click",
		() => {
			void copy(values.value, values, "設定已複製。把這段 JSON 傳給我即可。");
		},
		{ signal }
	);
	panel.querySelector<HTMLButtonElement>("[data-cover-share]")!.addEventListener(
		"click",
		() => {
			panel.querySelector<HTMLElement>("[data-cover-share-row]")!.hidden = false;
			shareInput.value = coverUrl(settings);
			void copy(shareInput.value, shareInput, "分享網址已複製，開啟後會還原這組參數。");
		},
		{ signal }
	);
	panel.addEventListener("pointermove", event => event.stopPropagation(), { signal });
	window.addEventListener("em:cover-ready", event => ready((event as CustomEvent<ReadyDetail>).detail), { signal });
	window.addEventListener("em:cover-error", failed, { signal });
	sync();
	dispatch();
	try {
		if ((window as RuntimeWindow).__EM_ART__?.getStats?.().loaded) ready();
		else if (document.documentElement.dataset.artState === "fallback") failed();
	} catch {
		/* Wait for the runtime's ready/error event. */
	}
}

document.addEventListener("astro:before-swap", () => {
	activeLab?.abort();
	activeLab = undefined;
});
document.addEventListener("astro:page-load", mountCoverLab);
mountCoverLab();
