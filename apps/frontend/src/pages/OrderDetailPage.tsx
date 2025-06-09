import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, DollarSign, MapPin, CreditCard, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { orderService } from '@/services/orderService';
import { formatCurrency } from '@/utils/currency';
import type { OrderDetail } from '@/types/order';
import { OrderStatusEnum, PaymentStatusEnum } from '@web-ecom/shared-types/orders/enums';

export function OrderDetailPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, isLoading: authLoading } = useAuthStore();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect nếu chưa đăng nhập
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login', {
                state: { from: `/orders/${orderId}` },
                replace: true
            });
        }
    }, [authLoading, isAuthenticated, navigate, orderId]);

    // Load order detail
    useEffect(() => {
        const loadOrder = async () => {
            if (isAuthenticated && orderId) {
                try {
                    setIsLoading(true);
                    setError(null);
                    const orderDetail = await orderService.getOrderById(orderId);
                    setOrder(orderDetail);
                    console.log('📦 Order detail loaded:', orderDetail);
                } catch (error: any) {
                    setError(error.message || 'Không thể tải chi tiết đơn hàng');
                    setOrder(null);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadOrder();
    }, [isAuthenticated, orderId]);

    const handleGoBack = () => {
        navigate('/orders');
    };

    const getStatusBadge = (status: OrderStatusEnum) => {
        switch (status) {
            case OrderStatusEnum.DELIVERED:
                return <Badge className="bg-green-100 text-green-800">Đã giao</Badge>;
            case OrderStatusEnum.PENDING:
                return <Badge className="bg-yellow-100 text-yellow-800">Chờ xử lý</Badge>;
            case OrderStatusEnum.PROCESSING:
                return <Badge className="bg-blue-100 text-blue-800">Đang xử lý</Badge>;
            case OrderStatusEnum.SHIPPED:
                return <Badge className="bg-purple-100 text-purple-800">Đang giao</Badge>;
            case OrderStatusEnum.CANCELLED:
                return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getPaymentStatusIcon = (status: PaymentStatusEnum) => {
        switch (status) {
            case PaymentStatusEnum.PAID:
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case PaymentStatusEnum.PENDING:
            case PaymentStatusEnum.WAITING:
                return <Clock className="h-4 w-4 text-yellow-600" />;
            case PaymentStatusEnum.FAILED:
            case PaymentStatusEnum.CANCELLED:
                return <XCircle className="h-4 w-4 text-red-600" />;
            default:
                return <Clock className="h-4 w-4 text-gray-600" />;
        }
    };

    const getPaymentStatusText = (status: PaymentStatusEnum) => {
        switch (status) {
            case PaymentStatusEnum.PAID:
                return 'Đã thanh toán';
            case PaymentStatusEnum.PENDING:
                return 'Chờ thanh toán';
            case PaymentStatusEnum.WAITING:
                return 'Đang chờ thanh toán';
            case PaymentStatusEnum.FAILED:
                return 'Thanh toán thất bại';
            case PaymentStatusEnum.CANCELLED:
                return 'Đã hủy thanh toán';
            default:
                return status;
        }
    };

    // Not authenticated
    if (!isAuthenticated && !authLoading) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Header */}
                    <div className="flex items-center space-x-4 mb-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleGoBack}
                            className="flex items-center space-x-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Quay lại</span>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
                            {order && (
                                <p className="text-sm text-gray-600 mt-1">
                                    Đơn hàng #{order.id.slice(0, 8)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="space-y-6">
                            <Card className="animate-pulse">
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <Card className="max-w-2xl mx-auto">
                            <CardContent className="text-center py-6">
                                <XCircle className="h-16 w-16 text-red-300 mx-auto mb-4" />
                                <p className="text-red-600 mb-4">{error}</p>
                                <Button onClick={() => window.location.reload()}>Thử lại</Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Order Detail */}
                    {!isLoading && !error && order && (
                        <div className="space-y-6">
                            {/* Order Summary */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center space-x-2">
                                            <Package className="h-5 w-5" />
                                            <span>Thông tin đơn hàng</span>
                                        </CardTitle>
                                        {getStatusBadge(order.status)}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600">Ngày đặt hàng</p>
                                                <p className="font-medium">
                                                    {new Date(order.orderDate).toLocaleDateString('vi-VN', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <DollarSign className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600">Tổng tiền</p>
                                                <p className="font-bold text-lg text-primary">
                                                    {formatCurrency(order.totalAmount)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <CreditCard className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600">Phương thức thanh toán</p>
                                                <div className="flex items-center space-x-2">
                                                    {getPaymentStatusIcon(order.paymentStatus)}
                                                    <span className="font-medium">{order.paymentMethod}</span>
                                                    <span className="text-sm text-gray-500">
                                                        ({getPaymentStatusText(order.paymentStatus)})
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600">Địa chỉ giao hàng</p>
                                                <p className="font-medium">{order.shippingAddress}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {order.note && (
                                        <div className="flex items-start space-x-3 pt-4 border-t">
                                            <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-600">Ghi chú</p>
                                                <p className="text-sm">{order.note}</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Order Items */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sản phẩm đã đặt</CardTitle>
                                    <CardDescription>
                                        {order.items.length} sản phẩm trong đơn hàng này
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                                                {item.product.imageUrl && (
                                                    <img
                                                        src={item.product.imageUrl}
                                                        alt={item.product.name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <h4 className="font-medium">{item.product.name}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        Giá: {formatCurrency(item.priceAtPurchase)}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Số lượng: {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">
                                                        {formatCurrency(item.priceAtPurchase * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total */}
                                    <div className="border-t pt-4 mt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-medium">Tổng cộng:</span>
                                            <span className="text-xl font-bold text-primary">
                                                {formatCurrency(order.totalAmount)}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
} 