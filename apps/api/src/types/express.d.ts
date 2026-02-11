import { Exam } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      exam?: Exam;
    }
  }
}
