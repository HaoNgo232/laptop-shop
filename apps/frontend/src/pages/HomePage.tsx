import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { CategorySection } from '@/components/home/CategorySection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { ServiceFeatures } from '@/components/home/ServiceFeatures';
import { useHomepage } from '@/hooks/useHomepage';

export function HomePage() {
    const {
        // Data
        products,
        categories,
        featuredProducts,
        currentSlide,

        // States
        isAuthenticated,
        authLoading,

        // Actions
        handleQuickAddToCart,
        handlePrevSlide,
        handleNextSlide,
        handleCategoryClick,
        handleProductClick,
        navigate,
    } = useHomepage();

    // Loading state
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

            {/* Hero Section */}
            <HeroSection
                products={products}
                isAuthenticated={isAuthenticated}
                onProductClick={handleProductClick}
                onQuickAddToCart={handleQuickAddToCart}
                onNavigate={navigate}
            />

            <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 space-y-12">
                    {/* Category Section */}
                    <CategorySection
                        categories={categories}
                        onCategoryClick={handleCategoryClick}
                    />

                    {/* Featured Products Carousel */}
                    <FeaturedProducts
                        products={featuredProducts}
                        currentSlide={currentSlide}
                        onPrevSlide={handlePrevSlide}
                        onNextSlide={handleNextSlide}
                        onProductClick={handleProductClick}
                        onNavigate={navigate}
                    />

                    {/* Service Features & Newsletter */}
                    <ServiceFeatures />
                </div>
            </main>
        </div>
    );
} 