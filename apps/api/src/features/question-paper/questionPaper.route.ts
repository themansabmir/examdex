import { Router } from "express";
import { QuestionPaperController } from "./questionPaper.controller";

const router = Router();
const controller = new QuestionPaperController();

router.post("/generate/exam", (req, res) => controller.generateForExam(req, res));
router.post("/generate/custom", (req, res) => controller.generateCustom(req, res));

export default router;
