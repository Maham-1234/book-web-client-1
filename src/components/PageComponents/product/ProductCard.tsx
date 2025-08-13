import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Loader2 } from "lucide-react";
import type { Product } from "@/types";
import toast from "react-hot-toast";
import { useState } from "react";
import { useCart } from "@/contexts/cartContext";

type ProductCardProps = {
  product: Product;
  userRole?: "admin" | "buyer";
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  userRole,
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userRole) {
      toast.error("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error: any) {
      toast.error(error.message || "Could not add item to cart.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card
      className="overflow-hidden group cursor-pointe pb-0 pt-0"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/400.png"}
          alt={product.name}
          className="h-64 w-full object-cover transition-transform group-hover:scale-105"
        />
        {product.stock === 0 && (
          <Badge variant="destructive" className="absolute top-2 left-2">
            Out of Stock
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground">
          {product.author || product.brand || ""}
        </p>
        <div className="flex justify-between items-center mt-4">
          <p className="font-semibold text-lg">${product.price}</p>

          {userRole !== "admin" && (
            <Button
              size="icon"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
            >
              {isAdding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
