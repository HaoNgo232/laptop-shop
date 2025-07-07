import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CartItemComponent } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { useCartStore } from '@/stores/cartStore'; // Thay đổi import
import { useAuthStore } from '@/stores/authStore';

export function CartPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const {
        cart,
        isLoading,
        error,
        updateCartItem,
        removeCartItem,
        clearCart,
        clearError
    } = useCartStore(); // Sử dụng Zustand store

    // Redirect nếu chưa đăng nhập
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', {
                state: { from: '/cart' },
                replace: true
            });
        }
    }, [isAuthenticated, navigate]);

    // Quay lại trang trước
    const handleGoBack = () => {
        navigate(-1);
    };

    // Handle clear cart với confirm
    const handleClearCart = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
            try {
                await clearCart();
            } catch (error) {
                console.error('Failed to clear cart:', error);
            }
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-4">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                                    ))}
                                </div>
                                <div className="h-64 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Nếu chưa login thì không render gì
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
                        <h1 className="text-2xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
                    </div>

                    {/* Error State */}
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertDescription className="flex justify-between items-center">
                                <span>{error}</span>
                                <Button variant="outline" size="sm" onClick={clearError}>
                                    Đóng
                                </Button>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Empty Cart */}
                    {!cart || cart.items.length === 0 ? (
                        <Card className="max-w-2xl mx-auto">
                            <CardHeader className="text-center">
                                <CardTitle>Giỏ hàng trống</CardTitle>
                                <CardDescription>
                                    Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá và thêm sản phẩm yêu thích!
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <Button onClick={() => navigate('/')}>
                                    Tiếp tục mua sắm
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        /* Cart with Items */
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">
                                        Sản phẩm ({cart.totalItems} sản phẩm)
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    {cart.items.map((item, index) => (
                                        <CartItemComponent
                                            key={`${item.product.id}-${index}`}
                                            item={item}
                                            onUpdateQuantity={updateCartItem}
                                            onRemoveItem={removeCartItem}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Cart Summary */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-6">
                                    <CartSummary
                                        cart={cart}
                                        onClearCart={handleClearCart}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 