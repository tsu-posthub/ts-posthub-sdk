import { PostHubSDK } from "../src/index.js";

async function main() {
    const sdk = new PostHubSDK();

    try {
        const login = await sdk.auth.login({
            email: "user@example.com",
            password: "password123",
        });
        console.log("Tokens:", login);
        sdk.setToken(login.access);
        
        const profile = await sdk.profile.getProfile();
        console.log("Profile:", profile);
        
        const updatedProfile = await sdk.profile.updateProfile({
            username: "newusername",
            email: "newemail@example.com",
        });
        console.log("Updated profile:", updatedProfile);

    } catch (err) {
        console.error("Error:", err);
    }
}

await main();