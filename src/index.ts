import {ApiClient} from "./api/client.js";
import https from "https";

async function ensureFetchPolyfill() {
	if (typeof fetch === "undefined") {
		const mod = await import("node-fetch");
        (globalThis as any).fetch = (mod as any).default ?? (mod as any);
		if ((mod as any).Headers) (globalThis as any).Headers = (mod as any).Headers;
		if ((mod as any).Request) (globalThis as any).Request = (mod as any).Request;
		if ((mod as any).Response) (globalThis as any).Response = (mod as any).Response;
	}
}

async function main() {
	await ensureFetchPolyfill();

	const httpsAgent = new https.Agent({
        rejectUnauthorized: false
    });
	const client = new ApiClient();

	try {
		const data = await client.request<any>("/posts/", { httpsAgent });
		console.log("GET /posts/ -> success\n");
		console.dir(data, { depth: null });
	} catch (err) {
		console.error("GET /posts/ -> failed:", err);
		if (err instanceof Error) {
			console.error("Stack:", err.stack);
		}
		const anyErr = err as any;
		if (anyErr?.response && typeof anyErr.response.text === "function") {
			try {
				const body = await anyErr.response.text();
				console.error("Response body:", body);
			} catch (e) {
				console.error("Error reading response body:", e);
			}
		}
		process.exitCode = 1;
	}
}

main().catch((err) => {
	console.error("Fatal error in main:", err);
	process.exitCode = 1;
});