import React from 'react';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { ProductsFilters } from '@/components/admin/ProductsFilters';
import ProductForm from '@/components/products/ProductForm';
import { Button } from '@/components/ui/button';
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
import { Plus } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useProductsManager } from '@/hooks/useProductsManager';

/**
 * Trang quản lý sản phẩm
 * Bao gồm CRUD, search, pagination
 */
export default function AdminProductsPage() {
    // Hook xử lý logic quản lý products
    const {
        // Data
        products,
        categories,
        pagination,

        // States
        isLoading,
        isFormDialogOpen,
        isDeleteDialogOpen,
        productToDelete,
        editingProduct,
        searchQuery,

        // Search handlers
        setSearchQuery,
        handleSearch,
        handleRefresh,
        handlePageChange,

        // CRUD handlers
        handleCreateProduct,
        handleEditProduct,
        handleViewProduct,
        handleDeleteProduct,
        handleFormSubmit,
        handleConfirmDelete,
        handleFormCancel,
        handleCancelDelete,
    } = useProductsManager();

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Sản Phẩm</h1>
                        <p className="text-gray-600">
                            Quản lý thông tin sản phẩm trong hệ thống
                        </p>
                    </div>
                    <Button onClick={handleCreateProduct} className="w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm Sản Phẩm
                    </Button>
                </div>

                {/* Search & Filters */}
                <ProductsFilters
                    searchQuery={searchQuery}
                    onSearchQueryChange={setSearchQuery}
                    onSearch={handleSearch}
                    onRefresh={handleRefresh}
                    isLoading={isLoading}
                />

                {/* Products Table */}
                <ProductsTable
                    products={products}
                    pagination={pagination}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                    onView={handleViewProduct}
                    onPageChange={handlePageChange}
                    isLoading={isLoading}
                />

                {/* Product Form Dialog */}
                <Dialog open={isFormDialogOpen} onOpenChange={() => handleFormCancel()}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingProduct ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingProduct
                                    ? 'Cập nhật thông tin sản phẩm trong hệ thống'
                                    : 'Thêm sản phẩm mới vào hệ thống'
                                }
                            </DialogDescription>
                        </DialogHeader>
                        <ProductForm
                            product={editingProduct}
                            categories={categories}
                            onSubmit={handleFormSubmit}
                            onCancel={handleFormCancel}
                            isLoading={isLoading}
                        />
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={() => handleCancelDelete()}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Xác Nhận Xóa Sản Phẩm</AlertDialogTitle>
                            <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa sản phẩm{' '}
                                <strong>"{productToDelete?.name}"</strong>?
                                <br />
                                <br />
                                Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn sản phẩm khỏi hệ thống.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={handleCancelDelete}
                            >
                                Hủy
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleConfirmDelete}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Xóa Sản Phẩm
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
}