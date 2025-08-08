import { type FC, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useOrder } from "@/contexts/orderContext";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Icons
import { CheckCircle2, AlertTriangle } from "lucide-react";

const OrderSuccessPage: FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const {
    currentOrder,
    isLoading,
    error,
    fetchOrderDetails,
    clearCurrentOrder,
  } = useOrder();

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
    // Cleanup function to clear the order from state when the user navigates away
    return () => {
      clearCurrentOrder();
    };
  }, [orderId, fetchOrderDetails, clearCurrentOrder]);

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 animate-pulse">
        <div className="text-center py-10">
          <Skeleton className="h-16 w-16 mx-auto rounded-full" />
          <Skeleton className="h-8 w-72 mx-auto mt-4" />
          <Skeleton className="h-5 w-96 mx-auto mt-2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // --- Error or Not Found State ---
  if (error || !currentOrder) {
    return (
      <div className="container mx-auto p-4 text-center py-20">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Order Not Found</AlertTitle>
          <AlertDescription>
            {error ||
              "We couldn't find the order details. Please check your order history."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // --- Success State ---
  return (
    <div className="container mx-auto p-4">
      <div className="text-center py-10">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold">Thank You for Your Order!</h1>
        <p className="mt-2 text-muted-foreground">
          Your order has been placed and is being processed. Here are the
          details:
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Items Ordered */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Items Ordered ({currentOrder.items.length})</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {currentOrder.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4">
                  <img
                    src={
                      item.product.images?.[0] ||
                      "https://via.placeholder.com/150.png"
                    }
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Summary & Shipping */}
        <div className="lg:col-span-1 space-y-8 sticky top-24">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Order #</span>{" "}
                <span className="font-semibold">
                  {currentOrder.orderNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Order Date</span>{" "}
                <span className="font-semibold">
                  {new Date(currentOrder.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>{" "}
                <span className="font-semibold capitalize">
                  {currentOrder.status}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-base">
                <span>Order Total</span>{" "}
                <span>${currentOrder.totalAmount}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="font-semibold text-primary-foreground">{`${currentOrder.shippingAddress.street}`}</p>
              <p>{`${currentOrder.shippingAddress.city}, ${currentOrder.shippingAddress.state} ${currentOrder.shippingAddress.zipCode}`}</p>
              <p>{currentOrder.shippingAddress.country}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12 text-center flex justify-center gap-4">
        <Button asChild>
          <Link to="/">Continue Shopping</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/orders">View My Orders</Link>
        </Button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
