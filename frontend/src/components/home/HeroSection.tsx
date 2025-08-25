import { HeroBanner } from './HeroBanner';
import { PromotionSection } from './PromotionSection';
import { BestSellingSection } from './BestSellingSection';
import type { Product } from "@/types";

interface HeroSectionProps {
    readonly products: Product[];
    readonly highStockProducts: Product[];
    readonly bestSellingProducts: Product[];
    readonly isAuthenticated: boolean;
    readonly onProductClick: (productId: string) => void;
    readonly onQuickAddToCart: (product: Product, e: React.MouseEvent<HTMLButtonElement>) => void;
    readonly onNavigate: (path: string) => void;
}

export function HeroSection({
    products,
    highStockProducts,
    bestSellingProducts,
    isAuthenticated,
    onProductClick,
    onQuickAddToCart,
    onNavigate
}: HeroSectionProps) {
    return (
        <div className="bg-gray-50">
            {/* Hero Banner - Main advertising section */}
            <HeroBanner 
                isAuthenticated={isAuthenticated}
                onNavigate={onNavigate}
            />

            {/* High Stock Products - "Khuyến mãi khủng" */}
            <PromotionSection
                products={highStockProducts}
                onProductClick={onProductClick}
                onQuickAddToCart={onQuickAddToCart}
            />

            {/* Best Selling Products */}
            <BestSellingSection
                products={bestSellingProducts}
                onProductClick={onProductClick}
                onQuickAddToCart={onQuickAddToCart}
            />
        </div>
    );
} 