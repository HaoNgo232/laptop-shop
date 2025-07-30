import { useState, useEffect, useMemo } from "react";
import { useAdminCategoryStore } from "@/stores/admin/adminCategoryStore";
import { Category, CreateCategory, UpdateCategory } from "@/types";
import { toast } from "sonner";

export function useCategoriesManager() {
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

  // Local state for UI
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load initial data
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle error display với toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Filter categories với useMemo để optimize performance
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return categories;
    }

    const searchLower = searchQuery.toLowerCase();
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchLower) ||
        (category.description &&
          category.description.toLowerCase().includes(searchLower)),
    );
  }, [categories, searchQuery]);

  // Action handlers
  const handleRefresh = async () => {
    await fetchCategories();
    toast.success("Dữ liệu đã được làm mới");
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
        toast.success("Cập nhật danh mục thành công");
      } else {
        await createCategory(data as CreateCategory);
        toast.success("Thêm danh mục thành công");
      }
      setIsFormDialogOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Lỗi khi xử lý form:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id);
      toast.success("Xóa danh mục thành công");
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
    }
  };

  const handleFormCancel = () => {
    setIsFormDialogOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  return {
    // Data
    categories: filteredCategories,
    allCategories: categories,
    isLoading,
    error,

    // Search state
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
  };
}
