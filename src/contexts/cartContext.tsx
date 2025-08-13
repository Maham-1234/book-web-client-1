import {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

import type { Cart, ApiErrorResponse, CartContextType } from "../types";

import { useAuth } from "./authContext";

import {
  fetchCart as apiFetchCart,
  addItemToCart as apiAddItemToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  clearCart as apiClearCart,
} from "../api/modules/cart";

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start true for initial fetch
  const [isUpdatingItem, setIsUpdatingItem] = useState<string | null>(null); // To show loading on a specific item
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFetchCart();
      setCart(response.cart);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || "Failed to load your cart.");
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadCart();
  }, [isAuthenticated, loadCart]);

  const addToCart = useCallback(async (productId: string, quantity: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiAddItemToCart({ productId, quantity });
      setCart(response.cart);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || "Could not add item to cart.");
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateItemQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      setIsUpdatingItem(itemId);
      setError(null);
      try {
        const response = await apiUpdateCartItem(itemId, { quantity });
        setCart(response.cart);
      } catch (err) {
        const apiError = err as ApiErrorResponse;
        setError(apiError.message || "Failed to update item quantity.");
        throw apiError;
      } finally {
        setIsUpdatingItem(null);
      }
    },
    []
  );

  const removeFromCart = useCallback(async (itemId: string) => {
    setIsUpdatingItem(itemId);
    setError(null);
    try {
      const response = await apiRemoveCartItem(itemId);
      setCart(response.cart);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || "Could not remove item from cart.");
      throw apiError;
    } finally {
      setIsUpdatingItem(null);
    }
  }, []);

  const emptyCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClearCart();
      // Update local state to reflect an empty cart
      setCart((prevCart) => (prevCart ? { ...prevCart, items: [] } : null));
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || "Failed to clear the cart.");
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const itemCount = useMemo(() => {
    return cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  }, [cart?.items]);

  const cartTotal = useMemo(() => {
    return (
      cart?.items?.reduce((total, item) => {
        return total + item.quantity * item.product.price;
      }, 0) || 0
    );
  }, [cart?.items]);

  const value: CartContextType = {
    cart,
    itemCount,
    cartTotal,
    isLoading,
    isUpdatingItem,
    error,
    loadCart,
    addToCart,
    updateItemQuantity,
    removeFromCart,
    emptyCart,
    clearError,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook for easy consumption of the context
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
