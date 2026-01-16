import { Router } from "express";
import { userController, examController } from "../container";

const router = Router();

// User routes
router.post("/users", (req, res) => userController.create(req, res));
router.get("/users", (req, res) => userController.getAll(req, res));
router.get("/users/:id", (req, res) => userController.getById(req, res));

// Exam routes
router.post("/exams", (req, res) => examController.create(req, res));
router.get("/exams", (req, res) => examController.getAll(req, res));
router.get("/exams/:id", (req, res) => examController.getById(req, res));
router.get("/users/:userId/exams", (req, res) => examController.getByUserId(req, res));
router.patch("/exams/:id/publish", (req, res) => examController.publish(req, res));

// Health check
router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export { router };
