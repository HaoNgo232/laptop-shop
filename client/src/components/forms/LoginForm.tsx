import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { LoginSchema, type LoginFormData } from '@/lib/validationSchemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginFormProps {
    onSubmit: (credentials: LoginFormData) => Promise<void>;
    isLoading?: boolean;
    error?: string | null;
}

export function LoginForm({ onSubmit, isLoading = false, error }: LoginFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const handleFormSubmit = async (data: LoginFormData) => {
        try {
            await onSubmit(data);
        } catch (error) {
            // Error handled by parent component
            console.error('Form submission error:', error);
        }
    };

    const loading = isLoading || isSubmitting;

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
                <CardDescription className="text-center">
                    Nhập email và mật khẩu để đăng nhập vào tài khoản
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="example@email.com"
                            disabled={loading}
                            {...register('email')}
                            className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Mật khẩu</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            disabled={loading}
                            {...register('password')}
                            className={errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </Button>

                    {/* Links */}
                    <div className="text-center text-sm">
                        <a
                            href="/forgot-password"
                            className="text-primary hover:underline"
                        >
                            Quên mật khẩu?
                        </a>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        Chưa có tài khoản?{' '}
                        <a
                            href="/register"
                            className="text-primary hover:underline"
                        >
                            Đăng ký ngay
                        </a>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
} 