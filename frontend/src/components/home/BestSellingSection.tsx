import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, TrendingUp, Crown, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from "@/types";

interface BestSellingSectionProps {
    readonly products: Product[];
    readonly onProductClick: (productId: string) => void;
    readonly onQuickAddToCart: (product: Product, e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function BestSellingSection({
    products,
    onProductClick,
    onQuickAddToCart
}: BestSellingSectionProps) {
    if (products.length === 0) {
        return null;
    }

    return (
        <section className="py-12 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Flame className="h-8 w-8 text-orange-500" />
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            SẢN PHẨM BÁN CHẠY
                        </h2>
                        <Flame className="h-8 w-8 text-orange-500" />
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Được khách hàng lựa chọn và tin tưởng nhất
                    </p>
                    <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold mt-2">
                        <TrendingUp className="h-4 w-4 inline mr-1" />
                        TOP BÁN CHẠY NHẤT THÁNG
                    </div>
                </motion.div>

                <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
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
                            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border-2 border-blue-200 hover:border-blue-400 relative overflow-hidden">
                                {/* Ranking badge */}
                                {index < 3 && (
                                    <div className="absolute top-2 left-2 z-10">
                                        <Badge className={`text-white text-xs font-bold px-2 py-1 ${index === 0 ? 'bg-yellow-500' :
                                            index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                                            }`}>
                                            <Crown className="h-3 w-3 mr-1" />
                                            TOP {index + 1}
                                        </Badge>
                                    </div>
                                )}

                                {/* Best seller badge */}
                                <div className="absolute top-2 right-2 z-10">
                                    <Badge className="bg-orange-500 text-white text-xs">
                                        BÁN CHẠY
                                    </Badge>
                                </div>

                                <CardContent className="p-3">
                                    <button
                                        className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative w-full border-none p-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        onClick={() => onProductClick(product.id)}
                                        aria-label={`Xem chi tiết sản phẩm ${product.name}`}
                                    >
                                        <img
                                            src={product.imageUrl || 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=500'}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />

                                        {/* Overlay with action */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <Button
                                                size="sm"
                                                className="bg-blue-500 hover:bg-blue-600 text-white"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Ngăn bubble lên button cha
                                                    onQuickAddToCart(product, e);
                                                }}
                                            >
                                                <ShoppingCart className="h-4 w-4 mr-1" />
                                                Chọn mua
                                            </Button>
                                        </div>
                                    </button>

                                    <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                                        {product.name}
                                    </h3>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-blue-600">
                                                {product.price.toLocaleString('vi-VN')}đ
                                            </span>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <TrendingUp className="h-3 w-3" />
                                                <span>Hot</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Badge variant="outline" className="text-xs">
                                                {product.category.name}
                                            </Badge>
                                            {product.averageRating > 0 && (
                                                <div className="flex items-center gap-1 text-xs text-yellow-500">
                                                    ⭐ {Number(product.averageRating).toFixed(1)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}