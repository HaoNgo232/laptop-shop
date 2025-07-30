import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAdminProductStore } from "@/stores/admin/adminProductStore";
import { useAdminCategoryStore } from "@/stores/admin/adminCategoryStore";
import { Product, CreateProduct, UpdateProduct } from "@/types";
import { AdminQuery } from "@/types";

/**
 * Hook xử lý logic quản lý sản phẩm
 * Bao gồm CRUD operations, search, pagination
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

  // UI state management
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentQuery, setCurrentQuery] = useState<AdminQuery>({
    page: 1,
    limit: 10,
  });

  // Load data khi component khởi tạo
  useEffect(() => {
    const loadInitialData = async () => {
      // Load song song để giảm thời gian chờ
      await Promise.all([fetchProducts(currentQuery), fetchCategories()]);
    };

    loadInitialData();
  }, []);

  // Xử lý hiển thị lỗi
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleSearch = async () => {
    // Reset về trang 1 khi search mới
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
    toast.success("Dữ liệu đã được làm mới");
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
    navigate(`/products/${product.id}`);
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  /**
   * Xử lý submit form tạo/sửa sản phẩm
   * Logic phức tạp: phân biệt create vs update, reload data sau khi thành công
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

      // Reset UI state sau khi thành công
      setIsFormDialogOpen(false);
      setEditingProduct(null);

      // Reload để cập nhật danh sách
      await fetchProducts(currentQuery);
    } catch (error) {
      console.error("Lỗi khi xử lý form:", error);
    }
  };

  /**
   * Xác nhận xóa sản phẩm
   * Cần reload danh sách và reset state sau khi xóa
   */
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const message = await deleteProduct(productToDelete.id);
      toast.success(message);

      // Reset state
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);

      // Reload danh sách
      await fetchProducts(currentQuery);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const handleFormCancel = () => {
    setIsFormDialogOpen(false);
    setEditingProduct(null);
  };

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
