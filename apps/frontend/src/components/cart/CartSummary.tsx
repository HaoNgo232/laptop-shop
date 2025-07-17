
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Cart } from '@/types/cart';
import { useAuthStore } from '@/stores/authStore';
import { calculateDiscount } from '@/helpers/discount.helpers';

interface CartSummaryProps {
    cart: Cart;
    onClearCart?: () => Promise<void>;
}

export function CartSummary({ cart, onClearCart }: CartSummaryProps) {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    // Tính discount ở frontend
    const discountInfo = user && cart
        ? calculateDiscount(cart.totalPrice, user.rank)
        : null;

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

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
                        <span className="font-medium">{formatPrice(discountInfo?.originalAmount || cart.totalPrice)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span>Phí vận chuyển:</span>
                        <span className="font-medium">Miễn phí</span>
                    </div>

                    <hr className="my-3" />

                    {/* Hiển thị discount */}
                    {discountInfo && discountInfo.discountAmount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                            <span>Giảm giá (Hạng {discountInfo.userRank}):</span>
                            <span>-{formatPrice(discountInfo.discountAmount)} ({(discountInfo.discountPercentage * 100)}%)</span>
                        </div>
                    )}

                    <div className="flex justify-between text-lg font-bold">
                        <span>Tổng cộng:</span>
                        <span className="text-primary">{formatPrice(discountInfo?.finalAmount || cart.totalPrice)}</span>
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