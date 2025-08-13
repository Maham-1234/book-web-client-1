import { type FC, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useOrder } from "@/contexts/orderContext";

import type { Order } from "@/types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { ArrowLeft, AlertTriangle, Loader2 } from "lucide-react";

const getStatusVariant = (
  status: Order["status"]
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "delivered":
      return "default";
    case "shipped":
      return "secondary";
    case "cancelled":
      return "destructive";
    case "pending":
    case "paid":
    default:
      return "outline";
  }
};

const ViewOrderDetailsPage: FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const {
    currentOrder,
    isLoading,
    isUpdating,
    error,
    fetchOrderDetails,
    clearCurrentOrder,
    cancelUserOrder,
  } = useOrder();

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
    return () => {
      clearCurrentOrder();
    };
  }, [orderId, fetchOrderDetails, clearCurrentOrder]);

  const isCancellable = useMemo(() => {
    if (!currentOrder) return false;

    const isCancellableStatus = ["pending", "paid"].includes(
      currentOrder.status
    );

    const orderDate = new Date(currentOrder.createdAt);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    return isCancellableStatus && orderDate > twentyFourHoursAgo;
  }, [currentOrder]);

  const handleCancelOrder = () => {
    if (!orderId) return;

    if (
      window.confirm(
        "Are you sure you want to cancel this order? This will restore stock and cannot be undone."
      )
    ) {
      const cancelPromise = cancelUserOrder(orderId);

      toast.promise(cancelPromise, {
        loading: "Processing cancellation...",
        success: "Your order has been successfully cancelled.",
        error: (err) => err.message || "Failed to cancel the order.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 animate-pulse">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Order Not Found</AlertTitle>
          <AlertDescription>
            {error || "We couldn't find the details for this order."}
          </AlertDescription>
        </Alert>
        <Button variant="outline" asChild className="mt-6">
          <Link to="/myOrders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Orders
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/myOrders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Orders
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Order Details</h1>
        <p className="text-muted-foreground">
          Order #{currentOrder.orderNumber}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Items Ordered ({currentOrder.items.length})</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {currentOrder.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4">
                  <img
                    src={
                      item.product.images?.[0] ||
                      "https://via.placeholder.com/150.png"
                    }
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      SKU: {item.product.sku}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      (${item.price} each)
                    </p>
                  </div>
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
                <span>Status</span>
                <Badge
                  variant={getStatusVariant(currentOrder.status)}
                  className="capitalize"
                >
                  {currentOrder.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Order Date</span>
                <span className="font-semibold">
                  {new Date(currentOrder.createdAt).toLocaleDateString()}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Order Total</span>
                <span>${currentOrder.totalAmount}</span>
              </div>
            </CardContent>
            {/* The Cancel button is conditionally rendered here */}
            {isCancellable && (
              <CardFooter className="border-t pt-4">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleCancelOrder}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Cancel Order
                </Button>
              </CardFooter>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipped To</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p>{`${currentOrder.shippingAddress.street}`}</p>
              <p>{`${currentOrder.shippingAddress.city}, ${currentOrder.shippingAddress.state} ${currentOrder.shippingAddress.zipCode}`}</p>
              <p>{currentOrder.shippingAddress.country}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewOrderDetailsPage;
