import { z } from "zod";

export const LoginRequestSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

export const LoginResponseSchema = z.object({
    access: z.string().min(1),
    refresh: z.string().min(1),
});

export const RegisterRequestSchema = z.object({
    username: z.string().min(1).max(150).regex(/^[\w.@+-]+$/),
    email: z.email().optional(),
    password: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
});

export const RegisterResponseSchema = LoginResponseSchema;

export const RefreshRequestSchema = z.object({
    refresh: z.string().min(1),
});

export const RefreshResponseSchema = z.object({
    access: z.string().min(1),
});

export const LogoutRequestSchema = z.object({
    refresh: z.string().min(1),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type RefreshRequest = z.infer<typeof RefreshRequestSchema>;
export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;
export type LogoutRequest = z.infer<typeof LogoutRequestSchema>;