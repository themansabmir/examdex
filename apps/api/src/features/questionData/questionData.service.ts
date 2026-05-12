export class QuestionService {
  async getQuestions(): Promise<object[]> {
    return [
      {
        questionNumber: 1,

        topicId: "topic-uuid-1",
        topicName: "Kinematics",

        difficulty: "medium",

        questionType: "MCQ",

        questionText: "What is the SI unit of velocity?",

        options: ["m/s", "kg", "joule", "newton"],

        correctAnswer: "m/s",

        solution: "Velocity is measured in meters per second.",

        marks: 4,

        negativeMarks: 1,

        estimatedTimeSeconds: 60,
      },
    ];
  }
}
