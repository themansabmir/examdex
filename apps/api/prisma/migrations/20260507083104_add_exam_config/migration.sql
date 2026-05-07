-- DropEnum
DROP TYPE "QuestionType";

-- CreateTable
CREATE TABLE "QuestionType" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "QuestionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamConfig" (
    "id" UUID NOT NULL,
    "examSubjectId" UUID NOT NULL,
    "questionTypeId" UUID NOT NULL,
    "questionCount" INTEGER NOT NULL,
    "marksPerQuestion" DOUBLE PRECISION NOT NULL,
    "negativeMarks" DOUBLE PRECISION,
    "displayOrder" INTEGER NOT NULL,
    "difficultyMixJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionType_code_key" ON "QuestionType"("code");

-- AddForeignKey
ALTER TABLE "ExamConfig" ADD CONSTRAINT "ExamConfig_examSubjectId_fkey" FOREIGN KEY ("examSubjectId") REFERENCES "exam_subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamConfig" ADD CONSTRAINT "ExamConfig_questionTypeId_fkey" FOREIGN KEY ("questionTypeId") REFERENCES "QuestionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
