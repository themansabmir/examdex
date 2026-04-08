export class Student {
  constructor(
    public email: string | null,

    public classId: string,
    public examId: string
    // public subjectId: string,
  ) {}

  // ✅ Factory method (from Prisma or DB object)
  static fromPrisma(data: any): Student {
    return new Student(
      data.email ?? null,
      // data.fullName,
      data.examPreferences?.[0]?.classId,
      data.examPreferences?.[0]?.examId
      // data.examPreferences?.[0]?.subjectId,
      // data.isOnboarded
    );
  }

  // ✅ Convert to plain object (for response / DTO mapping)
  toJSON() {
    return {
      email: this.email,
      // fullName: this.fullName,
      classId: this.classId,
      examId: this.examId,
      // subjectId: this.subjectId,
      // isOnboarded: this.isOnboarded,
    };
  }
}
