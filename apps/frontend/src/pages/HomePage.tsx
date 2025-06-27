import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { useAuthStore } from '@/stores/authStore';
import { useProductStore } from '@/stores/productStore';
import {
    ShoppingBag, Package, User, Star,
    ArrowRight, Shield, Truck, ChevronLeft, ChevronRight,
    Tag, Search, Phone,
    ShoppingCart
} from 'lucide-react';

export function HomePage() {
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
    const { products, categories, fetchProducts, fetchCategories } = useProductStore();

    // Stats từ database thực tế (có thể lấy từ API)
    const [stats] = useState({
        totalUsers: 12340,
        totalProducts: 1250,
        totalOrders: 5680,
        satisfaction: 4.7
    });

    // Featured products
    const [currentSlide, setCurrentSlide] = useState(0);
    const featuredProducts = products.slice(0, 8);

    useEffect(() => {
        fetchProducts({ limit: 8 });
        fetchCategories();
    }, []);

    // Auto-slide (slower for ecommerce)
    useEffect(() => {
        if (featuredProducts.length > 0) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % Math.ceil(featuredProducts.length / 4));
            }, 8000); // Slower auto-slide
            return () => clearInterval(timer);
        }
    }, [featuredProducts.length]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <span className="mt-4 block text-gray-600">Đang tải...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 space-y-8">

                    {/* Welcome Section cho User */}
                    {isAuthenticated && user && (
                        <div className="space-y-6">
                            {/* Simple Welcome Card */}
                            <Card className="bg-white border border-gray-200 shadow-sm">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-xl font-semibold text-gray-900">
                                                Xin chào, {user.username}! 👋
                                            </CardTitle>
                                            <CardDescription className="text-gray-600 mt-1">
                                                Chúc bạn có một ngày mua sắm vui vẻ
                                            </CardDescription>
                                        </div>
                                        <Badge variant="outline" className="hidden sm:block">
                                            {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <Button
                                            variant="outline"
                                            className="h-auto py-3 flex-col space-y-1 hover:bg-blue-50 hover:border-blue-300"
                                            onClick={() => navigate('/products')}
                                        >
                                            <ShoppingBag className="h-5 w-5 text-blue-600" />
                                            <span className="text-sm">Sản phẩm</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-auto py-3 flex-col space-y-1 hover:bg-green-50 hover:border-green-300"
                                            onClick={() => navigate('/orders')}
                                        >
                                            <Package className="h-5 w-5 text-green-600" />
                                            <span className="text-sm">Đơn hàng</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-auto py-3 flex-col space-y-1 hover:bg-purple-50 hover:border-purple-300"
                                            onClick={() => navigate('/profile')}
                                        >
                                            <User className="h-5 w-5 text-purple-600" />
                                            <span className="text-sm">Tài khoản</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-auto py-3 flex-col space-y-1 hover:bg-red-50 hover:border-red-300"
                                            onClick={() => navigate('/cart')}
                                        >
                                            <ShoppingCart className="h-5 w-5 text-red-600" />
                                            <span className="text-sm">Giỏ hàng</span>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Welcome Banner cho Guest */}
                    {!isAuthenticated && (
                        <Card className="bg-gray-600 text-white border-0">
                            <CardContent className="py-12 text-center">
                                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                    Web Ecommerce
                                </h1>
                                <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
                                    Cửa hàng trực tuyến uy tín với hàng ngàn sản phẩm chính hãng,
                                    giao hàng nhanh chóng, giá cả hợp lý
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button
                                        className="bg-white text-blue-950 hover:bg-gray-600 hover:text-white"
                                        onClick={() => navigate('/register')}
                                    >
                                        Đăng ký tài khoản
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className=" bg-white text-blue-950 hover:bg-gray-600 hover:text-white"
                                        onClick={() => navigate('/login')}
                                    >
                                        Đăng nhập
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className=" bg-white text-blue-950 hover:bg-gray-600 hover:text-white"
                                        onClick={() => navigate('/products')}
                                    >
                                        <Search className="mr-2 h-4 w-4" />
                                        Xem sản phẩm
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Quick Stats */}
                    <Card className="bg-white border border-gray-200">
                        <CardContent className="py-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div className="space-y-1">
                                    <div className="text-2xl font-bold text-blue-600">{stats.totalUsers.toLocaleString()}+</div>
                                    <div className="text-gray-600 text-sm">Khách hàng</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-2xl font-bold text-green-600">{stats.totalProducts.toLocaleString()}+</div>
                                    <div className="text-gray-600 text-sm">Sản phẩm</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-2xl font-bold text-purple-600">{stats.totalOrders.toLocaleString()}+</div>
                                    <div className="text-gray-600 text-sm">Đơn hàng</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                                        {stats.satisfaction}/5 <Star className="h-5 w-5 fill-current" />
                                    </div>
                                    <div className="text-gray-600 text-sm">Đánh giá</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Categories Grid */}
                    {categories.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">Danh mục sản phẩm</h2>
                                <Button variant="ghost" onClick={() => navigate('/categories')}>
                                    Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {categories.slice(0, 12).map((category) => (
                                    <Card
                                        key={category.id}
                                        className="hover:shadow-md transition-shadow cursor-pointer bg-white border hover:bg-gray-400 hover:text-white border-gray-200"
                                        onClick={() => navigate(`/products?category=${category.id}`)}
                                    >
                                        <CardContent className="p-4 text-center">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                                                <Tag className="h-6 w-6 text-gray-600" />
                                            </div>
                                            <h3 className="font-medium text-sm text-gray-900 transition-colors">
                                                {category.name}
                                            </h3>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Featured Products */}
                    {featuredProducts.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">Sản phẩm nổi bật</h2>
                                <Button variant="ghost" onClick={() => navigate('/products')}>
                                    Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
                                </Button>
                            </div>
                            <div className="relative">
                                <div className="overflow-hidden">
                                    <div
                                        className="flex transition-transform duration-300 ease-in-out"
                                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                    >
                                        {Array.from({ length: Math.ceil(featuredProducts.length / 4) }).map((_, slideIndex) => (
                                            <div key={slideIndex} className="w-full flex-shrink-0">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {featuredProducts.slice(slideIndex * 4, (slideIndex + 1) * 4).map((product) => (
                                                        <Card key={product.id} className="hover:shadow-accent-foreground transition-shadow cursor-pointer bg-white border border-gray-200">
                                                            <CardContent className="p-4">
                                                                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                                                                    <img
                                                                        src={product.imageUrl || '/placeholder-product.png'}
                                                                        alt={product.name}
                                                                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                                                                    />
                                                                </div>
                                                                <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2">
                                                                    {product.name}
                                                                </h3>
                                                                <p className="text-lg font-semibold mb-2">
                                                                    {product.price.toLocaleString('vi-VN')}đ
                                                                </p>
                                                                <Badge variant="secondary" className="text-xs mb-2">
                                                                    {product.category.name}
                                                                </Badge>
                                                                <Button
                                                                    size="sm"
                                                                    className="w-full"
                                                                    onClick={() => navigate(`/products/${product.id}`)}
                                                                >
                                                                    Xem chi tiết
                                                                </Button>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Simple Carousel Controls */}
                                {Math.ceil(featuredProducts.length / 4) > 1 && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md"
                                            onClick={() => setCurrentSlide((prev) => (prev - 1 + Math.ceil(featuredProducts.length / 4)) % Math.ceil(featuredProducts.length / 4))}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md"
                                            onClick={() => setCurrentSlide((prev) => (prev + 1) % Math.ceil(featuredProducts.length / 4))}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Service Features */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="bg-white border border-gray-200">
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                    <Truck className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="font-semibold mb-2">Giao hàng nhanh</h3>
                                <p className="text-gray-600 text-sm">
                                    Giao hàng trong 24h tại TP.HCM và Hà Nội
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border border-gray-200">
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                    <Shield className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="font-semibold mb-2">Đảm bảo chất lượng</h3>
                                <p className="text-gray-600 text-sm">
                                    100% hàng chính hãng, đổi trả trong 7 ngày
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border border-gray-200">
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                    <Phone className="h-6 w-6 text-purple-600" />
                                </div>
                                <h3 className="font-semibold mb-2">Hỗ trợ 24/7</h3>
                                <p className="text-gray-600 text-sm">
                                    Đội ngũ tư vấn nhiệt tình, sẵn sàng hỗ trợ
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Simple Newsletter */}
                    <Card className="bg-gray-800 text-white">
                        <CardContent className="py-8 text-center">
                            <h3 className="text-xl font-semibold mb-2">Nhận thông tin ưu đãi</h3>
                            <p className="text-gray-300 mb-4">
                                Đăng ký để nhận thông báo về sản phẩm mới và khuyến mãi
                            </p>
                            <div className="max-w-md mx-auto flex gap-2 ">
                                <input
                                    type="email"
                                    placeholder="Email của bạn"
                                    className="flex-1 px-3 py-2 rounded text-gray-50 text-sm border-1 border-amber-50"
                                />
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    Đăng ký
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
} 