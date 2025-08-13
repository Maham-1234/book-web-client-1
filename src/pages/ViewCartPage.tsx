import type { FC } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useCart } from "@/contexts/cartContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ShoppingCart } from "lucide-react";

import { CartItemsList } from "@/components/PageComponents/cart/CartItemsList";
import { CartSummary } from "@/components/PageComponents/cart/CartSummary";

const ViewCartPage: FC = () => {
  const navigate = useNavigate();
  const { cart, isLoading, error, itemCount } = useCart();

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleCheckout = () => {
    setIsPlacingOrder(true);
    navigate("/checkout");
    setIsPlacingOrder(false);
  };
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <Skeleton className="w-full h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!cart || itemCount === 0) {
    return (
      <div className="container mx-auto p-4 text-center py-20">
        <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-bold">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">
          Looks like you haven't added any books yet.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <CartItemsList items={cart.items} />
        </div>
        <div className="lg:col-span-1">
          <CartSummary onCheckout={handleCheckout} isLoading={isPlacingOrder} />
        </div>
      </div>
    </div>
  );
};

export default ViewCartPage;
