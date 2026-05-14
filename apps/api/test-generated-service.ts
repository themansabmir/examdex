/* eslint-disable no-console, @typescript-eslint/no-explicit-any */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { generatedPaperService } from "./src/container";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  console.log("🚀 Testing GeneratedPaperService...\n");

  // 1. Get or create a student user
  let user = await prisma.user.findFirst({ where: { userType: "student" } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        fullName: "Test Student",
        phoneNumber: "+1234567890",
        creditBalance: 10,
        userType: "student",
      },
    });
    console.log("Created test student user:", user.id);
  } else {
    // Ensure they have credits
    await prisma.user.update({
      where: { id: user.id },
      data: { creditBalance: 10 },
    });
    console.log("Using existing student user:", user.id, "and resetted credits to 10.");
  }

  // 2. Ensure exam, subject, examSubject, and config exist
  let exam = await prisma.exam.findFirst();
  if (!exam) {
    exam = await prisma.exam.create({
      data: { examCode: "JEE_MAIN", examName: "JEE Main" },
    });
  }

  let subject = await prisma.subject.findFirst();
  if (!subject) {
    subject = await prisma.subject.create({
      data: { subjectCode: "PHYSICS", subjectName: "Physics" },
    });
  }

  let examSubject = await prisma.examSubject.findFirst({
    where: { examId: exam.id, subjectId: subject.id },
  });
  if (!examSubject) {
    examSubject = await prisma.examSubject.create({
      data: { examId: exam.id, subjectId: subject.id },
    });
  }

  let questionType = await prisma.questionType.findFirst();
  if (!questionType) {
    questionType = await prisma.questionType.create({
      data: { code: "MCQ", name: "Multiple Choice" },
    });
  }

  let config = await prisma.examConfig.findFirst({
    where: { examSubjectId: examSubject.id },
  });
  if (!config) {
    config = await prisma.examConfig.create({
      data: {
        examSubjectId: examSubject.id,
        questionTypeId: questionType.id,
        questionCount: 30,
        marksPerQuestion: 4,
        displayOrder: 1,
      },
    });
  }

  // 3. Ensure User has an exam preference
  let pref = await prisma.userExamPreference.findFirst({
    where: { userId: user.id, examId: exam.id },
  });
  if (!pref) {
    pref = await prisma.userExamPreference.create({
      data: {
        userId: user.id,
        examId: exam.id,
        subjectId: subject.id,
        isPrimary: true,
      },
    });
    console.log("Created user exam preference.");
  } else if (!pref.isPrimary) {
    await prisma.userExamPreference.update({
      where: { id: pref.id },
      data: { isPrimary: true, subjectId: subject.id },
    });
  }

  // 4. Test Paper Generation
  console.log("\n⚙️  Calling createGeneratedPaper()...");
  try {
    const input = {
      type: "mock",
      paperTitle: "My Awesome Practice Paper",
      selectedTopics: [
        "123e4567-e89b-12d3-a456-426614174000",
        "123e4567-e89b-12d3-a456-426614174001",
      ],
      difficultyDistribution: { easy: 50, medium: 30, hard: 20 },
    };

    const paper = await generatedPaperService.createGeneratedPaper(input, user.id);
    console.log("\n✅ Paper generated successfully!");
    console.log("ID:", paper.id);
    console.log("Questions:", paper.questionsData.length);
    console.log("Topics:", paper.selectedTopics);
    console.log("Total Marks:", paper.maxMarks);

    // Verify Credits Deducted
    const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
    console.log(
      `\n💳 User credits after generation: ${updatedUser?.creditBalance} (Started with 10)`
    );
  } catch (error: any) {
    console.error("❌ Failed to generate paper:", error.message);
  }

  await prisma.$disconnect();
}

run().catch(console.error);
