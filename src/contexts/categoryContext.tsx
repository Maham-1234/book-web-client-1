import {
  createContext,
  useState,
  useCallback,
  useContext,
  type ReactNode,
} from "react";

import type {
  Category,
  CategoryContextType,
  ApiErrorResponse,
  CreateCategoryData,
  UpdateCategoryData,
} from "../types";

import {
  fetchCategoryTree as apiFetchCategoryTree,
  createCategory as apiCreateCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory,
} from "../api/modules/category";

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
  const createCategory = useCallback(
    async (data: CreateCategoryData) => {
      try {
        setIsLoading(true);
        setError(null);
        const formattedData = {
          ...data,
          parentId:
            data.parentId === undefined ||
            data.parentId === null ||
            data.parentId === ""
              ? null
              : typeof data.parentId === "string"
              ? Number(data.parentId)
              : data.parentId,
        };

        console.log("create category data", formattedData);
        await apiCreateCategory(data);
        await fetchCategoryTree();
      } catch (err) {
        const apiError = err as ApiErrorResponse;
        setError(apiError.message || "Failed to create category.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchCategoryTree]
  );

  const updateCategory = useCallback(
    async (categoryId: number, data: UpdateCategoryData) => {
      try {
        setIsLoading(true);
        setError(null);
        await apiUpdateCategory(categoryId, data);
        // Refresh categories after update
        await fetchCategoryTree();
      } catch (err) {
        const apiError = err as ApiErrorResponse;
        setError(apiError.message || "Failed to update category.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchCategoryTree]
  );

  const deleteCategory = useCallback(
    async (categoryId: number) => {
      try {
        setIsLoading(true);
        setError(null);
        await apiDeleteCategory(categoryId);
        // Refresh categories after delete
        await fetchCategoryTree();
      } catch (err) {
        const apiError = err as ApiErrorResponse;
        setError(apiError.message || "Failed to delete category.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchCategoryTree]
  );

  const value: CategoryContextType = {
    categoryTree,
    isLoading,
    error,
    fetchCategoryTree,
    createCategory,
    updateCategory,
    deleteCategory,
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
