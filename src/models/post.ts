import { z } from "zod";
import {UrlOrPathSchema} from "../utils/validators.js";

export const PostListItemSchema = z.object({
    id: z.number(),
    title: z.string(),
    preview_text: z.string(),
    author_username: z.string(),
    likes_count: z.number(),
    thumbnail: UrlOrPathSchema.nullable(),
    created_at: z.string(),
    updated_at: z.string(),
});

export const PostsListResponseSchema = z.array(PostListItemSchema);

export const PostImageSchema = z.object({
    id: z.number(),
    image: UrlOrPathSchema,
});

export const PostDetailSchema = z.object({
    id: z.number(),
    title: z.string(),
    text: z.string(),
    likes_count: z.number(),
    author_id: z.number(),
    author_username: z.string(),
    images: z.array(PostImageSchema),
    created_at: z.string(),
    updated_at: z.string(),
});

export const ImageTypeSchema = z.union([
    z.instanceof(File),
    z.object({
        uri: z.string(),
        name: z.string(),
        type: z.string(),
    }),
]);

export const CreatePostRequestSchema = z.object({
    title: z.string().min(1),
    text: z.string().min(1),
    images: z.array(ImageTypeSchema).optional(),
});

export const UpdatePostRequestSchema = z.object({
    title: z.string().optional(),
    text: z.string().optional(),
    images: z.array(ImageTypeSchema).optional(),
    delete_images: z.array(z.number()).optional(),
});

export type PostListItem = z.infer<typeof PostListItemSchema>;
export type PostsListResponse = z.infer<typeof PostsListResponseSchema>;
export type PostDetail = z.infer<typeof PostDetailSchema>;
export type CreatePostRequest = z.infer<typeof CreatePostRequestSchema>;
export type UpdatePostRequest = z.infer<typeof UpdatePostRequestSchema>;