import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import type { Path } from "react-hook-form";

import {
  createCategorySchema,
  updateCategorySchema,
  type CreateCategoryFormValues,
  type UpdateCategoryFormValues,
} from "@/lib/validators/category";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface Category {
  id: string | number;
  name: string;
  parentId?: string | number | null;
}

interface CategoryFormProps<T> {
  mode: "add" | "edit";
  initialData?: T extends "add" ? never : Category;
  categories: Category[];
  onFormSubmit: (
    data: T extends "add" ? CreateCategoryFormValues : UpdateCategoryFormValues
  ) => Promise<void>;
  isLoading: boolean;
}

export function CategoryForm<T extends "add" | "edit">({
  mode,
  initialData,
  categories,
  onFormSubmit,
  isLoading,
}: CategoryFormProps<T>) {
  const formSchema =
    mode === "add" ? createCategorySchema : updateCategorySchema;
  type FormValues = T extends "add"
    ? CreateCategoryFormValues
    : UpdateCategoryFormValues;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      parentId:
        initialData?.parentId !== undefined && initialData?.parentId !== null
          ? String(initialData.parentId)
          : null,
    } as any,
  });

  const parentCategoryOptions = useMemo(() => {
    if (mode === "edit" && initialData) {
      return categories.filter((cat) => cat.id !== initialData.id);
    }
    return categories;
  }, [categories, initialData, mode]);

  const title = mode === "add" ? "Create Category" : "Edit Category";
  const description =
    mode === "add"
      ? "Add a new category to your store."
      : "Update the details for this category.";
  const buttonText = mode === "add" ? "Create Category" : "Save Changes";

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name={"name" as Path<FormValues>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Fiction, Notebooks"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"parentId" as Path<FormValues>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || "null"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a parent category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="null">
                        None (Top-level Category)
                      </SelectItem>
                      {parentCategoryOptions.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                buttonText
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
