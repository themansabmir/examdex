import { z } from "zod";

export const createCreditMasterSchema = z.object({
  creditsPerNewStudent: z
    .number({ required_error: "Credits per new student is required" })
    .min(0, "Credits must be a non-negative number"),
  description: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateCreditMasterSchema = z.object({
  creditsPerNewStudent: z.number().min(0, "Credits must be a non-negative number").optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const creditMasterIdParamSchema = z.object({
  id: z.string().uuid("Invalid credit configuration ID format"),
});

export type CreateCreditMasterInput = z.infer<typeof createCreditMasterSchema>;
export type UpdateCreditMasterInput = z.infer<typeof updateCreditMasterSchema>;
export type CreditMasterIdParam = z.infer<typeof creditMasterIdParamSchema>;
