import {
  createContext,
  useState,
  useCallback,
  useContext,
  type ReactNode,
} from "react";

import type {
  InventoryTransaction,
  InventoryContextType,
  ApiErrorResponse,
  CreateManualTransactionData,
} from "@/types";

import {
  fetchTransactionsForProduct as apiFetchProductTransactions,
  createManualTransaction as apiCreateManualTransaction,
} from "../api/modules/inventory";
import { useProduct } from "./productContext";

export const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

type InventoryProviderProps = {
  children: ReactNode;
};

export function InventoryProvider({ children }: InventoryProviderProps) {
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { fetchProductById } = useProduct();

  const clearError = useCallback(() => setError(null), []);

  const getProductTransactions = useCallback(async (productId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFetchProductTransactions(productId);
      console.log("api fetch inventory response in context: ", response);
      setTransactions(response.transactions ?? []);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || "Failed to load inventory history.");
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addManualTransaction = useCallback(
    async (data: CreateManualTransactionData) => {
      try {
        const response = await apiCreateManualTransaction(data);
        const newTransaction = response.transaction as InventoryTransaction;

        if (newTransaction) {
          setTransactions((prev) => [newTransaction, ...prev]);
        }

        await fetchProductById(data.productId);

        return newTransaction;
      } catch (err) {
        const apiError = err as ApiErrorResponse;
        throw new Error(
          apiError.message || "The transaction could not be created."
        );
      }
    },
    [fetchProductById]
  );

  const value: InventoryContextType = {
    transactions,
    isLoading,
    error,
    getProductTransactions,
    addManualTransaction,
    clearError,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory(): InventoryContextType {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
