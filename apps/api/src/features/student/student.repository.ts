import { prisma } from '../../lib/prisma';
import { OnboardingStep1Input } from './student.schema';

export const studentRepository = {
    // Check onboarding status
    async getOnboardingStatus(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { isOnboarded: true },
        });
        const preferences = await prisma.userExamPreference.findMany({
            where: { userId },
            include: { exam: true },
        });
        return { isOnboarded: user?.isOnboarded ?? false, preferences };
    },

    // Save Exam Preference (Step 1)
    async saveExamPreference(userId: string, data: OnboardingStep1Input) {
        // Workaround: Auto-select a valid subjectId since schema requires it
        const firstMapping = await prisma.examSubject.findFirst({
            where: { examId: data.examId },
            select: { subjectId: true }
        });

        if (!firstMapping) {
            throw new Error("Invalid Exam: No subjects linked, cannot save preference.");
        }

        return prisma.userExamPreference.upsert({
            where: {
                userId_examId: { userId, examId: data.examId },
            },
            update: { isPrimary: true },
            create: {
                userId,
                examId: data.examId,
                isPrimary: true,
                subjectId: firstMapping.subjectId
            },
        });
    },

    // Save Target Year (Step 2)
    async saveTargetYear(userId: string, examId: string, targetYear: number) {
        const targetExamDate = new Date(`${targetYear}-12-31`);
        return prisma.userExamPreference.update({
            where: { userId_examId: { userId, examId } },
            data: { targetExamDate },
        });
    },

    // Complete Onboarding (Step 3)
    async completeOnboarding(userId: string, ratings: any[]) {
        return prisma.$transaction(async (tx) => {
            // 1. Mark User as onboarded
            await tx.user.update({
                where: { id: userId },
                data: { isOnboarded: true },
            });

            // 2. Store ratings in SystemConfig
            if (ratings && ratings.length > 0) {
                await tx.systemConfig.upsert({
                    where: { configKey: `onboarding:baseline:${userId}` },
                    update: { configValue: ratings },
                    create: {
                        configKey: `onboarding:baseline:${userId}`,
                        configValue: ratings,
                        description: 'Baseline subject ratings',
                    },
                });
            }
        });
    },
};
