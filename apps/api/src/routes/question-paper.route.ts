import { Router } from "express";
import questionPaperRoutes from "../features/question-paper/questionPaper.route";

export const questionPaperApiRoutes = Router();

// All routes require authentication
questionPaperApiRoutes.use("/question-paper", questionPaperRoutes);
