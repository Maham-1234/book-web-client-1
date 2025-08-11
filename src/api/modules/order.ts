import { apiClient } from "../axiosClient";
import type { Order, CreateOrderData, PaginatedResponse } from "../../types";

type OrderResponse = {
  order: Order;
};

type OrderListResponse = {
  orders: Order[];
};

type AllOrdersResponse = PaginatedResponse<Order>;

type UpdateOrderStatusData = {
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
};

/**
 * Creates a new order from the user's cart.
 * @param data - The shipping address for the order.
 * @returns The newly created order data.
 */
export const createOrder = async (
  data: CreateOrderData
): Promise<OrderResponse> => {
  return apiClient.post<OrderResponse, CreateOrderData>("/order", data);
};

/**
 * Fetches the logged-in user's complete order history.
 * @returns A list of the user's orders.
 */
export const fetchUserOrders = async (): Promise<OrderListResponse> => {
  return apiClient.get<OrderListResponse>("/order");
};

/**
 * Fetches a single, specific order by its ID.
 * @param orderId - The UUID of the order.
 * @returns The detailed order data.
 */
export const fetchOrderById = async (
  orderId: string
): Promise<OrderResponse> => {
  return apiClient.get<OrderResponse>(`/order/${orderId}`);
};

/**
 * [Admin] Fetches a paginated list of all orders from all users.
 * @param page - The page number for pagination.
 * @param limit - The number of orders per page.
 * @returns A paginated list of all orders.
 */
export const fetchAllOrders = async (
  page = 1,
  limit = 20
): Promise<AllOrdersResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  // Note: The backend route for this might be protected by admin middleware (e.g., /api/admin/orders)
  return apiClient.get<AllOrdersResponse>(
    `/order/admin/all?${params.toString()}`
  );
};

/**
 * [Admin] Updates the status of a specific order.
 * @param orderId - The UUID of the order to update.
 * @param data - The new status for the order.
 * @returns The updated order data.
 */
export const updateOrderStatus = async (
  orderId: string,
  data: UpdateOrderStatusData
): Promise<OrderResponse> => {
  return apiClient.put<OrderResponse, UpdateOrderStatusData>(
    `/order/admin/${orderId}/status`,
    data
  );
};

/**
 * Cancels a user's order if it's within the allowed timeframe.
 * @param orderId - The UUID of the order to cancel.
 * @returns The updated order data with 'cancelled' status.
 */
export const cancelOrder = async (orderId: string): Promise<OrderResponse> => {
  return apiClient.delete<OrderResponse>(`/order/${orderId}`);
};
