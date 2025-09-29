import { ApiClient } from "./api/client.js";
import { AuthApi } from "./api/auth.js";
import { ProfileApi } from "./api/profile.js";
import { PostsApi } from "./api/posts.js";

export class PostHubSDK {
    public auth: AuthApi;
    public profile: ProfileApi;
    public posts: PostsApi;
    private readonly client: ApiClient;

    constructor(token?: string) {
        this.client = new ApiClient(token);
        this.auth = new AuthApi(this.client);
        this.profile = new ProfileApi(this.client);
        this.posts = new PostsApi(this.client);
    }

    setToken(token: string) {
        this.client.setToken(token);
    }
}