import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '@/components/forms/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import type { RegisterFormData } from '@/lib/validationSchemas';

export function RegisterPage() {
    const navigate = useNavigate();
    const { register, isLoading, error, clearError, isAuthenticated } = useAuth();

    // Redirect if already authenticated
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Clear error when component mounts
    React.useEffect(() => {
        clearError();
    }, [clearError]);

    const handleRegister = async (userData: RegisterFormData) => {
        try {
            await register(userData);
            // After successful registration, redirect to login
            navigate('/login', {
                replace: true,
                state: {
                    message: 'Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.'
                }
            });
        } catch (error) {
            // Error is handled by AuthContext
            console.error('Register failed:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <RegisterForm
                    onSubmit={handleRegister}
                    isLoading={isLoading}
                    error={error}
                />
            </div>
        </div>
    );
} 