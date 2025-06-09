import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Package, Settings, Mail, Phone, MapPin } from 'lucide-react';
import ProfileForm from '@/components/forms/ProfileForm';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { orderService } from '@/services/orderService';
import { formatCurrency } from '@/utils/currency';
import type { Order } from '@/types/order';
import { OrderStatusEnum } from '@web-ecom/shared-types/orders/enums';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersMessage, setOrdersMessage] = useState<string>('');

    // Redirect nếu chưa đăng nhập
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login', {
                state: { from: '/profile' },
                replace: true
            });
        }
    }, [isLoading, isAuthenticated, navigate]);

    // Load recent orders
    useEffect(() => {
        const loadOrders = async () => {
            if (isAuthenticated) {
                try {
                    setOrdersLoading(true);
                    const response = await orderService.getUserOrders({ page: 1, limit: 5 });
                    setOrders(response.data);
                    setOrdersMessage(response.message); // Lưu message từ backend
                    console.log('📦 Orders loaded:', response.data.length, 'Message:', response.message);
                } catch (error: any) {
                    console.error('Failed to load orders:', error);
                    setOrders([]);
                    setOrdersMessage('Không thể tải danh sách đơn hàng');
                } finally {
                    setOrdersLoading(false);
                }
            }
        };

        loadOrders();
    }, [isAuthenticated]);

    // Quay lại trang trước
    const handleGoBack = () => {
        navigate(-1);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 h-64 bg-gray-200 rounded-lg"></div>
                                <div className="h-64 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Nếu chưa login thì không render gì (đã redirect)
    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleGoBack}
                                className="flex items-center space-x-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Quay lại Trang Trước</span>
                            </Button>
                            <h1 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h1>
                        </div>

                        {!isEditing && (
                            <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
                                <Settings className="h-4 w-4" />
                                <span>Chỉnh sửa</span>
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Info/Form */}
                        <div className="lg:col-span-2">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-semibold">Chỉnh sửa thông tin</h2>
                                    </div>
                                    <ProfileForm
                                        onSuccess={() => setIsEditing(false)}
                                        onCancel={() => setIsEditing(false)}
                                    />
                                </div>
                            ) : (
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
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center space-x-3">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Email</p>
                                                    <p className="font-medium">{user.email}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <User className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Tên người dùng</p>
                                                    <p className="font-medium">{user.username || 'Chưa cập nhật'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <Phone className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Số điện thoại</p>
                                                    <p className="font-medium">{user.phoneNumber || 'Chưa cập nhật'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <MapPin className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Địa chỉ</p>
                                                    <p className="font-medium">{user.address || 'Chưa cập nhật'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                                <div>
                                                    <span className="font-medium">Vai trò:</span> {user.role}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Ngày tham gia:</span>{' '}
                                                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Order History */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Package className="h-5 w-5" />
                                        <span>Lịch sử đơn hàng</span>
                                    </CardTitle>
                                    <CardDescription>
                                        {ordersMessage || '5 đơn hàng gần nhất'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {ordersLoading ? (
                                        <div className="space-y-3">
                                            {Array.from({ length: 3 }).map((_, i) => (
                                                <div key={i} className="animate-pulse">
                                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : orders.length > 0 ? (
                                        <div className="space-y-3">
                                            {orders.map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                                    onClick={() => navigate(`/orders/${order.id}`)}
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <p className="text-sm font-medium">
                                                            #{order.id.slice(0, 8)}
                                                        </p>
                                                        <span className={`text-xs px-2 py-1 rounded ${order.status === OrderStatusEnum.DELIVERED ? 'bg-green-100 text-green-800' :
                                                            order.status === OrderStatusEnum.PENDING ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-1">
                                                        {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                                    </p>
                                                    <p className="text-sm font-medium text-primary">
                                                        {formatCurrency(order.totalAmount)}
                                                    </p>
                                                </div>
                                            ))}

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full mt-3"
                                                onClick={() => navigate('/orders')}
                                            >
                                                Xem tất cả đơn hàng
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500 text-sm">Chưa có đơn hàng nào</p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="mt-3"
                                                onClick={() => navigate('/products')}
                                            >
                                                Mua sắm ngay
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;