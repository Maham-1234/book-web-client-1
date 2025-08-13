// import { useProduct } from "@/contexts/productContext";
// import { ProductCard } from "./ProductCard";
// import { Skeleton } from "@/components/ui/skeleton";
// import type { Product } from "@/types";

// type ProductGridProps = {
//   isAuthenticated: boolean;
// };

// export const ProductGrid: React.FC<ProductGridProps> = ({
//   isAuthenticated,
// }) => {
//   const { products, isLoading, error } = useProduct();

//   // Loading State
//   if (isLoading) {
//     return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {Array.from({ length: 9 }).map((_, i) => (
//           <div key={i} className="space-y-2">
//             <Skeleton className="h-64 w-full" />
//             <Skeleton className="h-4 w-3/4" />
//             <Skeleton className="h-4 w-1/2" />
//           </div>
//         ))}
//       </div>
//     );
//   }

//   // Error State
//   if (error) {
//     return <div className="text-center text-destructive py-10">{error}</div>;
//   }

//   // Empty State
//   if (products.length === 0) {
//     return (
//       <div className="text-center text-muted-foreground py-10">
//         No products found. Try adjusting your filters.
//       </div>
//     );
//   }

//   // Success State
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//       {products.map((product: Product) => (
//         <ProductCard
//           key={product.id}
//           product={product}
//           isAuthenticated={isAuthenticated}
//         />
//       ))}
//     </div>
//   );
// };
import { useProduct } from "@/contexts/productContext";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types";
import type { FC } from "react";

type ProductGridProps = {
  userRole?: "admin" | "buyer";
};

export const ProductGrid: FC<ProductGridProps> = ({ userRole }) => {
  const { paginatedData, isLoading, error } = useProduct();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-destructive py-10">{error}</div>;
  }

  if (!paginatedData || paginatedData.products.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No products found. Try adjusting your filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
      {/* Map over the products inside paginatedData */}
      {paginatedData.products.map((product: Product) => (
        <ProductCard key={product.id} product={product} userRole={userRole} />
      ))}
    </div>
  );
};
