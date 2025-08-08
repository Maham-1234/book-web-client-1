import { FC } from "react";
import { useCart } from "@/contexts/cartContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

interface CartSummaryProps {
  onCheckout: () => void;
  isLoading: boolean;
}

export const CartSummary: FC<CartSummaryProps> = ({
  onCheckout,
  isLoading,
}) => {
  const { cartTotal } = useCart();

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold">${cartTotal?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Shipping</span>
          <span>Calculated at next step</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${cartTotal?.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          onClick={onCheckout}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  );
};
