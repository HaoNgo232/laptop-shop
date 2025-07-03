import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminCategoryStore } from '@/stores/admin/adminCategoryStore';
import CategoryForm from '@/components/categorys/CategoryForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Search, RefreshCw, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Category, CreateCategory, UpdateCategory } from '@/types/product';

export function AdminCategoriesPage() {
    const {
        categories,
        isLoading,
        error,
        fetchCategories,
        clearError,
        createCategory,
        updateCategory,
        deleteCategory,
    } = useAdminCategoryStore();

    // Local state
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

    // Load initial data
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Handle error display
    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    // Filter categories based on search query
    useEffect(() => {
        if (!searchQuery) {
            setFilteredCategories(categories);
        } else {
            const filtered = categories.filter((category) =>
                category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setFilteredCategories(filtered);
        }
    }, [categories, searchQuery]);

    // Handlers
    const handleSearch = () => {
        // Search is handled by useEffect above
    };

    const handleRefresh = async () => {
        await fetchCategories();
        toast.success('Dữ liệu đã được làm mới');
    };

    const handleCreateCategory = () => {
        setEditingCategory(null);
        setIsFormDialogOpen(true);
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setIsFormDialogOpen(true);
    };

    const handleDeleteCategory = (category: Category) => {
        setCategoryToDelete(category);
        setIsDeleteDialogOpen(true);
    };

    const handleFormSubmit = async (data: CreateCategory | UpdateCategory) => {
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, data as UpdateCategory);
                toast.success('Cập nhật danh mục thành công');
            } else {
                await createCategory(data as CreateCategory);
                toast.success('Thêm danh mục thành công');
            }
            setIsFormDialogOpen(false);
            setEditingCategory(null);
        } catch (error) {
            console.error('Lỗi khi xử lý form:', error);
        }
    };

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return;

        try {
            await deleteCategory(categoryToDelete.id);
            toast.success('Xóa danh mục thành công');
            setIsDeleteDialogOpen(false);
            setCategoryToDelete(null);
        } catch (error) {
            console.error('Lỗi khi xóa danh mục:', error);
        }
    };

    const handleFormCancel = () => {
        setIsFormDialogOpen(false);
        setEditingCategory(null);
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Danh Mục</h1>
                        <p className="text-gray-600">
                            Quản lý danh mục sản phẩm trong hệ thống
                        </p>
                    </div>
                    <Button onClick={handleCreateCategory} className="w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm Danh Mục
                    </Button>
                </div>

                {/* Search & Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tìm Kiếm & Lọc</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Tìm kiếm theo tên hoặc mô tả danh mục..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleRefresh}
                                    disabled={isLoading}
                                    className="flex items-center gap-2"
                                >
                                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                    Làm mới
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Categories Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Danh sách danh mục ({filteredCategories.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <LoadingSkeleton />
                        ) : (
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
                                        {filteredCategories.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="text-center p-8 text-gray-500">
                                                    {searchQuery
                                                        ? `Không tìm thấy danh mục nào với từ khóa "${searchQuery}"`
                                                        : 'Chưa có danh mục nào'
                                                    }
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredCategories.map((category) => (
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
                                                                onClick={() => handleEditCategory(category)}
                                                                className="h-8 w-8 p-0"
                                                                title="Chỉnh sửa"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteCategory(category)}
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
                        )}
                    </CardContent>
                </Card>

                {/* Form Dialog */}
                <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingCategory
                                    ? 'Cập nhật thông tin danh mục.'
                                    : 'Điền thông tin để tạo danh mục mới.'
                                }
                            </DialogDescription>
                        </DialogHeader>
                        <CategoryForm
                            category={editingCategory}
                            onSubmit={handleFormSubmit}
                            onCancel={handleFormCancel}
                            isLoading={isLoading}
                        />
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
                            <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa danh mục "{categoryToDelete?.name}"?
                                Hành động này không thể hoàn tác và có thể ảnh hưởng đến các sản phẩm trong danh mục.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleConfirmDelete}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Xóa
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
}