import crypto from "crypto";
import { prisma } from "../../../lib/prisma";
import { lockAndGetUserCredits, decrementCredit } from "../infrastructure/credit.repo";
import { createPaper, createJobRecord } from "../infrastructure/paper.repo";

export async function generatePaperService(userId: string, topic: string) {
  return prisma.$transaction(async (tx: any) => {
    // 🔒 lock row
    const user = await lockAndGetUserCredits(tx, userId);

    if (!user || user.credits <= 0) {
      throw new Error("NO_CREDITS");
    }

    await decrementCredit(tx, userId);

    const paper = await createPaper(tx, userId, topic);

    const jobId = crypto.randomUUID();

    await createJobRecord(tx, jobId, paper.id, userId);

    return { jobId, paperId: paper.id };
  });
}
