import {
  createContext,
  useState,
  useCallback,
  useContext,
  type ReactNode,
} from "react";

import type {
  Review,
  CreateReviewData,
  UpdateReviewData,
  ApiErrorResponse,
  ReviewContextType,
} from "@/types";

import {
  fetchReviewsByProductId as apiFetchReviewsByProductId,
  createReview as apiCreateReview,
  updateReview as apiUpdateReview,
  deleteReview as apiDeleteReview,
} from "@/api/modules/review";

export const ReviewContext = createContext<ReviewContextType | undefined>(
  undefined
);

interface ReviewProviderProps {
  children: ReactNode;
}

export function ReviewProvider({ children }: ReviewProviderProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const getReviews = useCallback(async (productId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const reviewsResponse = await apiFetchReviewsByProductId(productId);
      console.log("review context data: ", reviewsResponse);
      setReviews(reviewsResponse.reviews);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || "Failed to fetch reviews.");
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addReview = useCallback(async (data: CreateReviewData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newReviewResponse = await apiCreateReview(data);
      setReviews((prevReviews) => [newReviewResponse.data, ...prevReviews]);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || "Could not post your review.");
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const editReview = useCallback(
    async (reviewId: string, data: UpdateReviewData) => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedReviewResponse = await apiUpdateReview(reviewId, data); // returns ApiResponse<Review>
        setReviews((prevReviews) =>
          prevReviews.map((r) =>
            r.id === reviewId ? updatedReviewResponse.data : r
          )
        );
      } catch (err) {
        const apiError = err as ApiErrorResponse;
        setError(apiError.message || "Failed to update review.");
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const removeReview = useCallback(async (reviewId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiDeleteReview(reviewId); // returns null
      setReviews((prevReviews) => prevReviews.filter((r) => r.id !== reviewId));
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || "Failed to delete review.");
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: ReviewContextType = {
    reviews,
    isLoading,
    error,
    getReviews,
    addReview,
    editReview,
    removeReview,
    clearError,
  };

  return (
    <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
  );
}

/**
 * Hook for consuming the Review context.
 */
export function useReview(): ReviewContextType {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReview must be used within a ReviewProvider");
  }
  return context;
}
