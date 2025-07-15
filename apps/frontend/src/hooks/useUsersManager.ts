import { useEffect, useState } from "react";
import { useAdminUserStore } from "@/stores/admin/adminUserStore";
import { AdminQuery } from "@/types/admin";
import { PaginationMeta } from "@/types/api";
import { UserRole } from "@web-ecom/shared-types/auth/enums";

/**
 * Custom hook quản lý users management
 * Tách business logic khỏi UI component để dễ test và maintain
 * Tuân thủ Single Responsibility Principle
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

  // Local states - quản lý UI state và pagination
  const [query, setQuery] = useState<AdminQuery>({
    page: 1,
    limit: 10,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);

  // Mock pagination data - trong thực tế sẽ lấy từ API response
  const [pagination, setPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  // Load users khi query thay đổi
  useEffect(() => {
    loadUsers();
  }, [query]);

  /**
   * Load danh sách users và update pagination
   */
  const loadUsers = async () => {
    try {
      await fetchUsers(query);
      // Update pagination từ API response
      if (users.meta) {
        setPagination(users.meta);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    }
  };

  /**
   * Handle search với reset về trang đầu
   */
  const handleSearch = () => {
    setQuery((prev) => ({
      ...prev,
      search: searchTerm.trim() || undefined,
      page: 1, // Reset về trang đầu khi search
    }));
  };

  /**
   * Handle role filter với reset về trang đầu
   */
  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    setQuery((prev) => ({
      ...prev,
      role: role === "all" ? undefined : (role as UserRole),
      page: 1, // Reset về trang đầu khi filter
    }));
  };

  /**
   * Handle pagination change
   */
  const handlePageChange = (page: number) => {
    setQuery((prev) => ({
      ...prev,
      page,
    }));
  };

  /**
   * Handle edit user - fetch detail và show modal
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
   * Handle update user thông tin
   */
  const handleUserUpdate = async (userId: string, data: any) => {
    try {
      await updateUser(userId, data);
      setShowModal(false);
      clearSelectedUser();
      // Reload danh sách để cập nhật thay đổi
      await loadUsers();
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
    }
  };

  /**
   * Handle đóng modal và clear selected user
   */
  const handleCloseModal = () => {
    setShowModal(false);
    clearSelectedUser();
  };

  /**
   * Handle search khi nhấn Enter
   */
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  /**
   * Handle refresh data - reload với query hiện tại
   */
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
