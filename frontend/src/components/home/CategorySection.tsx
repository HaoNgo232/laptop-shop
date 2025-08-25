import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Category } from "@/types";

interface CategorySectionProps {
    readonly categories: Category[];
    readonly onCategoryClick: (categoryId: string) => void;
}

export function CategorySection({ categories, onCategoryClick }: CategorySectionProps) {
    const { t } = useTranslation();
    if (categories.length === 0) return null;

    const iconMap = Icons as Record<string, LucideIcon>;

    return (
        <section className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('categorySection.title')}</h2>
                <p className="text-gray-600">{t('categorySection.subtitle')}</p>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {categories.slice(0, 16).map((category) => {
                    const IconComponent = (category.icon && iconMap[category.icon]) || iconMap.Tag;
                    return (
                        <button
                            key={category.id}
                            aria-label={category.name}
                            onClick={() => onCategoryClick(category.id)}
                            className="p-4 text-center bg-white border border-gray-200 rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
                                <IconComponent className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="font-medium text-xs text-gray-900">
                                {category.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}