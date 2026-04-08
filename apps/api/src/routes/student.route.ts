import { Router } from "express";

import { studentController } from "../container/index";
import { validateBody } from "../middleware";
import { studentOnBoardingSchema } from "../features/student/student.schema";

const router = Router();

router.post("/onboarding", validateBody(studentOnBoardingSchema), (req, res, next) => {
  studentController.onboarding(req, res, next).catch(next);
});
export const studentRoutes = router;
