import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, ShoppingCart, TrendingUp, Award, Crown } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { orderService } from '@/services/orderService';
import { formatCurrency } from '@/utils/currency';
import ProfileForm from '@/components/forms/ProfileForm';
import {
    ProfileHeader,
    UserStatsCards,
    ProfileTabs,
    ProfileInfoDisplay,
    OrdersList,
    ProfilePageSkeleton
} from '@/components/profiles';
import type { Order } from '@/types/order';
import { OrderStatusEnum } from '@web-ecom/shared-types/orders/enums';
import { getRankDisplayName, getRankColor, getRankDiscountPercentage } from '@/helpers/rank.helpers';

// Kiểu dữ liệu cho tab
type TabType = 'profile' | 'orders';

// Interface cho thống kê người dùng
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

    // Chuyển hướng nếu chưa đăng nhập
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login', {
                state: { from: '/profile' },
                replace: true
            });
        }
    }, [isLoading, isAuthenticated, navigate]);

    // Lấy danh sách đơn hàng gần đây và tính toán thống kê
    useEffect(() => {
        const loadOrdersAndStats = async () => {
            if (isAuthenticated) {
                try {
                    setOrdersLoading(true);
                    const response = await orderService.getUserOrders({ page: 1, limit: 10 });
                    setOrders(response.data);
                    setOrdersMessage(response.message);

                    // Tính toán thống kê người dùng từ đơn hàng chi tính DELIVERED
                    const deliveredOrders = response.data.filter(order => order.status === OrderStatusEnum.DELIVERED);
                    const stats: UserStats = {
                        totalOrders: response.data.length,
                        // Chỉ lấy đơn hàng đã giao (DELIVERED)
                        totalSpent: deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0),
                        completedOrders: deliveredOrders.length,
                        loyaltyPoints: Math.floor(deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0) / 1000) // 1 điểm cho mỗi 1000 VND
                    };
                    setUserStats(stats);

                    console.log('📦 Đã tải đơn hàng:', response.data.length, 'Thống kê:', stats);
                } catch (error: any) {
                    console.error('Không thể tải đơn hàng:', error);
                    setOrders([]);
                    setOrdersMessage('Không thể tải danh sách đơn hàng');
                } finally {
                    setOrdersLoading(false);
                }
            }
        };

        loadOrdersAndStats();
    }, [isAuthenticated]);

    // Stats Cards - Thông tin người dùng
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
            title: 'Hạng thành viên',
            value: getRankDisplayName(user?.rank || 'BRONZE'),
            icon: Crown,
            color: getRankColor(user?.rank || 'BRONZE').split(' ')[0],
            bgColor: getRankColor(user?.rank || 'BRONZE').split(' ')[1],
            change: `Giảm ${getRankDiscountPercentage(user?.rank || 'BRONZE')}% khi thanh toán`
        },
        {
            title: 'Điểm tích lũy',
            value: userStats.loyaltyPoints,
            icon: Award,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            change: 'Điểm tích lũy mỗi lần thanh toán'
        }
    ];

    // Configuration data cho components
    const tabs = [
        { type: 'profile' as TabType, label: 'Thông tin cá nhân', icon: User },
        { type: 'orders' as TabType, label: 'Đơn hàng', icon: Package },
    ];

    // Container logic - callbacks for ProfileView
    const getUserInitials = (username?: string, email?: string) => {
        if (username) return username.slice(0, 2).toUpperCase();
        if (email) return email.slice(0, 2).toUpperCase();
        return 'U';
    };

    const handleGoBack = () => navigate(-1);
    const handleEditClick = () => setIsEditing(true);
    const handleEditSuccess = () => setIsEditing(false);
    const handleEditCancel = () => setIsEditing(false);
    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setIsEditing(false);
    };
    const handleOrderClick = (orderId: string) => navigate(`/orders/${orderId}`);
    const handleViewAllOrders = () => navigate('/orders');
    const handleGoShopping = () => navigate('/products');





    // Loading state với Skeleton
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <ProfilePageSkeleton />
            </div>
        );
    }

    // Không render nếu chưa đăng nhập 
    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Profile Header với avatar và user info */}
                    <ProfileHeader
                        user={user}
                        isEditing={isEditing}
                        activeTab={activeTab}
                        onGoBack={handleGoBack}
                        onEditClick={handleEditClick}
                        getUserInitials={getUserInitials}
                    />

                    {/* User Stats Cards */}
                    <UserStatsCards statsCards={statsCards} />

                    {/* Tab Navigation */}
                    <ProfileTabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                    />

                    {/* Tab Content - Conditional rendering ở ProfilePage */}
                    {activeTab === 'profile' && (
                        isEditing ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Chỉnh sửa thông tin</CardTitle>
                                    <CardDescription>
                                        Cập nhật thông tin cá nhân của bạn
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ProfileForm
                                        onSuccess={handleEditSuccess}
                                        onCancel={handleEditCancel}
                                    />
                                </CardContent>
                            </Card>
                        ) : (
                            <ProfileInfoDisplay
                                user={user}
                                onEditProfile={handleEditClick}
                            />
                        )
                    )}

                    {activeTab === 'orders' && (
                        <OrdersList
                            orders={orders}
                            ordersLoading={ordersLoading}
                            ordersMessage={ordersMessage}
                            onOrderClick={handleOrderClick}
                            onViewAllOrders={handleViewAllOrders}
                            onGoShopping={handleGoShopping}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;