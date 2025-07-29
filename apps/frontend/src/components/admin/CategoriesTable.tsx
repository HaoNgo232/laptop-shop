import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Category } from '@/types/product';

interface CategoriesTableProps {
    readonly categories: Category[];
    readonly isLoading: boolean;
    readonly searchQuery: string;
    readonly onEdit: (category: Category) => void;
    readonly onDelete: (category: Category) => void;
}

const LoadingSkeleton = () => (
    <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/6 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/6 animate-pulse" />
            </div>
        ))}
    </div>
);

const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export function CategoriesTable({
    categories,
    isLoading,
    searchQuery,
    onEdit,
    onDelete
}: CategoriesTableProps) {
    if (isLoading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="text-left p-4 font-medium text-gray-500">
                            Tên danh mục
                        </th>
                        <th className="text-left p-4 font-medium text-gray-500">
                            Mô tả
                        </th>
                        <th className="text-left p-4 font-medium text-gray-500">
                            Ngày tạo
                        </th>
                        <th className="text-left p-4 font-medium text-gray-500">
                            Thao tác
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {categories.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center p-8 text-gray-500">
                                {searchQuery
                                    ? `Không tìm thấy danh mục nào với từ khóa "${searchQuery}"`
                                    : 'Chưa có danh mục nào'
                                }
                            </td>
                        </tr>
                    ) : (
                        categories.map((category) => (
                            <tr key={category.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="font-medium text-gray-900">
                                        {category.name}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="text-gray-600 max-w-md truncate">
                                        {category.description || 'Không có mô tả'}
                                    </div>
                                </td>
                                <td className="p-4 text-gray-600">
                                    {formatDate(category.createdAt)}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(category)}
                                            className="h-8 w-8 p-0"
                                            title="Chỉnh sửa"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(category)}
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            title="Xóa"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
} 