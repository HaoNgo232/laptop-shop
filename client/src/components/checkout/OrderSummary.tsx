import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/currency';
import { Package } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

interface OrderSummaryProps {
    className?: string;
}

export function OrderSummary({ className }: OrderSummaryProps) {
    const { cart } = useCartStore();

    if (!cart || cart.items.length === 0) {
        return (
            <Card className={className}>
                <CardContent className="text-center py-8">
                    <p className="text-gray-500">Giỏ hàng trống</p>
                </CardContent>
            </Card>
        );
    }

    const shippingFee = 0;
    const tax = 0;
    const finalTotal = cart.total_price + shippingFee + tax;

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Tóm tắt đơn hàng</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Items List */}
                <div className="space-y-3">
                    {cart.items.map((item) => (
                        <div key={item.product.id} className="flex items-center space-x-3">
                            <img
                                src={item.product.image_url}
                                alt={item.product.name}
                                className="w-12 h-12 object-cover rounded-md"
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                    {item.product.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    {item.product.category.name}
                                </p>
                            </div>
                            <div className="text-right">
                                <Badge variant="outline" className="mb-1">
                                    x{item.quantity}
                                </Badge>
                                <p className="text-sm font-medium">
                                    {formatCurrency(item.price_at_addition * item.quantity)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <hr />

                {/* Summary */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Tạm tính ({cart.total_items} sản phẩm):</span>
                        <span>{formatCurrency(cart.total_price)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Phí vận chuyển:</span>
                        <span className="text-green-600">Miễn phí</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>VAT:</span>
                        <span>Đã bao gồm</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                        <span>Tổng cộng:</span>
                        <span className="text-primary">{formatCurrency(finalTotal)}</span>
                    </div>
                </div>

                {/* Notes */}
                <div className="text-xs text-gray-500 space-y-1">
                    <p>• Giá đã bao gồm VAT</p>
                    <p>• Miễn phí vận chuyển toàn quốc</p>
                    <p>• Giao hàng trong 1-3 ngày làm việc</p>
                </div>
            </CardContent>
        </Card>
    );
} 