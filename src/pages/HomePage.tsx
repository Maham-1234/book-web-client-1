import { useState, useEffect } from "react";
import { useProduct } from "@/contexts/productContext";
import { useAuth } from "@/contexts/authContext";
import { ProductSidebar } from "../components/PageComponents/product/ProductSidebar";
import { ProductToolbar } from "../components/PageComponents/product/ProductToolbar";
import { ProductGrid } from "../components/PageComponents/product/ProductGrid";
import { PaginationControls } from "../components/PageComponents/product/PaginationControls";
import type { ProductFilters } from "@/types";

const HomeBanner = () => (
  <div className="bg-primary text-primary-foreground rounded-lg p-8 mb-8 text-center bg-gradient-to-r from-green-500 to-blue-500">
    <h2 className="text-3xl font-bold">Mid-Season Sale!</h2>
    <p className="mt-2">
      Up to 40% off on selected stationery and bestselling books. Don't miss
      out!
    </p>
  </div>
);

export default function HomePage() {
  const { paginatedData, fetchAllProducts } = useProduct();
  const { user } = useAuth();

  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    categoryId: undefined,
    sortBy: "createdAt",
    sortOrder: "DESC",
    page: 1,
    limit: 12,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchAllProducts(filters);
    }, 300);

    return () => clearTimeout(handler);
  }, [filters, fetchAllProducts]);

  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleSortChange = (sortByValue: string) => {
    const [sortBy, sortOrder] = sortByValue.split("-") as [
      ProductFilters["sortBy"],
      ProductFilters["sortOrder"]
    ];
    setFilters((prev) => ({ ...prev, sortBy, sortOrder, page: 1 }));
  };

  const handleCategoryChange = (categoryId: number | undefined) => {
    setFilters((prev) => ({ ...prev, categoryId, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <HomeBanner />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <ProductSidebar
            onSelectCategory={handleCategoryChange}
            activeCategoryId={filters.categoryId}
            categoryFilterId={undefined}
          />
        </aside>
        <main className="lg:col-span-3">
          <ProductToolbar
            onSearch={handleSearch}
            onSortChange={handleSortChange}
          />
          <ProductGrid userRole={user?.role} />
          <PaginationControls
            currentPage={paginatedData?.currentPage || 1}
            totalPages={paginatedData?.totalPages || 1}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </div>
  );
}
