import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Package, Settings, Mail, Phone, MapPin, Camera, Edit3, TrendingUp, ShoppingCart, Star, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileForm from '@/components/forms/ProfileForm';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/authStore';
import { orderService } from '@/services/orderService';
import { formatCurrency } from '@/utils/currency';
import type { Order } from '@/types/order';
import { OrderStatusEnum } from '@web-ecom/shared-types/orders/enums';

// Tab types
type TabType = 'profile' | 'orders' | 'settings';

// Stats interface
interface UserStats {
    totalOrders: number;
    totalSpent: number;
    completedOrders: number;
    loyaltyPoints: number;
}

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersMessage, setOrdersMessage] = useState<string>('');
    const [userStats, setUserStats] = useState<UserStats>({
        totalOrders: 0,
        totalSpent: 0,
        completedOrders: 0,
        loyaltyPoints: 0
    });

    // Redirect nếu chưa đăng nhập
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login', {
                state: { from: '/profile' },
                replace: true
            });
        }
    }, [isLoading, isAuthenticated, navigate]);

    // Load recent orders và calculate stats
    useEffect(() => {
        const loadOrdersAndStats = async () => {
            if (isAuthenticated) {
                try {
                    setOrdersLoading(true);
                    const response = await orderService.getUserOrders({ page: 1, limit: 10 });
                    setOrders(response.data);
                    setOrdersMessage(response.message);

                    // Calculate user stats from orders
                    const stats: UserStats = {
                        totalOrders: response.data.length,
                        totalSpent: response.data.reduce((sum, order) => sum + order.totalAmount, 0),
                        completedOrders: response.data.filter(order => order.status === OrderStatusEnum.DELIVERED).length,
                        loyaltyPoints: Math.floor(response.data.reduce((sum, order) => sum + order.totalAmount, 0) / 1000) // 1 point per 1000 VND
                    };
                    setUserStats(stats);

                    console.log('📦 Orders loaded:', response.data.length, 'Stats:', stats);
                } catch (error: any) {
                    console.error('Failed to load orders:', error);
                    setOrders([]);
                    setOrdersMessage('Không thể tải danh sách đơn hàng');
                } finally {
                    setOrdersLoading(false);
                }
            }
        };

        loadOrdersAndStats();
    }, [isAuthenticated]);

    // Tab navigation
    const tabs = [
        { id: 'profile' as TabType, label: 'Thông tin cá nhân', icon: User },
        { id: 'orders' as TabType, label: 'Đơn hàng', icon: Package },
        { id: 'settings' as TabType, label: 'Cài đặt', icon: Settings }
    ];

    // Get user initials for avatar fallback
    const getUserInitials = (username?: string, email?: string) => {
        if (username) return username.slice(0, 2).toUpperCase();
        if (email) return email.slice(0, 2).toUpperCase();
        return 'U';
    };

    // Quay lại trang trước
    const handleGoBack = () => {
        navigate(-1);
    };

    // Stats cards data
    const statsCards = [
        {
            title: 'Tổng đơn hàng',
            value: userStats.totalOrders,
            icon: ShoppingCart,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            change: '+2 tuần này'
        },
        {
            title: 'Tổng chi tiêu',
            value: formatCurrency(userStats.totalSpent),
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            change: 'Tháng này'
        },
        {
            title: 'Hoàn thành',
            value: userStats.completedOrders,
            icon: Package,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            change: `${userStats.totalOrders > 0 ? Math.round((userStats.completedOrders / userStats.totalOrders) * 100) : 0}%`
        },
        {
            title: 'Điểm tích lũy',
            value: userStats.loyaltyPoints,
            icon: Award,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            change: 'Cấp bạc'
        }
    ];

    // Loading state với Skeleton components
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="space-y-8">
                            {/* Header skeleton */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    <Skeleton className="h-8 w-20" />
                                    <div className="flex items-center space-x-4">
                                        <Skeleton className="h-16 w-16 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-6 w-32" />
                                            <Skeleton className="h-4 w-48" />
                                            <div className="flex space-x-2">
                                                <Skeleton className="h-5 w-16 rounded-full" />
                                                <Skeleton className="h-5 w-24" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Skeleton className="h-9 w-24" />
                            </div>

                            {/* Stats cards skeleton */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Card key={i} className="border-0 shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-20" />
                                                    <Skeleton className="h-8 w-16" />
                                                    <Skeleton className="h-3 w-16" />
                                                </div>
                                                <Skeleton className="h-12 w-12 rounded-full" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Tab navigation skeleton */}
                            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-md">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <Skeleton key={i} className="h-9 w-32 rounded-md" />
                                ))}
                            </div>

                            {/* Content skeleton */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <Card>
                                        <CardHeader>
                                            <Skeleton className="h-6 w-40" />
                                            <Skeleton className="h-4 w-64" />
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {Array.from({ length: 4 }).map((_, i) => (
                                                    <div key={i} className="p-4 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center space-x-3">
                                                            <Skeleton className="h-5 w-5" />
                                                            <div className="space-y-1">
                                                                <Skeleton className="h-3 w-16" />
                                                                <Skeleton className="h-4 w-24" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div>
                                    <Card>
                                        <CardHeader>
                                            <Skeleton className="h-6 w-32" />
                                            <Skeleton className="h-4 w-48" />
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <Skeleton className="h-4 w-24" />
                                                    <Skeleton className="h-4 w-8" />
                                                </div>
                                                <Skeleton className="h-2 w-full rounded-full" />
                                            </div>
                                            <div className="space-y-2">
                                                {Array.from({ length: 4 }).map((_, i) => (
                                                    <div key={i} className="flex items-center space-x-2">
                                                        <Skeleton className="h-2 w-2 rounded-full" />
                                                        <Skeleton className="h-3 w-32" />
                                                    </div>
                                                ))}
                                            </div>
                                            <Skeleton className="h-8 w-full" />
                                        </CardContent>
                                    </Card>
                                </div>
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
                    {/* Header với avatar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between mb-8"
                    >
                        <div className="flex items-center space-x-6">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleGoBack}
                                className="flex items-center space-x-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Quay lại</span>
                            </Button>

                            {/* Avatar Section */}
                            <div className="flex items-center space-x-4">
                                <div className="relative group">
                                    <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
                                        <AvatarImage
                                            src={user.avatarUrl}
                                            alt={user.username}
                                        />
                                        <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                            {getUserInitials(user.username, user.email)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <Camera className="h-5 w-5 text-white" />
                                    </div>
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {user.username || 'Người dùng'}
                                    </h1>
                                    <p className="text-gray-600">{user.email}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                            {user.role}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            Tham gia {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {!isEditing && activeTab === 'profile' && (
                            <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
                                <Edit3 className="h-4 w-4" />
                                <span>Chỉnh sửa</span>
                            </Button>
                        )}
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                    >
                        {statsCards.map((stat, index) => (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="cursor-pointer"
                            >
                                <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 mb-1">
                                                    {stat.title}
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {stat.value}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {stat.change}
                                                </p>
                                            </div>
                                            <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Tab Navigation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 max-w-md"
                    >
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setIsEditing(false);
                                }}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </motion.div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'profile' && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2">
                                        {isEditing ? (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Chỉnh sửa thông tin</CardTitle>
                                                    <CardDescription>
                                                        Cập nhật thông tin cá nhân của bạn
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <ProfileForm
                                                        onSuccess={() => setIsEditing(false)}
                                                        onCancel={() => setIsEditing(false)}
                                                    />
                                                </CardContent>
                                            </Card>
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
                                        )}
                                    </div>

                                    {/* Profile Completion */}
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
                                                {/* Progress bar */}
                                                <div>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span>Tiến độ hoàn thành</span>
                                                        <span className="font-medium">
                                                            {Math.round(((user.username ? 1 : 0) +
                                                                (user.phoneNumber ? 1 : 0) +
                                                                (user.address ? 1 : 0) +
                                                                (user.avatarUrl ? 1 : 0)) / 4 * 100)}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                            style={{
                                                                width: `${Math.round(((user.username ? 1 : 0) +
                                                                    (user.phoneNumber ? 1 : 0) +
                                                                    (user.address ? 1 : 0) +
                                                                    (user.avatarUrl ? 1 : 0)) / 4 * 100)}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {/* Completion checklist */}
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
                                                    onClick={() => setIsEditing(true)}
                                                    className="w-full"
                                                    size="sm"
                                                >
                                                    Hoàn thiện ngay
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Package className="h-5 w-5" />
                                            <span>Lịch sử đơn hàng</span>
                                        </CardTitle>
                                        <CardDescription>
                                            {ordersMessage || 'Danh sách tất cả đơn hàng của bạn'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {ordersLoading ? (
                                            <div className="space-y-4">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <div key={i} className="p-4 border rounded-lg">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div className="space-y-2">
                                                                <Skeleton className="h-4 w-32" />
                                                                <Skeleton className="h-3 w-24" />
                                                            </div>
                                                            <Skeleton className="h-6 w-16 rounded-full" />
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <Skeleton className="h-6 w-20" />
                                                            <Skeleton className="h-8 w-20" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : orders.length > 0 ? (
                                            <div className="space-y-4">
                                                {orders.map((order, index) => (
                                                    <motion.div
                                                        key={order.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                                        onClick={() => navigate(`/orders/${order.id}`)}
                                                    >
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <p className="font-medium">
                                                                    Đơn hàng #{order.id.slice(0, 8)}
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                                                </p>
                                                            </div>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === OrderStatusEnum.DELIVERED ? 'bg-green-100 text-green-800' :
                                                                order.status === OrderStatusEnum.PENDING ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-lg font-semibold text-primary">
                                                                {formatCurrency(order.totalAmount)}
                                                            </p>
                                                            <Button variant="outline" size="sm">
                                                                Xem chi tiết
                                                            </Button>
                                                        </div>
                                                    </motion.div>
                                                ))}

                                                <div className="pt-4 border-t">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full"
                                                        onClick={() => navigate('/orders')}
                                                    >
                                                        Xem tất cả đơn hàng
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                    Chưa có đơn hàng nào
                                                </h3>
                                                <p className="text-gray-500 mb-6">
                                                    Bạn chưa thực hiện đơn hàng nào. Hãy khám phá các sản phẩm của chúng tôi!
                                                </p>
                                                <Button onClick={() => navigate('/products')}>
                                                    Mua sắm ngay
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {activeTab === 'settings' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Settings className="h-5 w-5" />
                                            <span>Cài đặt tài khoản</span>
                                        </CardTitle>
                                        <CardDescription>
                                            Quản lý các cài đặt và tùy chọn tài khoản
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="text-center py-12">
                                            <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Cài đặt sẽ có sớm
                                            </h3>
                                            <p className="text-gray-500">
                                                Chúng tôi đang phát triển thêm nhiều tùy chọn cài đặt cho bạn.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;