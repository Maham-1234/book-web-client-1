import type { FC } from "react";
import type { InventoryTransaction } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface InventoryHistoryTableProps {
  transactions: InventoryTransaction[];
  isLoading: boolean;
  error: string | null;
}

export const InventoryHistoryTable: FC<InventoryHistoryTableProps> = ({
  transactions,
  isLoading,
  error,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
        {error && <p className="text-destructive text-center py-8">{error}</p>}
        {!isLoading && !error && transactions.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No transactions found for this product.
          </p>
        )}
        {!isLoading && !error && transactions.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Order ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={tx.type === "in" ? "default" : "destructive"}
                    >
                      {tx.type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{tx.quantity}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{tx.reason}</Badge>
                  </TableCell>
                  <TableCell>{tx.orderId || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
