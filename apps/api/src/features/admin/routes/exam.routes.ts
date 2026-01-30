import { ExamController } from "../exam/exam.controller";
import { Router } from "express";
import { ExamService } from "../exam/exam.service";
import { InMemoryExamRepository } from "../exam/exam.repository";
import { InMemoryUserRepository } from "../user/user.repository";

const router = Router();
const examRepository = new InMemoryExamRepository();
const userRepository = new InMemoryUserRepository();
const examController = new ExamController(new ExamService(examRepository, userRepository));
router.post("/exams", (req, res) => examController.create(req, res));
router.get("/exams", (req, res) => examController.getAll(req, res));
router.get("/exams/:id", (req, res) => examController.getById(req, res));
router.put("/exams/:id", (req, res) => examController.update(req, res));
router.delete("/exams/:id", (req, res) => examController.delete(req, res));

export default router;
