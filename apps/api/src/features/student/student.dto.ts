export interface StudentOnboardInputDTO {
  email: string; // required to identify user
  examId: string; // selected exam
  classId: string; // selected class
  // subjectId?: string;
}

export interface StudentOutputDTO {
  email: string;
  fullName?: string;
  examId: string;
  classId: string;
}
