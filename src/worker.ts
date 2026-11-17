import { handleNewsletter } from "./server/newsletter";

interface Env {
	ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const path = new URL(request.url).pathname;
		if (path === "/api/newsletter" || path === "/api/newsletter/") return handleNewsletter(request);
		if (path.startsWith("/api/")) return Response.json({ ok: false, code: "notFound" }, { status: 404, headers: { "Cache-Control": "no-store" } });
		return env.ASSETS.fetch(request);
	}
};
