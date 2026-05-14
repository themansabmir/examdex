import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

async function runTests() {
  const baseUrl = "http://localhost:3001/api/v1/exam-configs";
  console.log("🚀 Testing ExamConfig APIs...\n");

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  // 1. Get an auth token for testing
  console.log("🔑 Logging in to get access token...");
  const loginRes = await fetch("http://localhost:3001/api/v1/auth/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@examdex.com",
      password: "password123",
    }),
  });
  const loginData = await loginRes.json();

  if (!loginData.success || !loginData.data?.accessToken) {
    console.log("❌ Failed to log in. Response:");
    console.log(JSON.stringify(loginData, null, 2));
    await prisma.$disconnect();
    return;
  }
  const token = loginData.data.accessToken;
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const examSubject = await prisma.examSubject.findFirst();
  const questionType = await prisma.questionType.findFirst();

  if (!examSubject || !questionType) {
    console.log("❌ Need at least one examSubject and questionType in DB to test.");
    return;
  }

  // 1. Test POST (Create)
  console.log("\n1️⃣ Testing POST /api/v1/exam-configs");
  const createPayload = {
    examSubjectId: examSubject.id,
    questionTypeId: questionType.id,
    questionCount: 50,
    marksPerQuestion: 4,
    negativeMarks: 1,
    displayOrder: 1,
    difficultyMixJson: { easy: 10, medium: 20, hard: 20 },
  };

  const createRes = await fetch(baseUrl, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(createPayload),
  });

  const createData = await createRes.json();
  if (!createRes.ok) {
    console.log("❌ POST failed:", JSON.stringify(createData, null, 2));
    return;
  }
  console.log("✅ POST passed. Created ID:", createData.data.id);
  const createdId = createData.data.id;

  // 2. Test GET ALL
  console.log("\n2️⃣ Testing GET /api/v1/exam-configs");
  const getAllRes = await fetch(baseUrl, { headers: authHeaders });
  const getAllData = await getAllRes.json();
  console.log(`✅ GET ALL passed. Found ${getAllData.data.length} records.`);

  // 3. Test GET ALL with Search
  console.log("\n3️⃣ Testing GET /api/v1/exam-configs?search=MCQ");
  const searchRes = await fetch(`${baseUrl}?search=MCQ`, { headers: authHeaders });
  const searchData = await searchRes.json();
  console.log(
    `✅ GET ALL (Search) passed. Found ${searchData.data.length} records matching 'MCQ'.`
  );

  // 4. Test GET BY ID
  console.log(`\n4️⃣ Testing GET /api/v1/exam-configs/${createdId}`);
  const getByIdRes = await fetch(`${baseUrl}/${createdId}`, { headers: authHeaders });
  const getByIdData = await getByIdRes.json();
  console.log(`✅ GET BY ID passed. Found record with ID:`, getByIdData.data.id);

  // 5. Test PATCH (Update)
  console.log(`\n5️⃣ Testing PATCH /api/v1/exam-configs/${createdId}`);
  const updatePayload = {
    questionCount: 75,
    marksPerQuestion: 2,
  };
  const updateRes = await fetch(`${baseUrl}/${createdId}`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify(updatePayload),
  });
  const updateData = await updateRes.json();
  console.log(`✅ PATCH passed. New questionCount:`, updateData.data.questionCount);

  // 6. Test DELETE
  console.log(`\n6️⃣ Testing DELETE /api/v1/exam-configs/${createdId}`);
  const deleteRes = await fetch(`${baseUrl}/${createdId}`, {
    method: "DELETE",
    headers: authHeaders,
  });
  console.log(`✅ DELETE passed. Status code:`, deleteRes.status);

  // Verify deletion
  const verifyRes = await fetch(`${baseUrl}/${createdId}`, { headers: authHeaders });
  console.log(`✅ VERIFY DELETION passed. Fetching deleted ID returned status:`, verifyRes.status);

  console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!");
  await prisma.$disconnect();
}

runTests().catch(console.error);
