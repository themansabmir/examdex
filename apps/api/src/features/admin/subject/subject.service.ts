import { ISubjectRepository } from "./subject.repository";
import { CreateSubjectInputDTO, SubjectOutputDTO, UpdateSubjectInputDTO } from "./subject.dto";
import { Subject } from "./subject.entity";
export class SubjectService {
  constructor(private readonly subjectRepository: ISubjectRepository) {}

  async createSubject(input: CreateSubjectInputDTO): Promise<SubjectOutputDTO> {
    // Prevent duplicate subject per exam
    const existing = await this.subjectRepository.findByCode(input.code);
    if (existing) {
      throw new Error("Subject already exists for this exam");
    }

    const subject = new Subject(input);
    const saved = await this.subjectRepository.save(subject);
    return this.toDTO(saved);
  }

  async getAllSubjects(): Promise<SubjectOutputDTO[]> {
    const subjects = await this.subjectRepository.findAll();
    return subjects.map(this.toDTO);
  }

  async getSubjectById(id: string): Promise<SubjectOutputDTO> {
    const subject = await this.subjectRepository.findById(id);
    if (!subject) {
      throw new Error("Subject not found");
    }
    return this.toDTO(subject);
  }

  async updateSubject(id: string, input: UpdateSubjectInputDTO): Promise<SubjectOutputDTO> {
    const subject = await this.subjectRepository.findById(id);
    if (!subject) {
      throw new Error("Subject not found");
    }

    const updated = new Subject({
      id: subject.id,
      code: subject.code,
      name: input.name ?? subject.name,
      isActive: input.isActive ?? subject.isActive,
    });

    const saved = await this.subjectRepository.save(updated);
    return this.toDTO(saved);
  }

  async deleteSubject(id: string): Promise<void> {
    const subject = await this.subjectRepository.findById(id);
    if (!subject) {
      throw new Error("Subject not found");
    }
    await this.subjectRepository.delete(id);
  }

  private toDTO(subject: Subject): SubjectOutputDTO {
    return {
      id: subject.id,
      code: subject.code,
      name: subject.name,
      isActive: subject.isActive,
    };
  }
}
