import { apiClient } from "../axiosClient";
import type { Cart, AddItemToCartData, UpdateCartItemData } from "../../types";

type CartResponse = {
  cart: Cart;
};

/**
 * Fetches the current user's shopping cart.
 * @returns The user's cart data.
 */
export const fetchCart = async (): Promise<CartResponse> => {
  return apiClient.get<CartResponse>("/cart");
};

/**
 * Adds a product to the user's cart.
 * @param data - The product ID and quantity to add.
 * @returns The updated cart data.
 */
export const addItemToCart = async (
  data: AddItemToCartData
): Promise<CartResponse> => {
  return apiClient.post<CartResponse, AddItemToCartData>("/cart/items", data);
};

/**
 * Updates the quantity of a specific item in the cart.
 * @param itemId - The ID of the cart item to update.
 * @param data - The new quantity.
 * @returns The updated cart data.
 */
export const updateCartItem = async (
  itemId: string,
  data: UpdateCartItemData
): Promise<CartResponse> => {
  return apiClient.put<CartResponse, UpdateCartItemData>(
    `/cart/items/${itemId}`,
    data
  );
};

/**
 * Removes an item from the cart.
 * @param itemId - The ID of the cart item to remove.
 * @returns The updated cart data.
 */
export const removeCartItem = async (itemId: string): Promise<CartResponse> => {
  return apiClient.delete<CartResponse>(`/cart/items/${itemId}`);
};

/**
 * Clears all items from the user's cart.
 */
export const clearCart = async (): Promise<void> => {
  return apiClient.delete<void>("/cart");
};
