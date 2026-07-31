import { z } from "zod";

export const specEntrySchema = z.object({
  key: z.string(),
  value: z.string(),
});

export const gearFormSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters.")
      .max(120, "Name is too long."),

    description: z
      .string()
      .min(20, "Description must be at least 20 characters.")
      .max(2000, "Description is too long."),

    brand: z
      .string()
      .max(80, "Brand name is too long.")
      .optional(),

    categoryId: z
      .string()
      .min(1, "Please select a category."),

    pricePerDay: z.coerce
      .number()
      .positive("Price must be greater than 0."),

    originalPricePerDay: z
      .union([
        z.coerce.number().positive(),
        z.literal(""),
      ])
      .optional(),

    totalQuantity: z.coerce
      .number()
      .int("Quantity must be a whole number.")
      .min(1, "Quantity must be at least 1."),

    specifications: z.array(specEntrySchema),
  })
  .refine(
    (data) =>
      !data.originalPricePerDay ||
      data.originalPricePerDay > data.pricePerDay,
    {
      message:
        "Original price must be higher than the current price to show a discount.",
      path: ["originalPricePerDay"],
    }
  );

export type GearFormSchemaValues = z.input<typeof gearFormSchema>;