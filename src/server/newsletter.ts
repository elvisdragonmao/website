const FORM_RESPONSE_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeITLO_J8DsxypUmCL8Ubd4n_2WpiFI5hCnmtUY-TrKYys2Iw/formResponse?hl=en";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY = 8192;

type Field = "name" | "email" | "interest";
const json = (body: object, status = 200, headers: HeadersInit = {}) => Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

/** A readable Google response must contain its confirmation, not just an HTTP 200. */
export function hasSubmissionConfirmation(html: string): boolean {
	const body = html.replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1>/gi, "").replace(/<!--[\s\S]*?-->/g, "");
	return /<div\b[^>]*\sclass\s*=\s*["'][^"']*\bvHW8K\b[^"']*["'][^>]*>/i.test(body) || /\bYour response has been recorded\./i.test(body.replace(/<[^>]*>/g, " ").replace(/\s+/g, " "));
}

/** The injectable transport lets tests exercise failures without creating subscriptions. */
export async function handleNewsletter(request: Request, transport: typeof fetch = fetch): Promise<Response> {
	if (request.method !== "POST") return json({ ok: false, code: "method" }, 405, { Allow: "POST" });
	const origin = request.headers.get("Origin");
	if (origin && origin !== new URL(request.url).origin) return json({ ok: false, code: "origin" }, 403);
	if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) return json({ ok: false, code: "contentType" }, 415);
	if (Number(request.headers.get("Content-Length")) > MAX_BODY * 4) return json({ ok: false, code: "size" }, 413);
	let data: Record<string, unknown>;
	try {
		const text = await request.text();
		if (text.length > MAX_BODY) return json({ ok: false, code: "size" }, 413);
		const parsed: unknown = JSON.parse(text);
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return json({ ok: false, code: "invalid" }, 400);
		data = parsed as Record<string, unknown>;
	} catch {
		return json({ ok: false, code: "invalid" }, 400);
	}
	const name = typeof data.name === "string" ? data.name.trim() : "";
	const email = typeof data.email === "string" ? data.email.trim() : "";
	const interest = typeof data.interest === "string" ? data.interest.trim() : "";
	const referrer = typeof data.referrer === "string" ? data.referrer.slice(0, 2048) : "";
	const fields: Field[] = [];
	if ((data.name != null && typeof data.name !== "string") || name.length > 120) fields.push("name");
	if (!EMAIL.test(email) || email.length > 254) fields.push("email");
	if ((data.interest != null && typeof data.interest !== "string") || interest.length > 2000) fields.push("interest");
	if (fields.length) return json({ ok: false, code: "validation", fields }, 400);
	const body = new URLSearchParams({
		"entry.1211740646": name,
		"entry.1272945868": email,
		"entry.1531547295": interest,
		"entry.488472312": "elvismao.com",
		"entry.1137316312": referrer
	});
	try {
		const response = await transport(FORM_RESPONSE_URL, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "text/html" },
			body,
			signal: AbortSignal.timeout(12000),
			redirect: "follow"
		});
		if (!response.ok || !hasSubmissionConfirmation(await response.text())) return json({ ok: false, code: "unconfirmed" }, 502);
		return json({ ok: true });
	} catch {
		return json({ ok: false, code: "unavailable" }, 502);
	}
}
