import { useEffect, useState } from "react";
import { useAdminUserStore } from "@/stores/admin/adminUserStore";
import { AdminQuery } from "@/types/admin";
import { PaginationMeta } from "@/types/api";
import { UserRole } from "@web-ecom/shared-types/auth/enums";

/**
 * Hook xử lý logic quản lý người dùng
 * Bao gồm search, filter role, pagination, user CRUD
 */
export const useUsersManager = () => {
  // Store states
  const {
    users,
    selectedUser,
    isLoading,
    error,
    fetchUsers,
    fetchUserById,
    updateUser,
    clearError,
    clearSelectedUser,
  } = useAdminUserStore();

  // UI state và query management
  const [query, setQuery] = useState<AdminQuery>({
    page: 1,
    limit: 10,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);

  // Pagination state - cần tách riêng vì API response structure
  const [pagination, setPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  // Auto-load khi query thay đổi
  useEffect(() => {
    loadUsers();
  }, [query]);

  /**
   * Load danh sách users và cập nhật pagination
   * Logic phức tạp: cần sync pagination state với API response
   */
  const loadUsers = async () => {
    try {
      await fetchUsers(query);
      // Update pagination từ API response nếu có
      if (users.meta) {
        setPagination(users.meta);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    }
  };

  const handleSearch = () => {
    // Reset về trang 1 khi search mới
    setQuery((prev) => ({
      ...prev,
      search: searchTerm.trim() || undefined,
      page: 1,
    }));
  };

  /**
   * Xử lý filter theo role
   * Logic: convert 'all' thành undefined cho API
   */
  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    setQuery((prev) => ({
      ...prev,
      role: role === "all" ? undefined : (role as UserRole),
      page: 1, // Reset về trang đầu khi filter
    }));
  };

  const handlePageChange = (page: number) => {
    setQuery((prev) => ({
      ...prev,
      page,
    }));
  };

  /**
   * Mở modal edit user
   * Cần fetch detail trước khi hiển thị modal
   */
  const handleUserEdit = async (userId: string) => {
    try {
      await fetchUserById(userId);
      setShowModal(true);
    } catch (error) {
      console.error("Lỗi khi tải thông tin người dùng:", error);
    }
  };

  /**
   * Update user và reload danh sách
   * Logic phức tạp: update + close modal + clear state + reload
   */
  const handleUserUpdate = async (userId: string, data: any) => {
    try {
      await updateUser(userId, data);
      setShowModal(false);
      clearSelectedUser();
      // Reload để cập nhật danh sách
      await loadUsers();
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    clearSelectedUser();
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleRefresh = async () => {
    await loadUsers();
  };

  return {
    // Data
    users: users.data,
    selectedUser,
    pagination,

    // States
    isLoading,
    error,
    query,
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
  };
};
