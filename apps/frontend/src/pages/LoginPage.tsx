import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { LoginForm } from '@/components/forms/LoginForm';
import { useAuthStore } from '@/stores/authStore';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { LoginFormData } from '@/lib/validationSchemas';
import { Header } from '@/components/layout/Header';

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();

    const locationMessage = location.state?.message;

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        clearError();
    }, [clearError]);

    const handleLogin = async (credentials: LoginFormData) => {
        try {
            await login(credentials);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-4">
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
        </>
    );
} 