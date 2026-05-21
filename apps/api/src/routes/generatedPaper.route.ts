import { Router } from "express";
import { generatedPaperController } from "../container/index";
import { validateBody } from "../middleware";
import { createGeneratedPaperSchema } from "../features/generatedPaper/generatedPaper.schema";

const router = Router();

router.post("/", validateBody(createGeneratedPaperSchema), (req, res, next) => {
  generatedPaperController.create(req, res).catch(next);
});

router.get("/:id", (req, res, next) => {
  generatedPaperController.getById(req, res).catch(next);
});

export const generatedPaperRoutes = router;
