import { useState, useEffect, type FC } from "react";
import { useProduct } from "@/contexts/productContext";
import { useAuth } from "@/contexts/authContext"; // Keep this import
import type { ProductFilters } from "@/types";

import { ProductSidebar } from "@/components/PageComponents/product/ProductSidebar";
import { ProductToolbar } from "@/components/PageComponents/product/ProductToolbar";
import { ProductGrid } from "@/components/PageComponents/product/ProductGrid";
import { PaginationControls } from "@/components/PageComponents/product/PaginationControls";

interface ProductListingPageProps {
  pageTitle: string;
  baseCategoryId: number | undefined;
  categoryFilterId: number | undefined;
}

const ProductListingPage: FC<ProductListingPageProps> = ({
  pageTitle,
  baseCategoryId,
  categoryFilterId,
}) => {
  const { paginatedData, fetchAllProducts } = useProduct();
  const { user } = useAuth();

  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    categoryId: undefined,
    sortBy: "createdAt" as const,
    sortOrder: "DESC" as const,
    page: 1,
    limit: 12,
  });

  useEffect(() => {
    setFilters((prev) => ({ ...prev, categoryId: baseCategoryId }));
  }, [baseCategoryId]);

  useEffect(() => {
    if (filters.categoryId === undefined) return;
    const handler = setTimeout(() => {
      fetchAllProducts(filters);
    }, 300);
    return () => clearTimeout(handler);
  }, [filters, fetchAllProducts]);

  const handleSearch = (searchTerm: string) =>
    setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
  const handleSortChange = (sortByValue: string) => {
    const [sortByRaw, sortOrderRaw] = sortByValue.split("-");
    const sortBy = sortByRaw as ProductFilters["sortBy"];
    const sortOrder = sortOrderRaw as ProductFilters["sortOrder"];
    setFilters((prev) => ({ ...prev, sortBy, sortOrder, page: 1 }));
  };
  const handleCategoryChange = (categoryId: number | undefined) =>
    setFilters((prev) => ({
      ...prev,
      categoryId: categoryId ?? baseCategoryId,
      page: 1,
    }));
  const handlePageChange = (newPage: number) =>
    setFilters((prev) => ({ ...prev, page: newPage }));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">{pageTitle}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <ProductSidebar
            activeCategoryId={filters.categoryId}
            onSelectCategory={handleCategoryChange}
            categoryFilterId={categoryFilterId}
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
};

export default ProductListingPage;
