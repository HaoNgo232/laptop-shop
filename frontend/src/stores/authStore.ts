import { create } from "zustand";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import type {
  User,
  LoginUser,
  RegisterUser,
  UpdateProfile,
  LoginResponse,
  ApiError,
} from "@/types";
import { useCartStore } from "@/stores/cartStore";

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginUser) => Promise<void>;
  register: (userData: RegisterUser) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfile) => Promise<void>;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Actions
  login: async (credentials: LoginUser) => {
    try {
      set({ isLoading: true, error: null });

      const response: LoginResponse = await authService.login(credentials);

      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: apiError.message || "Đăng nhập thất bại",
      });
      throw error;
    }
  },

  register: async (userData) => {
    try {
      set({ isLoading: true, error: null });

      await authService.register(userData);

      set({ isLoading: false });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError.message || "Đăng ký thất bại",
      });
      throw error;
    }
  },

  logout: () => {
    // Call authService to clear tokens and redirect
    authService.logout();

    // Clear local state
    set({
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
    });

    // Clear cart state
    useCartStore.setState({ cart: null, error: null });
  },

  updateProfile: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const currentUser = get().user;
      if (!currentUser) {
        throw new Error("User không tồn tại");
      }

      // Lọc bỏ các trường rỗng
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(
          ([_, value]) =>
            value !== undefined &&
            value !== null &&
            String(value).trim() !== "",
        ),
      ) as UpdateProfile;

      const response = await userService.updateProfile(cleanData);

      set({
        user: response,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Cập nhật thông tin thất bại",
        isLoading: false,
      });
      throw error;
    }
  },

  initializeAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const token = localStorage.getItem("accessToken");

      if (!token) {
        set({ isAuthenticated: false, isLoading: false });
        useCartStore.setState({ cart: null, error: null });
        return;
      }

      const user = await authService.getUserProfile();
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      useCartStore.getState().fetchCart();
    } catch (error: any) {
      set({
        error: error.message,
        isAuthenticated: false,
        isLoading: false,
      });
      useCartStore.setState({ cart: null, error: null });
    }
  },

  clearError: () => set({ error: null }),
}));
