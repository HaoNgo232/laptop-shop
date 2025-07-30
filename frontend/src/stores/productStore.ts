import { create } from "zustand";
import { productService } from "@/services/productService";
import type {
  Product,
  ProductDetail,
  Category,
  QueryProduct,
  PaginationMeta,
  ApiError,
} from "@/types";

interface ProductState {
  // State
  products: Product[];
  categories: Category[];
  selectedProduct: ProductDetail | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;

  // Actions
  fetchProducts: (params?: QueryProduct) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  searchProducts: (searchTerm: string, params?: QueryProduct) => Promise<void>;
  clearError: () => void;
  clearSelectedProduct: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  // Initial state
  products: [],
  categories: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  pagination: null,

  // Actions
  fetchProducts: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const defaultParams: QueryProduct = {
        page: 1,
        limit: 12,
        ...params,
      };

      const response = await productService.getProducts(defaultParams);

      set({
        products: response.data,
        pagination: response.meta,
        isLoading: false,
      });
      console.log(" Products fetched:", response.data);
      console.log(" Pagination:", response.meta);
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể tải danh sách sản phẩm",
        isLoading: false,
      });
    }
  },

  fetchProductById: async (id) => {
    try {
      set({ isLoading: true, error: null });

      const product = await productService.getProductById(id);

      set({
        selectedProduct: product,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        selectedProduct: null,
        error: apiError.message || "Không thể tải thông tin sản phẩm",
        isLoading: false,
      });
    }
  },

  fetchCategories: async () => {
    try {
      set({ error: null });

      const categoriesData = await productService.getCategories();

      set({ categories: categoriesData });
    } catch (error) {
      const apiError = error as ApiError;
      set({ error: apiError.message || "Không thể tải danh mục sản phẩm" });
    }
  },

  searchProducts: async (searchTerm, params) => {
    try {
      set({ isLoading: true, error: null });

      const response = await productService.searchProducts(searchTerm, params);

      set({
        products: response.data,
        pagination: response.meta,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể tìm kiếm sản phẩm",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),

  clearSelectedProduct: () => set({ selectedProduct: null }),
}));
