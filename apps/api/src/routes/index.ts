import { Router } from "express";
import { authRoutes } from "./auth.route";
import { userRoutes } from "./user.route";
import { examRoutes } from "./exam.route";
import { subjectRoutes } from "./subject.route";
import { chapterRoutes } from "./chapter.route";
import { classRoutes } from "./class.route";
import { pricingTierRoutes } from "./pricing-tier.route";
import { examSubjectRoutes } from "./exam-subject.route";
import { subjectChapterRoutes } from "./subject-chapter.route";
import { devRoutes } from "./dev.route";
import { excelRoutes } from "./excel.route";
import { protect } from "../middleware";

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
router.use("/subject-chapter", protect, subjectChapterRoutes);
router.use("/dev", protect, devRoutes);
router.use("/excel", excelRoutes);

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
