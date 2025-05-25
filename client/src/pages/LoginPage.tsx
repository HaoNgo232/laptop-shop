import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '@/components/forms/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useErrorHandler, useAuthRedirect } from '@/hooks/useErrorHandler';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { LoginFormData } from '@/lib/validationSchemas';

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading, error, clearError, isAuthenticated } = useAuth();

    // Lấy message từ navigation state (từ ProductCard redirect)
    const locationMessage = location.state?.message;

    // Sử dụng custom hooks - đơn giản và tái sử dụng
    useAuthRedirect(isAuthenticated, navigate);
    useErrorHandler(clearError);

    const handleLogin = async (credentials: LoginFormData) => {
        try {
            await login(credentials);
            // Navigation sẽ được handle bởi useAuthRedirect
        } catch (error) {
            // Error đã được handle bởi AuthContext
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-4">
                {/* Hiển thị message từ navigation state */}
                {locationMessage && (
                    <Alert className="border-blue-200 bg-blue-50">
                        <AlertDescription className="text-blue-800">
                            {locationMessage}
                        </AlertDescription>
                    </Alert>
                )}

                <LoginForm
                    onSubmit={handleLogin}
                    isLoading={isLoading}
                    error={error}
                />
            </div>
        </div>
    );
} 