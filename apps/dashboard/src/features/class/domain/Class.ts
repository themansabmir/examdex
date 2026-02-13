import { z } from "zod";

export const CreateClassSchema = z.object({
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

export const UpdateClassSchema = z.object({
  className: z
    .string()
    .min(2, "Class name must be at least 2 characters")
    .max(50, "Class name must be at most 50 characters")
    .optional(),
  displayOrder: z.number().int().positive("Display order must be positive").optional(),
  isActive: z.boolean().optional(),
});

export type CreateClassInput = z.infer<typeof CreateClassSchema>;
export type UpdateClassInput = z.infer<typeof UpdateClassSchema>;

export interface Class {
  id: string;
  classCode: string;
  className: string;
  displayOrder: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ClassFormInput = CreateClassInput & { isActive?: boolean };
