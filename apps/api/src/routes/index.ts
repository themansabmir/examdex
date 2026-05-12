import { Router } from "express";
import { authRoutes } from "./auth.route";
import { userRoutes } from "./user.route";
import { examRoutes } from "./exam.route";
import { subjectRoutes } from "./subject.route";
import { chapterRoutes } from "./chapter.route";
import { classRoutes } from "./class.route";
import { pricingTierRoutes } from "./pricing-tier.route";
import { examSubjectRoutes } from "./exam-subject.route";
import { creditRoutes } from "./credit.route";
import { creditMasterRoutes } from "./credit-master.route";
import { examConfigRoutes } from "./examConfig.route";
import { generatedPaperRoutes } from "./generatedPaper.route";
import { studentRoutes } from "./student.route";

import { devRoutes } from "./dev.route";
import { excelRoutes } from "./excel.route";
import { protect } from "../middleware";
import { devController } from "../container/index";
import { questionPaperApiRoutes } from "./question-paper.route";

const router = Router();

// ============================================
// Module Routes
// ============================================
router.use("/auth", authRoutes);

// ============================================
// Health check (MUST be before catch-all routes)
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

// Dev routes (seed-admin is unprotected for initial setup)
router.post("/dev/seed-admin", (req, res, next) => {
  devController.seedAdmin(req, res).catch(next);
});
router.use("/dev", protect, devRoutes);

// Protected routes
router.use("/users", protect, userRoutes);
router.use("/exams", protect, examRoutes);
router.use("/subjects", protect, subjectRoutes);
router.use("/chapters", protect, chapterRoutes);
router.use("/classes", protect, classRoutes);
router.use("/pricing-tiers", protect, pricingTierRoutes);
router.use("/exam-subject", protect, examSubjectRoutes);
router.use("/credits", protect, creditRoutes);
router.use("/credit-master", protect, creditMasterRoutes);
router.use("/exam-configs", protect, examConfigRoutes);
router.use("/generated-papers", protect, generatedPaperRoutes);
router.use("/students", protect, studentRoutes);

router.use("/excel", excelRoutes);
router.use("/", protect, questionPaperApiRoutes);

// ============================================
// Health check (MOVED HERE - before catch-all)
// ============================================
// router.get("/health", (_req, res) => {
//   res.json({
//     success: true,
//     data: {
//       status: "ok",
//       timestamp: new Date().toISOString(),
//       uptime: process.uptime(),
//     },
//   });
// });

export { router };
