import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...\n");

  // ============================================
  // 1. SUBJECTS (10 subjects)
  // ============================================
  const subjects = await Promise.all([
    prisma.subject.upsert({
      where: { subjectCode: "PHY" },
      update: {},
      create: { subjectCode: "PHY", subjectName: "Physics", isActive: true },
    }),
    prisma.subject.upsert({
      where: { subjectCode: "CHEM" },
      update: {},
      create: { subjectCode: "CHEM", subjectName: "Chemistry", isActive: true },
    }),
    prisma.subject.upsert({
      where: { subjectCode: "MATH" },
      update: {},
      create: { subjectCode: "MATH", subjectName: "Mathematics", isActive: true },
    }),
    prisma.subject.upsert({
      where: { subjectCode: "BIO" },
      update: {},
      create: { subjectCode: "BIO", subjectName: "Biology", isActive: true },
    }),
    prisma.subject.upsert({
      where: { subjectCode: "ENG" },
      update: {},
      create: { subjectCode: "ENG", subjectName: "English", isActive: true },
    }),
    prisma.subject.upsert({
      where: { subjectCode: "CS" },
      update: {},
      create: { subjectCode: "CS", subjectName: "Computer Science", isActive: true },
    }),
    prisma.subject.upsert({
      where: { subjectCode: "HIST" },
      update: {},
      create: { subjectCode: "HIST", subjectName: "History", isActive: true },
    }),
    prisma.subject.upsert({
      where: { subjectCode: "GEO" },
      update: {},
      create: { subjectCode: "GEO", subjectName: "Geography", isActive: true },
    }),
    prisma.subject.upsert({
      where: { subjectCode: "ECO" },
      update: {},
      create: { subjectCode: "ECO", subjectName: "Economics", isActive: true },
    }),
    prisma.subject.upsert({
      where: { subjectCode: "POL" },
      update: {},
      create: { subjectCode: "POL", subjectName: "Political Science", isActive: true },
    }),
  ]);
  console.log(`✅ Created ${subjects.length} subjects`);

  // ============================================
  // 2. EXAMS (6 exams)
  // ============================================
  const exams = await Promise.all([
    prisma.exam.upsert({
      where: { examCode: "JEE-MAIN" },
      update: {},
      create: {
        examCode: "JEE-MAIN",
        examName: "JEE Main",
        examFullName: "Joint Entrance Examination Main",
        examBoard: "NTA",
        isActive: true,
        isPopular: true,
      },
    }),
    prisma.exam.upsert({
      where: { examCode: "JEE-ADV" },
      update: {},
      create: {
        examCode: "JEE-ADV",
        examName: "JEE Advanced",
        examFullName: "Joint Entrance Examination Advanced",
        examBoard: "IIT",
        isActive: true,
        isPopular: true,
      },
    }),
    prisma.exam.upsert({
      where: { examCode: "NEET" },
      update: {},
      create: {
        examCode: "NEET",
        examName: "NEET UG",
        examFullName: "National Eligibility cum Entrance Test",
        examBoard: "NTA",
        isActive: true,
        isPopular: true,
      },
    }),
    prisma.exam.upsert({
      where: { examCode: "BITSAT" },
      update: {},
      create: {
        examCode: "BITSAT",
        examName: "BITSAT",
        examFullName: "Birla Institute of Technology and Science Admission Test",
        examBoard: "BITS Pilani",
        isActive: true,
        isPopular: false,
      },
    }),
    prisma.exam.upsert({
      where: { examCode: "CUET" },
      update: {},
      create: {
        examCode: "CUET",
        examName: "CUET UG",
        examFullName: "Common University Entrance Test",
        examBoard: "NTA",
        isActive: true,
        isPopular: false,
      },
    }),
    prisma.exam.upsert({
      where: { examCode: "GATE-CS" },
      update: {},
      create: {
        examCode: "GATE-CS",
        examName: "GATE CS",
        examFullName: "Graduate Aptitude Test in Engineering - Computer Science",
        examBoard: "IIT",
        isActive: true,
        isPopular: true,
      },
    }),
  ]);
  console.log(`✅ Created ${exams.length} exams`);

  // ============================================
  // 3. EXAM-SUBJECT MAPPINGS (30 mappings)
  // ============================================
  // Helper to find IDs
  const subjectMap = Object.fromEntries(subjects.map((s) => [s.subjectCode, s.id]));
  const examMap = Object.fromEntries(exams.map((e) => [e.examCode, e.id]));

  const examSubjectMappings = [
    // JEE Main: Physics, Chemistry, Math
    { examCode: "JEE-MAIN", subjectCode: "PHY", displayOrder: 1 },
    { examCode: "JEE-MAIN", subjectCode: "CHEM", displayOrder: 2 },
    { examCode: "JEE-MAIN", subjectCode: "MATH", displayOrder: 3 },
    // JEE Advanced: Physics, Chemistry, Math
    { examCode: "JEE-ADV", subjectCode: "PHY", displayOrder: 1 },
    { examCode: "JEE-ADV", subjectCode: "CHEM", displayOrder: 2 },
    { examCode: "JEE-ADV", subjectCode: "MATH", displayOrder: 3 },
    // NEET: Physics, Chemistry, Biology
    { examCode: "NEET", subjectCode: "PHY", displayOrder: 1 },
    { examCode: "NEET", subjectCode: "CHEM", displayOrder: 2 },
    { examCode: "NEET", subjectCode: "BIO", displayOrder: 3 },
    // BITSAT: Physics, Chemistry, Math, English
    { examCode: "BITSAT", subjectCode: "PHY", displayOrder: 1 },
    { examCode: "BITSAT", subjectCode: "CHEM", displayOrder: 2 },
    { examCode: "BITSAT", subjectCode: "MATH", displayOrder: 3 },
    { examCode: "BITSAT", subjectCode: "ENG", displayOrder: 4 },
    // CUET: English, History, Geography, Economics, Political Science, Math, CS
    { examCode: "CUET", subjectCode: "ENG", displayOrder: 1 },
    { examCode: "CUET", subjectCode: "HIST", displayOrder: 2 },
    { examCode: "CUET", subjectCode: "GEO", displayOrder: 3 },
    { examCode: "CUET", subjectCode: "ECO", displayOrder: 4 },
    { examCode: "CUET", subjectCode: "POL", displayOrder: 5 },
    { examCode: "CUET", subjectCode: "MATH", displayOrder: 6 },
    { examCode: "CUET", subjectCode: "CS", displayOrder: 7 },
    // GATE CS: Computer Science, Math
    { examCode: "GATE-CS", subjectCode: "CS", displayOrder: 1 },
    { examCode: "GATE-CS", subjectCode: "MATH", displayOrder: 2 },
  ];

  const examSubjects = [];
  for (const mapping of examSubjectMappings) {
    const examId = examMap[mapping.examCode];
    const subjectId = subjectMap[mapping.subjectCode];
    const es = await prisma.examSubject.upsert({
      where: { examId_subjectId: { examId, subjectId } },
      update: {},
      create: {
        examId,
        subjectId,
        displayOrder: mapping.displayOrder,
        isActive: true,
      },
    });
    examSubjects.push(es);
  }
  console.log(`✅ Created ${examSubjects.length} exam-subject mappings`);

  // ============================================
  // 4. QUESTION TYPES (6 types)
  // ============================================
  const questionTypes = await Promise.all([
    prisma.questionType.upsert({
      where: { code: "MCQ_SINGLE" },
      update: {},
      create: { code: "MCQ_SINGLE", name: "MCQ (Single Correct)" },
    }),
    prisma.questionType.upsert({
      where: { code: "MCQ_MULTI" },
      update: {},
      create: { code: "MCQ_MULTI", name: "MCQ (Multiple Correct)" },
    }),
    prisma.questionType.upsert({
      where: { code: "NUMERICAL" },
      update: {},
      create: { code: "NUMERICAL", name: "Numerical Value" },
    }),
    prisma.questionType.upsert({
      where: { code: "ASSERTION_REASON" },
      update: {},
      create: { code: "ASSERTION_REASON", name: "Assertion-Reason" },
    }),
    prisma.questionType.upsert({
      where: { code: "TRUE_FALSE" },
      update: {},
      create: { code: "TRUE_FALSE", name: "True/False" },
    }),
    prisma.questionType.upsert({
      where: { code: "FILL_BLANK" },
      update: {},
      create: { code: "FILL_BLANK", name: "Fill in the Blank" },
    }),
  ]);
  console.log(`✅ Created ${questionTypes.length} question types`);

  // ============================================
  // 5. CLASSES (6 classes)
  // ============================================
  const classes = await Promise.all([
    prisma.class.upsert({
      where: { classCode: "CLASS-9" },
      update: {},
      create: { classCode: "CLASS-9", className: "Class 9", isActive: true },
    }),
    prisma.class.upsert({
      where: { classCode: "CLASS-10" },
      update: {},
      create: { classCode: "CLASS-10", className: "Class 10", isActive: true },
    }),
    prisma.class.upsert({
      where: { classCode: "CLASS-11" },
      update: {},
      create: { classCode: "CLASS-11", className: "Class 11", isActive: true },
    }),
    prisma.class.upsert({
      where: { classCode: "CLASS-12" },
      update: {},
      create: { classCode: "CLASS-12", className: "Class 12", isActive: true },
    }),
    prisma.class.upsert({
      where: { classCode: "UG-1" },
      update: {},
      create: { classCode: "UG-1", className: "Undergraduate Year 1", isActive: true },
    }),
    prisma.class.upsert({
      where: { classCode: "UG-2" },
      update: {},
      create: { classCode: "UG-2", className: "Undergraduate Year 2", isActive: true },
    }),
  ]);
  console.log(`✅ Created ${classes.length} classes`);

  // ============================================
  // SUMMARY
  // ============================================
  const totalRecords =
    subjects.length + exams.length + examSubjects.length + questionTypes.length + classes.length;
  console.log(`\n🎉 Seeding complete! Total records: ${totalRecords}`);
  console.log("\n📋 You can now create ExamConfigs using:");
  console.log("   - examSubjectId: any ID from exam_subjects table");
  console.log("   - questionTypeId: any ID from QuestionType table");

  // Print handy reference
  console.log("\n--- Exam-Subject IDs (for examConfig) ---");
  for (const es of examSubjects) {
    const exam = exams.find((e) => e.id === es.examId);
    const subject = subjects.find((s) => s.id === es.subjectId);
    console.log(`  ${exam?.examCode} + ${subject?.subjectCode}: ${es.id}`);
  }

  console.log("\n--- Question Type IDs (for examConfig) ---");
  for (const qt of questionTypes) {
    console.log(`  ${qt.code}: ${qt.id}`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
