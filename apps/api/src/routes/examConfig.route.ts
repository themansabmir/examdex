import { Router } from "express";
import { examConfigController } from "../container/index";
import { validateBody, validateParams } from "../middleware";
import {
  createExamConfigSchema,
  updateExamConfigSchema,
  examConfigIdParamSchema,
} from "../features/examConfig/examConfig.schema";

const router = Router();

router.post("/", validateBody(createExamConfigSchema), (req, res, next) => {
  examConfigController.createExamConfig(req, res).catch(next);
});

router.get("/", (req, res, next) => {
  examConfigController.getAllExamConfigs(req, res).catch(next);
});

router.get("/:id", validateParams(examConfigIdParamSchema), (req, res, next) => {
  examConfigController.getExamConfigById(req, res).catch(next);
});

router.patch(
  "/:id",
  validateParams(examConfigIdParamSchema),
  validateBody(updateExamConfigSchema),
  (req, res, next) => {
    examConfigController.updateExamConfig(req, res).catch(next);
  }
);

router.delete("/:id", validateParams(examConfigIdParamSchema), (req, res, next) => {
  examConfigController.deleteExamConfig(req, res).catch(next);
});

export const examConfigRoutes = router;
