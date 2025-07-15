import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { OrderStatusEnum } from '@web-ecom/shared-types/orders/enums';

interface OrderFiltersProps {
    searchTerm: string;
    statusFilter: OrderStatusEnum | 'all';
    onSearchChange: (value: string) => void;
    onStatusChange: (value: OrderStatusEnum | 'all') => void;
}

// Helper function để get status label
function getStatusLabel(status: OrderStatusEnum): string {
    const statusLabels = {
        [OrderStatusEnum.PENDING]: 'Chờ xử lý',
        [OrderStatusEnum.PROCESSING]: 'Đang xử lý',
        [OrderStatusEnum.SHIPPED]: 'Đang giao',
        [OrderStatusEnum.DELIVERED]: 'Đã giao',
        [OrderStatusEnum.CANCELLED]: 'Đã hủy'
    };
    return statusLabels[status] || status;
}

export function OrderFilters({
    searchTerm,
    statusFilter,
    onSearchChange,
    onStatusChange
}: OrderFiltersProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Bộ Lọc và Tìm Kiếm
                    {/* Hiển thị trạng thái filter hiện tại */}
                    {statusFilter !== 'all' && (
                        <Badge variant="default" className="ml-2">
                            Đang lọc: {getStatusLabel(statusFilter)}
                        </Badge>
                    )}
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
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <Select value={statusFilter} onValueChange={onStatusChange}>
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
    );
} 