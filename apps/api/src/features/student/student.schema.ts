import { z } from "zod";

export const studentOnBoardingSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email format")
      .transform((val) => val.toLowerCase().trim())
      .optional(),

    classId: z.string().uuid("Invalid class ID format"),

    examId: z.string().uuid("Invalid Exam ID format"),

    subjectId: z.string().uuid("Invalid Subject ID format"),
  })
  .superRefine((data, ctx) => {
    // 🔥 At least one identifier must exist
    if (!data.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email is required for onboarding",
        path: ["email"],
      });
    }
  });

export type StudentOnBoardingInput = z.infer<typeof studentOnBoardingSchema>;
