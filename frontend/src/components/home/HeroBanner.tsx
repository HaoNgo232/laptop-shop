import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Zap, Gift } from 'lucide-react';

interface HeroBannerProps {
    readonly isAuthenticated: boolean;
    readonly onNavigate: (path: string) => void;
}

export function HeroBanner({ isAuthenticated, onNavigate }: HeroBannerProps) {
    return (
        <section className="relative bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white py-16 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-10 left-10 opacity-20">
                <Gift className="h-32 w-32" />
            </div>
            <div className="absolute bottom-10 right-10 opacity-20">
                <Zap className="h-24 w-24" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                            <span className="block text-yellow-300">SIÊU SALE</span>
                            <span className="block">KHỦNG CUỐI NĂM</span>
                        </h1>
                        
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Star className="h-6 w-6 text-yellow-300 fill-yellow-300" />
                            <Star className="h-6 w-6 text-yellow-300 fill-yellow-300" />
                            <Star className="h-6 w-6 text-yellow-300 fill-yellow-300" />
                            <Star className="h-6 w-6 text-yellow-300 fill-yellow-300" />
                            <Star className="h-6 w-6 text-yellow-300 fill-yellow-300" />
                            <span className="text-lg font-semibold ml-2">Hàng ngàn khách hàng tin tưởng</span>
                        </div>

                        <p className="text-xl md:text-2xl font-medium mb-8 max-w-3xl mx-auto">
                            Giảm giá lên đến <span className="text-yellow-300 font-bold text-3xl">50%</span> cho tất cả sản phẩm
                            <br />
                            <span className="text-lg opacity-90">Miễn phí vận chuyển toàn quốc • Bảo hành chính hãng</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                size="lg"
                                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 text-lg font-bold rounded-full shadow-lg transform hover:scale-105 transition-all"
                                onClick={() => onNavigate('/products')}
                            >
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                Mua ngay - Giá sốc
                            </Button>
                            
                            {!isAuthenticated && (
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 text-lg font-semibold rounded-full"
                                    onClick={() => onNavigate('/register')}
                                >
                                    Đăng ký thành viên - Ưu đãi thêm
                                </Button>
                            )}
                        </div>

                        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm opacity-90">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                                <span>Giao hàng nhanh 2h</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                                <span>Đổi trả miễn phí 30 ngày</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                                <span>Hỗ trợ 24/7</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}