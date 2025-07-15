import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { OrderStatusEnum } from '@web-ecom/shared-types/orders/enums';

interface OrderStats {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
}

interface OrderStatsCardsProps {
    stats: OrderStats;
    statusFilter: OrderStatusEnum | 'all';
    onFilterByStatus: (status: OrderStatusEnum) => void;
    onClearFilter: () => void;
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
                    <CardTitle className="text-sm font-medium">Đang Xử Lý</CardTitle>
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
                    <CardTitle className="text-sm font-medium">Đã Giao</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
                    <Button
                        variant={statusFilter === OrderStatusEnum.DELIVERED ? "default" : "outline"}
                        className="mt-2"
                        onClick={() => onFilterByStatus(OrderStatusEnum.DELIVERED)}
                    >
                        {statusFilter === OrderStatusEnum.DELIVERED ? 'Đang Xem' : 'Xem Danh Sách'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
} 