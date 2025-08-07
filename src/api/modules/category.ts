import { apiClient } from "../axiosClient";
import type {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
} from "../../types";

type CategoryTreeResponse = {
  categoryTree: Category[];
};

type CategoryResponse = {
  category: Category;
};

/**
 * Fetches all categories organized into a nested parent-child tree.
 * @returns An object containing an array of categories, each with a `children` property.
 */
export const fetchCategoryTree = async (): Promise<CategoryTreeResponse> => {
  return apiClient.get<CategoryTreeResponse>("/categories");
};

/**
 * Fetches a single category by its ID.
 * @param categoryId - The ID of the category to retrieve.
 * @returns The requested category data.
 */
export const fetchCategoryById = async (
  categoryId: number
): Promise<CategoryResponse> => {
  return apiClient.get<CategoryResponse>(`/categories/${categoryId}`);
};

/**
 * [Admin] Creates a new category.
 * @param data - The data for the new category (name and optional parentId).
 * @returns The newly created category data.
 */
export const createCategory = async (
  data: CreateCategoryData
): Promise<CategoryResponse> => {
  return apiClient.post<CategoryResponse, CreateCategoryData>(
    "/categories",
    data
  );
};

/**
 * [Admin] Updates an existing category.
 * @param categoryId - The ID of the category to update.
 * @param data - The category data to update.
 * @returns The updated category data.
 */
export const updateCategory = async (
  categoryId: number,
  data: UpdateCategoryData
): Promise<CategoryResponse> => {
  return apiClient.put<CategoryResponse, UpdateCategoryData>(
    `/categories/${categoryId}`,
    data
  );
};

/**
 * [Admin] Deletes a category.
 * Note: The backend will prevent deletion if the category has children or is assigned to products.
 * @param categoryId - The ID of the category to delete.
 */
export const deleteCategory = async (categoryId: number): Promise<void> => {
  return apiClient.delete<void>(`/categories/${categoryId}`);
};
