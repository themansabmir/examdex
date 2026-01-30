import { Router } from "express";
import { SubjectService } from "../subject/subject.service";
import { InMemorySubjectRepository } from "../subject/subject.repository";
import { SubjectController } from "../subject/subject.controller";

const router = Router();
const subjectController = new SubjectController(
  new SubjectService(new InMemorySubjectRepository())
);

router.post("/subjects", (req, res) => subjectController.create(req, res));
router.get("/subjects", (req, res) => subjectController.getAll(req, res));
router.get("/subjects/:id", (req, res) => subjectController.getById(req, res));
router.put("/subjects/:id", (req, res) => subjectController.update(req, res));
router.delete("/subjects/:id", (req, res) => subjectController.delete(req, res));

export default router;
