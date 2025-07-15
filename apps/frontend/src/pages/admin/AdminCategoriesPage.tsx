import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { CategoriesTable } from '@/components/admin/CategoriesTable';
import { useCategoriesManager } from '@/hooks/useCategoriesManager';
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
import { Plus, Search, RefreshCw } from 'lucide-react';

export function AdminCategoriesPage() {
    const {
        // Data
        categories,
        isLoading,
        searchQuery,
        setSearchQuery,

        // Modal states
        isFormDialogOpen,
        setIsFormDialogOpen,
        isDeleteDialogOpen,
        editingCategory,
        categoryToDelete,

        // Actions
        handleRefresh,
        handleCreateCategory,
        handleEditCategory,
        handleDeleteCategory,
        handleFormSubmit,
        handleConfirmDelete,
        handleFormCancel,
        handleDeleteCancel,
    } = useCategoriesManager();

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
                            Danh sách danh mục ({categories.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CategoriesTable
                            categories={categories}
                            isLoading={isLoading}
                            searchQuery={searchQuery}
                            onEdit={handleEditCategory}
                            onDelete={handleDeleteCategory}
                        />
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
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={handleDeleteCancel}>
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