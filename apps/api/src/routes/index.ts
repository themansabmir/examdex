import { Router } from "express";
import { userController, examController } from "../container";
import { validateBody, validateParams } from "../middleware";
import {
  createUserSchema,
  userIdParamSchema,
  sendOtpSchema,
  verifyOtpSchema,
} from "../features/user/user.schema";
import {
  createExamSchema,
  examIdParamSchema,
  publishExamSchema,
  userExamsParamSchema,
} from "../features/exam/exam.schema";

const router = Router();

// User routes
router.post("/users", validateBody(createUserSchema), (req, res, next) => {
  userController.create(req, res).catch(next);
});

router.post("/users/send-otp", validateBody(sendOtpSchema), (req, res, next) => {
  userController.sendOtp(req, res).catch(next);
});

router.post("/users/verify-otp", validateBody(verifyOtpSchema), (req, res, next) => {
  userController.verifyOtp(req, res).catch(next);
});

router.get("/users", (req, res, next) => {
  userController.getAll(req, res).catch(next);
});

router.get("/users/:id", validateParams(userIdParamSchema), (req, res, next) => {
  userController.getById(req, res).catch(next);
});

// Exam routes
router.post("/exams", validateBody(createExamSchema), (req, res, next) => {
  examController.create(req, res).catch(next);
});

router.get("/exams", (req, res, next) => {
  examController.getAll(req, res).catch(next);
});

router.get("/exams/:id", validateParams(examIdParamSchema), (req, res, next) => {
  examController.getById(req, res).catch(next);
});

router.get("/users/:userId/exams", validateParams(userExamsParamSchema), (req, res, next) => {
  examController.getByUserId(req, res).catch(next);
});

router.patch(
  "/exams/:id/publish",
  validateParams(examIdParamSchema),
  validateBody(publishExamSchema),
  (req, res, next) => {
    examController.publish(req, res).catch(next);
  }
);

// Health check
router.get("/health", (_req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

export { router };
