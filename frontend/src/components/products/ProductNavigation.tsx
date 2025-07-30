import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Product } from "@/types";

interface ProductNavigationProps {
    product: Product;
    onBack: () => void;
    onNavigate: (path: string) => void;
}

export function ProductNavigation({ product, onBack, onNavigate }: ProductNavigationProps) {
    return (
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center space-x-1 p-0 h-auto"
            >
                <ArrowLeft className="h-4 w-4" />
                <span>Quay lại</span>
            </Button>
            <span>/</span>
            <span onClick={() => onNavigate('/products')} className="hover:text-primary cursor-pointer">
                Sản phẩm
            </span>
            <span>/</span>
            <span
                onClick={() => onNavigate(`/products?category=${product.category.id}`)}
                className="hover:text-primary cursor-pointer"
            >
                {product.category.name}
            </span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
        </div>
    );
} 