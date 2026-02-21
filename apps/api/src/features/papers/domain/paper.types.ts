export type PaperStatus = "PENDING" | "DONE" | "FAILED";

export interface GeneratePaperInput {
  topic: string;
}

export interface GeneratePaperResult {
  jobId: string;
  paperId: string;
}
