import { Router } from "express";
import { userController } from "../container";
import examRoutes from "../features/admin/routes/exam.routes";
import subjectRoutes from "../features/admin/routes/subject.routes";

const router = Router();

// User routes
router.post("/users", (req, res, next) => {
  userController.create(req, res).catch(next);
});

router.get("/users", (req, res, next) => {
  userController.getAll(req, res).catch(next);
});

router.get("/users/:id", (req, res, next) => {
  userController.getById(req, res).catch(next);
});

// Feature routes
router.use(examRoutes);
router.use(subjectRoutes);

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
