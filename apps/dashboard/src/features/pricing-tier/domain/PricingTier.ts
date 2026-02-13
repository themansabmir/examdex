import { z } from "zod";

export const CreatePricingTierSchema = z.object({
  tierCode: z
    .string({ required_error: "Tier code is required" })
    .min(2, "Tier code must be at least 2 characters")
    .max(20, "Tier code must be at most 20 characters")
    .regex(/^[A-Z0-9_]+$/, "Tier code must contain only uppercase letters, numbers, and underscores"),
  tierName: z
    .string({ required_error: "Tier name is required" })
    .min(2, "Tier name must be at least 2 characters")
    .max(50, "Tier name must be at most 50 characters"),
  description: z
    .string()
    .max(250, "Description must be at most 250 characters")
    .optional(),
  priceINR: z
    .number({ required_error: "Price in INR is required" })
    .positive("Price must be greater than 0"),
  credits: z
    .number({ required_error: "Credits are required" })
    .int("Credits must be a whole number")
    .positive("Credits must be greater than 0"),
  bonusCredits: z
    .number({ required_error: "Bonus credits are required" })
    .int("Bonus credits must be a whole number")
    .nonnegative("Bonus credits must be 0 or greater"),
  displayOrder: z.number().int().positive("Display order must be positive").optional(),
});

export const UpdatePricingTierSchema = z.object({
  tierName: z
    .string()
    .min(2, "Tier name must be at least 2 characters")
    .max(50, "Tier name must be at most 50 characters")
    .optional(),
  description: z
    .string()
    .max(250, "Description must be at most 250 characters")
    .optional(),
  priceINR: z
    .number()
    .positive("Price must be greater than 0")
    .optional(),
  credits: z
    .number()
    .int("Credits must be a whole number")
    .positive("Credits must be greater than 0")
    .optional(),
  bonusCredits: z
    .number()
    .int("Bonus credits must be a whole number")
    .nonnegative("Bonus credits must be 0 or greater")
    .optional(),
  displayOrder: z.number().int().positive("Display order must be positive").optional(),
  isActive: z.boolean().optional(),
});

export type CreatePricingTierInput = z.infer<typeof CreatePricingTierSchema>;
export type UpdatePricingTierInput = z.infer<typeof UpdatePricingTierSchema>;

export interface PricingTier {
  id: string;
  tierCode: string;
  tierName: string;
  description: string | null;
  priceINR: number;
  credits: number;
  bonusCredits: number;
  displayOrder: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PricingTierFormInput = CreatePricingTierInput & { isActive?: boolean };
