import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Mail, User, Phone, MapPin, Shield, Clock } from 'lucide-react';
import { UserRole } from '@/types';
import type { AdminDetail, UpdateByAdmin } from "@/types";

interface UserDetailModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly user: AdminDetail | null;
    readonly isLoading: boolean;
    readonly onUpdate: (userId: string, data: UpdateByAdmin) => Promise<void>;
    readonly error?: string | null;
}

export function UserDetailModal({
    isOpen,
    onClose,
    user,
    isLoading,
    onUpdate,
    error
}: UserDetailModalProps) {
    const [formData, setFormData] = useState<UpdateByAdmin>({
        role: UserRole.USER,
        isActive: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatDate = (date: Date | string): string => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(dateObj);
    };

    // Reset form khi user thay đổi
    useEffect(() => {
        if (user) {
            setFormData({
                role: user.role,
                isActive: true
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setIsSubmitting(true);
            await onUpdate(user.id, formData);
        } catch (error) {
            console.error('Lỗi khi cập nhật user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRoleBadgeVariant = (role: UserRole) => {
        switch (role) {
            case UserRole.ADMIN:
                return 'destructive';
            case UserRole.USER:
                return 'secondary';
            default:
                return 'outline';
        }
    };

    const getRoleLabel = (role: UserRole) => {
        switch (role) {
            case UserRole.ADMIN:
                return 'Quản trị viên';
            case UserRole.USER:
                return 'Người dùng';
            default:
                return 'Không xác định';
        }
    };

    if (!user) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <User className="h-6 w-6" />
                        Chi tiết người dùng
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Thông tin cơ bản */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Thông tin cơ bản
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                        <Mail className="h-4 w-4" />
                                        Email
                                    </Label>
                                    <Input
                                        value={user.email}
                                        readOnly
                                        className="bg-gray-50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        Tên đăng nhập
                                    </Label>
                                    <Input
                                        value={user.username}
                                        readOnly
                                        className="bg-gray-50"
                                    />
                                </div>

                                {user.phoneNumber && (
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                            <Phone className="h-4 w-4" />
                                            Số điện thoại
                                        </Label>
                                        <Input
                                            value={user.phoneNumber}
                                            readOnly
                                            className="bg-gray-50"
                                        />
                                    </div>
                                )}

                                {user.address && (
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            Địa chỉ
                                        </Label>
                                        <Input
                                            value={user.address}
                                            readOnly
                                            className="bg-gray-50"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4 pt-2">
                                <div className="flex items-center gap-2">
                                    <Label className="text-sm font-medium text-gray-600">Vai trò hiện tại:</Label>
                                    <Badge variant={getRoleBadgeVariant(user.role)}>
                                        {getRoleLabel(user.role)}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Thời gian */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Thông tin thời gian
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Ngày tạo
                                    </Label>
                                    <Input
                                        value={formatDate(user.createdAt)}
                                        readOnly
                                        className="bg-gray-50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Cập nhật lần cuối
                                    </Label>
                                    <Input
                                        value={formatDate(user.updatedAt)}
                                        readOnly
                                        className="bg-gray-50"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="border-t border-gray-200 my-4"></div>

                    {/* Form chỉnh sửa */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Chỉnh sửa thông tin</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Vai trò</Label>
                                        <Select
                                            value={formData.role}
                                            onValueChange={(value: UserRole) =>
                                                setFormData(prev => ({ ...prev, role: value }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn vai trò" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={UserRole.USER}>
                                                    Người dùng
                                                </SelectItem>
                                                <SelectItem value={UserRole.ADMIN}>
                                                    Quản trị viên
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="isActive">Trạng thái tài khoản</Label>
                                        <div className="flex items-center space-x-2 h-10">
                                            <input
                                                type="checkbox"
                                                id="isActive"
                                                checked={formData.isActive}
                                                onChange={(e) =>
                                                    setFormData(prev => ({ ...prev, isActive: e.target.checked }))
                                                }
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <Label htmlFor="isActive" className="text-sm">
                                                {formData.isActive ? 'Kích hoạt' : 'Vô hiệu hóa'}
                                            </Label>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-md">
                                        {error}
                                    </div>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting || isLoading}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting || isLoading}
                        className="min-w-[100px]"
                    >
                        {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
