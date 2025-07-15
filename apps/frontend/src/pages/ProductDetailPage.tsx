import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ReviewList } from '@/components/reviews/ReviewList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ProductNavigation } from '@/components/products/ProductNavigation';
import { ProductInfo } from '@/components/products/ProductInfo';
import { ProductFeatures } from '@/components/products/ProductFeatures';
import { useProductDetail } from '@/hooks/useProductDetail';

export function ProductDetailPage() {
    const {
        // Data
        product,
        currentUserReview,
        quantity,
        editingReview,
        cartSummary,

        // States
        isLoading,
        error,
        isAddingToCart,
        isAuthenticated,

        // Actions
        handleQuantityChange,
        handleAddToCart,
        handleBack,
        handleRetry,
        handleReviewSuccess,
        setEditingReview,
        navigate,
    } = useProductDetail();

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
                                    <Button onClick={handleRetry}>
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
                    {/* Navigation */}
                    <ProductNavigation
                        product={product}
                        onBack={handleBack}
                        onNavigate={navigate}
                    />

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
                        <ProductInfo
                            product={product}
                            quantity={quantity}
                            isAddingToCart={isAddingToCart}
                            isAuthenticated={isAuthenticated}
                            cartSummary={cartSummary}
                            onQuantityChange={handleQuantityChange}
                            onAddToCart={handleAddToCart}
                            onNavigate={navigate}
                        />
                    </div>

                    {/* Features and Specifications */}
                    <ProductFeatures product={product} />

                    {/* Reviews Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        {/* Review Form - chỉ hiển thị khi user đã đăng nhập */}
                        {isAuthenticated && (
                            <div className="lg:col-span-1">
                                <ReviewForm
                                    productId={product.id}
                                    existingReview={editingReview || currentUserReview}
                                    onSuccess={handleReviewSuccess}
                                    onCancel={() => setEditingReview(null)}
                                />
                            </div>
                        )}

                        {/* Review List */}
                        <div className={isAuthenticated ? "lg:col-span-2" : "lg:col-span-3"}>
                            <ReviewList
                                productId={product.id}
                                onEditReview={setEditingReview}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 