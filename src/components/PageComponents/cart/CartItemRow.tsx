import type { FC } from "react";
import toast from "react-hot-toast";
import { useCart } from "@/contexts/cartContext";
import type { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow: FC<CartItemRowProps> = ({ item }) => {
  const { updateItemQuantity, removeFromCart, isUpdatingItem } = useCart();
  const isUpdating = isUpdatingItem === item.id;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.product.stock) return;
    updateItemQuantity(item.id, newQuantity).catch((err) => {
      toast.error(err.message || "Failed to update quantity.");
    });
  };

  const handleRemove = () => {
    toast.promise(removeFromCart(item.id), {
      loading: "Removing item...",
      success: "Item removed.",
      error: (err) => err.message || "Failed to remove item.",
    });
  };

  return (
    <div className="flex items-center gap-4 py-4">
      <Link to={`/products/${item.product.id}`}>
        <img
          src={
            item.product.images?.[0] || "https://via.placeholder.com/150.png"
          }
          alt={item.product.name}
          className="w-24 h-24 object-cover rounded-md"
        />
      </Link>
      <div className="flex-1">
        <Link
          to={`/products/${item.product.id}`}
          className="font-semibold hover:underline"
        >
          {item.product.name}
        </Link>
        <p className="text-sm text-muted-foreground">${item.product.price}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={isUpdating || item.quantity <= 1}
        >
          -
        </Button>
        <span className="w-10 text-center font-semibold">
          {isUpdating ? (
            <Loader2 className="h-4 w-4 mx-auto animate-spin" />
          ) : (
            item.quantity
          )}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isUpdating || item.quantity >= item.product.stock}
        >
          +
        </Button>
      </div>
      <div className="font-semibold w-20 text-right">
        ${(item.quantity * item.product.price).toFixed(2)}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleRemove}
        disabled={isUpdating}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
};
