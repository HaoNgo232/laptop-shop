import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '@/components/forms/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import { useErrorHandler, useAuthRedirect } from '@/hooks/useErrorHandler';
import type { RegisterFormData } from '@/lib/validationSchemas';

export function RegisterPage() {
    const navigate = useNavigate();
    const { register, isLoading, error, clearError, isAuthenticated } = useAuth();

    useAuthRedirect(isAuthenticated, navigate);
    useErrorHandler(clearError);

    const handleRegister = async (userData: RegisterFormData) => {
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
            // Error đã được handle bởi AuthContext
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