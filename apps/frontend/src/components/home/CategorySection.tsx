import { Card, CardContent } from '@/components/ui/card';
import { Tag } from 'lucide-react';
import type { Category } from '@/types/product';

interface CategorySectionProps {
    readonly categories: Category[];
    readonly onCategoryClick: (categoryId: string) => void;
}

export function CategorySection({ categories, onCategoryClick }: CategorySectionProps) {
    if (categories.length === 0) return null;

    return (
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
                        onClick={() => onCategoryClick(category.id)}
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
    );
} 