import React, { useEffect, useMemo } from "react";
import { useForm, type Control, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Path } from "react-hook-form";
import { useCategory } from "@/contexts/categoryContext";
import {
  createProductSchema,
  updateProductSchema,
  type CreateProductFormValues,
  type UpdateProductFormValues,
} from "@/lib/validators/product";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type SubCategory = {
  id: string | number;
  name: string;
};

type GenericProductFormValues =
  | CreateProductFormValues
  | UpdateProductFormValues;

interface ControlProps<T extends FieldValues> {
  control: Control<T>;
}

interface ConditionalFieldsProps<T extends FieldValues>
  extends ControlProps<T> {
  productType: "Books" | "Stationary";
}

interface CategorySelectorProps<T extends FieldValues> extends ControlProps<T> {
  subCategories: SubCategory[];
}

interface SubmitButtonProps {
  isLoading: boolean;
  mode: "add" | "edit";
}

const PricingAndInventoryFields = <T extends FieldValues>({
  control,
}: ControlProps<T>) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <FormField
      control={control}
      name={"price" as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Price ($)</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder="19.99"
              {...field}
              value={field.value !== undefined ? String(field.value) : ""}
              onChange={(e) => field.onChange(e.target.value)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name={"sku" as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>SKU</FormLabel>
          <FormControl>
            <Input placeholder="BOOK-GATSBY-01" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name={"stock" as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Stock</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder="100"
              {...field}
              value={field.value !== undefined ? String(field.value) : ""}
              onChange={(e) => field.onChange(e.target.value)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

const ProductTypeSelector = <T extends FieldValues>({
  control,
}: ControlProps<T>) => (
  <FormField
    control={control}
    name={"productType" as Path<T>}
    render={({ field }) => (
      <FormItem>
        <FormLabel>Product Type</FormLabel>
        <Select onValueChange={field.onChange} value={field.value as string}>
          {" "}
          {/* Use value for controlled component */}
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a product type" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="Books">Book</SelectItem>
            <SelectItem value="Stationary">Stationery</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

const CommonProductFields = <T extends FieldValues>({
  control,
}: ControlProps<T>) => (
  <>
    <FormField
      control={control}
      name={"name" as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="Product Name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name={"description" as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea placeholder="Detailed product description" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);

const ConditionalFields = <T extends FieldValues>({
  control,
  productType,
}: ConditionalFieldsProps<T>) => {
  if (productType === "Books") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={"author" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={"isbn" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>ISBN</FormLabel>
              <FormControl>
                <Input placeholder="978-3-16-148410-0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  }
  if (productType === "Stationary") {
    return (
      <FormField
        control={control}
        name={"brand" as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Brand</FormLabel>
            <FormControl>
              <Input placeholder="Brand Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
  return null;
};

const CategorySelector = <T extends FieldValues>({
  control,
  subCategories,
}: CategorySelectorProps<T>) => (
  <FormField
    control={control}
    name={"categoryId" as Path<T>}
    render={({ field }) => (
      <FormItem>
        <FormLabel>Category</FormLabel>
        <Select
          value={field.value !== undefined ? String(field.value) : ""}
          onValueChange={(val) => field.onChange(val)}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {subCategories.length > 0 ? (
              subCategories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))
            ) : (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                Select a Product Type to see categories.
              </div>
            )}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

const ImageUploader = <T extends FieldValues>({ control }: ControlProps<T>) => (
  <FormField
    control={control}
    name={"images" as Path<T>}
    render={({ field: { onChange, onBlur, name, ref } }) => (
      <FormItem>
        <FormLabel>Images</FormLabel>
        <FormControl>
          <Input
            type="file"
            multiple
            onBlur={onBlur}
            name={name}
            ref={ref}
            onChange={(e) => onChange(e.target.files)}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading, mode }) => (
  <Button type="submit" disabled={isLoading} className="w-full">
    {isLoading ? (
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    ) : mode === "add" ? (
      "Create Product"
    ) : (
      "Update Product"
    )}
  </Button>
);

interface ProductFormProps {
  mode: "add" | "edit";
  initialData?: UpdateProductFormValues;
  onFormSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

export function ProductForm({
  mode,
  initialData,
  onFormSubmit,
  isLoading,
  error,
}: ProductFormProps) {
  const { categoryTree, fetchCategoryTree } = useCategory();

  const currentSchema = useMemo(() => {
    return mode === "add" ? createProductSchema : updateProductSchema;
  }, [mode]);

  const form = useForm<GenericProductFormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: "",
      sku: "",
      stock: "",
      categoryId: "",
      productType: "Books",
      author: "",
      isbn: "",
      brand: "",
      images: undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        price: String(initialData.price),
        stock: String(initialData.stock),
        categoryId: String(initialData.categoryId),
      });
    } else if (mode === "add") {
      form.reset({
        name: "",
        description: "",
        price: "",
        sku: "",
        stock: "",
        categoryId: "",
        productType: "Books",
        author: "",
        isbn: "",
        brand: "",
        images: undefined,
      });
    }
  }, [initialData, form, mode]);

  useEffect(() => {
    if (categoryTree.length === 0) {
      fetchCategoryTree();
    }
  }, [fetchCategoryTree, categoryTree.length]);

  const productType = form.watch("productType");

  const subCategories = useMemo(() => {
    const parentCategory = categoryTree.find(
      (cat) => cat.name.toLowerCase() === productType.toLowerCase()
    );
    return parentCategory?.children || [];
  }, [productType, categoryTree]);

  useEffect(() => {
    form.resetField("categoryId");
  }, [productType, form]);

  const onSubmit = async (data: GenericProductFormValues) => {
    try {
      const parsedData = currentSchema.parse(data);
      await onFormSubmit(parsedData);
    } catch (e) {
      console.error(e);
    }
  };

  const formTitle = mode === "add" ? "Product Details" : "Edit Product";
  const formDescription =
    mode === "add"
      ? "Start by selecting the product type and providing its basic details."
      : "Update the details of your product below.";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{formTitle}</CardTitle>
            <CardDescription>{formDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProductTypeSelector control={form.control} />
            <CommonProductFields control={form.control} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
            <CardDescription>
              Manage the product's price, stock, and identification codes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PricingAndInventoryFields control={form.control} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attributes & Category</CardTitle>
            <CardDescription>
              Add specific attributes based on the product type and assign a
              category.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ConditionalFields
              control={form.control}
              productType={productType}
            />
            <CategorySelector
              control={form.control}
              subCategories={subCategories}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
            <CardDescription>
              Upload one or more images for the product.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader control={form.control} />
          </CardContent>
        </Card>

        <div>
          <SubmitButton isLoading={isLoading} mode={mode} />
          {error && (
            <p className="mt-2 text-sm font-medium text-destructive">{error}</p>
          )}
        </div>
      </form>
    </Form>
  );
}
