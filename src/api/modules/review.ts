import { apiClient } from "../axiosClient";
import type {
  Review,
  CreateReviewData,
  UpdateReviewData,
  ApiResponse,
} from "@/types";

/**
 * Fetches all reviews for a specific product.
 * @param productId - The UUID of the product.
 * @returns A promise that resolves to an ApiResponse with an array of reviews.
 */
export const fetchReviewsByProductId = (
  productId: string
): Promise<ApiResponse<Review[]>> => {
  return apiClient.get<ApiResponse<Review[]>>(`/review/product/${productId}`);
};

/**
 * Creates a new review for a product.
 * @param data - The review data (productId, rating, comment).
 * @returns A promise that resolves to an ApiResponse with the newly created review.
 */
export const createReview = (
  data: CreateReviewData
): Promise<ApiResponse<Review>> => {
  return apiClient.post<ApiResponse<Review>>("/reviews", data);
};

/**
 * Updates an existing review.
 * @param reviewId - The UUID of the review to update.
 * @param data - The updated review data (rating, comment).
 * @returns A promise that resolves to an ApiResponse with the updated review.
 */
export const updateReview = (
  reviewId: string,
  data: UpdateReviewData
): Promise<ApiResponse<Review>> => {
  return apiClient.put<ApiResponse<Review>>(`/reviews/${reviewId}`, data);
};

/**
 * Deletes a user's review.
 * @param reviewId - The UUID of the review to delete.
 * @returns A promise that resolves to an ApiResponse with no data.
 */
export const deleteReview = (reviewId: string): Promise<ApiResponse<null>> => {
  return apiClient.delete<ApiResponse<null>>(`/reviews/${reviewId}`);
};
