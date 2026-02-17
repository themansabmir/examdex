import { Router } from "express";
import { examSubjectController } from "../container";
import { validateBody, validateParams } from "../middleware";
import {
  createExamSubjectSchema,
  createBulkExamSubjectSchema,
  updateExamSubjectSchema,
  examSubjectIdParamSchema,
  examSubjectExamIdParamSchema,
  examSubjectSubjectIdParamSchema,
} from "../features/exam-subject/exam-subject.schema";

const router = Router();

// Create exam-subject mapping
router.post("/", validateBody(createExamSubjectSchema), (req, res, next) => {
  examSubjectController.createMapping(req, res).catch(next);
});

// Bulk create exam-subject mappings
router.post("/bulk", validateBody(createBulkExamSubjectSchema), (req, res, next) => {
  examSubjectController.createBulkMappings(req, res).catch(next);
});

// Get all mappings
router.get("/", (req, res, next) => {
  examSubjectController.getAllMappings(req, res).catch(next);
});

// Get subjects for exam (MUST come before /:id to avoid route conflict)
router.get("/by-exam/:examId", validateParams(examSubjectExamIdParamSchema), (req, res, next) => {
  examSubjectController.getSubjectsForExam(req, res).catch(next);
});

// Get exams for subject (MUST come before /:id to avoid route conflict)
router.get("/by-subject/:subjectId", validateParams(examSubjectSubjectIdParamSchema), (req, res, next) => {
  examSubjectController.getExamsForSubject(req, res).catch(next);
});

// Get mapping by ID
router.get("/:id", validateParams(examSubjectIdParamSchema), (req, res, next) => {
  examSubjectController.getMappingById(req, res).catch(next);
});

// Update mapping
router.patch(
  "/:id",
  validateParams(examSubjectIdParamSchema),
  validateBody(updateExamSubjectSchema),
  (req, res, next) => {
    examSubjectController.updateMapping(req, res).catch(next);
  }
);

// Delete mapping
router.delete("/:id", validateParams(examSubjectIdParamSchema), (req, res, next) => {
  examSubjectController.deleteMapping(req, res).catch(next);
});

export const examSubjectRoutes = router;
