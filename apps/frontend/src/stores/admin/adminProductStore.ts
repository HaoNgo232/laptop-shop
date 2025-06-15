import { create } from "zustand";
import { AdminQuery } from "@/types/admin";
import { CreateProduct, Product, UpdateProduct } from "@/types/product";
import { ApiError, PaginationMeta } from "@/types/api";
import { adminProductService } from "@/services/adminServices/adminProductService";

interface AdminProductState {
  // Products State
  products: Product[];
  selectedProduct: Product | null;
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;

  // Products Actions
  fetchProducts: (query?: AdminQuery) => Promise<void>;
  fetchProductById: (productId: string) => Promise<void>;
  createProduct: (createProductDto: CreateProduct) => Promise<void>;
  updateProduct: (
    productId: string,
    updateProductDto: UpdateProduct,
  ) => Promise<void>;
  deleteProduct: (productId: string) => Promise<string>;
  restoreProduct: (productId: string) => Promise<void>;
  clearSelectedProduct: () => void;
  clearError: () => void;
}

export const useAdminProductStore = create<AdminProductState>((set, get) => ({
  // State
  products: [],
  selectedProduct: null,
  pagination: null,
  isLoading: false,
  error: null,

  // Actions
  async fetchProducts(query?: AdminQuery) {
    try {
      set({ isLoading: true, error: null });
      const response = await adminProductService.getProducts(query);
      set({
        products: response.data,
        pagination: response.meta,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể tải danh sách sản phẩm",
        isLoading: false,
      });
    }
  },

  async fetchProductById(productId: string) {
    try {
      set({ isLoading: true, error: null });
      const response = await adminProductService.getProductById(productId);
      set({ selectedProduct: response, isLoading: false });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể tải chi tiết sản phẩm",
        isLoading: false,
      });
    }
  },

  async createProduct(createProductDto: CreateProduct) {
    try {
      set({ isLoading: true, error: null });
      const response =
        await adminProductService.createProduct(createProductDto);
      const { products } = get();
      set({
        products: [...products, response],
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể tạo sản phẩm",
        isLoading: false,
      });
    }
  },

  async updateProduct(productId: string, updateProductDto: UpdateProduct) {
    try {
      set({ isLoading: true, error: null });
      const response = await adminProductService.updateProduct(
        productId,
        updateProductDto,
      );
      const { products } = get();
      set({
        products: products.map((product) =>
          product.id === productId ? response : product,
        ),
        selectedProduct: response,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể cập nhật sản phẩm",
        isLoading: false,
      });
    }
  },

  async deleteProduct(productId: string): Promise<string> {
    try {
      set({ isLoading: true, error: null });
      const response = await adminProductService.deleteProduct(productId);
      const { products } = get();
      set({
        products: products.filter((product) => product.id !== productId),
        isLoading: false,
      });
      return response.message; // Trả về message từ response object
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể chuyển sản phẩm vào thùng rác",
        isLoading: false,
      });
      throw error;
    }
  },

  async restoreProduct(productId: string): Promise<void> {
    try {
      set({ isLoading: true, error: null });
      const restoredProduct =
        await adminProductService.restoreProduct(productId);
      const { selectedProduct } = get();
      set({
        isLoading: false,
        // Cập nhật selectedProduct nếu đó là sản phẩm vừa được khôi phục
        selectedProduct:
          selectedProduct?.id === productId ? restoredProduct : selectedProduct,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể khôi phục sản phẩm",
        isLoading: false,
      });
      throw error;
    }
  },

  clearSelectedProduct: () => set({ selectedProduct: null }),
  clearError: () => set({ error: null }),
}));
