import React from "react";
import { toast } from "react-hot-toast";
import { useProduct } from "@/contexts/productContext";
import { ProductForm } from "../product/ProductForm";
import { type CreateProductFormValues } from "@/lib/validators/product";

export default function AddProductForm() {
  const { createProduct, isLoading, error } = useProduct();

  const handleAddProduct = async (data: CreateProductFormValues) => {
    try {
      await createProduct(data);
      toast.success("Product created successfully!");
    } catch (e) {
      console.error("Failed to create product:", e);
      toast.error("Failed to create product.");
    }
  };

  return (
    <ProductForm
      mode="add"
      onFormSubmit={handleAddProduct}
      isLoading={isLoading}
      error={error}
    />
  );
}
