import { create } from "zustand";
import { productService } from "@/services/productService";
import { mockProducts, mockHighStockProducts, mockBestSellingProducts, mockCategories } from "@/data/mockData";
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
  highStockProducts: Product[];
  bestSellingProducts: Product[];

  // Actions
  fetchProducts: (params?: QueryProduct) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  searchProducts: (searchTerm: string, params?: QueryProduct) => Promise<void>;
  fetchHighStockProducts: (limit?: number) => Promise<void>;
  fetchBestSellingProducts: (limit?: number) => Promise<void>;
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
  highStockProducts: [],
  bestSellingProducts: [],

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
      console.warn("API failed, using mock data:", apiError.message);
      
      // Use mock data when API fails
      set({
        products: mockProducts.slice(0, params?.limit || 12),
        pagination: {
          currentPage: 1,
          itemsPerPage: params?.limit || 12,
          totalItems: mockProducts.length,
          totalPages: Math.ceil(mockProducts.length / (params?.limit || 12)),
          hasNextPage: false,
          hasPreviousPage: false,
        },
        isLoading: false,
        error: null, // Don't show error, just use mock data
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
      console.warn("Categories API failed, using mock data:", apiError.message);
      
      // Use mock data when API fails
      set({ 
        categories: mockCategories,
        error: null
      });
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

  fetchHighStockProducts: async (limit = 8) => {
    try {
      set({ error: null });
      const highStockProducts = await productService.getHighStockProducts(limit);
      set({ highStockProducts });
    } catch (error) {
      const apiError = error as ApiError;
      console.warn("High stock API failed, using mock data:", apiError.message);
      
      // Use mock data when API fails
      set({ 
        highStockProducts: mockHighStockProducts.slice(0, limit),
        error: null
      });
    }
  },

  fetchBestSellingProducts: async (limit = 8) => {
    try {
      set({ error: null });
      const bestSellingProducts = await productService.getBestSellingProducts(limit);
      set({ bestSellingProducts });
    } catch (error) {
      const apiError = error as ApiError;
      console.warn("Best selling API failed, using mock data:", apiError.message);
      
      // Use mock data when API fails
      set({ 
        bestSellingProducts: mockBestSellingProducts.slice(0, limit),
        error: null
      });
    }
  },

  clearError: () => set({ error: null }),

  clearSelectedProduct: () => set({ selectedProduct: null }),
}));
