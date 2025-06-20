import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { OrderDetailModal } from '@/components/admin/OrderDetailModal';
import { useAdminOrderStore } from '@/stores/admin/adminOrderStore';
import { Order, UpdateOrderStatus } from '@/types/order';
import { AdminOrderQuery } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderStatusEnum } from '@web-ecom/shared-types/orders/enums';
import { Search, Filter, RefreshCw, Package, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

function AdminOrdersPage() {
    const {
        orders,
        selectedOrder,
        isLoading,
        error,
        fetchOrders,
        fetchOrderById,
        updateOrderStatus,
        clearSelectedOrder,
        clearError
    } = useAdminOrderStore();

    // Local state for UI
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatusEnum | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isStatusUpdateModalOpen, setIsStatusUpdateModalOpen] = useState(false);
    const [orderToUpdate, setOrderToUpdate] = useState<Order | null>(null);
    const [newStatus, setNewStatus] = useState<OrderStatusEnum>(OrderStatusEnum.PENDING);

    // Fetch orders on component mount và khi filter thay đổi
    useEffect(() => {
        const query: AdminOrderQuery = {
            page: currentPage,
            limit: 10,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            search: searchTerm || undefined,
        };
        fetchOrders(query);
    }, [currentPage, searchTerm, statusFilter, fetchOrders]);

    // Auto-refresh orders every 30 seconds (theo SOLID Principle - Single Responsibility)
    useEffect(() => {
        const interval = setInterval(() => {
            const query: AdminOrderQuery = {
                page: currentPage,
                limit: 10,
                search: searchTerm || undefined,
                status: statusFilter !== 'all' ? statusFilter : undefined,
            };
            fetchOrders(query);
        }, 30000);

        return () => clearInterval(interval);
    }, [currentPage, searchTerm, statusFilter, fetchOrders]);

    // Handlers - theo SOLID Principle, mỗi function có 1 responsibility
    const handleViewOrder = async (order: Order) => {
        await fetchOrderById(order.id);
        setIsDetailModalOpen(true);
    };

    const handleUpdateStatus = (order: Order) => {
        setOrderToUpdate(order);
        setNewStatus(order.status);
        setIsStatusUpdateModalOpen(true);
    };

    const handleConfirmStatusUpdate = async () => {
        if (!orderToUpdate) return;

        try {
            const updateDto: UpdateOrderStatus = { status: newStatus };
            await updateOrderStatus(orderToUpdate.id, updateDto);
            setIsStatusUpdateModalOpen(false);
            setOrderToUpdate(null);

            // Refresh orders list
            const query: AdminOrderQuery = {
                page: currentPage,
                limit: 10,
                search: searchTerm || undefined,
                status: statusFilter !== 'all' ? statusFilter : undefined,
            };
            fetchOrders(query);
        } catch (error) {
            // Error đã được handle trong store
        }
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        clearSelectedOrder();
    };

    const handleRefresh = () => {
        const query: AdminOrderQuery = {
            page: currentPage,
            limit: 10,
            search: searchTerm || undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
        };
        fetchOrders(query);
    };

    // Quick stats calculation
    const stats = {
        total: orders.length,
        pending: orders.filter(order => order.status === OrderStatusEnum.PENDING).length,
        processing: orders.filter(order => order.status === OrderStatusEnum.PROCESSING).length,
        delivered: orders.filter(order => order.status === OrderStatusEnum.DELIVERED).length,
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Quản Lý Đơn Hàng</h1>
                        <p className="text-gray-600 mt-1">
                            Quản lý và theo dõi tất cả đơn hàng trong hệ thống
                        </p>
                    </div>
                    <Button onClick={handleRefresh} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Làm Mới
                    </Button>
                </div>

                {/* Quick Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tổng Đơn Hàng</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Chờ Xử Lý</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Đang Xử Lý</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Đã Giao</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters và Search */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            Bộ Lọc và Tìm Kiếm
                        </CardTitle>
                        <CardDescription>
                            Lọc đơn hàng theo trạng thái và tìm kiếm theo mã đơn hàng hoặc email khách hàng
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Tìm kiếm theo mã đơn hàng hoặc email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatusEnum)}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Lọc theo trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                    <SelectItem value={OrderStatusEnum.PENDING}>Chờ xử lý</SelectItem>
                                    <SelectItem value={OrderStatusEnum.PROCESSING}>Đang xử lý</SelectItem>
                                    <SelectItem value={OrderStatusEnum.SHIPPED}>Đang giao</SelectItem>
                                    <SelectItem value={OrderStatusEnum.DELIVERED}>Đã giao</SelectItem>
                                    <SelectItem value={OrderStatusEnum.CANCELLED}>Đã hủy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Error Alert */}
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription className="flex items-center justify-between">
                            {error}
                            <Button variant="outline" size="sm" onClick={clearError}>
                                Đóng
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Danh Sách Đơn Hàng</CardTitle>
                        <CardDescription>
                            Hiển thị {orders.length} đơn hàng
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OrdersTable
                            orders={orders}
                            onView={handleViewOrder}
                            onUpdateStatus={handleUpdateStatus}
                            isLoading={isLoading}
                        />
                    </CardContent>
                </Card>

                {/* Order Detail Modal */}
                <OrderDetailModal
                    order={selectedOrder}
                    isOpen={isDetailModalOpen}
                    onClose={handleCloseDetailModal}
                />

                {/* Status Update Modal */}
                <Dialog open={isStatusUpdateModalOpen} onOpenChange={setIsStatusUpdateModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Cập Nhật Trạng Thái Đơn Hàng</DialogTitle>
                            <DialogDescription>
                                Thay đổi trạng thái cho đơn hàng #{orderToUpdate?.id.slice(-8)}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Trạng thái mới:</label>
                                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as OrderStatusEnum)}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={OrderStatusEnum.PENDING}>Chờ xử lý</SelectItem>
                                        <SelectItem value={OrderStatusEnum.PROCESSING}>Đang xử lý</SelectItem>
                                        <SelectItem value={OrderStatusEnum.SHIPPED}>Đang giao</SelectItem>
                                        <SelectItem value={OrderStatusEnum.DELIVERED}>Đã giao</SelectItem>
                                        <SelectItem value={OrderStatusEnum.CANCELLED}>Đã hủy</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsStatusUpdateModalOpen(false)}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    onClick={handleConfirmStatusUpdate}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Đang cập nhật...' : 'Cập Nhật'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}

export default AdminOrdersPage;