import { z } from "zod";

export const addCreditsSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  amount: z.number().int().positive("Amount must be positive"),
  transactionType: z.enum(["purchase", "bonus", "refund"]),
  notes: z.string().optional(),
});

export const getTransactionsSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

export type AddCreditsInput = z.infer<typeof addCreditsSchema>;
export type GetTransactionsInput = z.infer<typeof getTransactionsSchema>;
