import {
  createContext,
  useState,
  useCallback,
  useContext,
  type ReactNode,
} from "react";

// Import the types and API functions we just created
import type {
  SalesData,
  TopProductData,
  DashboardContextType,
  ApiErrorResponse,
} from "../types";
import {
  fetchSalesOverTime as apiFetchSales,
  fetchTopSellingProducts as apiFetchTopProducts,
} from "../api/modules/dashboard";

export const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

type DashboardProviderProps = {
  children: ReactNode;
};

// 2. Create the Provider component
export function DashboardProvider({ children }: DashboardProviderProps) {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProductData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  /**
   * Fetches all necessary data for the analytics dashboard in parallel.
   */
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Run API calls in parallel for better performance
      const [sales, top] = await Promise.all([
        apiFetchSales(),
        apiFetchTopProducts(),
      ]);

      setSalesData(sales);
      setTopProducts(top);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      const message = apiError.message || "Failed to fetch dashboard data.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // The value object provided to consuming components
  const value: DashboardContextType = {
    salesData,
    topProducts,
    isLoading,
    error,
    fetchDashboardData,
    clearError,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextType {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
