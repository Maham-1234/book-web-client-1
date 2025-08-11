import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const baseProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long."),
  price: z.coerce.number().positive("Price must be a positive number."),
  sku: z.string().min(3, "SKU must be at least 3 characters long."),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative."),
  categoryId: z.coerce.number().positive("You must select a category."),
  images: z
    .any()
    .refine((files) => files?.length >= 1, "At least one image is required.")
    .refine(
      (files) =>
        Array.from(files).every((file: any) => file?.size <= MAX_FILE_SIZE),
      `Max file size is 5MB.`
    )
    .refine(
      (files) =>
        Array.from(files).every((file: any) =>
          ACCEPTED_IMAGE_TYPES.includes(file?.type)
        ),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .optional(),
});

const bookSchema = baseProductSchema.extend({
  productType: z.literal("Books"),
  author: z.string().min(2, "Author is required."),
  isbn: z.string().min(10, "A valid ISBN is required."),
  brand: z.string().optional(),
});

const stationerySchema = baseProductSchema.extend({
  productType: z.literal("Stationary"),
  brand: z.string().min(2, "Brand is required."),
  author: z.string().optional(),
  isbn: z.string().optional(),
});

export const createProductSchema = z.discriminatedUnion("productType", [
  bookSchema,
  stationerySchema,
]);

export const updateProductSchema = baseProductSchema
  .partial()
  .and(
    z.discriminatedUnion("productType", [
      bookSchema.partial().extend({ productType: z.literal("Books") }),
      stationerySchema
        .partial()
        .extend({ productType: z.literal("Stationary") }),
    ])
  );
export type UpdateProductFormValues = z.input<typeof updateProductSchema>;

export type CreateProductFormValues = z.input<typeof createProductSchema>;
