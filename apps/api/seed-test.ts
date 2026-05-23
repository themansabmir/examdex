import "dotenv/config";
import { prisma } from "./src/lib/prisma";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { env } from "./src/config/env";

async function main() {
  console.log("Setting up test data...");

  // 1. Exam
  let exam = await prisma.exam.findFirst();
  if (!exam) {
    exam = await prisma.exam.create({
      data: {
        id: randomUUID(),
        examCode: "TEST_EXAM",
        examName: "Test Exam",
      },
    });
    console.log("Created Exam");
  }

  // 2. Subject
  let subject = await prisma.subject.findFirst();
  if (!subject) {
    subject = await prisma.subject.create({
      data: {
        id: randomUUID(),
        subjectCode: "TEST_SUB",
        subjectName: "Test Subject",
      },
    });
    console.log("Created Subject");
  }

  // 3. ExamSubject
  let examSubject = await prisma.examSubject.findFirst({
    where: { examId: exam.id, subjectId: subject.id },
  });
  if (!examSubject) {
    examSubject = await prisma.examSubject.create({
      data: {
        id: randomUUID(),
        examId: exam.id,
        subjectId: subject.id,
      },
    });
    console.log("Created ExamSubject");
  }

  // 4. User
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: randomUUID(),
        email: `student_${Date.now()}@test.com`,
        passwordHash: "dummy_hash",
        fullName: "Test Student",
        userType: "student",
      },
    });
    console.log("Created User");
  }

  // 5. User Exam Preference
  const pref = await prisma.userExamPreference.findFirst({
    where: { userId: user.id },
  });
  if (!pref) {
    await prisma.userExamPreference.create({
      data: {
        id: randomUUID(),
        userId: user.id,
        examId: exam.id,
        subjectId: subject.id,
        isPrimary: true,
      },
    });
    console.log("Created User Exam Preference");
  }

  // 6. Generated Papers
  const currentPapers = await prisma.generatedPaper.count({
    where: { userId: user.id },
  });

  if (currentPapers < 15) {
    const toCreate = 15 - currentPapers;
    for (let i = 0; i < toCreate; i++) {
      const type = Math.random() > 0.5 ? "Math Mock" : "Physics Practice";
      await prisma.generatedPaper.create({
        data: {
          id: randomUUID(),
          userId: user.id,
          examId: exam.id,
          examSubjectId: examSubject.id,
          paperTitle: `${type} Test ${i + 1}`,
          questionsData: [],
          selectedTopics: [],
          difficultyDistribution: {},
          totalQuestions: 10,
          maxMarks: 100,
          timeLimitMinutes: 60,
          generationStatus: "success",
          isBookmarked: false,
          attemptCount: 0,
        },
      });
    }
    console.log(`Created ${toCreate} GeneratedPapers`);
  }

  // Generate Token
  const token = jwt.sign(
    {
      id: user.id,
      userId: user.id,
      email: user.email,
      userType: user.userType,
    },
    env.JWT_ACCESS_SECRET,
    { expiresIn: "1h" }
  );

  console.log("\n==================================================");
  console.log("✅ DATA READY! Use this token for authorization:");
  console.log("Bearer " + token);
  console.log("==================================================\n");

  console.log("Try these queries in Postman / cURL:");
  console.log(
    `curl -H "Authorization: Bearer ${token}" "http://localhost:${env.PORT}/api/v1/generated-papers"`
  );
  console.log(
    `curl -H "Authorization: Bearer ${token}" "http://localhost:${env.PORT}/api/v1/generated-papers?page=2&limit=5"`
  );
  console.log(
    `curl -H "Authorization: Bearer ${token}" "http://localhost:${env.PORT}/api/v1/generated-papers?search=Math"`
  );
  console.log("==================================================\n");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
