import { PostHubSDK } from "../src/index.js";

async function main() {
    const sdk = new PostHubSDK();

    try {
        const login = await sdk.auth.login({
            email: "test@example.com",
            password: "Password1",
        });
        console.log("Tokens:", login);
        sdk.setToken(login.access);
        
        const profile = await sdk.profile.getProfile();
        console.log("Profile:", profile);
        
        const updatedProfile = await sdk.profile.updateProfile({
            username: "testuser",
            email: "test@example.com",
        });
        console.log("Updated profile:", updatedProfile);

        const posts = await sdk.posts.listPosts();
        console.log("Posts:", posts);
        
        const newPost = await sdk.posts.createPost({
            title: "Hello World",
            text: "This is my first post!",
        });
        console.log("Created post:", newPost);
        
        await sdk.posts.likePost(newPost.id);
        console.log("Post liked!");

    } catch (err) {
        console.error("Error:", err);
    }
}

await main();