import React, { useState } from 'react';
import { useValidation } from '@/hooks/useValidation';
import {

    type LoginUser,
} from "@/types";
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoginUserSchema } from '@/types/schemas/auth';

interface LoginFormProps {
    readonly onSubmit: (data: LoginUser) => void;
    readonly loading?: boolean;
    readonly error?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading = false, error }) => {
    const [formData, setFormData] = useState<Partial<LoginUser>>({
        email: '',
        password: '',
    });

    const { validate, errors, clearErrors } = useValidation(LoginUserSchema);

    const handleInputChange = (field: keyof LoginUser, value: string) => {
        setFormData((prev: Partial<LoginUser>) => ({ ...prev, [field]: value }));

    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        // Validate toàn bộ form
        if (validate(formData)) {
            onSubmit(formData as LoginUser);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
                <CardDescription className="text-center">
                    Nhập email và mật khẩu để đăng nhập vào tài khoản
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                            value={formData.email || ''}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                            disabled={loading}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Mật khẩu</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={formData.password || ''}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className={`${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                            disabled={loading}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password}</p>
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
}; 