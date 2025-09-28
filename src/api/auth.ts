import { ApiClient } from "./client.js";
import {
    type LoginRequest,
    type LoginResponse,
    LoginRequestSchema,
    LoginResponseSchema,
    type RegisterRequest,
    type RegisterResponse,
    RegisterRequestSchema,
    RegisterResponseSchema,
    type RefreshRequest,
    type RefreshResponse,
    RefreshRequestSchema,
    RefreshResponseSchema,
    type LogoutRequest,
    LogoutRequestSchema,
} from "../models/auth.js";

export class AuthApi {
    constructor(private client: ApiClient) {}
    
    async login(data: LoginRequest): Promise<LoginResponse> {
        const validData = LoginRequestSchema.parse(data);

        const response = await this.client.request("/auth/login/", {
            method: "POST",
            data: validData,
        });
        
        return LoginResponseSchema.parse(response);
    }
    
    async register(data: RegisterRequest): Promise<RegisterResponse> {
        const validData = RegisterRequestSchema.parse(data);

        const response = await this.client.request("/auth/register/", {
            method: "POST",
            data: validData,
        });

        return RegisterResponseSchema.parse(response);
    }
    
    async refresh(data: RefreshRequest): Promise<RefreshResponse> {
        const validData = RefreshRequestSchema.parse(data);

        const response = await this.client.request("/auth/refresh/", {
            method: "POST",
            data: validData,
        });

        return RefreshResponseSchema.parse(response);
    }
    
    async logout(data: LogoutRequest): Promise<void> {
        const validData = LogoutRequestSchema.parse(data);

        await this.client.request("/auth/logout/", {
            method: "POST",
            data: validData,
        });
    }
}