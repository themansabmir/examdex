import { Router } from "express";
import { chapterController } from "../container/index";
import { validateBody, validateParams } from "../middleware";
import {
  createChapterSchema,
  bulkCreateChapterSchema,
  updateChapterSchema,
  chapterIdParamSchema,
} from "../features/chapter/chapter.schema";

const router = Router();

router.post("/", validateBody(createChapterSchema), (req, res, next) => {
  chapterController.create(req, res).catch(next);
});

router.post("/bulk", validateBody(bulkCreateChapterSchema), (req, res, next) => {
  chapterController.bulkCreate(req, res).catch(next);
});

router.get("/", (req, res, next) => {
  chapterController.getAll(req, res).catch(next);
});

router.get("/:id", validateParams(chapterIdParamSchema), (req, res, next) => {
  chapterController.getById(req, res).catch(next);
});

router.patch(
  "/:id",
  validateParams(chapterIdParamSchema),
  validateBody(updateChapterSchema),
  (req, res, next) => {
    chapterController.update(req, res).catch(next);
  }
);

router.delete("/:id", validateParams(chapterIdParamSchema), (req, res, next) => {
  chapterController.delete(req, res).catch(next);
});

export const chapterRoutes = router;
