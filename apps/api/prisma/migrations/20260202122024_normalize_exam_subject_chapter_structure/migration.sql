/*
  Warnings:

  - You are about to drop the column `exam_id` on the `ai_prompt_templates` table. All the data in the column will be lost.
  - You are about to drop the column `subject_id` on the `ai_prompt_templates` table. All the data in the column will be lost.
  - You are about to drop the column `chapter_number` on the `chapters` table. All the data in the column will be lost.
  - You are about to drop the column `weightage_percentage` on the `chapters` table. All the data in the column will be lost.
  - You are about to drop the column `subject_id` on the `generated_papers` table. All the data in the column will be lost.
  - You are about to drop the column `display_order` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the column `exam_id` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the `topics` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[subject_code]` on the table `subjects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `exam_subject_id` to the `generated_papers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ai_prompt_templates" DROP CONSTRAINT "ai_prompt_templates_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "ai_prompt_templates" DROP CONSTRAINT "ai_prompt_templates_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "generated_papers" DROP CONSTRAINT "generated_papers_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "topics" DROP CONSTRAINT "topics_chapter_id_fkey";

-- DropIndex
DROP INDEX "ai_prompt_templates_scope_level_exam_id_subject_id_idx";

-- DropIndex
DROP INDEX "chapters_subject_id_id_idx";

-- DropIndex
DROP INDEX "generated_papers_exam_id_subject_id_idx";

-- DropIndex
DROP INDEX "subjects_exam_id_id_idx";

-- DropIndex
DROP INDEX "subjects_exam_id_subject_code_key";

-- AlterTable
ALTER TABLE "ai_prompt_templates" DROP COLUMN "exam_id",
DROP COLUMN "subject_id",
ADD COLUMN     "exam_subject_id" UUID;

-- AlterTable
ALTER TABLE "chapters" DROP COLUMN "chapter_number",
DROP COLUMN "weightage_percentage",
ADD COLUMN     "class_id" UUID;

-- AlterTable
ALTER TABLE "exams" ADD COLUMN     "is_popular" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "generated_papers" DROP COLUMN "subject_id",
ADD COLUMN     "exam_subject_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "display_order",
DROP COLUMN "exam_id";

-- AlterTable
ALTER TABLE "uploaded_content" ADD COLUMN     "class_id" UUID;

-- DropTable
DROP TABLE "topics";

-- CreateTable
CREATE TABLE "exam_subjects" (
    "id" UUID NOT NULL,
    "exam_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "display_order" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "exam_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject_chapters" (
    "id" UUID NOT NULL,
    "exam_subject_id" UUID NOT NULL,
    "chapter_id" UUID NOT NULL,
    "chapter_number" INTEGER,
    "weightage_percentage" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "subject_chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" UUID NOT NULL,
    "class_code" VARCHAR(20) NOT NULL,
    "class_name" VARCHAR(100) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "exam_subjects_exam_id_idx" ON "exam_subjects"("exam_id");

-- CreateIndex
CREATE INDEX "exam_subjects_subject_id_idx" ON "exam_subjects"("subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "exam_subjects_exam_id_subject_id_key" ON "exam_subjects"("exam_id", "subject_id");

-- CreateIndex
CREATE INDEX "subject_chapters_exam_subject_id_idx" ON "subject_chapters"("exam_subject_id");

-- CreateIndex
CREATE INDEX "subject_chapters_chapter_id_idx" ON "subject_chapters"("chapter_id");

-- CreateIndex
CREATE UNIQUE INDEX "subject_chapters_exam_subject_id_chapter_id_key" ON "subject_chapters"("exam_subject_id", "chapter_id");

-- CreateIndex
CREATE UNIQUE INDEX "classes_class_code_key" ON "classes"("class_code");

-- CreateIndex
CREATE INDEX "ai_prompt_templates_scope_level_exam_subject_id_idx" ON "ai_prompt_templates"("scope_level", "exam_subject_id");

-- CreateIndex
CREATE INDEX "chapters_subject_id_idx" ON "chapters"("subject_id");

-- CreateIndex
CREATE INDEX "chapters_class_id_idx" ON "chapters"("class_id");

-- CreateIndex
CREATE INDEX "exams_is_popular_is_active_idx" ON "exams"("is_popular", "is_active");

-- CreateIndex
CREATE INDEX "generated_papers_exam_id_exam_subject_id_idx" ON "generated_papers"("exam_id", "exam_subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_subject_code_key" ON "subjects"("subject_code");

-- CreateIndex
CREATE INDEX "subjects_subject_code_idx" ON "subjects"("subject_code");

-- CreateIndex
CREATE INDEX "uploaded_content_class_id_idx" ON "uploaded_content"("class_id");

-- AddForeignKey
ALTER TABLE "exam_subjects" ADD CONSTRAINT "exam_subjects_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_subjects" ADD CONSTRAINT "exam_subjects_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_chapters" ADD CONSTRAINT "subject_chapters_exam_subject_id_fkey" FOREIGN KEY ("exam_subject_id") REFERENCES "exam_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_chapters" ADD CONSTRAINT "subject_chapters_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_papers" ADD CONSTRAINT "generated_papers_exam_subject_id_fkey" FOREIGN KEY ("exam_subject_id") REFERENCES "exam_subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_prompt_templates" ADD CONSTRAINT "ai_prompt_templates_exam_subject_id_fkey" FOREIGN KEY ("exam_subject_id") REFERENCES "exam_subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uploaded_content" ADD CONSTRAINT "uploaded_content_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
