import { ApiClient } from "./client.js";
import {
    type ProfileResponse,
    ProfileResponseSchema,
    type UpdateProfileRequest,
    UpdateProfileRequestSchema,
} from "../models/profile.js";

export class ProfileApi {
    constructor(private client: ApiClient) {}
    
    async getProfile(): Promise<ProfileResponse> {
        const response = await this.client.request("/profile/", {
            method: "GET",
        });

        return ProfileResponseSchema.parse(response);
    }
    
    async updateProfile(data: UpdateProfileRequest): Promise<ProfileResponse> {
        const validData = UpdateProfileRequestSchema.parse(data);

        const response = await this.client.request("/profile/", {
            method: "PUT",
            data: validData,
        });

        return ProfileResponseSchema.parse(response);
    }
}
