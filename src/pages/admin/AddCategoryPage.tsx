import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useCategory } from "@/contexts/categoryContext";
import { CategoryForm } from "@/components/PageComponents/CategoryForm";
import {
  type CreateCategoryFormValues,
  type UpdateCategoryFormValues,
} from "@/lib/validators/category";

export default function CreateCategoryPage() {
  const {
    categoryTree,
    createCategory,
    updateCategory,
    isLoading,
    fetchCategoryTree,
  } = useCategory();

  useEffect(() => {
    if (categoryTree.length === 0) {
      fetchCategoryTree();
    }
  }, [fetchCategoryTree, categoryTree.length]);

  const handleFormSubmit = async (
    data: CreateCategoryFormValues | UpdateCategoryFormValues
  ) => {
    try {
      if ("id" in data) {
        await updateCategory(data.id, data);
        toast.success("Category updated successfully!");
      } else {
        await createCategory(data);
        toast.success("Category created successfully!");
      }
    } catch (error) {
      let message = "An unknown error occurred.";

      if (error instanceof Error) {
        message = error.message;
      }

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
      ) {
        message = (error as any)?.response?.data?.message ?? message;
      }

      toast.error(`Error: ${message}`);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <CategoryForm
        mode="add"
        categories={categoryTree}
        onFormSubmit={handleFormSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
