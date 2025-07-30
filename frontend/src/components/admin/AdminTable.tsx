import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import type { AdminView } from "@/types";
import type { PaginationMeta } from "@/types";
import { UserRole } from '@/types';

interface AdminTableProps {
    readonly users: AdminView[];
    readonly pagination: PaginationMeta | null;
    readonly isLoading: boolean;
    readonly onUserEdit: (userId: string) => void;
    readonly onPageChange: (page: number) => void;
}

export function AdminTable({
    users,
    pagination,
    isLoading,
    onUserEdit,
    onPageChange
}: AdminTableProps) {

    const getRoleBadge = (role: UserRole) => {
        const roleConfig = {
            [UserRole.ADMIN]: { variant: 'default' as const, label: 'Quản trị' },
            [UserRole.USER]: { variant: 'secondary' as const, label: 'Người dùng' },
        };

        const config = roleConfig[role as keyof typeof roleConfig] || roleConfig[UserRole.USER];
        return (
            <Badge variant={config.variant}>
                {config.label}
            </Badge>
        );
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
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                </div>
            ))}
        </div>
    );

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Quản lý người dùng</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <LoadingSkeleton />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quản lý người dùng</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-4 font-medium text-gray-500">
                                    Email
                                </th>
                                <th className="text-left p-4 font-medium text-gray-500">
                                    Tên người dùng
                                </th>
                                <th className="text-left p-4 font-medium text-gray-500">
                                    Vai trò
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
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center p-8 text-gray-500">
                                        Không có dữ liệu người dùng
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900">
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-gray-900">
                                                {user.username}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {getRoleBadge(user.role)}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onUserEdit(user.id)}
                                                    className="h-8 w-15 p-0"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Hiển thị {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} trong tổng số {pagination.totalItems} người dùng
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage <= 1}
                                className="flex items-center gap-1"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Trước
                            </Button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    const pageNumber = i + Math.max(1, pagination.currentPage - 2);
                                    if (pageNumber > pagination.totalPages) return null;

                                    return (
                                        <Button
                                            key={pageNumber}
                                            variant={pageNumber === pagination.currentPage ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => onPageChange(pageNumber)}
                                            className="w-8 h-8 p-0"
                                        >
                                            {pageNumber}
                                        </Button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage >= pagination.totalPages}
                                className="flex items-center gap-1"
                            >
                                Sau
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 