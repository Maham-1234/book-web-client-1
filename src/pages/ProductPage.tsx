import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useProduct } from "@/contexts/productContext";
import { useAuth } from "@/contexts/authContext";
import { useReview } from "@/contexts/reviewContext";

import { ProductImageGallery } from "@/components/PageComponents/product/ProductImageGallery";
import { ProductInfo } from "@/components/PageComponents/product/ProductInfo";
import { ProductActions } from "@/components/PageComponents/product/ProductActions";
import { ProductReviews } from "@/components/PageComponents/product/ProductReviews";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle } from "lucide-react";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();

  const {
    product,
    isLoading: isProductLoading,
    error: productError,
    fetchProductById,
    clearProduct,
  } = useProduct();

  const {
    reviews,
    isLoading: isReviewLoading,
    error: reviewError,
    getReviews,
  } = useReview();

  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
      getReviews(id);
    }

    return () => {
      clearProduct();
    };
  }, [id, fetchProductById, getReviews, clearProduct]);
  useEffect(() => {
    console.log("Reviews updated:", reviews);
  }, [reviews]);

  if (isProductLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-7 gap-8">
          <div className="lg:col-span-3">
            <Skeleton className="w-full h-[400px] lg:h-[500px]" />
          </div>
          <div className="lg:col-span-4 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Product Not Found</AlertTitle>
          <AlertDescription>
            {productError || "We couldn't find the product you're looking for."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        <div className="lg:col-span-3">
          <ProductImageGallery images={product.images || []} />
        </div>

        <div className="lg:col-span-2">
          <ProductInfo product={product} reviews={reviews} />
        </div>

        <div className="lg:col-span-2">
          <ProductActions
            product={product}
            isAuthenticated={isAuthenticated}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        </div>
      </div>

      <Separator className="my-12" />

      <div>
        <ProductReviews
          reviews={reviews}
          isLoading={isReviewLoading}
          error={reviewError}
          productId={product.id}
        />
      </div>
    </div>
  );
}
