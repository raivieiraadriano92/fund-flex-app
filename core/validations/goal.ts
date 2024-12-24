import { z } from 'zod';

export const goalFormSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
    })
    .min(1, 'Title is required')
    .max(50, 'Title must be less than 50 characters'),
  amount: z
    .number({
      required_error: 'Amount is required',
    })
    .positive('Amount must be greater than 0'),
  emoji: z
    .string({
      required_error: 'Emoji is required',
    })
    .min(1, 'Emoji is required'),
});

export type GoalFormSchema = z.infer<typeof goalFormSchema>;
