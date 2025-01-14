import { z } from "zod";

export const transactionFormSchema = z.object({
  type: z.enum(["expense", "income"], {
    required_error: "Transaction type is required"
  }),
  amount: z
    .number({
      required_error: "Amount is required"
    })
    .positive("Amount must be greater than 0"),
  title: z
    .string({
      required_error: "Title is required"
    })
    .min(1, "Title is required"),
  datetime: z.string({
    required_error: "Date is required"
  }),
  category_id: z.string({
    required_error: "Category is required"
  }),
  goal_id: z.string().nullable().optional(),
  isRecurring: z.boolean().default(false),
  recurring: z
    .object({
      frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
      endDate: z.string().optional(),
      occurrences: z.number().positive().optional()
    })
    .optional()
});

export type TransactionFormSchema = z.infer<typeof transactionFormSchema>;
