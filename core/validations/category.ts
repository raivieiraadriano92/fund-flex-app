import { z } from "zod";

export const categoryFormSchema = z.object({
  type: z.enum(["expense", "income"], {
    required_error: "Category type is required"
  }),
  title: z
    .string({
      required_error: "Title is required"
    })
    .min(1, "Title is required")
    .max(50, "Title must be less than 50 characters"),
  emoji: z
    .string({
      required_error: "Emoji is required"
    })
    .min(1, "Emoji is required")
});

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>;
