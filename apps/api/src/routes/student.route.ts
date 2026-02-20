import { Router } from "express";
import { protect, validateBody } from "../middleware";
import * as StudentController from "../features/student/student.controller";
import {
    onboardingStep1Schema,
    onboardingStep2Schema,
    onboardingCompletionSchema,
} from "../features/student/student.schema";

const router = Router();

router.get("/onboarding/status", protect, (req, res, next) => {
    StudentController.getOnboardingStatus(req, res).catch(next);
});

router.post(
    "/onboarding/step-1",
    protect,
    validateBody(onboardingStep1Schema),
    (req, res, next) => {
        StudentController.submitOnboardingStep1(req, res).catch(next);
    }
);

router.post(
    "/onboarding/step-2",
    protect,
    validateBody(onboardingStep2Schema),
    (req, res, next) => {
        StudentController.submitOnboardingStep2(req, res).catch(next);
    }
);

router.post(
    "/onboarding/complete",
    protect,
    validateBody(onboardingCompletionSchema),
    (req, res, next) => {
        StudentController.completeOnboarding(req, res).catch(next);
    }
);

export const studentRoutes = router;
