import assert from "node:assert/strict";
import { test } from "node:test";
import { handleNewsletter, hasSubmissionConfirmation } from "../src/server/newsletter.ts";

const url = "https://elvismao.com/api/newsletter/";
const subscription = { name: "Reader", email: "reader@example.test", interest: "Web design", referrer: "https://elvismao.com/about/" };
const request = (data: unknown = subscription, headers: Record<string, string> = {}) =>
	new Request(url, { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://elvismao.com", ...headers }, body: JSON.stringify(data) });
const forbiddenTransport: typeof fetch = async () => {
	throw new Error("This request must not reach Google");
};
const confirmed = '<html><body><div class="vHW8K">Your response has been recorded.</div></body></html>';

test("reject invalid requests before contacting Google", async t => {
	for (const [label, req, expected] of [
		["GET", new Request(url), 405],
		["cross-origin", request(subscription, { Origin: "https://another.example" }), 403],
		["wrong content type", request(subscription, { "Content-Type": "text/plain" }), 415],
		["invalid JSON", new Request(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" }), 400],
		["array payload", request([]), 400],
		["missing email", request({ name: "Reader" }), 400],
		["invalid email", request({ ...subscription, email: "reader" }), 400],
		["invalid field types", request({ ...subscription, name: true, interest: [] }), 400],
		["long name", request({ ...subscription, name: "x".repeat(121) }), 400],
		["long interest", request({ ...subscription, interest: "x".repeat(2001) }), 400],
		["oversized payload", request({ extra: "x".repeat(8193) }), 413]
	] as const)
		await t.test(label, async () => {
			let contacted = false;
			const response = await handleNewsletter(req, async (...args) => {
				contacted = true;
				return forbiddenTransport(...args);
			});
			assert.equal(response.status, expected);
			assert.equal(contacted, false);
			assert.equal(response.headers.get("Cache-Control"), "no-store");
			assert.equal((await response.json()).ok, false);
		});
});

test("forward the existing form fields and accept an explicit confirmation", async () => {
	let calls = 0;
	const response = await handleNewsletter(request({ ...subscription, name: " Reader ", email: " reader@example.test " }), async (input, init) => {
		calls++;
		assert.equal(String(input), "https://docs.google.com/forms/d/e/1FAIpQLSeITLO_J8DsxypUmCL8Ubd4n_2WpiFI5hCnmtUY-TrKYys2Iw/formResponse?hl=en");
		assert.equal(init?.method, "POST");
		const fields = new URLSearchParams(String(init?.body));
		assert.equal(fields.get("entry.1211740646"), "Reader");
		assert.equal(fields.get("entry.1272945868"), "reader@example.test");
		assert.equal(fields.get("entry.1531547295"), "Web design");
		assert.equal(fields.get("entry.488472312"), "elvismao.com");
		assert.equal(fields.get("entry.1137316312"), subscription.referrer);
		assert.ok(init?.signal);
		return new Response(confirmed);
	});
	assert.equal(calls, 1);
	assert.equal(response.status, 200);
	assert.deepEqual(await response.json(), { ok: true });
});

test("the standalone form permits an omitted name", async () => {
	const response = await handleNewsletter(request({ email: subscription.email }), async () => new Response(confirmed));
	assert.equal(response.status, 200);
});

test("HTTP 200 alone, validation pages and embedded confirmation strings are not success", async () => {
	for (const body of [
		"<form><p>There was a problem submitting your response.</p></form>",
		'<script>const text="Your response has been recorded."; const sample="<div class=\"vHW8K\">";</script><form>Try again</form>',
		'<div data-example="Your response has been recorded.">Sign in</div>',
		'<!-- <div class="vHW8K">Your response has been recorded.</div> -->',
		'<template><div class="vHW8K">Your response has been recorded.</div></template>',
		'<div data-class="vHW8K">Sign in</div>',
		""
	]) {
		assert.equal(hasSubmissionConfirmation(body), false);
		const response = await handleNewsletter(request(), async () => new Response(body));
		assert.equal(response.status, 502);
		assert.deepEqual(await response.json(), { ok: false, code: "unconfirmed" });
	}
});

test("confirmation markup also supports a customized confirmation message", () => {
	assert.equal(hasSubmissionConfirmation('<div class="vHW8K">Thanks for joining!</div>'), true);
	assert.equal(hasSubmissionConfirmation("<p>Your response has been recorded.</p>"), true);
});

test("upstream HTTP failures and network errors remain retryable failures", async () => {
	for (const status of [403, 429, 500]) {
		const response = await handleNewsletter(request(), async () => new Response(confirmed, { status }));
		assert.equal(response.status, 502);
		assert.equal((await response.json()).ok, false);
	}
	for (const error of [new TypeError("network error"), new DOMException("timed out", "TimeoutError")]) {
		const response = await handleNewsletter(request(), async () => {
			throw error;
		});
		assert.equal(response.status, 502);
		assert.deepEqual(await response.json(), { ok: false, code: "unavailable" });
	}
});
