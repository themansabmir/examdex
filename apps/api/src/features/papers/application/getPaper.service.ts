import { prisma } from "../../../lib/prisma";

export async function getPaperForStudent(userId: string, paperId: string) {
  return prisma.paper.findFirst({
    where: { id: paperId, userId },
    include: {
      questions: {
        select: {
          id: true,
          questionText: true,
          options: true,
        },
      },
    },
  });
}

export async function getPaperHistory(userId: string, page: number) {
  const limit = 10;

  return prisma.paper.findMany({
    where: { userId },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      topic: true,
      score: true,
      createdAt: true,
    },
  });
}
