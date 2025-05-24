import { apiClient } from "./api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  ResetPasswordRequest,
} from "@/types/auth";

class AuthService {
  // Login method
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
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
  async register(userData: RegisterRequest): Promise<User> {
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
  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      // Call backend logout API
      await apiClient.post("/api/auth/logout", {
        refreshToken: refreshToken || undefined,
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with local logout even if API fails
    } finally {
      // Always clear local storage
      this.clearTokens();
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    try {
      return await apiClient.get<User>("/api/auth/me");
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
        {
          refreshToken,
        },
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

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    try {
      await apiClient.post("/api/auth/forgot-password", { email });
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    try {
      await apiClient.post("/api/auth/reset-password", data);
    } catch (error) {
      console.error("Reset password error:", error);
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
