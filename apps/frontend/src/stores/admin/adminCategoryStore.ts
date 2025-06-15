import { create } from "zustand";
import { Category, CreateCategory, UpdateCategory } from "@/types/product";
import { ApiError } from "@/types/api";
import { adminCategoryService } from "@/services/adminServices/adminCategoryService";
import { productService } from "@/services/productService";

interface AdminCategoryState {
  // Categories State
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // Categories Actions
  fetchCategories: () => Promise<void>;
  createCategory: (createCategoryDto: CreateCategory) => Promise<void>;
  updateCategory: (
    categoryId: string,
    updateCategoryDto: UpdateCategory,
  ) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  clearError: () => void;
}

export const useAdminCategoryStore = create<AdminCategoryState>((set, get) => ({
  // State
  categories: [],
  isLoading: false,
  error: null,

  // Actions
  async fetchCategories() {
    try {
      set({ isLoading: true, error: null });
      const response = await productService.getCategories();
      set({ categories: response, isLoading: false });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể tải danh sách danh mục",
        isLoading: false,
      });
    }
  },

  async createCategory(createCategoryDto: CreateCategory) {
    try {
      set({ isLoading: true, error: null });
      const response =
        await adminCategoryService.createCategory(createCategoryDto);
      const { categories } = get();
      set({
        categories: [...categories, response],
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể tạo danh mục",
        isLoading: false,
      });
    }
  },

  async updateCategory(categoryId: string, updateCategoryDto: UpdateCategory) {
    try {
      set({ isLoading: true, error: null });
      const response = await adminCategoryService.updateCategory(
        categoryId,
        updateCategoryDto,
      );
      const { categories } = get();
      set({
        categories: categories.map((category) =>
          category.id === categoryId ? response : category,
        ),
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể cập nhật danh mục",
        isLoading: false,
      });
    }
  },

  async deleteCategory(categoryId: string) {
    try {
      set({ isLoading: true, error: null });
      await adminCategoryService.deleteCategory(categoryId);
      const { categories } = get();
      set({
        categories: categories.filter((category) => category.id !== categoryId),
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể xóa danh mục",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
