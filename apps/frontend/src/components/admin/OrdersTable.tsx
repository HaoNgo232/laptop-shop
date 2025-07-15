import React from 'react';
import { Order } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, MoreHorizontal, Edit, Truck, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { OrderStatusEnum } from '@web-ecom/shared-types/orders/enums';
import { cn } from '@/lib/utils';

interface OrdersTableProps {
    orders: Order[];
    onView: (order: Order) => void;
    onUpdateStatus: (order: Order) => void;
    isLoading?: boolean;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
}

export function OrdersTable({
    orders,
    onView,
    onUpdateStatus,
    isLoading = false,
    currentPage = 1,
    totalPages = 1,
    onPageChange
}: OrdersTableProps) {
    const getStatusBadge = (status: OrderStatusEnum) => {
        // Phối màu badge cho dễ nhìn, phân biệt rõ trạng thái
        // Thêm cả màu hover cho background và text cho badge trạng thái
        const statusConfig = {
            [OrderStatusEnum.PENDING]: {
                label: 'Chờ xử lý',
                icon: null,
                className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            },
            [OrderStatusEnum.PROCESSING]: {
                label: 'Đang xử lý',
                icon: <CheckCircle className="h-3 w-3" />,
                className: 'bg-blue-100 text-blue-800 border-blue-200',
            },
            [OrderStatusEnum.SHIPPED]: {
                label: 'Đã giao cho vận chuyển',
                icon: <Truck className="h-3 w-3" />,
                className: 'bg-purple-100 text-purple-800 border-purple-200',
            },
            [OrderStatusEnum.DELIVERED]: {
                label: 'Khách đã nhận hàng',
                icon: <CheckCircle className="h-3 w-3" />,
                className: 'bg-green-100 text-green-800 border-green-200',
            },
            [OrderStatusEnum.CANCELLED]: {
                label: 'Đã hủy',
                icon: <XCircle className="h-3 w-3" />,
                className: 'bg-rose-50 text-rose-700 border-rose-200',
            },
        };

        const config = statusConfig[status];
        return (
            <Badge variant="outline" className={cn("flex items-center gap-1", config.className)}>
                {config.icon}
                {config.label}
            </Badge>
        );
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID Đơn Hàng</TableHead>
                            <TableHead>Ngày Đặt</TableHead>
                            <TableHead>Khách Hàng</TableHead>
                            <TableHead>Tổng Tiền</TableHead>
                            <TableHead>Trạng Thái</TableHead>
                            <TableHead className="text-right">Thao Tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                </TableCell>
                                <TableCell>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                </TableCell>
                                <TableCell>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                </TableCell>
                                <TableCell>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                </TableCell>
                                <TableCell>
                                    <div className="h-6 bg-gray-200 rounded animate-pulse" />
                                </TableCell>
                                <TableCell>
                                    <div className="h-8 bg-gray-200 rounded animate-pulse" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="border rounded-lg p-8 text-center">
                <p className="text-gray-500">Không có đơn hàng nào được tìm thấy</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID Đơn Hàng</TableHead>
                            <TableHead>Ngày Đặt</TableHead>
                            <TableHead>Khách Hàng</TableHead>
                            <TableHead>Tổng Tiền</TableHead>
                            <TableHead>Trạng Thái</TableHead>
                            <TableHead className="text-right">Thao Tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono text-sm">
                                    #{order.id.slice(-8)}
                                </TableCell>
                                <TableCell>{formatDate(order.orderDate)}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            {(order as any).user?.email || 'N/A'}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {(order as any).user?.username || 'Guest'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-semibold">
                                    {formatCurrency(order.totalAmount)}
                                </TableCell>
                                <TableCell>{getStatusBadge(order.status)}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onView(order)}>
                                                <Eye className="h-4 w-4 mr-2" />
                                                Xem Chi Tiết
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onUpdateStatus(order)}>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Cập Nhật Trạng Thái
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Trang {currentPage} / {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange?.(currentPage - 1)}
                            disabled={currentPage <= 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Trước
                        </Button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = Math.max(1, currentPage - 2) + i;
                            if (pageNum > totalPages) return null;

                            return (
                                <Button
                                    key={pageNum}
                                    variant={pageNum === currentPage ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onPageChange?.(pageNum)}
                                >
                                    {pageNum}
                                </Button>
                            );
                        })}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange?.(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                        >
                            Sau
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
} 