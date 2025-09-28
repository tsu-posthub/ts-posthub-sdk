import {testAuth} from "../tests/testAuth.js";

async function main() {
    await testAuth();
}

main().catch((err) => {
	console.error("Fatal error in main:", err);
});