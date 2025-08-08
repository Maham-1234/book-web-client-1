import { apiClient } from "../axiosClient";
import type {
  Product,
  PaginatedResponse,
  CreateProductData,
  UpdateProductData,
  ProductFilters,
} from "../../types";

type ProductResponse = {
  product: Product;
};

type ProductListResponse = PaginatedResponse<Product>;

/**
 * Fetches a paginated and filtered list of products.
 * @param filters - Optional filters for pagination, search, category, etc.
 * @returns A paginated response of products.
 */
export const fetchProducts = async (
  filters?: ProductFilters
): Promise<ProductListResponse> => {
  const params = new URLSearchParams();
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());
  if (filters?.search) params.append("search", filters.search);
  if (filters?.categoryId)
    params.append("categoryId", filters.categoryId.toString());
  if (filters?.sortBy) params.append("sortBy", filters.sortBy);
  if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

  return apiClient.get<ProductListResponse>(`/product?${params.toString()}`);
};

/**
 * Fetches a single product by its unique ID.
 * @param productId - The UUID of the product.
 * @returns The product data.
 */
export const fetchProductById = async (
  productId: string
): Promise<ProductResponse> => {
  return apiClient.get<ProductResponse>(`/product/${productId}`);
};

/**
 * [Admin] Creates a new product.
 * @param data - The data for the new product.
 * @returns The newly created product data.
 */
export const createProductText = async (
  data: Omit<CreateProductData, "images">
): Promise<ProductResponse> => {
  // This function sends JSON, not FormData
  return apiClient.post<ProductResponse>("/product", data);
};

/**
 * [Admin] Uploads images for an existing product.
 * @param productId - The ID of the product to associate the images with.
 * @param images - An array of File objects to upload.
 * @returns The updated product data with new image URLs.
 */
export const uploadProductImages = async (
  productId: string,
  images: File[]
): Promise<ProductResponse> => {
  const formData = new FormData();
  for (const file of images) {
    formData.append("images", file);
  }

  return apiClient.post<ProductResponse>(
    `/product/upload/${productId}`,
    formData
  );
};

/**
 * [Admin] Updates an existing product, with optional new image uploads.
 * @param productId - The UUID of the product to update.
 * @param data - The product data to update.
 * @returns The updated product data.
 */
export const updateProduct = async (
  productId: string,
  data: UpdateProductData
): Promise<ProductResponse> => {
  const { images, ...textData } = data;

  return apiClient.put<ProductResponse>(`/product/${productId}`, textData);
};

/**
 * [Admin] Soft-deletes a product.
 * @param productId - The UUID of the product to delete.
 */
export const deleteProduct = async (productId: string): Promise<void> => {
  return apiClient.delete<void>(`/product/${productId}`);
};
