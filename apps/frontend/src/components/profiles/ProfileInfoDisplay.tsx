import { User, Mail, Phone, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { User as UserType } from '@/types/auth';

interface ProfileInfoDisplayProps {
    user: UserType;
    onEditProfile: () => void;
}

export const ProfileInfoDisplay = ({ user, onEditProfile }: ProfileInfoDisplayProps) => {
    // Tính phần trăm hoàn thành profile
    const completionPercentage = Math.round(((user.username ? 1 : 0) +
        (user.phoneNumber ? 1 : 0) +
        (user.address ? 1 : 0) +
        (user.avatarUrl ? 1 : 0)) / 4 * 100);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <User className="h-5 w-5" />
                            <span>Thông tin cá nhân</span>
                        </CardTitle>
                        <CardDescription>
                            Thông tin tài khoản của bạn
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                <Mail className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                <User className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-600">Tên người dùng</p>
                                    <p className="font-medium">{user.username || 'Chưa cập nhật'}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                <Phone className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-600">Số điện thoại</p>
                                    <p className="font-medium">{user.phoneNumber || 'Chưa cập nhật'}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                <MapPin className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-600">Địa chỉ</p>
                                    <p className="font-medium">{user.address || 'Chưa cập nhật'}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Hoàn thiện hồ sơ */}
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Star className="h-5 w-5" />
                            <span>Hoàn thiện hồ sơ</span>
                        </CardTitle>
                        <CardDescription>
                            Hoàn thiện hồ sơ để có trải nghiệm tốt hơn
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Thanh tiến độ hoàn thành */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span>Tiến độ hoàn thành</span>
                                <span className="font-medium">{completionPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${completionPercentage}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Danh sách các mục hoàn thiện */}
                        <div className="space-y-2">
                            <div className={`flex items-center space-x-2 text-sm ${user.username ? 'text-green-600' : 'text-gray-600'}`}>
                                <div className={`w-2 h-2 rounded-full ${user.username ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span>Cập nhật tên người dùng</span>
                            </div>
                            <div className={`flex items-center space-x-2 text-sm ${user.phoneNumber ? 'text-green-600' : 'text-gray-600'}`}>
                                <div className={`w-2 h-2 rounded-full ${user.phoneNumber ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span>Thêm số điện thoại</span>
                            </div>
                            <div className={`flex items-center space-x-2 text-sm ${user.address ? 'text-green-600' : 'text-gray-600'}`}>
                                <div className={`w-2 h-2 rounded-full ${user.address ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span>Cập nhật địa chỉ</span>
                            </div>
                            <div className={`flex items-center space-x-2 text-sm ${user.avatarUrl ? 'text-green-600' : 'text-gray-600'}`}>
                                <div className={`w-2 h-2 rounded-full ${user.avatarUrl ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span>Tải lên ảnh đại diện</span>
                            </div>
                        </div>

                        <Button
                            onClick={onEditProfile}
                            className="w-full"
                            size="sm"
                        >
                            Hoàn thiện ngay
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}; 