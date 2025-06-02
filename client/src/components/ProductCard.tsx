import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import type { Product } from '@/types/product';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const { addToCart } = useCartStore();
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Xem chi tiết sản phẩm
    const handleViewDetails = () => {
        navigate(`/products/${product.id}`);
    };

    // Thêm vào giỏ hàng
    const handleAddToCart = async () => {
        // Kiểm tra đăng nhập trước
        if (!isAuthenticated) {
            navigate('/login', {
                state: {
                    from: '/',
                    message: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng'
                }
            });
            return;
        }

        try {
            setIsAddingToCart(true);
            await addToCart(product.id, 1); // Thêm 1 sản phẩm

            // Có thể hiển thị toast notification ở đây
            console.log('Đã thêm vào giỏ hàng:', product.name);
        } catch (error) {
            console.error('Failed to add to cart:', error);
            // Error đã được handle bởi CartContext
        } finally {
            setIsAddingToCart(false);
        }
    };

    return (
        <Card className="w-full max-w-sm mx-auto hover:shadow-lg transition-shadow">
            {/* Hình ảnh sản phẩm */}
            <div className="aspect-square overflow-hidden rounded-t-xl">
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
            </div>

            <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    {product.category.name}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Mô tả sản phẩm */}
                <p className="text-sm text-gray-600 line-clamp-3">
                    {product.description}
                </p>

                {/* Giá và số lượng tồn kho */}
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary">
                        {formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-gray-500">
                        Còn {product.stock_quantity} sản phẩm
                    </span>
                </div>

                {/* Buttons */}
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleViewDetails}
                        className="flex-1"
                    >
                        Xem chi tiết
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleAddToCart}
                        disabled={product.stock_quantity === 0 || isAddingToCart}
                        className="flex-1"
                    >
                        {isAddingToCart
                            ? 'Đang thêm...'
                            : product.stock_quantity === 0
                                ? 'Hết hàng'
                                : 'Thêm vào giỏ'
                        }
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
} 