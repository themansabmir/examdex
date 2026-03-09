import { Router } from "express";
import { QuestionPaperController } from "./questionPaper.controller";
import { validateBody } from "../../middleware";
import { generateCustomPaperSchema, generateForExamSchema } from "./questionPaper.schema";

const router = Router();
const controller = new QuestionPaperController();

router.post("/generate/exam", validateBody(generateForExamSchema), controller.generateForExam);
router.post("/generate/custom", validateBody(generateCustomPaperSchema), controller.generateCustom);

export default router;
