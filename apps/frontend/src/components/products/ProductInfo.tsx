import { Star, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/currency';
import { formatRating, getRatingStars } from '@/utils/rating';
import type { Product } from '@/types/product';

interface ProductInfoProps {
    product: Product;
    quantity: number;
    isAddingToCart: boolean;
    isAuthenticated: boolean;
    cartSummary: { totalItems: number };
    onQuantityChange: (change: number) => void;
    onAddToCart: () => void;
    onNavigate: (path: string) => void;
}

export function ProductInfo({
    product,
    quantity,
    isAddingToCart,
    isAuthenticated,
    cartSummary,
    onQuantityChange,
    onAddToCart,
    onNavigate
}: ProductInfoProps) {
    return (
        <div className="space-y-6">
            {/* Title and Category */}
            <div>
                <Badge variant="secondary" className="mb-2">
                    {product.category.name}
                </Badge>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                </h1>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={`h-4 w-4 ${i < getRatingStars(product?.averageRating ?? 0)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-gray-600">
                        ({formatRating(product?.averageRating ?? 0, product?.reviewCount ?? 0)})
                    </span>
                </div>
            </div>

            {/* Price */}
            <div className="border-b pb-6">
                <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-primary">
                        {formatCurrency(product.price)}
                    </span>
                    <Badge variant={product.stockQuantity > 0 ? "default" : "destructive"}>
                        {product.stockQuantity > 0 ? `Còn ${product.stockQuantity} sản phẩm` : 'Hết hàng'}
                    </Badge>
                </div>
            </div>

            {/* Description */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mô tả sản phẩm</h3>
                <p className="text-gray-600 leading-relaxed">
                    {product.description}
                </p>
            </div>

            {/* Quantity and Add to Cart */}
            {product.stockQuantity > 0 && (
                <div className="border-t pt-6 space-y-4">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-900">Số lượng:</span>
                        <div className="flex items-center border rounded-md">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onQuantityChange(-1)}
                                disabled={quantity <= 1}
                                className="h-10 w-10 p-0"
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">{quantity}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onQuantityChange(1)}
                                disabled={quantity >= product.stockQuantity}
                                className="h-10 w-10 p-0"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <span className="text-sm text-gray-600">
                            (Tối đa {product.stockQuantity} sản phẩm)
                        </span>
                    </div>

                    <div className="flex space-x-3">
                        {isAuthenticated ? (
                            <>
                                <Button
                                    onClick={onAddToCart}
                                    disabled={isAddingToCart}
                                    className="flex-1 flex items-center space-x-2"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    <span>
                                        {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                                    </span>
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => onNavigate('/cart')}
                                    className="flex items-center space-x-2"
                                >
                                    <span>Giỏ hàng ({cartSummary.totalItems})</span>
                                </Button>
                            </>
                        ) : (
                            <div className="w-full">
                                <Button
                                    onClick={() => onNavigate('/login')}
                                    className="w-full flex items-center space-x-2"
                                >
                                    <span>Đăng nhập để mua hàng</span>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
} 