import { Star } from "lucide-react";
import type { Product, Review } from "@/types";

interface ProductInfoProps {
  product: Product;
  reviews: Review[];
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  reviews,
}) => {
  const getAverageRating = (): number => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((total / reviews.length).toFixed(1));
  };

  const avgRating = getAverageRating();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-md text-muted-foreground">
        by {product.author || product.brand || "Unknown"}
      </p>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.round(avgRating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-muted-foreground text-sm">
          {avgRating} ({reviews?.length || 0} reviews)
        </span>
      </div>

      <p className="text-2xl font-semibold text-primary">${product.price}</p>

      <div>
        <h3 className="font-bold mb-2">Description</h3>
        <p className="text-muted-foreground whitespace-pre-wrap">
          {product.description}
        </p>
      </div>
    </div>
  );
};
