import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from "@/types";

interface HeroSectionProps {
    readonly products: Product[];
    readonly isAuthenticated: boolean;
    readonly onProductClick: (productId: string) => void;
    readonly onQuickAddToCart: (product: Product, e: React.MouseEvent<HTMLButtonElement>) => void;
    readonly onNavigate: (path: string) => void;
}

export function HeroSection({
    products,
    isAuthenticated,
    onProductClick,
    onQuickAddToCart,
    onNavigate
}: HeroSectionProps) {
    return (
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

                {/* Hero Products Grid */}
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
                                            onClick={() => onProductClick(product.id)}
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
                                                    onClick={(e) => onQuickAddToCart(product, e)}
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
                        onClick={() => onNavigate('/products')}
                    >
                        Xem tất cả sản phẩm
                    </Button>
                    {!isAuthenticated && (
                        <Button
                            variant="outline"
                            size="lg"
                            className="px-8 py-3 text-lg"
                            onClick={() => onNavigate('/register')}
                        >
                            Đăng ký ngay
                        </Button>
                    )}
                </div>
            </div>
        </section>
    );
} 