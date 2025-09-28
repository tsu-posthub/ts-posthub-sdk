import { ApiClient } from "./api/client.js";
import { AuthApi } from "./api/auth.js";

export class PostHubSDK {
    private readonly client: ApiClient;

    public auth: AuthApi;
    // TODO: posts, profile, etc.

    constructor(token?: string) {
        this.client = new ApiClient(token);
        this.auth = new AuthApi(this.client);
    }

    setToken(token: string) {
        this.client.setToken(token);
    }
}