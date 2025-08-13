import { apiClient } from "../axiosClient";
import type { SalesData, TopProductData } from "@/types";

export const fetchSalesOverTime = async (): Promise<SalesData[]> => {
  return apiClient.get<SalesData[]>("/dashboard/sales-over-time");
};

export const fetchTopSellingProducts = async (): Promise<TopProductData[]> => {
  return apiClient.get<TopProductData[]>("/dashboard/top-selling-products");
};
