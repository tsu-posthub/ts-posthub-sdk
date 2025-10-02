import { ApiClient } from "./client.js";
import {
    PostDetailSchema,
    CreatePostRequestSchema,
    UpdatePostRequestSchema,
    type PostDetail,
    type CreatePostRequest,
    type UpdatePostRequest,
    PaginatedPostsResponseSchema,
    type PaginatedPostsResponse,
} from "../models/post.js";

export class PostsApi {
    constructor(private client: ApiClient) {}
    
    async listPosts(params?: { page?: number; page_size?: number }): Promise<PaginatedPostsResponse> {
        const query: Record<string, string> = {};
        if (params?.page !== undefined) query.page = String(params.page);
        if (params?.page_size !== undefined) query.page_size = String(params.page_size);

        const queryString = new URLSearchParams(query).toString();
        const url = queryString ? `/posts/?${queryString}` : "/posts/";

        const response = await this.client.request(url, { method: "GET" });
        return PaginatedPostsResponseSchema.parse(response);
    }
    
    async getPost(id: number): Promise<PostDetail> {
        const response = await this.client.request(`/posts/${id}/`, {
            method: "GET",
        });
        return PostDetailSchema.parse(response);
    }

    async createPost(data: CreatePostRequest): Promise<PostDetail> {
        const validData = CreatePostRequestSchema.parse(data);

        const form = new FormData();
        form.append("title", validData.title);
        form.append("text", validData.text);

        if (validData.images) {
            for (const img of validData.images) {
                if (img instanceof File) form.append("images", img);
                else form.append("images", {
                    uri: img.uri,
                    name: img.name,
                    type: img.type,
                } as any);
            }
        }

        const response = await this.client.request(`/posts/`, {
            method: "POST",
            data: form,
            headers: { "Content-Type": "multipart/form-data" },
        });
        return PostDetailSchema.parse(response);
    }

    async updatePost(id: number, data: UpdatePostRequest): Promise<PostDetail> {
        const validData = UpdatePostRequestSchema.parse(data);

        const form = new FormData();
        if (validData.title) form.append("title", validData.title);
        if (validData.text) form.append("text", validData.text);

        if (validData.images) {
            for (const img of validData.images) {
                if (img instanceof File) form.append("images", img);
                else form.append("images", {
                    uri: img.uri,
                    name: img.name,
                    type: img.type,
                } as any);
            }
        }

        if (validData.delete_images) {
            for (const id of validData.delete_images) form.append("delete_images", String(id));
        }

        const response = await this.client.request(`/posts/${id}/`, {
            method: "PUT",
            data: form,
            headers: { "Content-Type": "multipart/form-data" },
        });
        return PostDetailSchema.parse(response);
    }

    async deletePost(id: number): Promise<void> {
        await this.client.request(`/posts/${id}/`, { method: "DELETE" });
    }
    
    async likePost(id: number): Promise<void> {
        await this.client.request(`/posts/${id}/like/`, { method: "POST" });
    }
    
    async unlikePost(id: number): Promise<void> {
        await this.client.request(`/posts/${id}/unlike/`, { method: "DELETE" });
    }
}