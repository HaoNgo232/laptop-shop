import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminTable } from '@/components/admin/AdminTable';
import { UserDetailModal } from '@/components/admin/UserDetailModal';
import { UsersFilters } from '@/components/admin/UsersFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useUsersManager } from '@/hooks/useUsersManager';

/**
 * AdminManagerUserPage - Trang quản lý người dùng
 */
export function AdminManagerUserPage() {
    // Hook xử lý data và logic cho users
    const {
        // Data
        users,
        selectedUser,
        pagination,

        // States
        isLoading,
        error,
        searchTerm,
        selectedRole,
        showModal,

        // Search & Filter handlers
        setSearchTerm,
        handleSearch,
        handleSearchKeyDown,
        handleRoleFilter,
        handleRefresh,

        // Pagination handler
        handlePageChange,

        // User CRUD handlers
        handleUserEdit,
        handleUserUpdate,
        handleCloseModal,

        // Error handler
        clearError,
    } = useUsersManager();

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
                <UsersFilters
                    searchTerm={searchTerm}
                    selectedRole={selectedRole}
                    onSearchTermChange={setSearchTerm}
                    onSearch={handleSearch}
                    onSearchKeyDown={handleSearchKeyDown}
                    onRoleFilter={handleRoleFilter}
                    onRefresh={handleRefresh}
                    isLoading={isLoading}
                />
            </div>

            {/* Users Table */}
            <AdminTable
                users={users}
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