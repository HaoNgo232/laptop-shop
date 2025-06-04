import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';

export function MiniCart() {
    const navigate = useNavigate();
    // Sử dụng lại cartSummary từ store
    const { cartSummary } = useCartStore();

    // Xóa các dòng tính toán trực tiếp và log cũ liên quan đến 'cart' object
    // const cart = useCartStore(state => state.cart);
    // const totalItems = cart?.total_items || 0;
    // const totalPrice = cart?.total_price || 0;
    // console.log('MiniCart Render. Direct cart object:', cart);
    // console.log('MiniCart Render. Calculated totalItems:', totalItems);

    // Log mới để kiểm tra cartSummary
    console.log('MiniCart re-rendered with cartSummary:', cartSummary);

    // Format giá tiền ngắn gọn
    const formatPrice = (price: number): string => {
        if (price >= 1000000) {
            return `${(price / 1000000).toFixed(1)}M`;
        } else if (price >= 1000) {
            return `${(price / 1000).toFixed(0)}K`;
        }
        return price.toString();
    };

    // Điều hướng đến trang giỏ hàng
    const handleGoToCart = () => {
        navigate('/cart');
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleGoToCart}
            className="relative flex items-center space-x-2"
        >
            {/* Icon giỏ hàng */}
            <ShoppingCart className="h-4 w-4" />

            {/* Số lượng sản phẩm - sử dụng cartSummary.totalItems */}
            {cartSummary.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                    {cartSummary.totalItems > 99 ? '99+' : cartSummary.totalItems}
                </span>
            )}

            {/* Hiển thị giá trị giỏ hàng trên desktop - sử dụng cartSummary.totalItems và cartSummary.totalPrice */}
            <span className="hidden md:inline">
                {cartSummary.totalItems > 0
                    ? `${formatPrice(cartSummary.totalPrice)}đ`
                    : 'Giỏ hàng'
                }
            </span>
        </Button>
    );
} 