/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '@/services/authService';
import type {
    User,
    LoginRequest,
    RegisterRequest,
    UpdateProfileRequest
} from '@/types/auth';
import type { ApiError } from '@/types/api';

// Auth Context Type - Đơn giản hóa
interface AuthContextType {
    // State
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions - đơn giản, không cần useCallback
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: UpdateProfileRequest) => Promise<void>;
    clearError: () => void;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simplified AuthProvider với useState
export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Tách useReducer thành các useState riêng biệt - dễ hiểu hơn
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize auth khi app load
    useEffect(() => {
        const initializeAuth = async () => {
            const token = authService.getStoredToken();

            if (token) {
                try {
                    setIsLoading(true);
                    setError(null);
                    const userData = await authService.getCurrentUser();

                    // Set user data
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Token validation failed:', error);
                    authService.logout();
                    setUser(null);
                    setIsAuthenticated(false);
                    setError('Phiên đăng nhập đã hết hạn');
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
                setError(null);
            }

            setIsLoading(false);
        };

        initializeAuth();
    }, []); // Chỉ chạy 1 lần khi mount

    // Login function - đơn giản
    const login = async (credentials: LoginRequest): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await authService.login(credentials);

            setUser(response.user);
            setIsAuthenticated(true);
        } catch (error) {
            const apiError = error as ApiError;
            setUser(null);
            setIsAuthenticated(false);
            setError(apiError.message || 'Đăng nhập thất bại');
            throw error; // Re-throw để component handle
        } finally {
            setIsLoading(false);
        }
    };

    // Register function - đơn giản  
    const register = async (userData: RegisterRequest): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            await authService.register(userData);

            // Sau khi register thành công, không auto login
            setError(null);
        } catch (error) {
            const apiError = error as ApiError;
            setError(apiError.message || 'Đăng ký thất bại');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function - đơn giản
    const logout = async (): Promise<void> => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Luôn luôn clear state khi logout
            setUser(null);
            setIsAuthenticated(false);
            setError(null);
            setIsLoading(false);
        }
    };

    // Update profile - đơn giản
    const updateProfile = async (data: UpdateProfileRequest): Promise<void> => {
        try {
            if (user) {
                const updatedUser = { ...user, ...data };
                setUser(updatedUser);
                setError(null);
            }
        } catch (error) {
            const apiError = error as ApiError;
            setError(apiError.message || 'Cập nhật thông tin thất bại');
            throw error;
        }
    };

    // Clear error - đơn giản
    const clearError = (): void => {
        setError(null);
    };

    // Context value - không cần useMemo vì đã đơn giản
    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook để sử dụng context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
