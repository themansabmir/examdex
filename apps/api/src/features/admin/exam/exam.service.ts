import { CreateExamInputDTO, ExamOutputDTO, UpdateExamInputDTO } from "./exam.dto";
import { Exam } from "./exam.entity";
import { IExamRepository } from "./exam.repository";

export class ExamService {
  constructor(private readonly examRepository: IExamRepository) {}

  async createExam(input: CreateExamInputDTO): Promise<ExamOutputDTO> {
    const existing = await this.examRepository.findByCode(input.code);
    if (existing) {
      throw new Error("Exam already exists");
    }

    const exam = new Exam(input);
    const saved = await this.examRepository.save(exam);
    return this.toDTO(saved);
  }

  async getAllExams(): Promise<ExamOutputDTO[]> {
    const exams = await this.examRepository.findAll();
    return exams.map(this.toDTO);
  }

  async getExamById(id: string): Promise<ExamOutputDTO> {
    const exam = await this.examRepository.findById(id);
    if (!exam) {
      throw new Error("Exam not found");
    }
    return this.toDTO(exam);
  }

  async updateExam(id: string, input: UpdateExamInputDTO): Promise<ExamOutputDTO> {
    const exam = await this.examRepository.findById(id);
    if (!exam) {
      throw new Error("Exam not found");
    }

    const updated = new Exam({
      id: exam.id,
      code: exam.code,
      name: input.name ?? exam.name,
      category: input.category ?? exam.category,
      isActive: input.isActive ?? exam.isActive,
    });

    const saved = await this.examRepository.save(updated);
    return this.toDTO(saved);
  }

  async deleteExam(id: string): Promise<void> {
    const exam = await this.examRepository.findById(id);
    if (!exam) {
      throw new Error("Exam not found");
    }
    await this.examRepository.delete(id);
  }

  async getExamsByUserId(userId: string): Promise<ExamOutputDTO[]> {
    const exams = await this.examRepository.findByUserId(userId);
    return exams.map(this.toDTO);
  }

  async publishExam(id: string): Promise<ExamOutputDTO> {
    const exam = await this.examRepository.findById(id);
    if (!exam) {
      throw new Error("Exam not found");
    }

    const updated = new Exam({
      ...exam,
      isActive: true, // Assuming publish means activating
    });

    const saved = await this.examRepository.save(updated);
    return this.toDTO(saved);
  }

  private toDTO(exam: Exam): ExamOutputDTO {
    return {
      id: exam.id,
      code: exam.code,
      name: exam.name,
      category: exam.category,
      isActive: exam.isActive,
    };
  }
}
