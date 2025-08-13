import { useState, FC } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

import type { Product } from "@/types";
import { useCart } from "@/contexts/cartContext";

interface ProductActionsProps {
  product: Product;
  isAuthenticated: boolean;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
}

export const ProductActions: FC<ProductActionsProps> = ({
  product,
  isAuthenticated,
  quantity,
  setQuantity,
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(product.id, quantity);

      toast.success(`${quantity} x ${product.name} added to cart!`);
    } catch (error: any) {
      toast.error(error.message || "Could not add item to cart.");
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + amount;
      if (newQuantity < 1) return 1;
      if (newQuantity > product.stock) return product.stock;
      return newQuantity;
    });
  };

  const inStock = product.stock > 0;

  return (
    <Card className="border-2 rounded-lg sticky top-24">
      <CardHeader>
        <p className="text-2xl font-bold">${product.price}</p>
        <p
          className={`font-semibold ${
            inStock ? "text-green-600" : "text-destructive"
          }`}
        >
          {inStock ? "In Stock" : "Out of Stock"}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {inStock && (
          <>
            <div className="flex items-center justify-between">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1 || isAdding}
                >
                  -
                </Button>
                <span className="w-10 text-center font-semibold">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock || isAdding}
                >
                  +
                </Button>
              </div>
            </div>
            <Separator />

            <Button
              className="w-full"
              size="lg"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isAdding ? "Adding..." : "Add to Cart"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
