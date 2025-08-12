import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useProduct } from "@/contexts/productContext";
import { useAuth } from "@/contexts/authContext";
import { useReview } from "@/contexts/reviewContext";
import { useInventory } from "@/contexts/inventoryContext";

import { ProductImageGallery } from "@/components/PageComponents/product/ProductImageGallery";
import { ProductInfo } from "@/components/PageComponents/product/ProductInfo";
import { ProductActions } from "@/components/PageComponents/product/ProductActions";
import { ProductReviews } from "@/components/PageComponents/product/ProductReviews";

import { InventoryHistoryTable } from "@/components/PageComponents/admin/InventoryHistoryTable";
import { ManualTransactionForm } from "@/components/PageComponents/admin/ManualTransactionForm";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();

  const { user, isAuthenticated } = useAuth();
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
  const {
    transactions,
    isLoading: isInventoryLoading,
    error: inventoryError,
    getProductTransactions,
  } = useInventory();

  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (id) {
      fetchProductById(id);

      if (user?.role === "admin") {
        getProductTransactions(id);
      } else {
        getReviews(id);
      }
    }
    return () => {
      clearProduct();
    };
  }, [
    id,
    fetchProductById,
    getReviews,
    clearProduct,
    getProductTransactions,
    user?.role,
  ]);

  if (isProductLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="w-full h-[400px] lg:h-[500px]" />
          <div className="space-y-4">
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
            {productError || "We couldn't find the product."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isAdminView = user?.role === "admin";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {isAdminView ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <ProductImageGallery images={product.images || []} />
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                <p className="text-3xl font-bold text-primary mb-4">
                  ${Number(product.price).toFixed(2)}
                </p>
                <p className="text-lg">
                  <strong>Current Stock:</strong> {product.stock}
                </p>
                <Separator className="my-4" />
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <ManualTransactionForm productId={product.id} />
            <InventoryHistoryTable
              transactions={transactions}
              isLoading={isInventoryLoading}
              error={inventoryError}
            />
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
