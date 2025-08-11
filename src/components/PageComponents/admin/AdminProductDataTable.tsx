import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";
import { useNavigate } from "react-router-dom";
type AdminProductDataTableProps = {
  products: Product[];
};

export default function AdminProductDataTable({
  products,
}: AdminProductDataTableProps) {
  const navigate = useNavigate();
  const handleManageClick = (productId: string) => {
    navigate(`/admin/product/edit/${productId}`);
    console.log("Manage product:", productId);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.category?.name}</TableCell>
            <TableCell>${Number(product.price).toFixed(2)}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>
              <Button
                onClick={() => handleManageClick(product.id)}
                variant="outline"
                size="sm"
              >
                Manage
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
