import type { IExamRepository } from "./exam.repository";
import type { IUserRepository } from "../user/user.repository";
import { Exam } from "./exam.entity";
import type { CreateExamInputDTO, ExamOutputDTO, PublishExamInputDTO } from "./exam.dto";
import { NotFoundError, ForbiddenError } from "../../utils";

export class ExamService {
  constructor(
    private readonly examRepository: IExamRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async createExam(input: CreateExamInputDTO): Promise<ExamOutputDTO> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new NotFoundError("User not found", "USER_NOT_FOUND");
    }

    const exam = new Exam({
      title: input.title,
      description: input.description,
      userId: input.userId,
      duration: input.duration,
      passingScore: input.passingScore,
    });

    const savedExam = await this.examRepository.save(exam);

    return this.toDTO(savedExam);
  }

  async publishExam(input: PublishExamInputDTO): Promise<ExamOutputDTO> {
    const exam = await this.examRepository.findById(input.examId);
    if (!exam) {
      throw new NotFoundError("Exam not found", "EXAM_NOT_FOUND");
    }

    if (exam.userId !== input.userId) {
      throw new ForbiddenError("You do not have permission to publish this exam", "NOT_OWNER");
    }

    const publishedExam = exam.publish();
    const savedExam = await this.examRepository.save(publishedExam);

    return this.toDTO(savedExam);
  }

  async getExamById(id: string): Promise<ExamOutputDTO | null> {
    const exam = await this.examRepository.findById(id);
    if (!exam) return null;

    return this.toDTO(exam);
  }

  async getExamsByUserId(userId: string): Promise<ExamOutputDTO[]> {
    const exams = await this.examRepository.findByUserId(userId);
    return exams.map((exam) => this.toDTO(exam));
  }

  async getAllExams(): Promise<ExamOutputDTO[]> {
    const exams = await this.examRepository.findAll();
    return exams.map((exam) => this.toDTO(exam));
  }

  private toDTO(exam: Exam): ExamOutputDTO {
    return {
      id: exam.id,
      title: exam.title,
      description: exam.description,
      userId: exam.userId,
      status: exam.status,
      duration: exam.duration,
      passingScore: exam.passingScore,
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt,
    };
  }
}
