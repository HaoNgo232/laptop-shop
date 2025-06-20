import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { useAuthStore } from '@/stores/authStore';
import { useProductStore } from '@/stores/productStore';
import {
    ShoppingBag, Package, User, Heart, Star, TrendingUp,
    ArrowRight, Users, Shield, Truck, Clock, ChevronLeft, ChevronRight,
    Sparkles, Gift, MessageCircle, Award, Crown, Zap
} from 'lucide-react';

export function HomePage() {
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
    const { products, categories, fetchProducts, fetchCategories } = useProductStore();

    // Stats state
    const [stats] = useState({
        totalUsers: 15420,
        totalProducts: 2840,
        totalOrders: 8590,
        satisfaction: 4.8
    });

    // Featured products carousel state
    const [currentSlide, setCurrentSlide] = useState(0);
    const featuredProducts = products.slice(0, 6);

    useEffect(() => {
        fetchProducts({ limit: 6 });
        fetchCategories();
    }, []);

    // Auto-slide for carousel
    useEffect(() => {
        if (featuredProducts.length > 0) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % Math.ceil(featuredProducts.length / 3));
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [featuredProducts.length]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <span className="mt-4 block text-gray-600">Đang tải...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <Header />

            <main className="max-w-6xl mx-auto py-8 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 space-y-12">

                    {/* Welcome Section cho User đã đăng nhập */}
                    {isAuthenticated && user && (
                        <div className="space-y-8">
                            {/* Personal Welcome Card */}
                            <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-xl">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                                Xin chào, {user.username}!
                                                <Crown className="h-6 w-6 text-yellow-300" />
                                            </CardTitle>
                                            <CardDescription className="text-indigo-100 mt-2">
                                                Chúc bạn có một ngày tuyệt vời cùng Web Ecommerce
                                            </CardDescription>
                                        </div>
                                        <div className="hidden sm:block">
                                            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                                                {user.role === 'admin' ? 'Quản trị viên' : 'Thành viên VIP'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <Button
                                            variant="ghost"
                                            className="bg-white/10 hover:bg-white/20 text-white border-white/30 h-auto py-4 flex-col space-y-2 transition-all hover:scale-105"
                                            onClick={() => navigate('/products')}
                                        >
                                            <ShoppingBag className="h-6 w-6" />
                                            <span className="text-sm">Mua sắm</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="bg-white/10 hover:bg-white/20 text-white border-white/30 h-auto py-4 flex-col space-y-2 transition-all hover:scale-105"
                                            onClick={() => navigate('/orders')}
                                        >
                                            <Package className="h-6 w-6" />
                                            <span className="text-sm">Đơn hàng</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="bg-white/10 hover:bg-white/20 text-white border-white/30 h-auto py-4 flex-col space-y-2 transition-all hover:scale-105"
                                            onClick={() => navigate('/profile')}
                                        >
                                            <User className="h-6 w-6" />
                                            <span className="text-sm">Hồ sơ</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="bg-white/10 hover:bg-white/20 text-white border-white/30 h-auto py-4 flex-col space-y-2 transition-all hover:scale-105"
                                            onClick={() => navigate('/cart')}
                                        >
                                            <Heart className="h-6 w-6" />
                                            <span className="text-sm">Yêu thích</span>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Activity for Logged Users */}
                            <Card className="bg-gradient-to-r from-emerald-50 to-cyan-50 border-emerald-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-emerald-700">
                                        <Sparkles className="h-5 w-5" />
                                        Hoạt động gần đây
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span className="text-sm">Bạn có 2 sản phẩm mới trong wishlist</span>
                                            <Badge variant="outline" className="ml-auto">Mới</Badge>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span className="text-sm">Đơn hàng #12345 đang được giao</span>
                                            <Badge variant="outline" className="ml-auto">Đang giao</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Welcome Section cho Guest */}
                    {!isAuthenticated && (
                        <div className="text-center">
                            {/* Hero Banner */}
                            <Card className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-700 text-white border-0 shadow-2xl overflow-hidden relative">
                                <div className="absolute inset-0 bg-black/10"></div>
                                <CardContent className="py-16 relative z-10">
                                    <div className="max-w-3xl mx-auto">
                                        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-pulse">
                                            Chào mừng đến với
                                            <span className="block text-yellow-300 text-5xl md:text-7xl">Web Ecommerce</span>
                                        </h1>
                                        <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
                                            🎉 Khám phá hàng ngàn sản phẩm chất lượng với giá tốt nhất.
                                            Trải nghiệm mua sắm trực tuyến tuyệt vời cùng chúng tôi!
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <Button
                                                size="lg"
                                                className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg transition-all hover:scale-105"
                                                onClick={() => navigate('/register')}
                                            >
                                                <Gift className="mr-2 h-5 w-5" />
                                                Đăng ký ngay - Nhận ưu đãi
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                className="border-white text-white hover:bg-white hover:text-indigo-600 font-semibold px-8 py-4 text-lg transition-all hover:scale-105"
                                                onClick={() => navigate('/login')}
                                            >
                                                Đăng nhập
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Stats Section */}
                    <Card className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
                        <CardHeader>
                            <CardTitle className="text-center text-2xl font-bold">
                                Tại sao khách hàng tin tưởng chúng tôi?
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                <div className="space-y-2">
                                    <div className="text-3xl font-bold text-yellow-400">{stats.totalUsers.toLocaleString()}+</div>
                                    <div className="text-slate-300 text-sm">Khách hàng tin tưởng</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-3xl font-bold text-green-400">{stats.totalProducts.toLocaleString()}+</div>
                                    <div className="text-slate-300 text-sm">Sản phẩm chất lượng</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-3xl font-bold text-blue-400">{stats.totalOrders.toLocaleString()}+</div>
                                    <div className="text-slate-300 text-sm">Đơn hàng đã giao</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-3xl font-bold text-purple-400 flex items-center justify-center gap-1">
                                        {stats.satisfaction}/5 <Star className="h-6 w-6 fill-current" />
                                    </div>
                                    <div className="text-slate-300 text-sm">Đánh giá trung bình</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Categories Preview */}
                    {categories.length > 0 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Danh mục sản phẩm</h2>
                                <p className="text-gray-600">Khám phá các danh mục sản phẩm hot nhất</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {categories.slice(0, 8).map((category, index) => (
                                    <Card
                                        key={category.id}
                                        className="hover:shadow-lg transition-all cursor-pointer group hover:scale-105"
                                        onClick={() => navigate(`/products?category=${category.id}`)}
                                    >
                                        <CardContent className="p-6 text-center">
                                            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${['bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100', 'bg-pink-100', 'bg-indigo-100', 'bg-cyan-100'][index % 8]
                                                }`}>
                                                <TrendingUp className={`h-8 w-8 ${['text-red-600', 'text-blue-600', 'text-green-600', 'text-yellow-600', 'text-purple-600', 'text-pink-600', 'text-indigo-600', 'text-cyan-600'][index % 8]
                                                    }`} />
                                            </div>
                                            <h3 className="font-semibold group-hover:text-indigo-600 transition-colors">{category.name}</h3>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            <div className="text-center">
                                <Button variant="outline" onClick={() => navigate('/categories')}>
                                    Xem tất cả danh mục <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Featured Products Carousel */}
                    {featuredProducts.length > 0 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                                    <Zap className="h-8 w-8 text-yellow-500" />
                                    Sản phẩm nổi bật
                                </h2>
                                <p className="text-gray-600">Những sản phẩm hot nhất hiện nay</p>
                            </div>
                            <div className="relative">
                                <div className="overflow-hidden rounded-lg">
                                    <div
                                        className="flex transition-transform duration-500 ease-in-out"
                                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                    >
                                        {Array.from({ length: Math.ceil(featuredProducts.length / 3) }).map((_, slideIndex) => (
                                            <div key={slideIndex} className="w-full flex-shrink-0">
                                                <div className="grid md:grid-cols-3 gap-6 px-2">
                                                    {featuredProducts.slice(slideIndex * 3, (slideIndex + 1) * 3).map((product) => (
                                                        <Card key={product.id} className="hover:shadow-xl transition-all cursor-pointer group hover:scale-105">
                                                            <CardContent className="p-4">
                                                                <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                                                                    <img
                                                                        src={product.imageUrl || '/placeholder-product.png'}
                                                                        alt={product.name}
                                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                                    />
                                                                </div>
                                                                <h3 className="font-semibold mb-2 group-hover:text-indigo-600 transition-colors">
                                                                    {product.name}
                                                                </h3>
                                                                <p className="text-2xl font-bold text-indigo-600 mb-2">
                                                                    {product.price.toLocaleString('vi-VN')}đ
                                                                </p>
                                                                <Badge variant="secondary" className="mb-3">
                                                                    {product.category.name}
                                                                </Badge>
                                                                <Button
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

                                {/* Carousel Controls */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                                    onClick={() => setCurrentSlide((prev) => (prev - 1 + Math.ceil(featuredProducts.length / 3)) % Math.ceil(featuredProducts.length / 3))}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                                    onClick={() => setCurrentSlide((prev) => (prev + 1) % Math.ceil(featuredProducts.length / 3))}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Features Section */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-br from-green-50 to-emerald-100">
                            <CardHeader className="text-center">
                                <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                                    <Star className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-green-700">Sản phẩm chất lượng</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <CardDescription>
                                    100% hàng chính hãng, được tuyển chọn kỹ lưỡng từ các thương hiệu uy tín hàng đầu thế giới
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-br from-blue-50 to-cyan-100">
                            <CardHeader className="text-center">
                                <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                                    <Truck className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-blue-700">Giao hàng siêu tốc</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <CardDescription>
                                    Giao hàng trong 2-4 giờ nội thành, 24-48 giờ toàn quốc. Miễn phí ship cho đơn từ 300k
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-br from-purple-50 to-pink-100">
                            <CardHeader className="text-center">
                                <div className="mx-auto w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-purple-700">Bảo hành tận tâm</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <CardDescription>
                                    Đội ngũ hỗ trợ 24/7, đổi trả trong 30 ngày, bảo hành chính hãng toàn quốc
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Testimonials Section */}
                    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
                        <CardHeader>
                            <CardTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
                                <MessageCircle className="h-6 w-6 text-indigo-600" />
                                Khách hàng nói gì về chúng tôi?
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-6">
                                {[
                                    { name: "Anh Minh", comment: "Sản phẩm chất lượng, giao hàng nhanh. Sẽ quay lại mua tiếp!", rating: 5 },
                                    { name: "Chị Linh", comment: "Dịch vụ tuyệt vời, nhân viên tư vấn nhiệt tình. Rất hài lòng!", rating: 5 },
                                    { name: "Anh Tuấn", comment: "Giá cả hợp lý, đóng gói cẩn thận. Cửa hàng uy tín!", rating: 5 }
                                ].map((testimonial, index) => (
                                    <Card key={index} className="bg-white">
                                        <CardContent className="p-6">
                                            <div className="flex items-center mb-4">
                                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                                                    <User className="h-6 w-6 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold">{testimonial.name}</div>
                                                    <div className="flex">
                                                        {[...Array(testimonial.rating)].map((_, i) => (
                                                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 italic">"{testimonial.comment}"</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Newsletter Section */}
                    <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        <CardContent className="py-12 text-center">
                            <h3 className="text-3xl font-bold mb-4">🎁 Nhận ưu đãi đặc biệt!</h3>
                            <p className="text-xl mb-6 text-yellow-100">
                                Đăng ký nhận tin để được thông báo về các chương trình khuyến mãi hot nhất
                            </p>
                            <div className="max-w-md mx-auto flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Nhập email của bạn"
                                    className="flex-1 px-4 py-3 rounded-lg text-gray-900"
                                />
                                <Button className="bg-white text-orange-500 hover:bg-gray-100 px-6 py-3 font-semibold">
                                    Đăng ký
                                </Button>
                            </div>
                            <p className="text-sm text-yellow-100 mt-3">
                                * Miễn phí và có thể hủy đăng ký bất kỳ lúc nào
                            </p>
                        </CardContent>
                    </Card>

                    {/* CTA Section */}
                    <Card className="bg-gray-900 text-white">
                        <CardContent className="py-12 text-center">
                            <Award className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                            <h3 className="text-3xl font-bold mb-4">Bắt đầu trải nghiệm mua sắm tuyệt vời!</h3>
                            <p className="text-gray-300 mb-8 text-lg">
                                Tham gia cộng đồng hơn 15.000+ khách hàng tin tưởng chúng tôi mỗi ngày
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    className="bg-indigo-600 hover:bg-indigo-700 font-semibold px-8 py-4 text-lg"
                                    onClick={() => navigate('/products')}
                                >
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Khám phá ngay
                                </Button>
                                {!isAuthenticated && (
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-4 text-lg"
                                        onClick={() => navigate('/register')}
                                    >
                                        Tạo tài khoản miễn phí
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
} 