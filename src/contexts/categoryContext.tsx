import {
  createContext,
  useState,
  useCallback,
  useContext,
  type ReactNode,
} from "react";

import type { Category, CategoryContextType, ApiErrorResponse } from "../types";

import { fetchCategoryTree as apiFetchCategoryTree } from "../api/modules/category";

export const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

type CategoryProviderProps = {
  children: ReactNode;
};

export function CategoryProvider({ children }: CategoryProviderProps) {
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryTree = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { categoryTree } = await apiFetchCategoryTree();
      setCategoryTree(categoryTree);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || "Failed to load categories.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: CategoryContextType = {
    categoryTree,
    isLoading,
    error,
    fetchCategoryTree,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory(): CategoryContextType {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
}
