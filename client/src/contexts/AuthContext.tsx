/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useReducer, useEffect, useCallback, useMemo, useContext } from 'react';
import { authService } from '@/services/authService';
import type {
    User,
    LoginRequest,
    RegisterRequest,
    UpdateProfileRequest
} from '@/types/auth';
import type { ApiError } from '@/types/api';

// Auth State Type
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// Auth Actions
type AuthAction =
    | { type: 'AUTH_START' }
    | { type: 'AUTH_SUCCESS'; payload: User }
    | { type: 'AUTH_ERROR'; payload: string }
    | { type: 'AUTH_LOGOUT' }
    | { type: 'CLEAR_ERROR' }
    | { type: 'UPDATE_USER'; payload: User };

// Auth Context Type
interface AuthContextType extends AuthState {
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: UpdateProfileRequest) => Promise<void>;
    clearError: () => void;
}

// Initial State
const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start with loading to check stored token
    error: null,
};

// Auth Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'AUTH_START':
            return {
                ...state,
                isLoading: true,
                error: null,
            };

        case 'AUTH_SUCCESS':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };

        case 'AUTH_ERROR':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
            };

        case 'AUTH_LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };

        case 'UPDATE_USER':
            return {
                ...state,
                user: action.payload,
                error: null,
            };

        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Wrap các functions với useCallback trong AuthProvider:
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // useEffect không thay đổi
    useEffect(() => {
        console.log('AuthProvider useEffect running');
        const initializeAuth = async () => {
            const token = authService.getStoredToken();

            if (token) {
                try {
                    dispatch({ type: 'AUTH_START' });
                    const user = await authService.getCurrentUser();
                    dispatch({ type: 'AUTH_SUCCESS', payload: user });
                } catch (error) {
                    console.error('Token validation failed:', error);
                    authService.logout();
                    dispatch({ type: 'AUTH_ERROR', payload: 'Phiên đăng nhập đã hết hạn' });
                }
            } else {
                dispatch({ type: 'AUTH_ERROR', payload: '' });
            }
        };

        initializeAuth();
    }, []); // Empty dependency array là đúng

    // Wrap functions với useCallback
    const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
        try {
            dispatch({ type: 'AUTH_START' });
            const response = await authService.login(credentials);
            dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
        } catch (error) {
            const apiError = error as ApiError;
            dispatch({
                type: 'AUTH_ERROR',
                payload: apiError.message || 'Đăng nhập thất bại'
            });
            throw error;
        }
    }, []);

    const register = useCallback(async (userData: RegisterRequest): Promise<void> => {
        try {
            dispatch({ type: 'AUTH_START' });
            await authService.register(userData);
            dispatch({ type: 'AUTH_ERROR', payload: '' });
        } catch (error) {
            const apiError = error as ApiError;
            dispatch({
                type: 'AUTH_ERROR',
                payload: apiError.message || 'Đăng ký thất bại'
            });
            throw error;
        }
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            dispatch({ type: 'AUTH_LOGOUT' });
        }
    }, []);

    const updateProfile = useCallback(async (data: UpdateProfileRequest): Promise<void> => {
        try {
            if (state.user) {
                const updatedUser = { ...state.user, ...data };
                dispatch({ type: 'UPDATE_USER', payload: updatedUser });
            }
        } catch (error) {
            const apiError = error as ApiError;
            dispatch({
                type: 'AUTH_ERROR',
                payload: apiError.message || 'Cập nhật thông tin thất bại'
            });
            throw error;
        }
    }, [state.user]);

    const clearError = useCallback((): void => {
        dispatch({ type: 'CLEAR_ERROR' });
    }, []);

    // Tạo value object với useMemo để tránh re-create
    const value = useMemo(() => ({
        ...state,
        login,
        register,
        logout,
        updateProfile,
        clearError,
    }), [state, login, register, logout, updateProfile, clearError]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
