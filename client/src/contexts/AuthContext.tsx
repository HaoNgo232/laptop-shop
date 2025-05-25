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

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: UpdateProfileRequest) => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = authService.getStoredToken();

            if (token) {
                try {
                    setIsLoading(true);
                    setError(null);
                    const userData = await authService.getCurrentUser();

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
    }, []);

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
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData: RegisterRequest): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            await authService.register(userData);

            setError(null);
        } catch (error) {
            const apiError = error as ApiError;
            setError(apiError.message || 'Đăng ký thất bại');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            setError(null);
            setIsLoading(false);
        }
    };

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

    const clearError = (): void => {
        setError(null);
    };

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

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth phải được sử dụng trong AuthProvider');
    }
    return context;
}
