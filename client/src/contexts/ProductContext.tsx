/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';
import { productService } from '@/services/productService';
import type {
    Product,
    ProductDetail,
    Category,
    ProductQueryParams
} from '@/types/product';
import type { ApiError, PaginationMeta } from '@/types/api';

// Product Context Type - Đơn giản với useState
interface ProductContextType {
    // State
    products: Product[];
    categories: Category[];
    selectedProduct: ProductDetail | null;
    isLoading: boolean;
    error: string | null;
    pagination: PaginationMeta | null;

    // Actions - đơn giản, không cần useCallback
    fetchProducts: (params?: ProductQueryParams) => Promise<void>;
    fetchProductById: (id: string) => Promise<void>;
    fetchCategories: () => Promise<void>;
    searchProducts: (searchTerm: string, params?: ProductQueryParams) => Promise<void>;
    clearError: () => void;
    clearSelectedProduct: () => void;
}

// Create Context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);

    const fetchProducts = async (params?: ProductQueryParams): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await productService.getProducts(params);

            setProducts(response.data);
            setPagination(response.meta);
            console.log('response.data', response.data);
            console.log('response.meta', response.meta);
        } catch (error) {
            const apiError = error as ApiError;
            setError(apiError.message || 'Không thể tải danh sách sản phẩm');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProductById = async (id: string): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const product = await productService.getProductById(id);

            setSelectedProduct(product);
        } catch (error) {
            const apiError = error as ApiError;
            setSelectedProduct(null);
            setError(apiError.message || 'Không thể tải thông tin sản phẩm');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async (): Promise<void> => {
        try {
            setError(null);

            const categoriesData = await productService.getCategories();

            setCategories(categoriesData);
        } catch (error) {
            const apiError = error as ApiError;
            setError(apiError.message || 'Không thể tải danh mục sản phẩm');
        }
    };

    const searchProducts = async (searchTerm: string, params?: ProductQueryParams): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await productService.searchProducts(searchTerm, params);

            setProducts(response.data);
            setPagination(response.meta);
        } catch (error) {
            const apiError = error as ApiError;
            setError(apiError.message || 'Không thể tìm kiếm sản phẩm');
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = (): void => {
        setError(null);
    };

    const clearSelectedProduct = (): void => {
        setSelectedProduct(null);
    };

    const value: ProductContextType = {
        products,
        categories,
        selectedProduct,
        isLoading,
        error,
        pagination,
        fetchProducts,
        fetchProductById,
        fetchCategories,
        searchProducts,
        clearError,
        clearSelectedProduct,
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
}

// Custom hook để sử dụng context
export function useProducts() {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts phải được sử dụng trong ProductProvider');
    }
    return context;
} 