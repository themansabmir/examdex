import { studentRepository } from './student.repository';
import { OnboardingStep1Input } from './student.schema';

export const studentService = {
    getOnboardingStatus: studentRepository.getOnboardingStatus,

    saveOnboardingStep1: async (userId: string, data: OnboardingStep1Input) => {
        return studentRepository.saveExamPreference(userId, data);
    },

    saveOnboardingStep2: async (userId: string, examId: string, targetYear: number) => {
        return studentRepository.saveTargetYear(userId, examId, targetYear);
    },

    completeOnboarding: async (userId: string, ratings: any[]) => {
        return studentRepository.completeOnboarding(userId, ratings);
    },
};