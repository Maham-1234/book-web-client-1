import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; // Import Alert
import { Star, AlertTriangle } from "lucide-react";
import type { Review } from "@/types";

interface ProductReviewsProps {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  productId: string | number;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  reviews,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Could not load reviews. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        <p className="text-muted-foreground">
          This product has no reviews yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-4">
            <Avatar>
              <AvatarImage
                src={review.user?.avatar}
                alt={review.user?.firstName}
              />
              <AvatarFallback>
                {review.user?.firstName?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold">
                  {review.user?.firstName || "Anonymous"}
                </p>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {review.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
