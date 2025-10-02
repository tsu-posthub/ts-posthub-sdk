import { ApiClient } from "../src/api/client.js";
import { AuthApi } from "../src/api/auth.js";
import { PostsApi } from "../src/api/posts.js";

export async function testPagination() {
    const client = new ApiClient();
    const auth = new AuthApi(client);
    const posts = new PostsApi(client);

    const demoUser = {
        email: "test@example.com",
        password: "Password1",
    };

    try {
        const login = await auth.login({
            email: demoUser.email,
            password: demoUser.password,
        });
        client.setToken(login.access);
        console.log("Login: OK");
        
        const page1 = await posts.listPosts({ page: 1, page_size: 5 });
        console.log("Page 1 object:", {
            count: page1.count,
            next: page1.next,
            previous: page1.previous,
            results: page1.results
        });
        
        const page2 = await posts.listPosts({ page: 2, page_size: 5 });
        console.log("Page 2 object:", {
            count: page2.count,
            next: page2.next,
            previous: page2.previous,
            results: page2.results
        });
        
        if (page1.results.length && page2.results.length) {
            const overlap = page1.results.filter(p1 => page2.results.some(p2 => p1.id === p2.id));
            if (overlap.length === 0) {
                console.log("✅ Pagination works correctly (no overlap between page 1 and 2).");
            } else {
                console.warn("⚠️ Pagination issue: found overlapping posts:", overlap);
            }
        } else {
            console.warn("⚠️ Not enough posts to fully test pagination (need > 2).");
        }

    } catch (err) {
        console.error("Pagination test error:", err);
    }
}

await testPagination();
