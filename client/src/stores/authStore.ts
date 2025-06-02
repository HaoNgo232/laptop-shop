import { create } from "zustand";
import { authService } from "@/services/authService";
import type {
  User,
  LoginUserDto,
  RegisterUserDto,
  UpdateProfileDto,
} from "@/types/auth";
import type { ApiError } from "@/types/api";
import { useCartStore } from "@/stores/cartStore";

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginUserDto) => Promise<void>;
  register: (userData: RegisterUserDto) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileDto) => Promise<void>;
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
  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });

      const response = await authService.login(credentials);

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

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    }
  },

  updateProfile: async (data) => {
    try {
      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = { ...currentUser, ...data };
        set({ user: updatedUser, error: null });
      }
    } catch (error) {
      const apiError = error as ApiError;
      set({ error: apiError.message || "Cập nhật thông tin thất bại" });
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

      const user = await authService.getCurrentUser();
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
