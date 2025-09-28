import { ApiClient } from "../src/api/client.js";

export async function testApi() {
  const client = new ApiClient();

  try {
    const posts = await client.request<any[]>("/posts/", { method: "GET" });
    console.log("Posts:", posts);
  } catch (err) {
    console.error(err);
  }

  client.setToken("YOUR_JWT_TOKEN");

  try {
    const profile = await client.request<any>("/profile/", { method: "GET" });
    console.log("Profile:", profile);
  } catch (err) {
    console.error(err);
  }
}