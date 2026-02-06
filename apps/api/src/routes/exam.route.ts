import { Router } from "express";
import { examController } from "../container/index";
import { validateBody, validateParams } from "../middleware";
import { createExamSchema, examIdParamSchema } from "../features/exam/exam.schema";

const router = Router();

router.post("/", validateBody(createExamSchema), (req, res, next) => {
  examController.create(req, res).catch(next);
});

router.get("/", (req, res, next) => {
  examController.getAll(req, res).catch(next);
});

router.get("/:id", validateParams(examIdParamSchema), (req, res, next) => {
  examController.getById(req, res).catch(next);
});

export const examRoutes = router;
