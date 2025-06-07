
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Cart } from '@/types/cart';

interface CartSummaryProps {
    cart: Cart;
    onClearCart?: () => Promise<void>;
}

export function CartSummary({ cart, onClearCart }: CartSummaryProps) {
    const navigate = useNavigate();

    // Format giá tiền
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Điều hướng đến trang thanh toán
    const handleCheckout = () => {
        navigate('/checkout');
    };

    // Tiếp tục mua sắm
    const handleContinueShopping = () => {
        navigate('/');
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Thông tin tổng kết */}
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span>Số lượng sản phẩm:</span>
                        <span className="font-medium">{cart.totalItems} sản phẩm</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span>Tạm tính:</span>
                        <span className="font-medium">{formatPrice(cart.totalPrice)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span>Phí vận chuyển:</span>
                        <span className="font-medium">Miễn phí</span>
                    </div>

                    <hr className="my-3" />

                    <div className="flex justify-between text-lg font-bold">
                        <span>Tổng cộng:</span>
                        <span className="text-primary">{formatPrice(cart.totalPrice)}</span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                    {/* Nút thanh toán */}
                    <Button
                        onClick={handleCheckout}
                        className="w-full "
                        size="lg"
                        disabled={cart.items.length === 0}
                    >
                        Đi đến thanh toán
                    </Button>

                    {/* Nút tiếp tục mua sắm */}
                    <Button
                        variant="outline"
                        onClick={handleContinueShopping}
                        className="w-full"
                    >
                        Tiếp tục mua sắm
                    </Button>

                    {/* Nút xóa giỏ hàng */}
                    {onClearCart && cart.items.length > 0 && (
                        <Button
                            variant="destructive"
                            onClick={onClearCart}
                            className="w-full primary hover:text-amber-300"
                            size="sm"
                        >
                            Xóa toàn bộ giỏ hàng
                        </Button>
                    )}
                </div>

                {/* Ghi chú */}
                <div className="text-xs text-gray-500 mt-4">
                    <p>• Miễn phí vận chuyển cho đơn hàng từ 500.000đ</p>
                    <p>• Giá đã bao gồm VAT</p>
                </div>
            </CardContent>
        </Card>
    );
} 