import type { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CartItem } from "@/types";
import { CartItemRow } from "./CartItemRow";

interface CartItemsListProps {
  items: CartItem[];
}

export const CartItemsList: FC<CartItemsListProps> = ({ items }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Items</CardTitle>
      </CardHeader>
      <CardContent className="divide-y">
        {items.map((item) => (
          <CartItemRow key={item.id} item={item} />
        ))}
      </CardContent>
    </Card>
  );
};
