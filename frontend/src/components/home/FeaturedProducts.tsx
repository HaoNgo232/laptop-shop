import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from "@/types";

interface FeaturedProductsProps {
    readonly products: Product[];
    readonly currentSlide: number;
    readonly onPrevSlide: () => void;
    readonly onNextSlide: () => void;
    readonly onProductClick: (productId: string) => void;
    readonly onNavigate: (path: string) => void;
}

export function FeaturedProducts({
    products,
    currentSlide,
    onPrevSlide,
    onNextSlide,
    onProductClick,
    onNavigate
}: FeaturedProductsProps) {
    if (products.length <= 8) return null;

    const totalSlides = Math.ceil(products.length / 4);

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Sản phẩm bán chạy</h2>
                <Button variant="ghost" onClick={() => onNavigate('/products')}>
                    Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
            </div>

            <div className="relative">
                <div className="overflow-hidden">
                    <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                            <div key={slideIndex} className="w-full flex-shrink-0">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {products.slice(slideIndex * 4, (slideIndex + 1) * 4).map((product) => (
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
                                                    onClick={() => onProductClick(product.id)}
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
                {totalSlides > 1 && (
                    <>
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md"
                            onClick={onPrevSlide}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md"
                            onClick={onNextSlide}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </>
                )}
            </div>
        </section>
    );
} 