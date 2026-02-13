import { Router } from "express";
import { classController } from "../container";
import { validateBody, validateParams } from "../middleware";
import {
  createClassSchema,
  updateClassSchema,
  classIdParamSchema,
  classCodeParamSchema,
} from "../features/class/class.schema";

const router = Router();

// Create class
router.post("/", validateBody(createClassSchema), (req, res, next) => {
  classController.createClass(req, res).catch(next);
});

// Get all classes
router.get("/", (req, res, next) => {
  classController.getAllClasses(req, res).catch(next);
});

// Get class by code (must come before /:id to avoid route conflicts)
router.get("/code/:classCode", validateParams(classCodeParamSchema), (req, res, next) => {
  classController.getClassByCode(req, res).catch(next);
});

// Get class by ID
router.get("/:id", validateParams(classIdParamSchema), (req, res, next) => {
  classController.getClassById(req, res).catch(next);
});

// Update class
router.patch(
  "/:id",
  validateParams(classIdParamSchema),
  validateBody(updateClassSchema),
  (req, res, next) => {
    classController.updateClass(req, res).catch(next);
  }
);

// Delete class
router.delete("/:id", validateParams(classIdParamSchema), (req, res, next) => {
  classController.deleteClass(req, res).catch(next);
});

export const classRoutes = router;
