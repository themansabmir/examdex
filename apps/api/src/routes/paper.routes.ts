import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  generatePaper,
  getJobStatus,
  getPapers,
  getPaperById,
} from "../features/papers/presentation/paper.controller";

const router = Router();

router.post("/generate", authMiddleware, generatePaper);
router.get("/job/:jobId", authMiddleware, getJobStatus);
router.get("/", authMiddleware, getPapers);
router.get("/:id", authMiddleware, getPaperById);

export default router;
