import { ApiClient } from "../src/api/client.js";
import { AuthApi } from "../src/api/auth.js";

export async function testAuth() {
  const client = new ApiClient();
  const auth = new AuthApi(client);
  
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
    console.error("Register error:", err);
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
  }
  
  try {
    if (login?.refresh) {
      const refreshed = await auth.refresh({ refresh: login.refresh });
      console.log("Refresh (new access):", refreshed);
      client.setToken(refreshed.access);
    } else {
      console.warn("Skip refresh: no refresh token from login");
    }
  } catch (err) {
    console.error("Refresh error:", err);
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

