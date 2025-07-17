import { ProductCard, ProductSkeleton } from '@/components/products';
import type { Product } from '@/types/product';

interface ProductListProps {
    readonly products: Product[];
    readonly isLoading?: boolean;
}

export function ProductList({ products, isLoading = false }: ProductListProps) {

    // Loading state
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Loading skeleton */}
                {Array.from({ length: 8 }).map(() => (
                    <ProductSkeleton key={crypto.randomUUID()} />
                ))}
            </div>
        );
    }

    // Empty state
    if (!products || products.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">
                    Không tìm thấy sản phẩm nào
                </div>
                <p className="text-gray-400 text-sm">
                    Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
            </div>
        );
    }

    // Products grid
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
} 