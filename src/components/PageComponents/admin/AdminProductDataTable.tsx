// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import type { Product } from "@/types";
// import { useNavigate } from "react-router-dom";
// type AdminProductDataTableProps = {
//   products: Product[];
// };

// export default function AdminProductDataTable({
//   products,
// }: AdminProductDataTableProps) {
//   const navigate = useNavigate();
//   const handleManageClick = (productId: string) => {
//     navigate(`/admin/product/edit/${productId}`);
//     console.log("Manage product:", productId);
//   };

//   return (
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead>Name</TableHead>
//           <TableHead>Category</TableHead>
//           <TableHead>Price</TableHead>
//           <TableHead>Stock</TableHead>
//           <TableHead>Actions</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {products.map((product) => (
//           <TableRow key={product.id}>
//             <TableCell>{product.name}</TableCell>
//             <TableCell>{product.category?.name}</TableCell>
//             <TableCell>${Number(product.price).toFixed(2)}</TableCell>
//             <TableCell>{product.stock}</TableCell>
//             <TableCell>
//               <Button
//                 onClick={() => handleManageClick(product.id)}
//                 variant="outline"
//                 size="sm"
//                 className="dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:text-primary-foreground dark:focus:ring"
//               >
//                 Manage
//               </Button>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// }
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

  const handleInventoryClick = (productId: string) => {
    navigate(`/product/${productId}`);
    console.log("View inventory for product:", productId);
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
              {/* NEW: Flex container to align buttons */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleManageClick(product.id)}
                  variant="outline"
                  size="sm"
                  className="dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:text-primary-foreground dark:focus:ring"
                >
                  Manage
                </Button>
                {/* NEW: Inventory button */}
                <Button
                  onClick={() => handleInventoryClick(product.id)}
                  variant="outline"
                  size="sm"
                  className="dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:text-primary-foreground dark:focus:ring"
                >
                  Inventory
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
