import type { Category } from "@/types";

export const flattenCategories = (categories: Category[]): Category[] => {
  const allCategories: Category[] = [];

  const traverse = (nodes: Category[]) => {
    for (const node of nodes) {
      allCategories.push(node);
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    }
  };

  traverse(categories);
  return allCategories;
};
