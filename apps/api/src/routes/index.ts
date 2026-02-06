import { Router } from "express";
import { authRoutes } from "./auth.route";
import { userRoutes } from "./user.route";
import { examRoutes } from "./exam.route";
import { subjectRoutes } from "./subject.route";
import { chapterRoutes } from "./chapter.route";
import { devRoutes } from "./dev.route";

const router = Router();

// ============================================
// Module Routes
// ============================================
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/exams", examRoutes);
router.use("/subjects", subjectRoutes);
router.use("/chapters", chapterRoutes);
router.use("/dev", devRoutes);

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
