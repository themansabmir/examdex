import { z } from "zod";

export const createClassSchema = z.object({
  classCode: z
    .string({ required_error: "Class code is required" })
    .min(2, "Class code must be at least 2 characters")
    .max(10, "Class code must be at most 10 characters")
    .regex(/^[A-Z0-9_]+$/, "Class code must contain only uppercase letters, numbers, and underscores"),
  className: z
    .string({ required_error: "Class name is required" })
    .min(2, "Class name must be at least 2 characters")
    .max(50, "Class name must be at most 50 characters"),
  displayOrder: z.number().int().positive("Display order must be positive").optional(),
});

export const updateClassSchema = z.object({
  className: z
    .string()
    .min(2, "Class name must be at least 2 characters")
    .max(50, "Class name must be at most 50 characters")
    .optional(),
  displayOrder: z.number().int().positive("Display order must be positive").optional(),
  isActive: z.boolean().optional(),
});

export const classIdParamSchema = z.object({
  id: z.string().uuid("Invalid class ID format"),
});

export const classCodeParamSchema = z.object({
  classCode: z.string().min(2).max(10),
});

export type CreateClassInput = z.infer<typeof createClassSchema>;
export type UpdateClassInput = z.infer<typeof updateClassSchema>;
export type ClassIdParam = z.infer<typeof classIdParamSchema>;
