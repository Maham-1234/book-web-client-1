import { apiClient } from "../axiosClient";
import type {
  InventoryTransaction,
  PaginatedResponse,
  CreateManualTransactionData,
} from "@/types";

type InventoryResponse = {
  transaction: InventoryTransaction;
};

type InventoryListReponse = PaginatedResponse<InventoryTransaction>;

export const fetchTransactionsForProduct = async (
  productId: string
): Promise<InventoryListReponse> => {
  const response = await apiClient.get<InventoryListReponse>(
    `/inventory/product/${productId}`
  );
  return response;
};

export const createManualTransaction = async (
  data: CreateManualTransactionData
): Promise<InventoryResponse> => {
  const response = await apiClient.post<InventoryResponse>("/inventory", data);
  return response;
};
