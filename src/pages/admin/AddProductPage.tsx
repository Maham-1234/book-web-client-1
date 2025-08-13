import AddProductForm from "@/components/PageComponents/admin/AddProductForm";

export default function AddProductPage() {
  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
        <p className="mt-2 text-muted-foreground">
          Fill out the form below to create a new product in your store.
        </p>
      </header>

      <main>
        <AddProductForm />
      </main>
    </div>
  );
}
