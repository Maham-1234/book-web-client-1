import ManageProductForm from "@/components/PageComponents/admin/ManageProductForm";
import { useParams } from "react-router-dom";
export default function ManageProductPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <p>Product ID not provided.</p>;
  }
  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="mt-2 text-muted-foreground">
          Fill out the form edit the product.
        </p>
      </header>

      <main>
        <ManageProductForm productId={id} />
      </main>
    </div>
  );
}
