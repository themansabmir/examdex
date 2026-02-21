// Express route handlers
import { Request, Response } from "express";

export async function getPapers(req: Request, res: Response) {
  // Example: fetch all papers for the authenticated user
  const userId = req.user?.id || req.body.userId || req.query.userId;
  const papers = await prisma.paper.findMany({ where: { userId } });
  res.json(papers);
}

export async function getPaperById(req: Request, res: Response) {
  const userId = req.user?.id || req.body.userId || req.query.userId;
  const paperId = req.params.id;
  const paper = await prisma.paper.findFirst({ where: { id: paperId, userId } });
  if (!paper) return res.status(404).json({ error: "Paper not found" });
  res.json(paper);
}

export async function generatePaper(req: Request, res: Response) {
  // Example: call your service to generate a paper
  // You may want to validate input, etc.
  res.status(202).json({ message: "Paper generation started" });
}

export async function getJobStatus(req: Request, res: Response) {
  // Example: return job status
  res.json({ status: "pending" });
}
import { Worker } from "bullmq";
import { paperQueue } from "../infrastructure/queue";
import { prisma } from "../../../lib/prisma";
import { refundCreditService } from "../application/refundCredit.service";

async function generateFromLLM() {
  // mock
  return [
    {
      question: "Sample?",
      options: ["A", "B", "C", "D"],
      answer: "A",
    },
  ];
}

new Worker(
  "paper-generation",
  async (job) => {
    const { paperId, userId } = job.data;

    try {
      const questions = await generateFromLLM();

      await prisma.$transaction(async (tx: any) => {
        await tx.paperQuestion.createMany({
          data: questions.map((q) => ({
            paperId,
            questionText: q.question,
            options: q.options,
            correctAnswer: q.answer,
          })),
        });

        await tx.paper.update({
          where: { id: paperId },
          data: { status: "DONE" },
        });

        await tx.generationJob.update({
          where: { id: job.id },
          data: { status: "DONE" },
        });
      });
    } catch (err: any) {
      if (job.attemptsMade + 1 >= job.opts.attempts!) {
        await refundCreditService(userId, paperId, job.id!, err.message);
      }
      throw err;
    }
  },
  { connection: paperQueue.opts.connection }
);
