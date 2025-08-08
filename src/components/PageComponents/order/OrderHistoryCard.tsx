import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import type { Order } from "@/types";

// UI Components
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

interface OrderHistoryCardProps {
  order: Order;
}

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

export const OrderHistoryCard: FC<OrderHistoryCardProps> = ({ order }) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge variant={getStatusVariant(order.status)} className="capitalize">
          {order.status}
        </Badge>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <div className="flex space-x-4">
          {order.items.slice(0, 4).map((item) => (
            <img
              key={item.id}
              src={
                item.product.images?.[0] ||
                "https://via.placeholder.com/150.png"
              }
              alt={item.product.name}
              className="h-16 w-16 rounded-md object-cover border"
            />
          ))}
          {order.items.length > 4 && (
            <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center text-sm font-semibold">
              +{order.items.length - 4}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-muted/50 p-4">
        <div>
          <span className="text-muted-foreground">Total: </span>
          <span className="font-bold text-lg">${order.totalAmount}</span>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(`/order/${order.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
