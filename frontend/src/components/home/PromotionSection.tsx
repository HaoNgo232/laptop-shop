import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Zap, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from "@/types";

interface PromotionSectionProps {
    readonly products: Product[];
    readonly onProductClick: (productId: string) => void;
    readonly onQuickAddToCart: (product: Product, e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function PromotionSection({
    products,
    onProductClick,
    onQuickAddToCart
}: PromotionSectionProps) {
    if (products.length === 0) {
        return null;
    }

    return (
        <section className="py-12 bg-gradient-to-r from-red-50 to-orange-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Zap className="h-8 w-8 text-red-500" />
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            KHUYẾN MÃI KHỦNG
                        </h2>
                        <Zap className="h-8 w-8 text-red-500" />
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Sản phẩm có số lượng tồn kho nhiều nhất - Giảm giá sâu nhất!
                    </p>
                    <div className="inline-block bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold mt-2">
                        <Package className="h-4 w-4 inline mr-1" />
                        HÀNG TỒN KHO CAO - GIẢM MẠNH
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
                            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border-2 border-red-200 hover:border-red-400 relative overflow-hidden">
                                {/* Sale badge */}
                                <div className="absolute top-2 left-2 z-10">
                                    <Badge className="bg-red-500 text-white text-xs font-bold px-2 py-1">
                                        SALE KHỦNG
                                    </Badge>
                                </div>
                                
                                {/* Stock badge */}
                                <div className="absolute top-2 right-2 z-10">
                                    <Badge variant="secondary" className="text-xs">
                                        Còn {product.stockQuantity}
                                    </Badge>
                                </div>

                                <CardContent className="p-3">
                                    <div
                                        className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative"
                                        onClick={() => onProductClick(product.id)}
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
                                                className="bg-red-500 hover:bg-red-600 text-white"
                                                onClick={(e) => onQuickAddToCart(product, e)}
                                            >
                                                <ShoppingCart className="h-4 w-4 mr-1" />
                                                Mua ngay
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                                        {product.name}
                                    </h3>
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-400 line-through">
                                                    {(product.price * 1.2).toLocaleString('vi-VN')}đ
                                                </span>
                                                <span className="text-lg font-bold text-red-600">
                                                    {product.price.toLocaleString('vi-VN')}đ
                                                </span>
                                            </div>
                                            <Badge variant="destructive" className="text-xs">
                                                -{Math.round((1 - 1/1.2) * 100)}%
                                            </Badge>
                                        </div>
                                        
                                        <Badge variant="outline" className="text-xs w-full justify-center">
                                            {product.category.name}
                                        </Badge>
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