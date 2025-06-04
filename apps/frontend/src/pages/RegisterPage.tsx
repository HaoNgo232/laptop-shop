import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { RegisterForm } from '@/components/forms/RegisterForm';
import type { RegisterUser } from '@/types/auth';
import { useAuthStore } from '@/stores/authStore';

export function RegisterPage() {
    const navigate = useNavigate();
    const { register, isLoading, error, clearError, isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        clearError();
    }, [clearError]);

    const handleRegister = async (userData: RegisterUser) => {
        try {
            await register(userData);
            // Sau khi đăng ký thành công, chuyển đến trang login
            navigate('/login', {
                replace: true,
                state: {
                    message: 'Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.'
                }
            });
        } catch (error) {
            // Error đã được handle bởi store
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