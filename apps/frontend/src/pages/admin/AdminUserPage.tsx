import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminUserStore } from '@/stores/admin/adminUserStore';
import type { AdminQuery } from '@/types/admin';
import { AdminTable } from '@/components/admin/AdminTable';
import { UserDetailModal } from '@/components/admin/UserDetailModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, Filter } from 'lucide-react';
import { UserRole } from '@web-ecom/shared-types/auth/enums';
import { PaginationMeta } from '@/types/api';

export function AdminUserPage() {
    const {
        users,
        selectedUser,
        isLoading,
        error,
        fetchUsers,
        fetchUserById,
        updateUser,
        clearError,
        clearSelectedUser
    } = useAdminUserStore();

    const [query, setQuery] = useState<AdminQuery>({
        page: 1,
        limit: 10
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [showModal, setShowModal] = useState(false);

    // Mock pagination data - trong thực tế sẽ lấy từ API response
    const [pagination, setPagination] = useState<PaginationMeta>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
        hasPreviousPage: false,
        hasNextPage: false
    });



    useEffect(() => {
        loadUsers();
    }, [query]);

    const loadUsers = async () => {
        try {
            await fetchUsers(query);
            setPagination(users.meta);
        } catch (error) {
            console.error('Lỗi khi tải danh sách người dùng:', error);
        }
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSearch = () => {
        setQuery(prev => ({
            ...prev,
            search: searchTerm.trim() || undefined,
            page: 1 // Reset về trang đầu khi search
        }));
    };

    const handleRoleFilter = (role: string) => {
        setSelectedRole(role);
        setQuery(prev => ({
            ...prev,
            role: role === 'all' ? undefined : role as UserRole,
            page: 1
        }));
    };

    const handlePageChange = (page: number) => {
        setQuery(prev => ({
            ...prev,
            page
        }));
    };

    const handleUserEdit = async (userId: string) => {
        try {
            await fetchUserById(userId);
            setShowModal(true);
        } catch (error) {
            console.error('Lỗi khi tải thông tin người dùng:', error);
        }
    };

    const handleUserUpdate = async (userId: string, data: any) => {
        try {
            await updateUser(userId, data);
            setShowModal(false);
            clearSelectedUser();
            loadUsers(); // Reload danh sách
        } catch (error) {
            console.error('Lỗi khi cập nhật người dùng:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        clearSelectedUser();
    };

    return (
        <AdminLayout>
            {/* Page Header with Search */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Quản lý người dùng
                        </h1>
                        <p className="text-muted-foreground">
                            Quản lý tài khoản và quyền của người dùng
                        </p>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm người dùng
                    </Button>
                </div>

                {/* Search and Filter Bar */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Tìm kiếm theo email hoặc tên người dùng..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleSearch}
                                    className="whitespace-nowrap"
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    Tìm kiếm
                                </Button>
                                <Select value={selectedRole} onValueChange={handleRoleFilter}>
                                    <SelectTrigger className="w-40">
                                        <Filter className="mr-2 h-4 w-4" />
                                        <SelectValue placeholder="Vai trò" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value={UserRole.ADMIN}>Quản trị</SelectItem>
                                        <SelectItem value={UserRole.USER}>Người dùng</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Users Table */}
            <AdminTable
                users={users.data}
                pagination={pagination}
                isLoading={isLoading}
                onUserEdit={handleUserEdit}
                onPageChange={handlePageChange}
            />

            {/* User Detail Modal */}
            <UserDetailModal
                isOpen={showModal}
                onClose={handleCloseModal}
                user={selectedUser}
                isLoading={isLoading}
                onUpdate={handleUserUpdate}
                error={error}
            />

            {/* Error Display */}
            {error && !showModal && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800">{error}</p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearError}
                        className="mt-2"
                    >
                        Đóng
                    </Button>
                </div>
            )}
        </AdminLayout>
    );
}