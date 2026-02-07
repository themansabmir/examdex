import { Router } from "express";
import { subjectChapterController } from "../container";
import { validateBody, validateParams } from "../middleware";
import {
  createSubjectChapterSchema,
  updateSubjectChapterSchema,
  subjectChapterIdParamSchema,
  subjectChapterExamSubjectIdParamSchema,
  subjectChapterChapterIdParamSchema,
} from "../features/subject-chapter/subject-chapter.schema";

const router = Router();

// Create subject-chapter mapping
router.post("/", validateBody(createSubjectChapterSchema), (req, res, next) => {
  subjectChapterController.createMapping(req, res).catch(next);
});

// Get all mappings
router.get("/", (req, res, next) => {
  subjectChapterController.getAllMappings(req, res).catch(next);
});

// Get chapters for exam-subject with weightage info (MUST come before /:id)
router.get("/by-exam-subject/:examSubjectId", validateParams(subjectChapterExamSubjectIdParamSchema), (req, res, next) => {
  subjectChapterController.getChaptersForExamSubject(req, res).catch(next);
});

// Get total weightage for exam-subject (MUST come before /:id)
router.get(
  "/weightage/:examSubjectId",
  validateParams(subjectChapterExamSubjectIdParamSchema),
  (req, res, next) => {
    subjectChapterController.getTotalWeightage(req, res).catch(next);
  }
);

// Get exam-subjects for chapter (MUST come before /:id)
router.get(
  "/by-chapter/:chapterId",
  validateParams(subjectChapterChapterIdParamSchema),
  (req, res, next) => {
    subjectChapterController.getExamSubjectsForChapter(req, res).catch(next);
  }
);

// Get mapping by ID
router.get("/:id", validateParams(subjectChapterIdParamSchema), (req, res, next) => {
  subjectChapterController.getMappingById(req, res).catch(next);
});

// Update mapping
router.patch(
  "/:id",
  validateParams(subjectChapterIdParamSchema),
  validateBody(updateSubjectChapterSchema),
  (req, res, next) => {
    subjectChapterController.updateMapping(req, res).catch(next);
  }
);

// Delete mapping
router.delete("/:id", validateParams(subjectChapterIdParamSchema), (req, res, next) => {
  subjectChapterController.deleteMapping(req, res).catch(next);
});

export const subjectChapterRoutes = router;
