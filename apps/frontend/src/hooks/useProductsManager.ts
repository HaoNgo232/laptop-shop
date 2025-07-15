import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAdminProductStore } from "@/stores/admin/adminProductStore";
import { useAdminCategoryStore } from "@/stores/admin/adminCategoryStore";
import { Product, CreateProduct, UpdateProduct } from "@/types/product";
import { AdminQuery } from "@/types/admin";

/**
 * Custom hook quản lý products management
 * Tách business logic khỏi UI component để dễ test và maintain
 * Tuân thủ Single Responsibility Principle
 */
export const useProductsManager = () => {
  const navigate = useNavigate();

  // Store states
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

  // Local states - quản lý UI state
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentQuery, setCurrentQuery] = useState<AdminQuery>({
    page: 1,
    limit: 10,
  });

  // Load dữ liệu ban đầu
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([fetchProducts(currentQuery), fetchCategories()]);
    };

    loadInitialData();
  }, []);

  // Hiển thị lỗi qua toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  /**
   * Handle search với debounce logic có thể thêm sau
   */
  const handleSearch = async () => {
    const query: AdminQuery = {
      page: 1,
      limit: 10,
      search: searchQuery || undefined,
    };
    setCurrentQuery(query);
    await fetchProducts(query);
  };

  /**
   * Handle pagination change
   */
  const handlePageChange = async (page: number) => {
    const query: AdminQuery = {
      ...currentQuery,
      page,
    };
    setCurrentQuery(query);
    await fetchProducts(query);
  };

  /**
   * Handle refresh data
   */
  const handleRefresh = async () => {
    await fetchProducts(currentQuery);
    toast.success("Dữ liệu đã được làm mới");
  };

  /**
   * Handle create new product
   */
  const handleCreateProduct = () => {
    setEditingProduct(null);
    setIsFormDialogOpen(true);
  };

  /**
   * Handle edit existing product
   */
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormDialogOpen(true);
  };

  /**
   * Handle view product detail - navigate to product page
   */
  const handleViewProduct = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  /**
   * Handle delete product - show confirmation dialog
   */
  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  /**
   * Handle form submit (create/update)
   */
  const handleFormSubmit = async (data: CreateProduct | UpdateProduct) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data as UpdateProduct);
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        await createProduct(data as CreateProduct);
        toast.success("Thêm sản phẩm thành công");
      }

      // Close dialog và reset state
      setIsFormDialogOpen(false);
      setEditingProduct(null);

      // Refresh lại danh sách
      await fetchProducts(currentQuery);
    } catch (error) {
      console.error("Lỗi khi xử lý form:", error);
    }
  };

  /**
   * Handle confirm delete product
   */
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const message = await deleteProduct(productToDelete.id);
      toast.success(message);

      // Close dialog và reset state
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);

      // Refresh lại danh sách
      await fetchProducts(currentQuery);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  /**
   * Handle cancel form
   */
  const handleFormCancel = () => {
    setIsFormDialogOpen(false);
    setEditingProduct(null);
  };

  /**
   * Handle cancel delete
   */
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  return {
    // Data
    products,
    categories,
    pagination,

    // States
    isLoading,
    error,
    isFormDialogOpen,
    isDeleteDialogOpen,
    productToDelete,
    editingProduct,
    searchQuery,
    currentQuery,

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
  };
};
