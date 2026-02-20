import { Router } from "express";
import { authRoutes } from "./auth.route";
import { userRoutes } from "./user.route";
import { examRoutes } from "./exam.route";
import { subjectRoutes } from "./subject.route";
import { chapterRoutes } from "./chapter.route";
import { classRoutes } from "./class.route";
import { pricingTierRoutes } from "./pricing-tier.route";
import { examSubjectRoutes } from "./exam-subject.route";

import { devRoutes } from "./dev.route";
import { excelRoutes } from "./excel.route";
import { protect } from "../middleware";
import { questionPaperApiRoutes } from "./question-paper.route";
import { studentRoutes } from "./student.route";

const router = Router();

// ============================================
// Module Routes
// ============================================
router.use("/auth", authRoutes);

// Protected routes
router.use("/users", protect, userRoutes);
router.use("/exams", protect, examRoutes);
router.use("/subjects", protect, subjectRoutes);
router.use("/chapters", protect, chapterRoutes);
router.use("/classes", protect, classRoutes);
router.use("/pricing-tiers", protect, pricingTierRoutes);
router.use("/exam-subject", protect, examSubjectRoutes);
router.use("/student", studentRoutes);

router.use("/dev", protect, devRoutes);
router.use("/excel", excelRoutes);
router.use("/", protect, questionPaperApiRoutes);

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
