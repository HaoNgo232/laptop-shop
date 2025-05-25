/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartService } from '@/services/cartService';
import { useAuth } from '@/contexts/AuthContext';
import type {
    Cart,
    AddToCartRequest,
    UpdateCartItemRequest,
    CartSummary
} from '@/types/cart';
import type { ApiError } from '@/types/api';

interface CartContextType {
    // State
    cart: Cart | null;
    isLoading: boolean;
    error: string | null;

    // Computed values
    cartSummary: CartSummary;

    // Actions
    fetchCart: () => Promise<void>;
    addToCart: (productId: string, quantity: number) => Promise<void>;
    updateCartItem: (productId: string, quantity: number) => Promise<void>;
    removeCartItem: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    clearError: () => void;
}

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// CartProvider
export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { isAuthenticated } = useAuth();

    // Computed values - CartSummary
    const cartSummary: CartSummary = {
        totalItems: cart?.total_items || 0,
        totalPrice: cart?.total_price || 0
    };

    // Load cart khi user login
    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            // Clear cart khi logout
            setCart(null);
            setError(null);
        }
    }, [isAuthenticated]);

    // Fetch cart - đơn giản
    const fetchCart = async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            console.log('🛒 Fetching cart...');
            const cartData = await cartService.getCart();
            console.log('🛒 Cart data received:', cartData);

            setCart(cartData);
        } catch (error) {
            const apiError = error as ApiError;
            console.error('🛒 Cart fetch error:', error);
            setCart(null);
            setError(apiError.message || 'Không thể tải giỏ hàng');
        } finally {
            setIsLoading(false);
        }
    };

    // Add to cart - đơn giản
    const addToCart = async (productId: string, quantity: number): Promise<void> => {
        try {
            setError(null);

            console.log('🛒 Adding to cart:', { productId, quantity });
            const request: AddToCartRequest = { productId, quantity };
            const updatedCart = await cartService.addToCart(request);
            console.log('🛒 Updated cart after add:', updatedCart);

            setCart(updatedCart);
        } catch (error) {
            const apiError = error as ApiError;
            console.error('🛒 Add to cart error:', error);
            setError(apiError.message || 'Không thể thêm sản phẩm vào giỏ hàng');
            throw error; // Re-throw để component handle
        }
    };

    const updateCartItem = async (productId: string, quantity: number): Promise<void> => {
        try {
            setError(null);

            const request: UpdateCartItemRequest = { productId, quantity };
            const updatedCart = await cartService.updateCartItem(request);

            setCart(updatedCart);
        } catch (error) {
            const apiError = error as ApiError;
            setError(apiError.message || 'Không thể cập nhật giỏ hàng');
            throw error;
        }
    };

    const removeCartItem = async (productId: string): Promise<void> => {
        try {
            setError(null);

            const updatedCart = await cartService.removeCartItem(productId);

            setCart(updatedCart);
        } catch (error) {
            const apiError = error as ApiError;
            setError(apiError.message || 'Không thể xóa sản phẩm khỏi giỏ hàng');
            throw error;
        }
    };

    const clearCart = async (): Promise<void> => {
        try {
            setError(null);

            await cartService.clearCart();

            setCart(null);
        } catch (error) {
            const apiError = error as ApiError;
            setError(apiError.message || 'Không thể xóa giỏ hàng');
            throw error;
        }
    };

    const clearError = (): void => {
        setError(null);
    };

    const value: CartContextType = {
        cart,
        isLoading,
        error,
        cartSummary,
        fetchCart,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
        clearError,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

// Custom hook để sử dụng context
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
} 