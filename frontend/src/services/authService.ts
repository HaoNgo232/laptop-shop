import { apiClient } from "./api";
import type {
  LoginUser,
  RegisterUser,
  User,
  LoginResponse,
} from "@/types";

class AuthService {
  // Login method
  async login(credentials: LoginUser): Promise<LoginResponse> {
    try {
      const response: LoginResponse = await apiClient.post<LoginResponse>(
        "/api/auth/login",
        credentials,
      );

      // Store tokens
      if (response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
      }
      if (response.refreshToken) {
        localStorage.setItem("refreshToken", response.refreshToken);
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // Register method
  async register(userData: RegisterUser): Promise<User> {
    try {
      const response = await apiClient.post<User>(
        "/api/auth/register",
        userData,
      );
      return response;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  }

  // Logout method
  logout(): void {
    // Clear local storage
    this.clearTokens();

    // Redirect to login
    if (
      typeof window !== "undefined" &&
      window.location.pathname !== "/login"
    ) {
      window.location.href = "/login";
    }
  }

  // Get current user profile
  async getUserProfile(): Promise<User> {
    try {
      return await apiClient.get<User>("/api/users/profile");
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  }

  // Refresh token
  async refreshToken(): Promise<LoginResponse> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await apiClient.post<LoginResponse>(
        "/api/auth/refresh-token",
        { refreshToken },
      );

      // Update stored tokens
      if (response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
      }
      if (response.refreshToken) {
        localStorage.setItem("refreshToken", response.refreshToken);
      }

      return response;
    } catch (error) {
      console.error("Refresh token error:", error);
      this.clearTokens();
      throw error;
    }
  }

  // Utility methods
  getStoredToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  private clearTokens(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

export const authService = new AuthService();
