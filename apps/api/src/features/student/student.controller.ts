import { Request, Response } from 'express';
import { studentService } from './student.service';
import { onboardingStep1Schema, onboardingStep2Schema, onboardingCompletionSchema } from './student.schema';

export const getOnboardingStatus = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await studentService.getOnboardingStatus(userId);
    res.json(result);
};

export const submitOnboardingStep1 = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const data = onboardingStep1Schema.parse(req.body);
    const result = await studentService.saveOnboardingStep1(userId, data);
    res.json({ message: "Step 1 saved", examId: result.examId });
};

export const submitOnboardingStep2 = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { examId, targetYear } = onboardingStep2Schema.parse(req.body);
    await studentService.saveOnboardingStep2(userId, examId, targetYear);
    res.json({ message: "Step 2 saved", targetYear });
};

export const completeOnboarding = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { subjectRatings } = onboardingCompletionSchema.parse(req.body);
    await studentService.completeOnboarding(userId, subjectRatings || []);
    res.json({ message: "Onboarding complete" });
};