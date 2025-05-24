import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/forms/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import type { LoginFormData } from '@/lib/validationSchemas';

export function LoginPage() {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError, isAuthenticated } = useAuth();

    // Fix: Chỉ redirect khi authenticated thay đổi
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Fix: Chỉ clear error khi mount, không depend vào clearError
    React.useEffect(() => {
        clearError();
    }, []); // Remove clearError from dependencies

    // Hoặc dùng useCallback trong component
    const handleClearError = React.useCallback(() => {
        clearError();
    }, [clearError]);

    React.useEffect(() => {
        handleClearError();
    }, []);

    const handleLogin = async (credentials: LoginFormData) => {
        try {
            await login(credentials);
            // Navigation will be handled by useEffect above
            navigate('/', { replace: true });
        } catch (error) {
            // Error is handled by AuthContext
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <LoginForm
                    onSubmit={handleLogin}
                    isLoading={isLoading}
                    error={error}
                />
            </div>
        </div>
    );
} 