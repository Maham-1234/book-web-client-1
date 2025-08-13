import { type FC, useEffect } from "react";
import { Link } from "react-router-dom";
import { useOrder } from "@/contexts/orderContext";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { AlertTriangle, FileText } from "lucide-react";

import { OrderHistoryCard } from "@/components/PageComponents/order/OrderHistoryCard";

const MyOrdersPage: FC = () => {
  const { orders, isLoading, error, fetchMyOrders } = useOrder();

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center py-20">
        <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-bold">No Orders Yet</h2>
        <p className="mt-2 text-muted-foreground">
          You haven't placed any orders with us. Let's change that!
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <OrderHistoryCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;
