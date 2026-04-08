import type { IStudentRepository } from "./student.repository";
import { ConflictError } from "../../utils";
import { StudentOnboardInputDTO, StudentOutputDTO } from "./student.dto";

export class StudentService {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async onboarding(studentInput: StudentOnboardInputDTO): Promise<StudentOutputDTO> {
    const updatedUser = await this.studentRepository.onboarding(studentInput);

    if (!updatedUser) {
      throw new ConflictError("User onboarding failed", "ONBOARDING_FAILED");
    }

    return this.toOutputDTO(updatedUser);
  }

  private toOutputDTO(user: any): StudentOutputDTO {
    return {
      email: user.email ?? null,
      fullName: user.fullName,
      examId: user.examPreferences?.[0]?.examId,
      classId: user.examPreferences?.[0]?.classId,
    };
  }
}
