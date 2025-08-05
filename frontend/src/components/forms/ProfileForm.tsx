import { UpdateProfile } from "@/types";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UpdateProfileSchema } from "@/types/schemas/auth";

interface ProfileFormProps {
    readonly onSuccess?: () => void;
    readonly onCancel?: () => void;
}

const ProfileForm = ({ onSuccess, onCancel }: ProfileFormProps) => {
    const navigate = useNavigate();
    const { user, updateProfile, isAuthenticated, isLoading, error, clearError } = useAuthStore();
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isLoading, isAuthenticated, navigate]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UpdateProfile>({
        resolver: zodResolver(UpdateProfileSchema),
        defaultValues: {
            username: user?.username || '',
            address: user?.address || '',
            phoneNumber: user?.phoneNumber || '',
        },
    });

    const loading = isSubmitting || isLoading;

    const handleFormSubmit = async (data: UpdateProfile) => {
        try {
            setSuccessMessage('');
            clearError();
            await updateProfile(data);
            setSuccessMessage('Cập nhật thông tin thành công!');


            setTimeout(() => {
                onSuccess?.();
                // Reload lại trang
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error('Form submission error:', error);
            setSuccessMessage('');
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Cập nhật thông tin</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Success Message */}
                {successMessage && (
                    <Alert className="mb-4 border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            {successMessage}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Error Message */}
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription className="flex justify-between items-center">
                            <span>{error}</span>
                            <Button variant="outline" size="sm" onClick={clearError}>
                                ×
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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

                    {/* Address Field */}
                    <div className="space-y-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Input
                            id="address"
                            type="text"
                            placeholder="Nhập địa chỉ"
                            disabled={loading}
                            {...register('address')}
                        />
                    </div>

                    {/* Phone Number Field */}
                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Số điện thoại</Label>
                        <Input
                            id="phoneNumber"
                            type="tel"
                            placeholder="Nhập số điện thoại"
                            disabled={loading}
                            {...register('phoneNumber')}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <Button type="submit" className="flex-1" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                        </Button>

                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={loading}
                                className="flex-1"
                            >
                                Hủy
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

export default ProfileForm;