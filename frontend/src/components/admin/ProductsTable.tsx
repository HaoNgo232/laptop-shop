import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from "@/types";
import { PaginationMeta } from "@/types";
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ProductsTableProps {
    readonly products: Product[];
    readonly pagination: PaginationMeta | null;
    readonly onEdit: (product: Product) => void;
    readonly onDelete: (product: Product) => void;
    readonly onView: (product: Product) => void;
    readonly onPageChange: (page: number) => void;
    readonly isLoading?: boolean;
}

export function ProductsTable({
    products,
    pagination,
    onEdit,
    onDelete,
    onView,
    onPageChange,
    isLoading = false,
}: ProductsTableProps) {
    const navigate = useNavigate();
    //  Format giá tiền
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    //  Format số lượng với badge màu
    const getStockBadge = (quantity: number) => {
        if (quantity === 0) {
            return <Badge variant="destructive">Hết hàng</Badge>;
        }
        if (quantity < 10) {
            return <Badge variant="secondary">Sắp hết ({quantity})</Badge>;
        }
        return <Badge variant="default">Còn {quantity}</Badge>;
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Quản Lý Sản Phẩm</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quản Lý Sản Phẩm</CardTitle>
                <p className="text-sm text-gray-600">
                    Tổng: {pagination?.totalItems || 0} sản phẩm
                </p>
            </CardHeader>
            <CardContent>
                {products.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Chưa có sản phẩm nào</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16">Ảnh</TableHead>
                                        <TableHead>Tên sản phẩm</TableHead>
                                        <TableHead>Danh mục</TableHead>
                                        <TableHead className="text-right">Giá</TableHead>
                                        <TableHead className="text-center">Tồn kho</TableHead>
                                        <TableHead className="text-center">Ngày tạo</TableHead>
                                        <TableHead className="text-center w-32">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-12 h-12 object-cover rounded-md"
                                                    onError={(e) => {
                                                        e.currentTarget.src = '/placeholder-image.png';
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <div>
                                                    <p className="font-semibold">{product.name}</p>
                                                    <p className="text-sm text-gray-500 truncate max-w-xs">
                                                        {product.description}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {product.category?.name}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                                {formatPrice(product.price)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {getStockBadge(product.stockQuantity)}
                                            </TableCell>
                                            <TableCell className="text-center text-sm text-gray-500">
                                                {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onView(product)}
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onEdit(product)}
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onDelete(product)}
                                                        title="Xóa"
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/*  Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4">
                                <div className="text-sm text-gray-600">
                                    Hiển thị {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {' '}
                                    {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} trong{' '}
                                    {pagination.totalItems} sản phẩm
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onPageChange(pagination.currentPage - 1)}
                                        disabled={!pagination.hasPreviousPage}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Trước
                                    </Button>

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                            .filter(page => {
                                                const current = pagination.currentPage;
                                                return page === 1 || page === pagination.totalPages ||
                                                    (page >= current - 1 && page <= current + 1);
                                            })
                                            .map((page, index, array) => (
                                                <React.Fragment key={page}>
                                                    {index > 0 && array[index - 1] !== page - 1 && (
                                                        <span className="px-2">...</span>
                                                    )}
                                                    <Button
                                                        variant={page === pagination.currentPage ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => onPageChange(page)}
                                                        className={cn(
                                                            "w-8 h-8",
                                                            page === pagination.currentPage && "bg-primary text-white"
                                                        )}
                                                    >
                                                        {page}
                                                    </Button>
                                                </React.Fragment>
                                            ))}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onPageChange(pagination.currentPage + 1)}
                                        disabled={!pagination.hasNextPage}
                                    >
                                        Sau
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}