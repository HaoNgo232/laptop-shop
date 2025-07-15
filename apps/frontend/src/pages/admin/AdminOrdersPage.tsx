import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { OrderDetailModal } from '@/components/admin/OrderDetailModal';
import { OrderStatsCards } from '@/components/admin/OrderStatsCards';
import { OrderFilters } from '@/components/admin/OrderFilters';
import { OrderStatusModal } from '@/components/admin/OrderStatusModal';
import { useOrdersFilter } from '@/hooks/useOrdersFilter';
import { useAdminOrderStore } from '@/stores/admin/adminOrderStore';
import { Order, UpdateOrderStatus } from '@/types/order';
import { AdminOrderQuery } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderStatusEnum } from '@web-ecom/shared-types/orders/enums';
import { RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

function AdminOrdersPage() {
    const {
        selectedOrder,
        fetchOrderById,
        updateOrderStatus,
        clearSelectedOrder,
        clearError
    } = useAdminOrderStore();

    // Sử dụng custom hook cho filtering logic
    const {
        orders,
        filteredOrders,
        stats,
        isLoading,
        error,
        searchTerm,
        statusFilter,
        currentPage,
        totalPages,
        setSearchTerm,
        setStatusFilter,
        handleFilterByStatus,
        handleClearFilter,
        handleRefresh,
        handlePageChange,
    } = useOrdersFilter();

    // Local state for modals
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isStatusUpdateModalOpen, setIsStatusUpdateModalOpen] = useState(false);
    const [orderToUpdate, setOrderToUpdate] = useState<Order | null>(null);
    const [newStatus, setNewStatus] = useState<OrderStatusEnum>(OrderStatusEnum.PENDING);

    // Modal handlers - theo SOLID Principle, mỗi function có 1 responsibility
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

            // Refresh orders list để cập nhật stats
            handleRefresh();
        } catch (error) {
            // Error đã được handle trong store
        }
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        clearSelectedOrder();
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
                    <div className="flex gap-2">
                        {/* Nút Clear Filter khi đang filter */}
                        {statusFilter !== 'all' && (
                            <Button
                                variant="outline"
                                onClick={handleClearFilter}
                                className="text-gray-600"
                            >
                                Xem Tất Cả
                            </Button>
                        )}
                        <Button onClick={handleRefresh} disabled={isLoading}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Làm Mới
                        </Button>
                    </div>
                </div>

                {/* Quick Stats Cards - Sử dụng component riêng */}
                <OrderStatsCards
                    stats={stats}
                    statusFilter={statusFilter}
                    onFilterByStatus={handleFilterByStatus}
                    onClearFilter={handleClearFilter}
                />

                {/* Filters và Search - Sử dụng component riêng */}
                <OrderFilters
                    searchTerm={searchTerm}
                    statusFilter={statusFilter}
                    onSearchChange={setSearchTerm}
                    onStatusChange={(value) => setStatusFilter(value as OrderStatusEnum | 'all')}
                />

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
                <Card id="orders-list-section">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Danh Sách Đơn Hàng</span>
                            {/* Hiển thị filter status và số lượng */}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                {statusFilter !== 'all' && (
                                    <Badge variant="outline">
                                        {statusFilter}
                                    </Badge>
                                )}
                                <span>({filteredOrders.length} / {stats.total} đơn hàng)</span>
                            </div>
                        </CardTitle>
                        <CardDescription>
                            {statusFilter === 'all'
                                ? `Hiển thị tất cả ${filteredOrders.length} đơn hàng`
                                : `Hiển thị ${filteredOrders.length} đơn hàng có trạng thái "${statusFilter}" trong tổng số ${stats.total} đơn hàng`
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OrdersTable
                            orders={orders}
                            onView={handleViewOrder}
                            onUpdateStatus={handleUpdateStatus}
                            isLoading={isLoading}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </CardContent>
                </Card>

                {/* Order Detail Modal */}
                <OrderDetailModal
                    order={selectedOrder}
                    isOpen={isDetailModalOpen}
                    onClose={handleCloseDetailModal}
                />

                {/* Status Update Modal - Sử dụng component riêng */}
                <OrderStatusModal
                    isOpen={isStatusUpdateModalOpen}
                    onClose={() => setIsStatusUpdateModalOpen(false)}
                    order={orderToUpdate}
                    newStatus={newStatus}
                    onStatusChange={(status) => setNewStatus(status)}
                    onConfirm={handleConfirmStatusUpdate}
                    isLoading={isLoading}
                />
            </div>
        </AdminLayout>
    );
}

export default AdminOrdersPage;