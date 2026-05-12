import { ExamConfig } from "./examConfig.entity";
import { IExamConfigRepository } from "./examConfig.repositary";

export class ExamConfigService {
  constructor(private readonly examConfigRepository: IExamConfigRepository) {}

  async createExamConfig(examConfig: ExamConfig): Promise<ExamConfig> {
    const saved = await this.examConfigRepository.save(examConfig);
    return saved;
  }

  async updateExamConfig(id: string, data: Partial<ExamConfig>): Promise<ExamConfig> {
    const existingExamConfig = await this.examConfigRepository.findById(id);
    if (!existingExamConfig) {
      throw Error("Exam config id not found");
    }

    const updated = await this.examConfigRepository.update(id, data);
    return updated;
  }

  async deleteExamConfig(id: string): Promise<void> {
    const examConfig = await this.examConfigRepository.findById(id);
    if (!examConfig) {
      throw Error("Exam Config not found");
    }
    await this.examConfigRepository.delete(id);
  }

  async getAllExamConfigs(page: number, limit: number, search: string): Promise<ExamConfig[]> {
    const skip = (page - 1) * limit;
    const examConfig = await this.examConfigRepository.findAll(skip, limit, search);
    return examConfig;
  }

  async getExamConfigByid(id: string): Promise<ExamConfig> {
    const examConfig = await this.examConfigRepository.findById(id);
    if (!examConfig) {
      throw Error("Exam Config not found");
    }
    return examConfig;
  }
}
