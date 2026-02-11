import { app } from "../src/main";
import http from "http";
import { PrismaClient } from "@prisma/client";

const PORT = 3002;
const prisma = new PrismaClient();

async function runTest() {
  console.log("Starting user creation test server...");
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(PORT, () => {
      console.log(`Test server running on port ${PORT}`);
      resolve();
    });
  });

  try {
    // 0. Setup: Get a valid Exam ID
    const exam = await prisma.exam.findFirst({ where: { isActive: true } });
    if (!exam) {
      throw new Error("No active exam found in database. Cannot run test.");
    }
    console.log(`Using Exam ID: ${exam.id}`);

    // 1. Create User WITH Exam ID Header
    const timestamp = Date.now();
    const userData = {
      fullName: `Test User ${timestamp}`,
      email: `test${timestamp}@example.com`,
      phone: `9${timestamp.toString().slice(-9)}`, // Dummy phone
      password: "password123",
      userType: "student",
    };

    const res = await fetch(`http://localhost:${PORT}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-exam-id": exam.id,
      },
      body: JSON.stringify(userData),
    });

    if (res.status !== 201) {
      console.error(await res.text());
      throw new Error(`Failed to create user. Status: ${res.status}`);
    }

    const { data: createdUser } = await res.json();
    console.log(`User created: ${createdUser.id}`);

    // 2. Verify Preference in Database
    const preference = await prisma.userExamPreference.findFirst({
      where: {
        userId: createdUser.id,
        examId: exam.id,
        isPrimary: true,
      },
    });

    if (!preference) {
      throw new Error("User created but Exam Preference NOT found or not primary.");
    }

    console.log("User Exam Preference verified successfully!");
    console.log("All tests passed!");
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  } finally {
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  }
}

runTest();
