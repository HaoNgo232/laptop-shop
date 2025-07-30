import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { SummaryCard } from '@/components/admin/SummaryCard';
import {
    Users,
    ShoppingBag,
    DollarSign,
    Package,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import { formatCurrency } from '@/utils/formatters';
import { getOrderStatusLabel } from '@/utils/orderStatus';
import { OrderStatusEnum } from '@/types';

/**
 * AdminDashboardPage - Trang dashboard cho admin
 */
export function AdminDashboardPage() {
    // Hook xử lý data và logic cho dashboard
    const {
        dashboardSummary,
        detailedStats,
        isLoading,
        error,
        handleRefresh
    } = useDashboard();

    const LoadingSkeleton = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                                <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse" />
                                <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    if (error) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Card className="w-full max-w-md">
                        <CardContent className="p-6 text-center">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Có lỗi xảy ra</h3>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <Button onClick={handleRefresh}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Thử lại
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </AdminLayout>
        );
    }

    if (isLoading) {
        return (
            <AdminLayout>
                <LoadingSkeleton />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Tổng quan về hoạt động của hệ thống
                    </p>
                </div>
                <Button onClick={handleRefresh} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Làm mới
                </Button>
            </div>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <SummaryCard
                    title="Tổng người dùng"
                    value={dashboardSummary?.totalUsers || 0}
                    icon={Users}
                    description="Tổng số tài khoản đã đăng ký"
                />
                <SummaryCard
                    title="Tổng đơn hàng"
                    value={dashboardSummary?.totalOrders || 0}
                    icon={ShoppingBag}
                    description="Tổng số đơn hàng đã tạo"
                />
                <SummaryCard
                    title="Doanh thu"
                    value={formatCurrency(dashboardSummary?.totalRevenue || 0)}
                    icon={DollarSign}
                    description="Tổng doanh thu từ các đơn hàng"
                />
                <SummaryCard
                    title="Sản phẩm"
                    value={dashboardSummary?.totalProducts || 0}
                    icon={Package}
                    description="Tổng số sản phẩm trong kho"
                />
            </div>

            {/* New Users and Orders Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Người dùng mới</CardTitle>
                        <CardDescription>
                            Số người dùng đăng ký mới trong tháng này
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                            +{dashboardSummary?.newUsersCount || 0}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            So với tháng trước
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Đơn hàng mới</CardTitle>
                        <CardDescription>
                            Số đơn hàng được tạo trong tháng này
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">
                            +{dashboardSummary?.newOrdersCount || 0}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            So với tháng trước
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Orders by Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Đơn hàng theo trạng thái</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {detailedStats?.ordersByStatus?.map((item: any, index: number) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{getOrderStatusLabel(item.status as OrderStatusEnum)}</span>
                                    <span className="text-2xl font-bold">{item.count}</span>
                                </div>
                            )) || (
                                    <p className="text-center text-muted-foreground">
                                        Không có dữ liệu
                                    </p>
                                )}
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue by Month */}
                <Card>
                    <CardHeader>
                        <CardTitle>Doanh thu theo tháng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {detailedStats?.revenueByMonth?.map((item: any, index: number) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{item.month}</span>
                                    <span className="text-lg font-bold">
                                        {formatCurrency(item.revenue)}
                                    </span>
                                </div>
                            )) || (
                                    <p className="text-center text-muted-foreground">
                                        Không có dữ liệu
                                    </p>
                                )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
} 