import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/currency';
import { OrderStatusEnum } from '@web-ecom/shared-types/orders/enums';
import type { Order } from '@/types/order';

interface OrdersListProps {
    readonly orders: Order[];
    readonly ordersLoading: boolean;
    readonly ordersMessage: string;
    readonly onOrderClick: (orderId: string) => void;
    readonly onViewAllOrders: () => void;
    readonly onGoShopping: () => void;
}

export const OrdersList = ({
    orders,
    ordersLoading,
    ordersMessage,
    onOrderClick,
    onViewAllOrders,
    onGoShopping
}: OrdersListProps) => {
    // Hàm này xử lý màu sắc status của đơn hàng
    // Tách riêng ra để dễ maintain và theo Single Responsibility Principle
    const getOrderStatusClasses = (status: OrderStatusEnum): string => {
        switch (status) {
            case OrderStatusEnum.DELIVERED:
                return 'bg-green-100 text-green-800'; // Xanh lá cho đã giao
            case OrderStatusEnum.PENDING:
                return 'bg-yellow-100 text-yellow-800'; // Vàng cho đang chờ
            default:
                return 'bg-gray-100 text-gray-800'; // Xám cho các trạng thái khác
        }
    };

    // Render nội dung chính của danh sách đơn hàng
    // Tách ra để component chính không quá dài và dễ đọc
    const renderOrdersContent = () => {
        // Loading state - hiện skeleton placeholders
        if (ordersLoading) {
            return (
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-3">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        // Empty state - khi chưa có đơn hàng nào
        if (orders.length === 0) {
            return (
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào</p>
                    <Button onClick={onGoShopping} variant="outline">
                        Bắt đầu mua sắm
                    </Button>
                </div>
            );
        }

        // Render danh sách đơn hàng với animation
        return (
            <div className="space-y-4">
                {orders.map((order, index) => (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }} // Staggered animation cho smooth effect
                        className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => onOrderClick(order.id)}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                {/* Hiện 8 ký tự đầu của order ID cho gọn */}
                                <p className="font-medium">
                                    Đơn hàng #{order.id.slice(0, 8)}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                            {/* Status badge với màu dynamic */}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getOrderStatusClasses(order.status)}`}>
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

                {/* Button xem tất cả ở cuối */}
                <div className="pt-4 border-t">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={onViewAllOrders}
                    >
                        Xem tất cả đơn hàng
                    </Button>
                </div>
            </div>
        );
    };

    return (
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
                {renderOrdersContent()}
            </CardContent>
        </Card>
    );
};