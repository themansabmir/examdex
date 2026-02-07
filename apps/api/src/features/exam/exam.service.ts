import type { IExamRepository } from "./exam.repository";
import { Exam } from "./exam.entity";
import type { CreateExamInputDTO, UpdateExamInputDTO, ExamOutputDTO } from "./exam.dto";
import { ConflictError } from "../../utils";
import { randomUUID } from "crypto";

export class ExamService {
  constructor(private readonly examRepository: IExamRepository) { }

  async createExam(input: CreateExamInputDTO): Promise<ExamOutputDTO> {
    const existingExam = await this.examRepository.findByCode(input.examCode);
    if (existingExam) {
      throw new ConflictError("Exam with this code already exists", "EXAM_CODE_EXISTS");
    }

    const exam = new Exam({
      id: randomUUID(),
      examCode: input.examCode,
      examName: input.examName,
      examFullName: input.examFullName ?? null,
      examBoard: input.examBoard ?? null,
      isActive: true,
      isPopular: input.isPopular ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedExam = await this.examRepository.save(exam);

    return this.toOutputDTO(savedExam);
  }

  async getExamById(id: string): Promise<ExamOutputDTO | null> {
    const exam = await this.examRepository.findById(id);
    if (!exam) return null;

    return this.toOutputDTO(exam);
  }

  async getAllExams(options?: {
    onlyActive?: boolean;
    onlyPopular?: boolean;
  }): Promise<ExamOutputDTO[]> {
    const exams = await this.examRepository.findAll(options);
    return exams.map((exam) => this.toOutputDTO(exam));
  }

  async updateExam(id: string, input: UpdateExamInputDTO): Promise<ExamOutputDTO> {
    const existingExam = await this.examRepository.findById(id);
    if (!existingExam) {
      throw new ConflictError("Exam not found", "EXAM_NOT_FOUND");
    }

    const updatedExam = await this.examRepository.update(id, input);
    return this.toOutputDTO(updatedExam);
  }

  async deleteExam(id: string): Promise<void> {
    const existingExam = await this.examRepository.findById(id);
    if (!existingExam) {
      throw new ConflictError("Exam not found", "EXAM_NOT_FOUND");
    }

    await this.examRepository.delete(id);
  }

  async bulkCreateExams(inputs: CreateExamInputDTO[]): Promise<{ count: number }> {
    // 1. Validate for duplicates within the input array
    const codes = inputs.map((i) => i.examCode);
    const uniqueCodes = new Set(codes);
    if (uniqueCodes.size !== codes.length) {
      throw new ConflictError(
        "Duplicate exam codes found in input",
        "DUPLICATE_INPUT_CODES"
      );
    }

    // 2. Check for existing exams in DB
    const existingExams = await this.examRepository.findAll();
    const existingCodes = new Set(existingExams.map((e) => e.examCode));

    const duplicates = codes.filter((code) => existingCodes.has(code));
    if (duplicates.length > 0) {
      throw new ConflictError(
        `Exams with these codes already exist: ${duplicates.join(", ")}`,
        "EXAM_CODE_EXISTS"
      );
    }

    // 3. Prepare data
    const exams = inputs.map(
      (input) =>
        new Exam({
          id: randomUUID(),
          examCode: input.examCode,
          examName: input.examName,
          examFullName: input.examFullName ?? null,
          examBoard: input.examBoard ?? null,
          isActive: true,
          isPopular: input.isPopular ?? false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
    );

    // 4. Transactional Bulk Insert
    await this.examRepository.saveMany(exams);
    return { count: exams.length };
  }

  private toOutputDTO(exam: Exam): ExamOutputDTO {
    return {
      id: exam.id,
      examCode: exam.examCode,
      examName: exam.examName,
      examFullName: exam.examFullName,
      examBoard: exam.examBoard,
      isActive: exam.isActive,
      isPopular: exam.isPopular,
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt,
    };
  }
}
