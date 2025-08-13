import { type FC, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategory } from "@/contexts/categoryContext";
import { useEffect } from "react";

interface ProductSidebarProps {
  activeCategoryId: number | undefined;
  onSelectCategory: (id: number | undefined) => void;
  categoryFilterId: number | undefined;
}

export const ProductSidebar: FC<ProductSidebarProps> = ({
  activeCategoryId,
  onSelectCategory,
  categoryFilterId,
}) => {
  const { categoryTree, isLoading, error, fetchCategoryTree } = useCategory();

  useEffect(() => {
    fetchCategoryTree();
  }, [fetchCategoryTree]);

  const displayedCategories = useMemo(() => {
    if (categoryFilterId === undefined) return categoryTree;

    const rootCategory = categoryTree.find(
      (cat) => cat.id === categoryFilterId
    );
    if (!rootCategory) return [];

    return [
      {
        ...rootCategory,
        name: `All ${rootCategory.name}`,
        children: rootCategory.children || [],
      },
    ];
  }, [categoryTree, categoryFilterId]);

  const handleCategorySelect = (id: number | undefined) => {
    onSelectCategory(id);
  };

  if (isLoading) {
    return (
      <div className="p-4 rounded-lg bg-card border space-y-4">
        <Skeleton className="h-6 w-1/2" /> <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg bg-card border sticky top-24">
      <h3 className="text-lg font-bold mb-4">Categories</h3>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="space-y-1">
        {displayedCategories.map((category) => (
          <div key={category.id}>
            <Button
              variant={activeCategoryId === category.id ? "secondary" : "ghost"}
              className="w-full justify-start font-semibold"
              onClick={() => handleCategorySelect(category.id)}
            >
              {category.name}
            </Button>
            {category.children && (
              <div className="pl-4 mt-1 space-y-1 border-l-2 ml-4">
                {category.children.map((sub) => (
                  <Button
                    key={sub.id}
                    variant={
                      activeCategoryId === sub.id ? "secondary" : "ghost"
                    }
                    className="w-full justify-start text-sm"
                    onClick={() => handleCategorySelect(sub.id)}
                  >
                    {sub.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
