import { z } from "zod";
export const createCategorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required." }),
  parentId: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val === "null" || val === "" ? null : val)),
});
export type CreateCategoryFormValues = z.input<typeof createCategorySchema>;
export const updateCategorySchema = createCategorySchema.partial();
export type UpdateCategoryFormValues = z.input<typeof updateCategorySchema>;
