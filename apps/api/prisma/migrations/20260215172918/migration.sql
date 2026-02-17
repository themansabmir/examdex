/*
  Warnings:

  - You are about to drop the `subject_chapters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "subject_chapters" DROP CONSTRAINT "subject_chapters_chapter_id_fkey";

-- DropForeignKey
ALTER TABLE "subject_chapters" DROP CONSTRAINT "subject_chapters_exam_subject_id_fkey";

-- DropTable
DROP TABLE "subject_chapters";
