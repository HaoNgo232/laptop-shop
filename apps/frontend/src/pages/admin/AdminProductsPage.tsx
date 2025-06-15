/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useAdminProductStore } from '@/stores/admin/adminProductStore';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { ProductForm } from '@/components/forms/ProductForm';
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
import { toast } from 'sonner';
import { Product, CreateProduct, UpdateProduct } from '@/types/product';
import { AdminQuery } from '@/types/admin';
import { useAdminCategoryStore } from '@/stores/admin/adminCategoryStore';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function AdminProductsPage() {
    const {
        products,
        pagination,
        isLoading,
        error,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        clearError,
    } = useAdminProductStore();

    const { categories, fetchCategories } = useAdminCategoryStore();

    //  Local state
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentQuery, setCurrentQuery] = useState<AdminQuery>({
        page: 1,
        limit: 10,
    });

    //  Load dữ liệu ban đầu
    useEffect(() => {
        const loadInitialData = async () => {
            await Promise.all([
                fetchProducts(currentQuery),
                fetchCategories(),
            ]);
        };

        loadInitialData();
    }, []);

    //  Hiển thị lỗi
    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error]);

    //  Handlers
    const handleSearch = async () => {
        const query: AdminQuery = {
            page: 1,
            limit: 10,
            search: searchQuery || undefined,
        };
        setCurrentQuery(query);
        await fetchProducts(query);
    };

    const handlePageChange = async (page: number) => {
        const query: AdminQuery = {
            ...currentQuery,
            page,
        };
        setCurrentQuery(query);
        await fetchProducts(query);
    };

    const handleRefresh = async () => {
        await fetchProducts(currentQuery);
        toast.success('Dữ liệu đã được làm mới');
    };

    const handleCreateProduct = () => {
        setEditingProduct(null);
        setIsFormDialogOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsFormDialogOpen(true);
    };

    const handleViewProduct = (product: Product) => {
        toast.info(`Xem chi tiết sản phẩm: ${product.name}`);
    };

    const handleDeleteProduct = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteDialogOpen(true);
    };

    const handleFormSubmit = async (data: CreateProduct | UpdateProduct) => {
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, data as UpdateProduct);
                toast.success('Cập nhật sản phẩm thành công');
            } else {
                await createProduct(data as CreateProduct);
                toast.success('Thêm sản phẩm thành công');
            }
            setIsFormDialogOpen(false);
            setEditingProduct(null);

            // Refresh lại danh sách
            await fetchProducts(currentQuery);
        } catch (error) {
            console.error('Lỗi khi xử lý form:', error);
        }
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;

        try {
            const message = await deleteProduct(productToDelete.id);
            toast.success(message);
            setIsDeleteDialogOpen(false);
            setProductToDelete(null);

            // Refresh lại danh sách
            await fetchProducts(currentQuery);
        } catch (error) {
            // Lỗi đã được store xử lý và hiển thị qua useEffect
            console.error('Lỗi khi xóa sản phẩm:', error);
        }
    };

    const handleFormCancel = () => {
        setIsFormDialogOpen(false);
        setEditingProduct(null);
    };

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
                                        placeholder="Tìm kiếm theo tên sản phẩm..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleSearch} variant="outline">
                                    <Search className="h-4 w-4 mr-2" />
                                    Tìm Kiếm
                                </Button>
                                <Button onClick={handleRefresh} variant="outline">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Làm Mới
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/*  Products Table */}
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
                <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
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
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
                                onClick={() => {
                                    setIsDeleteDialogOpen(false);
                                    setProductToDelete(null);
                                }}
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