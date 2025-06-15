import { Alert } from "@/components/ui/alert";
import { apiClient } from "@/services/api";
import { AdminQuery } from "@/types/admin";
import { ApiError, PaginatedResponse } from "@/types/api";
import {
  CreateProduct,
  Product,
  ProductDetail,
  UpdateProduct,
} from "@/types/product";

class AdminProductService {
  // Product APIs
  async getProducts(query?: AdminQuery): Promise<PaginatedResponse<Product>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Product>>(
        "/api/products",
        query,
      );
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      alert(apiError.message);
      throw error;
    }
  }

  async getProductById(productId: string): Promise<ProductDetail> {
    try {
      const response = await apiClient.get<ProductDetail>(
        `/api/admin/products/${productId}`,
      );
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      alert(apiError.message);
      throw error;
    }
  }

  async createProduct(createProductDto: CreateProduct): Promise<Product> {
    try {
      const response = await apiClient.post<Product>(
        "/api/admin/products",
        createProductDto,
      );
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      alert(apiError.message);
      throw error;
    }
  }

  async updateProduct(
    productId: string,
    updateProductDto: UpdateProduct,
  ): Promise<Product> {
    try {
      const response = await apiClient.put<Product>(
        `/api/admin/products/${productId}`,
        updateProductDto,
      );
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      alert(apiError.message);
      throw error;
    }
  }

  async deleteProduct(productId: string): Promise<string> {
    try {
      const response = await apiClient.delete<string>(
        `/api/admin/products/${productId}`,
      );
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      alert(apiError.message);
      throw error;
    }
  }
}

export const adminProductService = new AdminProductService();
