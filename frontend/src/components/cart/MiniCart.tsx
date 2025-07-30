import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';

export function MinCart() {
    const navigate = useNavigate();
    const { cartSummary } = useCartStore();

    const formatPrice = (price: number): string => {
        if (price >= 1000000) {
            return `${(price / 1000000).toFixed(1)}M`;
        } else if (price >= 1000) {
            return `${(price / 1000).toFixed(0)}K`;
        }
        return price.toString();
    };

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
            <ShoppingCart className="h-4 w-4" />

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