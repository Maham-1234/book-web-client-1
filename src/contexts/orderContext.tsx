import {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
  type ReactNode,
} from "react";

import type {
  Order,
  CreateOrderData,
  PaginatedResponse,
  ApiErrorResponse,
  OrderContextType,
} from "../types";

import { useAuth } from "./authContext";

import {
  createOrder as apiCreateOrder,
  fetchUserOrders as apiFetchUserOrders,
  fetchOrderById as apiFetchOrderById,
  fetchAllOrders as apiFetchAllOrders,
  updateOrderStatus as apiUpdateOrderStatus,
  cancelOrder as apiCancelOrder,
} from "../api/modules/order";

export const OrderContext = createContext<OrderContextType | undefined>(
  undefined
);

type OrderProviderProps = {
  children: ReactNode;
};

export function OrderProvider({ children }: OrderProviderProps) {
  const { isAuthenticated } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [paginatedOrders, setPaginatedOrders] =
    useState<PaginatedResponse<Order> | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchMyOrders = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFetchUserOrders();
      setOrders(response.orders);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || "Failed to fetch your orders.");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyOrders();
    } else {
      setOrders([]);
      setCurrentOrder(null);
      setPaginatedOrders(null);
    }
  }, [isAuthenticated, fetchMyOrders]);

  const fetchOrderDetails = useCallback(async (orderId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFetchOrderById(orderId);
      setCurrentOrder(response.order);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || "Could not find the requested order.");
      setCurrentOrder(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllAdminOrders = useCallback(
    async (page?: number, limit?: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiFetchAllOrders(page, limit);
        setPaginatedOrders(response);
      } catch (err) {
        const apiError = err as ApiErrorResponse;
        setError(apiError.message || "Failed to fetch all orders.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateStatusAdmin = useCallback(
    async (orderId: string, status: Order["status"]) => {
      setIsUpdating(true);
      setError(null);
      try {
        const response = await apiUpdateOrderStatus(orderId, { status });
        const updatedOrder = response.order;

        setPaginatedOrders((prev) => {
          if (!prev) return null;
          console.log("prev", prev);
          const updatedOrders = prev.orders.map((o) => {
            if (o.id === orderId) {
              return {
                ...updatedOrder,
                user: o.user,
              };
            }
            return o;
          });

          return {
            ...prev,
            orders: updatedOrders,
          };
        });

        if (currentOrder?.id === orderId) {
          setCurrentOrder(updatedOrder);
        }
      } catch (err) {
        const apiError = err as ApiErrorResponse;
        setError(apiError.message || "Failed to update order status.");
        throw apiError;
      } finally {
        setIsUpdating(false);
      }
    },
    [currentOrder]
  );

  const clearCurrentOrder = useCallback(() => {
    setCurrentOrder(null);
  }, []);
  const cancelUserOrder = useCallback(
    async (orderId: string) => {
      setIsUpdating(true);
      setError(null);
      try {
        const response = await apiCancelOrder(orderId);
        const cancelledOrder = response.order;

        // Update the detailed view if it's the one being viewed
        if (currentOrder?.id === orderId) {
          setCurrentOrder(cancelledOrder);
        }

        // Also update the order in the main list
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? cancelledOrder : o))
        );
      } catch (err) {
        const apiError = err as ApiErrorResponse;
        setError(apiError.message || "Failed to cancel the order.");
        throw apiError; // Re-throw for the toast to catch
      } finally {
        setIsUpdating(false);
      }
    },
    [currentOrder]
  );

  const placeOrder = useCallback(async (data: CreateOrderData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiCreateOrder(data);
      setOrders((prev) => [response.order, ...prev]);
      return response.order;
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || "There was a problem placing your order.");
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: OrderContextType = {
    orders,
    currentOrder,
    paginatedOrders,
    isLoading,
    isUpdating,
    error,
    fetchMyOrders,
    fetchOrderDetails,
    placeOrder,
    fetchAllAdminOrders,
    updateStatusAdmin,
    clearCurrentOrder,
    cancelUserOrder,
    clearError,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

export function useOrder(): OrderContextType {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
