import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, TrendingUp, Clock, CheckCircle, Truck, X } from 'lucide-react';
import { OrderStatusEnum } from '@/types';

interface OrderStats {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    DELIVERED: number;
    cancelled: number;
}

interface OrderStatsCardsProps {
    readonly stats: OrderStats;
    readonly statusFilter: OrderStatusEnum | 'all';
    readonly onFilterByStatus: (status: OrderStatusEnum) => void;
    readonly onClearFilter: () => void;
}

export function OrderStatsCards({
    stats,
    statusFilter,
    onFilterByStatus,
    onClearFilter
}: OrderStatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tổng Đơn Hàng</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <Button
                        variant={statusFilter === 'all' ? "default" : "outline"}
                        className="mt-2"
                        onClick={onClearFilter}
                    >
                        {statusFilter === 'all' ? 'Đang Xem' : 'Xem Tất Cả'}
                    </Button>
                </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Chờ Xử Lý</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    <Button
                        variant={statusFilter === OrderStatusEnum.PENDING ? "default" : "outline"}
                        className="mt-2"
                        onClick={() => onFilterByStatus(OrderStatusEnum.PENDING)}
                    >
                        {statusFilter === OrderStatusEnum.PENDING ? 'Đang Xem' : 'Xem Danh Sách'}
                    </Button>
                </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Đang chuẩn bị hàng</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
                    <Button
                        variant={statusFilter === OrderStatusEnum.PROCESSING ? "default" : "outline"}
                        className="mt-2"
                        onClick={() => onFilterByStatus(OrderStatusEnum.PROCESSING)}
                    >
                        {statusFilter === OrderStatusEnum.PROCESSING ? 'Đang Xem' : 'Xem Danh Sách'}
                    </Button>
                </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Đã Giao Cho Vận Chuyển</CardTitle>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{stats.shipped}</div>
                    <Button
                        variant={statusFilter === OrderStatusEnum.SHIPPED ? "default" : "outline"}
                        className="mt-2"
                        onClick={() => onFilterByStatus(OrderStatusEnum.SHIPPED)}
                    >
                        {statusFilter === OrderStatusEnum.SHIPPED ? 'Đang Xem' : 'Xem Danh Sách'}
                    </Button>
                </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Khách Đã Nhận Hàng</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.DELIVERED}</div>
                    <Button
                        variant={statusFilter === OrderStatusEnum.DELIVERED ? "default" : "outline"}
                        className="mt-2"
                        onClick={() => onFilterByStatus(OrderStatusEnum.DELIVERED)}
                    >
                        {statusFilter === OrderStatusEnum.DELIVERED ? 'Đang Xem' : 'Xem Danh Sách'}
                    </Button>
                </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Đã Hủy</CardTitle>
                    <X className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
                    <Button
                        variant={statusFilter === OrderStatusEnum.CANCELLED ? "default" : "outline"}
                        className="mt-2"
                        onClick={() => onFilterByStatus(OrderStatusEnum.CANCELLED)}
                    >
                        {statusFilter === OrderStatusEnum.CANCELLED ? 'Đang Xem' : 'Xem Danh Sách'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
} 