import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RegisterUserSchema, type RegisterUser } from '@/types/auth';

interface RegisterFormProps {
    readonly onSubmit: (userData: RegisterUser) => Promise<void>;
    readonly isLoading?: boolean;
    readonly error?: string | null;
}

export function RegisterForm({ onSubmit, isLoading = false, error }: RegisterFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<RegisterUser>({
        resolver: zodResolver(RegisterUserSchema),
        defaultValues: {
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
        },
    });

    const password = watch('password');

    const handleFormSubmit = async (data: RegisterUser) => {
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
                <CardTitle className="text-2xl text-center">Đăng ký</CardTitle>
                <CardDescription className="text-center">
                    Tạo tài khoản mới để bắt đầu mua sắm
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

                    {/* Username Field */}
                    <div className="space-y-2">
                        <Label htmlFor="username">Tên người dùng</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Nhập tên người dùng"
                            disabled={loading}
                            {...register('username')}
                            className={errors.username ? 'border-destructive focus-visible:ring-destructive' : ''}
                        />
                        {errors.username && (
                            <p className="text-sm text-destructive">{errors.username.message}</p>
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
                        {/* Password Strength Indicator */}
                        {password && password.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                                <p>Mật khẩu phải có:</p>
                                <ul className="ml-4 space-y-1">
                                    <li className={password.length >= 8 ? 'text-green-600' : 'text-red-500'}>
                                        • Ít nhất 8 ký tự
                                    </li>
                                    <li className={/(?=.*\d)(?=.*[a-zA-Z])/.test(password) ? 'text-green-600' : 'text-red-500'}>
                                        • Chứa cả chữ và số
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            disabled={loading}
                            {...register('confirmPassword')}
                            className={errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </Button>

                    {/* Links */}
                    <div className="text-center text-sm text-muted-foreground">
                        Đã có tài khoản?{' '}
                        <a
                            href="/login"
                            className="text-primary hover:underline"
                        >
                            Đăng nhập ngay
                        </a>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
} 