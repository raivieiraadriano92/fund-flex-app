import { z } from "zod";

const transactionGoalSchema = z.object({
  goal_id: z.string().nonempty("Goal is required"),
  amount: z.number().positive("Amount must be greater than 0")
});

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
    .optional(),
  goals: z.array(transactionGoalSchema).optional()
  /**
   * @todo
   * https://github.com/orgs/react-hook-form/discussions/8516
   * Refactor to use RHF's validateSchema
   */
  // .refine(
  //   (goals) => {
  //     if (!goals) return true;

  //     // Check for duplicate goals
  //     const goalIds = goals.map((g) => g.goal_id);

  //     return new Set(goalIds).size === goalIds.length;
  //   },
  //   { message: "Duplicate goals are not allowed" }
  // )
  // .refine(
  //   (goals, ctx) => {
  //     if (!goals) return true;

  //     // Check if total amount matches transaction amount
  //     const totalGoalAmount = goals.reduce(
  //       (sum, goal) => sum + goal.amount,
  //       0
  //     );

  //     return totalGoalAmount <= ctx.parent.amount;
  //   },
  //   { message: "Total goal amounts cannot exceed transaction amount" }
  // )
});

export type TransactionFormSchema = z.infer<typeof transactionFormSchema>;
