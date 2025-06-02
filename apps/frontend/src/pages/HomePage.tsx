/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductList } from '@/components/ProductList';
import { SearchBar } from '@/components/SearchBar';
import { Header } from '@/components/layout/Header';
import { useAuthStore } from '@/stores/authStore';
import { useProductStore } from '@/stores/productStore';

export function HomePage() {

    const navigate = useNavigate();

    const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
    console.log('Auth state:', { isAuthenticated, authLoading, user: user?.username });

    const {
        products,
        isLoading: productsLoading,
        error: productsError,
        fetchProducts,
        searchProducts,
        clearError
    } = useProductStore();


    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearch = async (searchTerm: string) => {
        if (searchTerm.trim()) {
            await searchProducts(searchTerm);
        } else {
            await fetchProducts();
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Loading auth...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">

                    {/* Welcome Section cho User */}
                    {isAuthenticated && user && (
                        <Card className="max-w-2xl mx-auto mb-8">
                            <CardHeader>
                                <CardTitle>Chào mừng {user.username}!</CardTitle>
                                <CardDescription>
                                    Khám phá các sản phẩm tuyệt vời dưới đây
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex space-x-2">
                                    <Button onClick={() => navigate('/profile')}>
                                        Cập nhật thông tin
                                    </Button>
                                    <Button variant="outline">
                                        Xem đơn hàng
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Welcome Section cho Guest */}
                    {!isAuthenticated && (
                        <Card className="max-w-2xl mx-auto mb-8">
                            <CardHeader>
                                <CardTitle>Chào mừng đến với Web Ecommerce!</CardTitle>
                                <CardDescription>
                                    Khám phá hàng ngàn sản phẩm chất lượng với giá tốt nhất
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-center space-x-2">
                                    <Button onClick={() => navigate('/login')}>
                                        Đăng nhập
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate('/register')}
                                    >
                                        Đăng ký
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Search Bar */}
                    <div className="mb-8">
                        <SearchBar onSearch={handleSearch} />
                    </div>

                    {/* Products Section */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Sản phẩm</h2>
                            {productsError && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        clearError();
                                        fetchProducts();
                                    }}
                                >
                                    Thử lại
                                </Button>
                            )}
                        </div>

                        {/* Error State */}
                        {productsError && (
                            <Card className="max-w-2xl mx-auto">
                                <CardContent className="text-center py-6">
                                    <p className="text-red-600 mb-4">{productsError}</p>
                                    <Button onClick={() => {
                                        clearError();
                                        fetchProducts();
                                    }}>
                                        Thử lại
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Loading state debug */}
                        {productsLoading && (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                <p className="mt-2">Đang tải sản phẩm...</p>
                            </div>
                        )}

                        {/* Products List */}
                        {!productsError && !productsLoading && (
                            <ProductList
                                products={products}
                                isLoading={productsLoading}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
} 