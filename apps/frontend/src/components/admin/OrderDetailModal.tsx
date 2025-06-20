import React from 'react';
import { Order } from '@/types/order';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderStatusEnum, PaymentStatusEnum, PaymentMethodEnum } from '@web-ecom/shared-types/orders/enums';
import { Truck, CheckCircle, XCircle, User, MapPin, CreditCard, Package, Calendar } from 'lucide-react';

interface OrderDetailModalProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
}

export function OrderDetailModal({ order, isOpen, onClose }: OrderDetailModalProps) {
    if (!order) return null;

    const getStatusBadge = (status: OrderStatusEnum) => {
        const statusConfig = {
            [OrderStatusEnum.PENDING]: {
                variant: 'secondary' as const,
                label: 'Chờ xử lý',
                icon: null,
            },
            [OrderStatusEnum.PROCESSING]: {
                variant: 'default' as const,
                label: 'Đang xử lý',
                icon: <CheckCircle className="h-3 w-3" />,
            },
            [OrderStatusEnum.SHIPPED]: {
                variant: 'default' as const,
                label: 'Đang giao',
                icon: <Truck className="h-3 w-3" />,
            },
            [OrderStatusEnum.DELIVERED]: {
                variant: 'default' as const,
                label: 'Đã giao',
                icon: <CheckCircle className="h-3 w-3" />,
            },
            [OrderStatusEnum.CANCELLED]: {
                variant: 'destructive' as const,
                label: 'Đã hủy',
                icon: <XCircle className="h-3 w-3" />,
            },
        };

        const config = statusConfig[status];
        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
                {config.icon}
                {config.label}
            </Badge>
        );
    };

    const getPaymentStatusBadge = (status: PaymentStatusEnum) => {
        const statusConfig = {
            [PaymentStatusEnum.PENDING]: { variant: 'secondary' as const, label: 'Chưa thanh toán' },
            [PaymentStatusEnum.WAITING]: { variant: 'default' as const, label: 'Đang chờ' },
            [PaymentStatusEnum.PAID]: { variant: 'default' as const, label: 'Đã thanh toán' },
            [PaymentStatusEnum.FAILED]: { variant: 'destructive' as const, label: 'Thất bại' },
            [PaymentStatusEnum.REFUNDED]: { variant: 'secondary' as const, label: 'Đã hoàn tiền' },
            [PaymentStatusEnum.CANCELLED]: { variant: 'destructive' as const, label: 'Đã hủy' },
        };

        const config = statusConfig[status];
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const getPaymentMethodLabel = (method: PaymentMethodEnum) => {
        const methodLabels = {
            [PaymentMethodEnum.SEPAY_QR]: 'Chuyển khoản QR',
            [PaymentMethodEnum.COD]: 'Thanh toán khi nhận hàng',
            [PaymentMethodEnum.BANK_TRANSFER]: 'Chuyển khoản ngân hàng',
        };
        return methodLabels[method];
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

    // Cast order to get detailed info (because Order type might not have all fields)
    const orderDetail = order as any;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl lg:max-w-6xl xl:max-w-7xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Chi Tiết Đơn Hàng #{order.id.slice(-8)}
                    </DialogTitle>
                    <DialogDescription>
                        Thông tin chi tiết về đơn hàng và trạng thái xử lý
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Order Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Thông Tin Đơn Hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">ID:</span>
                                <span className="font-mono text-sm">#{order.id.slice(-8)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Ngày đặt:</span>
                                <span className="text-sm">{formatDate(order.orderDate)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Trạng thái:</span>
                                {getStatusBadge(order.status)}
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Tổng tiền:</span>
                                <span className="font-semibold text-lg">
                                    {formatCurrency(order.totalAmount)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Thông Tin Khách Hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Email:</span>
                                <span className="text-sm">{orderDetail.user?.email || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Tên:</span>
                                <span className="text-sm">{orderDetail.user?.username || 'Guest'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">SĐT:</span>
                                <span className="text-sm">{orderDetail.user?.phoneNumber || 'N/A'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Thông Tin Giao Hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">
                                {orderDetail.shippingAddress || 'Chưa có địa chỉ giao hàng'}
                            </p>
                            {orderDetail.note && (
                                <div className="mt-3 p-2 bg-gray-50 rounded-md">
                                    <span className="text-sm font-medium">Ghi chú:</span>
                                    <p className="text-sm text-gray-600 mt-1">{orderDetail.note}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                Thông Tin Thanh Toán
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Phương thức:</span>
                                <span className="text-sm">
                                    {orderDetail.paymentMethod
                                        ? getPaymentMethodLabel(orderDetail.paymentMethod)
                                        : 'N/A'
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Trạng thái:</span>
                                {orderDetail.paymentStatus
                                    ? getPaymentStatusBadge(orderDetail.paymentStatus)
                                    : <Badge variant="secondary">N/A</Badge>
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Items */}
                {orderDetail.items && orderDetail.items.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Sản Phẩm Đã Đặt</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {orderDetail.items.map((item: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            {item.product?.imageUrl && (
                                                <img
                                                    src={item.product.imageUrl}
                                                    alt={item.product.name}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                            )}
                                            <div>
                                                <h4 className="font-medium">
                                                    {item.product?.name || 'Sản phẩm không xác định'}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    Số lượng: {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">
                                                {formatCurrency(item.priceAtPurchase)}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Thành tiền: {formatCurrency(item.priceAtPurchase * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="flex justify-end">
                    <Button onClick={onClose}>Đóng</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
} 