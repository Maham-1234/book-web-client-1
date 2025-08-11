import React, { useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useProduct } from "@/contexts/productContext";
import { ProductForm } from "..//product/ProductForm";
import { type UpdateProductFormValues } from "@/lib/validators/product";

interface ManageProductFormProps {
  productId: string;
}

export default function ManageProductForm({
  productId,
}: ManageProductFormProps) {
  const { products, fetchAllProducts, updateProduct, isLoading, error } =
    useProduct();

  const productToEdit = useMemo(
    () => products.find((p) => p.id === productId),
    [products, productId]
  );

  useEffect(() => {
    if (products.length === 0 && !isLoading) {
      fetchAllProducts();
    }
  }, [products.length, fetchAllProducts, isLoading]);

  const handleUpdateProduct = async (data: UpdateProductFormValues) => {
    if (!productToEdit) {
      toast.error("Product not found for update.");
      return;
    }
    try {
      await updateProduct(productToEdit.id, data);
      toast.success("Product updated successfully!");
    } catch (e) {
      console.error("Failed to update product:", e);
      toast.error("Failed to update product.");
    }
  };

  if (isLoading && !productToEdit) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading product...</p>
      </div>
    );
  }

  if (!productToEdit) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Product not found.</p>
      </div>
    );
  }

  const productFormData: UpdateProductFormValues = {
    name: productToEdit.name,
    description: productToEdit.description,
    price: productToEdit.price,
    sku: productToEdit.sku,
    stock: productToEdit.stock,
    categoryId: String(productToEdit.categoryId),
    productType: productToEdit.productType,
    author: productToEdit.author ?? "",
    isbn: productToEdit.isbn ?? "",
    brand: productToEdit.brand ?? "",
    images: undefined,
  };

  return (
    <ProductForm
      mode="edit"
      initialData={{ ...productFormData }}
      onFormSubmit={handleUpdateProduct}
      isLoading={isLoading}
      error={error}
    />
  );
}
