import { apiClient } from "@/services/api";
import { AdminQuery } from "@/types/admin";
import { PaginatedResponse } from "@/types/api";
import {
  CreateProduct,
  Product,
  ProductDetail,
  UpdateProduct,
} from "@/types/product";

class AdminProductService {
  // Product APIs
  async getProducts(query?: AdminQuery): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get<PaginatedResponse<Product>>(
      "/api/products",
      query,
    );
    return response;
  }

  async getProductById(productId: string): Promise<ProductDetail> {
    const response = await apiClient.get<ProductDetail>(
      `/api/products/${productId}`,
    );
    return response;
  }

  async createProduct(createProductDto: CreateProduct): Promise<Product> {
    const response = await apiClient.post<Product>(
      "/api/admin/products",
      createProductDto,
    );
    return response;
  }

  async updateProduct(
    productId: string,
    updateProductDto: UpdateProduct,
  ): Promise<Product> {
    const response = await apiClient.put<Product>(
      `/api/admin/products/${productId}`,
      updateProductDto,
    );
    return response;
  }

  async deleteProduct(productId: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(
      `/api/admin/products/${productId}`,
    );
    return response;
  }

  async restoreProduct(productId: string): Promise<Product> {
    const response = await apiClient.patch<Product>(
      `/api/admin/products/${productId}/restore`,
      {}, // Body rỗng cho PATCH request
    );
    return response;
  }
}

export const adminProductService = new AdminProductService();
