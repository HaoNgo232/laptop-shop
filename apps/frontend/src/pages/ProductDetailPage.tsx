import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Minus, Star, Package, Truck, Shield } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@/utils/currency';

export function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const {
        selectedProduct: product,
        isLoading,
        error,
        fetchProductById,
        clearError
    } = useProductStore();
    const { addToCart, cartSummary } = useCartStore();

    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    // Load product detail khi component mount
    useEffect(() => {
        if (id) {
            fetchProductById(id);
        }
    }, [id, fetchProductById]);

    // Handle quantity change
    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= (product?.stockQuantity || 1)) {
            setQuantity(newQuantity);
        }
    };

    // Handle add to cart
    const handleAddToCart = async () => {
        if (!product || !isAuthenticated) return;

        try {
            setIsAddingToCart(true);
            await addToCart(product.id, quantity);

            // Show success message hoặc redirect
            console.log('🛒 Added to cart successfully');
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    // Handle back navigation
    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="animate-pulse">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                                <div className="space-y-4">
                                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <Card className="max-w-2xl mx-auto">
                            <CardContent className="text-center py-8">
                                <p className="text-red-600 mb-4">{error}</p>
                                <div className="space-x-2">
                                    <Button onClick={handleBack} variant="outline">
                                        Quay lại
                                    </Button>
                                    <Button onClick={() => {
                                        clearError();
                                        if (id) fetchProductById(id);
                                    }}>
                                        Thử lại
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        );
    }

    // Product not found
    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <Card className="max-w-2xl mx-auto">
                            <CardContent className="text-center py-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    Không tìm thấy sản phẩm
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                                </p>
                                <Button onClick={() => navigate('/products')}>
                                    Xem tất cả sản phẩm
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        );
    }

    // Main product detail content
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Breadcrumb */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBack}
                            className="flex items-center space-x-1 p-0 h-auto"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Quay lại</span>
                        </Button>
                        <span>/</span>
                        <span onClick={() => navigate('/products')} className="hover:text-primary cursor-pointer">
                            Sản phẩm
                        </span>
                        <span>/</span>
                        <span onClick={() => navigate(`/products?category=${product.category.id}`)} className="hover:text-primary cursor-pointer">
                            {product.category.name}
                        </span>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{product.name}</span>
                    </div>

                    {/* Product Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* Product Image */}
                        <div className="aspect-square">
                            <img
                                src={product.imageUrl || '/placeholder-product.jpg'}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg shadow-sm"
                                onError={(e) => {
                                    e.currentTarget.src = '/placeholder-product.jpg';
                                }}
                            />
                        </div>

                        {/* Product Info */}
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
                                                className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">(4.5 / 5 từ 24 đánh giá)</span>
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
                                                onClick={() => handleQuantityChange(-1)}
                                                disabled={quantity <= 1}
                                                className="h-10 w-10 p-0"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="w-12 text-center font-medium">{quantity}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleQuantityChange(1)}
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
                                                    onClick={handleAddToCart}
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
                                                    onClick={() => navigate('/cart')}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <span>Giỏ hàng ({cartSummary.totalItems})</span>
                                                </Button>
                                            </>
                                        ) : (
                                            <div className="w-full">
                                                <Button
                                                    onClick={() => navigate('/login')}
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
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <Card>
                            <CardContent className="flex items-center space-x-3 p-6">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Truck className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Miễn phí vận chuyển</h4>
                                    <p className="text-sm text-gray-600">Cho đơn hàng trên 500.000đ</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex items-center space-x-3 p-6">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Shield className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Bảo hành chính hãng</h4>
                                    <p className="text-sm text-gray-600">12 tháng toàn quốc</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex items-center space-x-3 p-6">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Package className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Đổi trả 7 ngày</h4>
                                    <p className="text-sm text-gray-600">Miễn phí đổi trả</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Product Specifications */}
                    <Card className="mb-12">
                        <CardHeader>
                            <CardTitle>Thông tin chi tiết</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Mã sản phẩm:</span>
                                        <span className="font-medium">{product.id.slice(0, 8).toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Danh mục:</span>
                                        <span className="font-medium">{product.category.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tình trạng:</span>
                                        <span className="font-medium">
                                            {product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Ngày tạo:</span>
                                        <span className="font-medium">
                                            {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Cập nhật:</span>
                                        <span className="font-medium">
                                            {new Date(product.updatedAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
} 