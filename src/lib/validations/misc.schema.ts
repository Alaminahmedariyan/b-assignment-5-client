import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name is too long."),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^\+?[0-9\s-]{7,15}$/.test(value),
      "Please enter a valid phone number.",
    ),
  address: z.string().trim().max(255, "Address is too long.").optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .regex(/[A-Z]/, "Must include at least one uppercase letter.")
      .regex(/[0-9]/, "Must include at least one number."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from your current password.",
    path: ["newPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const reviewSchema = z.object({
  rating: z
    .number({ message: "Please select a star rating." })
    .min(1, "Please select a star rating.")
    .max(5),
  comment: z.string().max(1000, "Comment is too long.").optional(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters.")
    .max(60, "Category name is too long."),
  description: z.string().max(300, "Description is too long.").optional(),
  parentId: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
