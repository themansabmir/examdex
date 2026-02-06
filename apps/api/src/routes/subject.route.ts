import { Router } from "express";
import { subjectController } from "../container/index";
import { validateBody, validateParams } from "../middleware";
import {
  createSubjectSchema,
  updateSubjectSchema,
  subjectIdParamSchema,
} from "../features/subject/subject.schema";

const router = Router();

router.post("/", validateBody(createSubjectSchema), (req, res, next) => {
  subjectController.create(req, res).catch(next);
});

router.get("/", (req, res, next) => {
  subjectController.getAll(req, res).catch(next);
});

router.get("/:id", validateParams(subjectIdParamSchema), (req, res, next) => {
  subjectController.getById(req, res).catch(next);
});

router.patch(
  "/:id",
  validateParams(subjectIdParamSchema),
  validateBody(updateSubjectSchema),
  (req, res, next) => {
    subjectController.update(req, res).catch(next);
  }
);

router.delete("/:id", validateParams(subjectIdParamSchema), (req, res, next) => {
  subjectController.delete(req, res).catch(next);
});

export const subjectRoutes = router;
