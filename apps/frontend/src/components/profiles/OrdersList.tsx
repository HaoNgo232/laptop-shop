import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/currency';
import { OrderStatusEnum } from '@web-ecom/shared-types/orders/enums';
import type { Order } from '@/types/order';

interface OrdersListProps {
    orders: Order[];
    ordersLoading: boolean;
    ordersMessage: string;
    onOrderClick: (orderId: string) => void;
    onViewAllOrders: () => void;
    onGoShopping: () => void;
}

export const OrdersList = ({
    orders,
    ordersLoading,
    ordersMessage,
    onOrderClick,
    onViewAllOrders,
    onGoShopping
}: OrdersListProps) => {
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
                                onClick={() => onOrderClick(order.id)}
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
                                onClick={onViewAllOrders}
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
                        <Button onClick={onGoShopping}>
                            Mua sắm ngay
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}; 