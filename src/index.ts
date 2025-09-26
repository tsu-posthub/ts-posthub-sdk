import { ApiClient } from "./api/client.js";

async function ensureFetchPolyfill() {
	if (typeof fetch === "undefined") {
		const mod = await import("node-fetch");
		const fetchImpl = (mod as any).default ?? (mod as any);
		(globalThis as any).fetch = fetchImpl;
		if ((mod as any).Headers) (globalThis as any).Headers = (mod as any).Headers;
		if ((mod as any).Request) (globalThis as any).Request = (mod as any).Request;
		if ((mod as any).Response) (globalThis as any).Response = (mod as any).Response;
	}
}

async function main() {
	await ensureFetchPolyfill();

	const client = new ApiClient();

	try {
		const data = await client.request<any>("/posts/");
		console.log("GET /posts/ -> success\n");
		console.dir(data, { depth: null });
	} catch (err) {
		console.error("GET /posts/ -> failed:", err);
		const anyErr = err as any;
		if (anyErr?.response && typeof anyErr.response.text === "function") {
			try {
				const body = await anyErr.response.text();
				console.error("Response body:", body);
			} catch {}
		}
		process.exitCode = 1;
	}
}

main();