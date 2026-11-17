/** Submit once, report confirmed results, and validate only on an explicit submission. */
export function setupNewsletters(signal: AbortSignal): void {
	for (const form of document.querySelectorAll<HTMLFormElement>("form[data-newsletter]")) {
		const status = form.querySelector<HTMLOutputElement>("[data-status]");
		const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
		if (!status || !button) continue;
		const originalLabel = button.textContent ?? "";
		const inputs = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input:not([type=hidden]), textarea")];
		let submitting = false;
		let complete = false;
		const animations = new Set<Animation>();
		const report = (state: string, message: string) => {
			form.dataset.state = state;
			status.textContent = message;
			if (message && (state === "success" || state === "error")) status.scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
		};
		const clear = (input: HTMLInputElement | HTMLTextAreaElement) => {
			input.removeAttribute("aria-invalid");
			input.closest<HTMLElement>("[data-newsletter-field]")?.removeAttribute("data-invalid");
		};
		const invalidate = (input: HTMLInputElement | HTMLTextAreaElement) => {
			input.setAttribute("aria-invalid", "true");
			const field = input.closest<HTMLElement>("[data-newsletter-field]") ?? input;
			field.dataset.invalid = "true";
			if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
				for (const animation of field.getAnimations()) animation.cancel();
				const animation = field.animate(
					[0, -6, 6, -4, 4, 0].map(x => ({ transform: `translateX(${x}px)` })),
					{ duration: 360, easing: "ease-out" }
				);
				animations.add(animation);
				void animation.finished.catch(() => {}).finally(() => animations.delete(animation));
			}
		};
		for (const input of inputs)
			input.addEventListener(
				"input",
				() => {
					clear(input);
					if (!submitting && !complete) report("idle", "");
				},
				{ signal }
			);
		signal.addEventListener(
			"abort",
			() => {
				for (const animation of animations) animation.cancel();
			},
			{ once: true }
		);
		form.addEventListener(
			"submit",
			async event => {
				event.preventDefault();
				if (submitting || complete) return;
				for (const input of inputs) {
					input.value = input.value.trim();
					clear(input);
				}
				const invalid = inputs.filter(input => !input.validity.valid);
				if (invalid.length) {
					for (const input of invalid) invalidate(input);
					report("invalid", form.dataset.validationMessage ?? "Please check the highlighted fields.");
					invalid[0]?.focus();
					return;
				}
				submitting = true;
				button.disabled = true;
				button.textContent = form.dataset.pendingLabel ?? originalLabel;
				form.setAttribute("aria-busy", "true");
				report("pending", form.dataset.pendingMessage ?? "Sending…");
				const values = new FormData(form);
				for (const input of inputs) input.readOnly = true;
				try {
					const response = await fetch(form.action, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ name: values.get("name"), email: values.get("email"), interest: values.get("interest"), referrer: new URLSearchParams(location.search).get("f") || location.href }),
						signal: AbortSignal.any([signal, AbortSignal.timeout(18000)])
					});
					const result: { ok?: boolean; fields?: unknown } = await response.json();
					if (signal.aborted) return;
					if (!response.ok || result.ok !== true) {
						if (Array.isArray(result.fields)) {
							const invalid = inputs.filter(input => result.fields instanceof Array && result.fields.includes(input.name));
							for (const input of invalid) invalidate(input);
							invalid[0]?.focus();
						}
						report("error", form.dataset.errorMessage ?? "We couldn't confirm your subscription. Please try again.");
						return;
					}
					complete = true;
					for (const input of inputs) input.readOnly = true;
					button.textContent = form.dataset.successLabel ?? originalLabel;
					report("success", form.dataset.successMessage ?? "You're subscribed. Thank you!");
				} catch {
					if (!signal.aborted) report("error", form.dataset.errorMessage ?? "We couldn't confirm your subscription. Please try again.");
				} finally {
					submitting = false;
					if (!signal.aborted) {
						form.removeAttribute("aria-busy");
						button.disabled = complete;
						if (!complete) {
							button.textContent = originalLabel;
							for (const input of inputs) input.readOnly = false;
						}
					}
				}
			},
			{ signal }
		);
	}
}
