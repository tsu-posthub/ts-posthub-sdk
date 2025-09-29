import fs from "fs";
import path from "path";
import mime from "mime-types";
import { ApiClient } from "../src/api/client.js";
import { AuthApi } from "../src/api/auth.js";
import { PostsApi } from "../src/api/posts.js";

function loadTestImage(filename: string): File {
    const imagePath = path.resolve("./", filename);
    const buffer = fs.readFileSync(imagePath);

    const mimeType = mime.lookup(imagePath) || "application/octet-stream";
    const blob = new Blob([buffer], { type: mimeType });

    return new File([blob], path.basename(imagePath), { type: mimeType });
}

export async function testPosts() {
    const client = new ApiClient();
    const auth = new AuthApi(client);
    const posts = new PostsApi(client);

    const demoUser = {
        username: "testuser",
        email: "test@example.com",
        password: "Password1",
    };

    try {
        const reg = await auth.register({
            username: demoUser.username,
            email: demoUser.email,
            password: demoUser.password,
        });
        console.log("Register (tokens):", reg);
    } catch (err) {
        console.warn("Register skipped or failed:", err);
    }

    let login: { access: string; refresh: string } | undefined;
    try {
        login = await auth.login({
            email: demoUser.email,
            password: demoUser.password,
        });
        console.log("Login (tokens):", login);
        client.setToken(login.access);
    } catch (err) {
        console.error("Login error:", err);
        return;
    }

    try {
        const list = await posts.listPosts();
        console.log("Posts list (count):", list.length);

        if (list.length > 0) {
            const first = list[0];
            if (first) {
                const detail = await posts.getPost(first.id);
                console.log("First post detail:", {
                    id: detail.id,
                    title: detail.title,
                    likes: detail.likes_count,
                });
            }
        } else {
            console.warn("No posts found");
        }
    } catch (err) {
        console.error("List/get posts error:", err);
    }

    let createdId: number | undefined;
    try {
        const file = loadTestImage("test-image.png");

        const created = await posts.createPost({
            title: "SDK Test Post",
            text: "This is a test post created by automated SDK test.",
            images: [file],
        });
        createdId = created.id;
        console.log("Created post:", { id: created.id, title: created.title, images: created.images.length });
    } catch (err) {
        console.error("Create post error:", err);
    }

    try {
        if (createdId) {
            const newFile = loadTestImage("test-image.png");

            const createdDetail = await posts.getPost(createdId);
            const firstImageId = createdDetail.images[0]?.id;

            const updated = await posts.updatePost(createdId, {
                title: "SDK Test Post (updated)",
                text: "This is an updated test post content.",
                images: [newFile],
                delete_images: firstImageId ? [firstImageId] : undefined,
            });

            console.log("Updated post:", {
                id: updated.id,
                title: updated.title,
                images: updated.images.map(img => img.id),
            });
        } else {
            console.warn("Skip update: no created post id");
        }
    } catch (err) {
        console.error("Update post error:", err);
    }

    try {
        if (createdId) {
            await posts.likePost(createdId);
            console.log("Like post: OK");
            await posts.unlikePost(createdId);
            console.log("Unlike post: OK");
        }
    } catch (err) {
        console.error("Like/Unlike error:", err);
    }

    try {
        if (createdId) {
            await posts.deletePost(createdId);
            console.log("Delete post: OK");
        }
    } catch (err) {
        console.error("Delete post error:", err);
    }

    try {
        if (login?.refresh) {
            await auth.logout({ refresh: login.refresh });
            console.log("Logout: OK");
        }
    } catch (err) {
        console.error("Logout error:", err);
    }
}

await testPosts();
