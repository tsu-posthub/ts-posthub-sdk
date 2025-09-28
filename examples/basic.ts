import { PostHubSDK } from "../src/index.js";

async function main() {
    const sdk = new PostHubSDK();

    const login = await sdk.auth.login({
        email: "test@example.com",
        password: "Password1",
    });

    console.log("Tokens:", login);
    sdk.setToken(login.access);
}

main().catch(console.error);