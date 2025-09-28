import { z } from "zod";

export const ProfileResponseSchema = z.object({
    id: z.number(),
    username: z.string().min(1),
    email: z.email(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
});

export const UpdateProfileRequestSchema = z.object({
    username: z.string().min(1),
    email: z.email(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
});

export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;