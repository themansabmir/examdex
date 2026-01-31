import { subjectController } from "../../../container";
import { Router } from "express";

const router = Router();

router.post("/subjects", (req, res) => subjectController.create(req, res));
router.get("/subjects", (req, res) => subjectController.getAll(req, res));
router.get("/subjects/:id", (req, res) => subjectController.getById(req, res));
router.put("/subjects/:id", (req, res) => subjectController.update(req, res));
router.delete("/subjects/:id", (req, res) => subjectController.delete(req, res));

export default router;
