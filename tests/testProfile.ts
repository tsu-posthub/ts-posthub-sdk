import { ApiClient } from "../src/api/client.js";
import { AuthApi } from "../src/api/auth.js";
import { ProfileApi } from "../src/api/profile.js";

export async function testProfile() {
  const client = new ApiClient();
  const auth = new AuthApi(client);
  const profile = new ProfileApi(client);

  const demoUser = {
    username: "testuser",
    email: "test@example.com",
    password: "Password1",
  };
  
  try {
    const reg = await auth.register({
      username: demoUser.username,
      email: demoUser.email,
      password: demoUser.password,
    });
    console.log("Register (tokens):", reg);
  } catch (err) {
    console.warn("Register skipped or failed:", err);
  }
  
  let login: { access: string; refresh: string } | undefined;
  try {
    login = await auth.login({
      email: demoUser.email,
      password: demoUser.password,
    });
    console.log("Login (tokens):", login);
    client.setToken(login.access);
  } catch (err) {
    console.error("Login error:", err);
    return;
  }
  
  try {
    const me = await profile.getProfile();
    console.log("Profile:", me);
  } catch (err) {
    console.error("Get profile error:", err);
  }
  
  try {
    const updated = await profile.updateProfile({
      username: demoUser.username,
      email: demoUser.email,
      first_name: "Test",
      last_name: "User",
    });
    console.log("Updated profile:", updated);
  } catch (err) {
    console.error("Update profile error:", err);
  }
  
  try { 
    if (login?.refresh) {
      await auth.logout({ refresh: login.refresh });
      console.log("Logout: OK");
    } else {
      console.warn("Skip logout: no refresh token from login");
    }
  } catch (err) {
    console.error("Logout error:", err);
  }
}

await testProfile()