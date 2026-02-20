import { z } from 'zod';

// Onboarding: Step 1 (Exam Selection)
export const onboardingStep1Schema = z.object({
    examId: z.string().uuid({ message: "Invalid Exam ID" }),
});

// Onboarding: Step 2 (Target Year)
export const onboardingStep2Schema = z.object({
    examId: z.string().uuid({ message: "Invalid Exam ID" }),
    targetYear: z.number().int()
        .min(new Date().getFullYear(), { message: "Invalid target year" })
        .max(new Date().getFullYear() + 2, { message: "Target year too far in the future" }),
});

// Onboarding: Step 3 (Completion & Ratings)
export const onboardingCompletionSchema = z.object({
    examId: z.string().uuid({ message: "Invalid Exam ID" }),
    subjectRatings: z.array(
        z.object({
            subjectId: z.string().uuid(),
            rating: z.number().min(1).max(5),
        })
    ).optional(),
});

export type OnboardingStep1Input = z.infer<typeof onboardingStep1Schema>;
export type OnboardingStep2Input = z.infer<typeof onboardingStep2Schema>;
export type OnboardingCompletionInput = z.infer<typeof onboardingCompletionSchema>;