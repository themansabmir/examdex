export async function createPaper(tx: any, userId: string, topic: string) {
  return tx.paper.create({
    data: {
      userId,
      topic,
      status: "PENDING",
    },
  });
}

export async function createJobRecord(tx: any, jobId: string, paperId: string, userId: string) {
  return tx.generationJob.create({
    data: {
      id: jobId,
      paperId,
      userId,
      status: "PENDING",
    },
  });
}
