import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { useAuthStore } from '@/stores/authStore';
import { useProductStore } from '@/stores/productStore';
import { MinimalBackground } from '@/components/backgrounds/MinimalBackground';
import { MinimalDarkWrapper } from '@/components/backgrounds/MinimalDarkWrapper';
import {
    ShoppingBag, Package, User, Star,
    ArrowRight, Shield, Truck, ChevronLeft, ChevronRight,
    Tag, Search, Phone,
    ShoppingCart
} from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';

export function HomePage() {
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
    const { products, categories, fetchProducts, fetchCategories } = useProductStore();
    const { addToCart } = useCartStore();

    // Featured products
    const [currentSlide, setCurrentSlide] = useState(0);
    const featuredProducts = products.slice(0, 8);

    // Hero products - sản phẩm hot nhất
    const [heroProducts, setHeroProducts] = useState([]);

    useEffect(() => {
        fetchProducts({ limit: 12 });
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

    const handleQuickAddToCart = async (product: Product, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        await addToCart(product.id, 1);
        // Toast notification có thể thêm ở đây
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* HERO: Products-First Approach */}
            <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Headline */}
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Khám phá sản phẩm{' '}
                            <span className="text-gray-900">hot nhất</span> tuần này
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Hàng ngàn sản phẩm chất lượng, giao hàng nhanh chóng
                        </p>
                    </motion.div>

                    {/* Hero Products Grid - Sản phẩm ngay trong hero */}
                    {products.length > 0 && (
                        <motion.div
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            {products.slice(0, 8).map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                >
                                    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-0 shadow-sm hover:scale-[1.02]">
                                        <CardContent className="p-3">
                                            <div
                                                className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative"
                                                onClick={() => navigate(`/products/${product.id}`)}
                                            >
                                                <img
                                                    src={product.imageUrl || '/placeholder-product.png'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                                {/* Quick Add Overlay */}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <Button
                                                        size="sm"
                                                        className="bg-white text-gray-900 hover:bg-gray-100"
                                                        onClick={(e) => handleQuickAddToCart(product, e)}
                                                    >
                                                        <ShoppingCart className="h-4 w-4 mr-1" />
                                                        Thêm vào giỏ
                                                    </Button>
                                                </div>
                                            </div>
                                            <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <p className="text-lg font-bold text-gray-900">
                                                    {product.price.toLocaleString('vi-VN')}đ
                                                </p>
                                                <Badge variant="secondary" className="text-xs">
                                                    {product.category.name}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* CTA buttons */}
                    <div className="text-center">
                        <Button
                            size="lg"
                            className="bg-gray-900 hover:bg-gray-700 text-white px-8 py-3 text-lg mr-4"
                            onClick={() => navigate('/products')}
                        >
                            Xem tất cả sản phẩm
                        </Button>
                        {!isAuthenticated && (
                            <Button
                                variant="outline"
                                size="lg"
                                className="px-8 py-3 text-lg"
                                onClick={() => navigate('/register')}
                            >
                                Đăng ký ngay
                            </Button>
                        )}
                    </div>
                </div>
            </section>


            <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 space-y-12">

                    {/* Quick Category Navigation */}
                    {categories.length > 0 && (
                        <section className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Mua sắm theo danh mục</h2>
                                <p className="text-gray-600">Tìm kiếm sản phẩm theo sở thích của bạn</p>
                            </div>
                            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
                                {categories.slice(0, 16).map((category) => (
                                    <Card
                                        key={category.id}
                                        className="hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer bg-white border border-gray-200"
                                        onClick={() => navigate(`/products?category=${category.id}`)}
                                    >
                                        <CardContent className="p-4 text-center">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
                                                <Tag className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <h3 className="font-medium text-xs text-gray-900">
                                                {category.name}
                                            </h3>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* More Products Carousel - nếu cần */}
                    {products.length > 8 && (
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">Sản phẩm bán chạy</h2>
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
                        </section>
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
                    <MinimalDarkWrapper padding="lg" className="rounded-lg">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-2">Nhận thông tin ưu đãi</h3>
                            <p className="text-gray-300 mb-4">
                                Đăng ký để nhận thông báo về sản phẩm mới và khuyến mãi
                            </p>
                            <div className="max-w-md mx-auto flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Email của bạn"
                                    className="flex-1 px-3 py-2 rounded bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none"
                                />
                                <Button className="bg-white text-gray-900 hover:bg-gray-300 mt-0.5">
                                    Đăng ký
                                </Button>
                            </div>
                        </div>
                    </MinimalDarkWrapper>
                </div>
            </main>
        </div>
    );
} 