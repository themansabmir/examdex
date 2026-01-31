import { examController } from "../../../container";
import { Router } from "express";

const router = Router();

router.post("/exams", (req, res) => examController.create(req, res));
router.get("/exams", (req, res) => examController.getAll(req, res));
router.get("/exams/:id", (req, res) => examController.getById(req, res));
router.put("/exams/:id", (req, res) => examController.update(req, res));
router.delete("/exams/:id", (req, res) => examController.delete(req, res));

export default router;
