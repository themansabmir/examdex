import { prisma } from "../../../lib/prisma";
import { refundCredit } from "../infrastructure/credit.repo";

export async function refundCreditService(
  userId: string,
  paperId: string,
  jobId: string,
  error: string
) {
  await prisma.$transaction(async (tx: any) => {
    await refundCredit(tx, userId);

    await tx.paper.update({
      where: { id: paperId },
      data: { status: "FAILED" },
    });

    await tx.generationJob.update({
      where: { id: jobId },
      data: { status: "FAILED", error },
    });
  });
}
