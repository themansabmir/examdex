import { Router } from "express";
import {
  userController,
  examController,
  authController,
  subjectController,
  chapterController,
  devController,
} from "../container";
import { validateBody, validateParams } from "../middleware";

import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
} from "../features/user/user.schema";
import { createExamSchema, examIdParamSchema } from "../features/exam/exam.schema";
import { adminLoginSchema, studentAuthSchema, verifyOtpSchema } from "../features/auth/auth.schema";
import {
  createSubjectSchema,
  updateSubjectSchema,
  subjectIdParamSchema,
} from "../features/subject/subject.schema";
import {
  createChapterSchema,
  updateChapterSchema,
  chapterIdParamSchema,
} from "../features/chapter/chapter.schema";

const router = Router();

// ============================================
// Auth routes
// ============================================
// ============================================
// Auth routes
// ============================================
router.post("/auth/admin/login", validateBody(adminLoginSchema), (req, res, next) => {
  authController.adminLogin(req, res).catch(next);
});

router.post("/auth/student", validateBody(studentAuthSchema), (req, res, next) => {
  authController.studentAuth(req, res).catch(next);
});

router.post("/auth/verify-otp", validateBody(verifyOtpSchema), (req, res, next) => {
  authController.verifyOtp(req, res).catch(next);
});

router.post("/auth/refresh", (req, res, next) => {
  authController.refreshToken(req, res).catch(next);
});

router.post("/auth/logout", (req, res, next) => {
  authController.logout(req, res).catch(next);
});

// ============================================
// User routes
// ============================================
router.post("/users", validateBody(createUserSchema), (req, res, next) => {
  userController.createUser(req, res).catch(next);
});

router.get("/users", (req, res, next) => {
  userController.getAllUsers(req, res).catch(next);
});

// ... existing code ...
router.get("/users/:id", validateParams(userIdParamSchema), (req, res, next) => {
  userController.getUserById(req, res).catch(next);
});

router.patch(
  "/users/:id",
  validateParams(userIdParamSchema),
  validateBody(updateUserSchema),
  (req, res, next) => {
    userController.updateUser(req, res).catch(next);
  }
);

// ============================================
// Exam routes
// ============================================
router.post("/exams", validateBody(createExamSchema), (req, res, next) => {
  examController.create(req, res).catch(next);
});

router.get("/exams", (req, res, next) => {
  examController.getAll(req, res).catch(next);
});

router.get("/exams/:id", validateParams(examIdParamSchema), (req, res, next) => {
  examController.getById(req, res).catch(next);
});

// ============================================
// Subject routes
// ============================================
router.post("/subjects", validateBody(createSubjectSchema), (req, res, next) => {
  subjectController.create(req, res).catch(next);
});

router.get("/subjects", (req, res, next) => {
  subjectController.getAll(req, res).catch(next);
});

router.get("/subjects/:id", validateParams(subjectIdParamSchema), (req, res, next) => {
  subjectController.getById(req, res).catch(next);
});

router.patch(
  "/subjects/:id",
  validateParams(subjectIdParamSchema),
  validateBody(updateSubjectSchema),
  (req, res, next) => {
    subjectController.update(req, res).catch(next);
  }
);

router.delete("/subjects/:id", validateParams(subjectIdParamSchema), (req, res, next) => {
  subjectController.delete(req, res).catch(next);
});

// ============================================
// Chapter routes
// ============================================
router.post("/chapters", validateBody(createChapterSchema), (req, res, next) => {
  chapterController.create(req, res).catch(next);
});

router.get("/chapters", (req, res, next) => {
  chapterController.getAll(req, res).catch(next);
});

router.get("/chapters/:id", validateParams(chapterIdParamSchema), (req, res, next) => {
  chapterController.getById(req, res).catch(next);
});

router.patch(
  "/chapters/:id",
  validateParams(chapterIdParamSchema),
  validateBody(updateChapterSchema),
  (req, res, next) => {
    chapterController.update(req, res).catch(next);
  }
);

router.delete("/chapters/:id", validateParams(chapterIdParamSchema), (req, res, next) => {
  chapterController.delete(req, res).catch(next);
});

// ============================================
// Dev routes (only available in non-production)
// ============================================
router.post("/dev/seed-admin", (req, res, next) => {
  devController.seedAdmin(req, res).catch(next);
});

// ============================================
// Health check
// ============================================
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
