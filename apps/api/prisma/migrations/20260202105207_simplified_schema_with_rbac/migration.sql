/*
  Warnings:

  - The primary key for the `credit_transactions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `change` on the `credit_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `credit_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `wallet_id` on the `credit_transactions` table. All the data in the column will be lost.
  - The primary key for the `exams` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `exams` table. All the data in the column will be lost.
  - The primary key for the `permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `slug` on the `permissions` table. All the data in the column will be lost.
  - The primary key for the `role_permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `roles` table. All the data in the column will be lost.
  - The primary key for the `subjects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `subjects` table. All the data in the column will be lost.
  - The primary key for the `topics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `topics` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `topics` table. All the data in the column will be lost.
  - You are about to drop the column `subject_id` on the `topics` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `password_hash` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the `admin_team_invites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_models` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_usage_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `credit_wallets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exam_subjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `knowledge_index_jobs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `knowledge_sources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `otp_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `packages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prompt_templates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchases` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rankings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student_answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `students` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `test_questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `test_results` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tests` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[exam_code]` on the table `exams` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[permission_name]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resource,action]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[role_id,permission_id]` on the table `role_permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[role_name]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[exam_id,subject_code]` on the table `subjects` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chapter_id,topic_code]` on the table `topics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `balance_after` to the `credit_transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credits_change` to the `credit_transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_type` to the `credit_transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `credit_transactions` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `credit_transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `exam_code` to the `exams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exam_name` to the `exams` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `exams` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `action` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permission_name` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resource` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `permissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `role_permissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role_id` on the `role_permissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `permission_id` on the `role_permissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `role_name` to the `roles` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `roles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `exam_id` to the `subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject_code` to the `subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject_name` to the `subjects` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `subjects` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `chapter_id` to the `topics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic_code` to the `topics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic_name` to the `topics` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `topics` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `full_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MCQ_single', 'MCQ_multiple', 'Numerical', 'Assertion_Reason');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "StrengthRating" AS ENUM ('weak', 'moderate', 'strong');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('purchase', 'referral_earned', 'referral_bonus', 'admin_grant', 'paper_generation', 'refund');

-- CreateEnum
CREATE TYPE "ErrorType" AS ENUM ('incorrect_answer', 'unclear_question', 'wrong_solution', 'formatting_issue');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('pending', 'reviewed', 'fixed', 'rejected');

-- CreateEnum
CREATE TYPE "GenerationStatus" AS ENUM ('success', 'failed', 'partial');

-- CreateEnum
CREATE TYPE "VectorizationStatus" AS ENUM ('pending', 'processing', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('super_admin', 'content_manager', 'support');

-- CreateEnum
CREATE TYPE "ScopeLevel" AS ENUM ('exam', 'subject', 'global');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('student', 'admin', 'content_manager', 'support');

-- DropForeignKey
ALTER TABLE "ai_usage_logs" DROP CONSTRAINT "ai_usage_logs_model_id_fkey";

-- DropForeignKey
ALTER TABLE "ai_usage_logs" DROP CONSTRAINT "ai_usage_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_actor_user_id_fkey";

-- DropForeignKey
ALTER TABLE "credit_transactions" DROP CONSTRAINT "credit_transactions_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "credit_wallets" DROP CONSTRAINT "credit_wallets_student_id_fkey";

-- DropForeignKey
ALTER TABLE "exam_subjects" DROP CONSTRAINT "exam_subjects_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "exam_subjects" DROP CONSTRAINT "exam_subjects_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "knowledge_index_jobs" DROP CONSTRAINT "knowledge_index_jobs_knowledge_source_id_fkey";

-- DropForeignKey
ALTER TABLE "knowledge_sources" DROP CONSTRAINT "knowledge_sources_created_by_fkey";

-- DropForeignKey
ALTER TABLE "knowledge_sources" DROP CONSTRAINT "knowledge_sources_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "otp_requests" DROP CONSTRAINT "otp_requests_user_id_fkey";

-- DropForeignKey
ALTER TABLE "prompt_templates" DROP CONSTRAINT "prompt_templates_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "purchases" DROP CONSTRAINT "purchases_package_id_fkey";

-- DropForeignKey
ALTER TABLE "purchases" DROP CONSTRAINT "purchases_student_id_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "rankings" DROP CONSTRAINT "rankings_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "rankings" DROP CONSTRAINT "rankings_student_id_fkey";

-- DropForeignKey
ALTER TABLE "rankings" DROP CONSTRAINT "rankings_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_role_id_fkey";

-- DropForeignKey
ALTER TABLE "student_answers" DROP CONSTRAINT "student_answers_student_id_fkey";

-- DropForeignKey
ALTER TABLE "student_answers" DROP CONSTRAINT "student_answers_test_question_id_fkey";

-- DropForeignKey
ALTER TABLE "student_profiles" DROP CONSTRAINT "student_profiles_student_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_target_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_user_id_fkey";

-- DropForeignKey
ALTER TABLE "test_questions" DROP CONSTRAINT "test_questions_question_id_fkey";

-- DropForeignKey
ALTER TABLE "test_questions" DROP CONSTRAINT "test_questions_test_id_fkey";

-- DropForeignKey
ALTER TABLE "test_results" DROP CONSTRAINT "test_results_test_id_fkey";

-- DropForeignKey
ALTER TABLE "tests" DROP CONSTRAINT "tests_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "tests" DROP CONSTRAINT "tests_student_id_fkey";

-- DropForeignKey
ALTER TABLE "topics" DROP CONSTRAINT "topics_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_role_fkey";

-- DropIndex
DROP INDEX "permissions_slug_key";

-- DropIndex
DROP INDEX "users_phone_key";

-- AlterTable
ALTER TABLE "credit_transactions" DROP CONSTRAINT "credit_transactions_pkey",
DROP COLUMN "change",
DROP COLUMN "reason",
DROP COLUMN "wallet_id",
ADD COLUMN     "balance_after" INTEGER NOT NULL,
ADD COLUMN     "credits_change" INTEGER NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "payment_amount_inr" DECIMAL(10,2),
ADD COLUMN     "payment_gateway_id" VARCHAR(255),
ADD COLUMN     "payment_status" VARCHAR(50),
ADD COLUMN     "razorpay_payment_id" VARCHAR(255),
ADD COLUMN     "related_paper_id" UUID,
ADD COLUMN     "transaction_type" VARCHAR(50) NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(6),
ADD CONSTRAINT "credit_transactions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "exams" DROP CONSTRAINT "exams_pkey",
DROP COLUMN "name",
DROP COLUMN "status",
ADD COLUMN     "exam_board" VARCHAR(100),
ADD COLUMN     "exam_code" VARCHAR(50) NOT NULL,
ADD COLUMN     "exam_full_name" TEXT,
ADD COLUMN     "exam_name" VARCHAR(255) NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(6),
ADD CONSTRAINT "exams_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_pkey",
DROP COLUMN "slug",
ADD COLUMN     "action" VARCHAR(50) NOT NULL,
ADD COLUMN     "permission_name" VARCHAR(100) NOT NULL,
ADD COLUMN     "resource" VARCHAR(50) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "permissions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "role_id",
ADD COLUMN     "role_id" UUID NOT NULL,
DROP COLUMN "permission_id",
ADD COLUMN     "permission_id" UUID NOT NULL,
ADD CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "roles" DROP CONSTRAINT "roles_pkey",
DROP COLUMN "name",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "role_name" VARCHAR(50) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(6),
ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_pkey",
DROP COLUMN "created_at",
DROP COLUMN "name",
ADD COLUMN     "display_order" INTEGER,
ADD COLUMN     "exam_id" UUID NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "subject_code" VARCHAR(50) NOT NULL,
ADD COLUMN     "subject_name" VARCHAR(255) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "subjects_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "topics" DROP CONSTRAINT "topics_pkey",
DROP COLUMN "created_at",
DROP COLUMN "name",
DROP COLUMN "subject_id",
ADD COLUMN     "chapter_id" UUID NOT NULL,
ADD COLUMN     "difficulty_level" VARCHAR(20),
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "topic_code" VARCHAR(50) NOT NULL,
ADD COLUMN     "topic_name" VARCHAR(500) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "topics_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "phone",
DROP COLUMN "role",
DROP COLUMN "status",
DROP COLUMN "updated_at",
ADD COLUMN     "credit_balance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "device_fingerprint" VARCHAR(255),
ADD COLUMN     "full_name" VARCHAR(255) NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "last_login_at" TIMESTAMP(6),
ADD COLUMN     "phone_number" VARCHAR(15),
ADD COLUMN     "total_credits_purchased" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "user_type" "UserType" NOT NULL DEFAULT 'student',
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "password_hash" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(6),
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "admin_team_invites";

-- DropTable
DROP TABLE "ai_models";

-- DropTable
DROP TABLE "ai_usage_logs";

-- DropTable
DROP TABLE "audit_logs";

-- DropTable
DROP TABLE "credit_wallets";

-- DropTable
DROP TABLE "exam_subjects";

-- DropTable
DROP TABLE "knowledge_index_jobs";

-- DropTable
DROP TABLE "knowledge_sources";

-- DropTable
DROP TABLE "otp_requests";

-- DropTable
DROP TABLE "packages";

-- DropTable
DROP TABLE "prompt_templates";

-- DropTable
DROP TABLE "purchases";

-- DropTable
DROP TABLE "questions";

-- DropTable
DROP TABLE "rankings";

-- DropTable
DROP TABLE "student_answers";

-- DropTable
DROP TABLE "student_profiles";

-- DropTable
DROP TABLE "students";

-- DropTable
DROP TABLE "test_questions";

-- DropTable
DROP TABLE "test_results";

-- DropTable
DROP TABLE "tests";

-- CreateTable
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "granted_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "granted_by" UUID,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_exam_preferences" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "exam_id" UUID NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "target_exam_date" DATE,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_exam_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapters" (
    "id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "chapter_code" VARCHAR(50) NOT NULL,
    "chapter_name" VARCHAR(500) NOT NULL,
    "chapter_number" INTEGER,
    "weightage_percentage" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generated_papers" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "exam_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "paper_title" VARCHAR(500),
    "questions_data" JSONB NOT NULL,
    "selected_topics" UUID[],
    "difficulty_distribution" JSONB NOT NULL,
    "total_questions" INTEGER NOT NULL,
    "max_marks" INTEGER NOT NULL,
    "time_limit_minutes" INTEGER NOT NULL,
    "ai_prompt_template_id" UUID,
    "ai_prompt_version" VARCHAR(20),
    "generation_latency_ms" INTEGER,
    "generation_status" VARCHAR(20) NOT NULL,
    "student_rating" INTEGER,
    "is_bookmarked" BOOLEAN NOT NULL DEFAULT false,
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generated_papers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paper_attempts" (
    "id" UUID NOT NULL,
    "paper_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "attempt_number" INTEGER NOT NULL,
    "started_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submitted_at" TIMESTAMP(6),
    "time_taken_seconds" INTEGER,
    "answers_data" JSONB NOT NULL,
    "total_score" DECIMAL(6,2),
    "percentage" DECIMAL(5,2),
    "correct_answers" INTEGER,
    "incorrect_answers" INTEGER,
    "unattempted" INTEGER,
    "all_time_rank" INTEGER,
    "cohort_rank" INTEGER,
    "weekly_rank" INTEGER,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "paper_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_tiers" (
    "id" UUID NOT NULL,
    "tier_name" VARCHAR(50) NOT NULL,
    "tier_code" VARCHAR(20) NOT NULL,
    "price_inr" DECIMAL(10,2) NOT NULL,
    "credits" INTEGER NOT NULL,
    "bonus_credits" INTEGER NOT NULL DEFAULT 0,
    "display_order" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pricing_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_prompt_templates" (
    "id" UUID NOT NULL,
    "template_name" VARCHAR(255) NOT NULL,
    "scope_level" VARCHAR(20) NOT NULL,
    "exam_id" UUID,
    "subject_id" UUID,
    "system_prompt" TEXT NOT NULL,
    "generation_rules" JSONB NOT NULL,
    "sample_output_format" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "avg_generation_time_ms" INTEGER,
    "avg_student_rating" DECIMAL(3,2),
    "success_rate" DECIMAL(5,2),
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_prompt_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_config" (
    "id" UUID NOT NULL,
    "config_key" VARCHAR(255) NOT NULL,
    "config_value" JSONB NOT NULL,
    "description" TEXT,
    "updated_by" UUID,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uploaded_content" (
    "id" UUID NOT NULL,
    "exam_id" UUID,
    "subject_id" UUID,
    "chapter_id" UUID,
    "file_name" VARCHAR(500) NOT NULL,
    "file_type" VARCHAR(50),
    "s3_bucket" VARCHAR(255),
    "s3_key" VARCHAR(500),
    "file_size_bytes" BIGINT,
    "vectorization_status" VARCHAR(50) NOT NULL,
    "vectorization_started_at" TIMESTAMP(6),
    "vectorization_completed_at" TIMESTAMP(6),
    "questions_extracted" INTEGER NOT NULL DEFAULT 0,
    "uploaded_by" UUID NOT NULL,
    "uploaded_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploaded_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_metrics" (
    "id" UUID NOT NULL,
    "metric_date" DATE NOT NULL,
    "new_signups" INTEGER NOT NULL DEFAULT 0,
    "active_users" INTEGER NOT NULL DEFAULT 0,
    "papers_generated" INTEGER NOT NULL DEFAULT 0,
    "papers_attempted" INTEGER NOT NULL DEFAULT 0,
    "paper_generation_failures" INTEGER NOT NULL DEFAULT 0,
    "avg_generation_time_ms" INTEGER,
    "credits_purchased" INTEGER NOT NULL DEFAULT 0,
    "credits_consumed" INTEGER NOT NULL DEFAULT 0,
    "total_revenue_inr" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "avg_paper_rating" DECIMAL(3,2),
    "question_error_reports" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_roles_user_id_idx" ON "user_roles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_key" ON "user_roles"("user_id", "role_id");

-- CreateIndex
CREATE INDEX "user_exam_preferences_user_id_exam_id_idx" ON "user_exam_preferences"("user_id", "exam_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_exam_preferences_user_id_exam_id_key" ON "user_exam_preferences"("user_id", "exam_id");

-- CreateIndex
CREATE INDEX "chapters_subject_id_id_idx" ON "chapters"("subject_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "chapters_subject_id_chapter_code_key" ON "chapters"("subject_id", "chapter_code");

-- CreateIndex
CREATE INDEX "generated_papers_user_id_created_at_idx" ON "generated_papers"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "generated_papers_exam_id_subject_id_idx" ON "generated_papers"("exam_id", "subject_id");

-- CreateIndex
CREATE INDEX "generated_papers_user_id_is_bookmarked_idx" ON "generated_papers"("user_id", "is_bookmarked");

-- CreateIndex
CREATE INDEX "paper_attempts_user_id_submitted_at_idx" ON "paper_attempts"("user_id", "submitted_at" DESC);

-- CreateIndex
CREATE INDEX "paper_attempts_paper_id_attempt_number_idx" ON "paper_attempts"("paper_id", "attempt_number");

-- CreateIndex
CREATE INDEX "paper_attempts_user_id_is_completed_idx" ON "paper_attempts"("user_id", "is_completed");

-- CreateIndex
CREATE UNIQUE INDEX "pricing_tiers_tier_code_key" ON "pricing_tiers"("tier_code");

-- CreateIndex
CREATE INDEX "ai_prompt_templates_scope_level_exam_id_subject_id_idx" ON "ai_prompt_templates"("scope_level", "exam_id", "subject_id");

-- CreateIndex
CREATE INDEX "ai_prompt_templates_is_active_scope_level_idx" ON "ai_prompt_templates"("is_active", "scope_level");

-- CreateIndex
CREATE UNIQUE INDEX "system_config_config_key_key" ON "system_config"("config_key");

-- CreateIndex
CREATE INDEX "uploaded_content_vectorization_status_idx" ON "uploaded_content"("vectorization_status");

-- CreateIndex
CREATE INDEX "uploaded_content_chapter_id_idx" ON "uploaded_content"("chapter_id");

-- CreateIndex
CREATE UNIQUE INDEX "daily_metrics_metric_date_key" ON "daily_metrics"("metric_date");

-- CreateIndex
CREATE INDEX "daily_metrics_metric_date_idx" ON "daily_metrics"("metric_date" DESC);

-- CreateIndex
CREATE INDEX "credit_transactions_user_id_created_at_idx" ON "credit_transactions"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "credit_transactions_payment_gateway_id_idx" ON "credit_transactions"("payment_gateway_id");

-- CreateIndex
CREATE INDEX "credit_transactions_related_paper_id_idx" ON "credit_transactions"("related_paper_id");

-- CreateIndex
CREATE UNIQUE INDEX "exams_exam_code_key" ON "exams"("exam_code");

-- CreateIndex
CREATE INDEX "exams_exam_code_idx" ON "exams"("exam_code");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_permission_name_key" ON "permissions"("permission_name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_resource_action_key" ON "permissions"("resource", "action");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_id_permission_id_key" ON "role_permissions"("role_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_name_key" ON "roles"("role_name");

-- CreateIndex
CREATE INDEX "subjects_exam_id_id_idx" ON "subjects"("exam_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_exam_id_subject_code_key" ON "subjects"("exam_id", "subject_code");

-- CreateIndex
CREATE INDEX "topics_chapter_id_id_idx" ON "topics"("chapter_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "topics_chapter_id_topic_code_key" ON "topics"("chapter_id", "topic_code");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE INDEX "users_phone_number_idx" ON "users"("phone_number");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_id_credit_balance_idx" ON "users"("id", "credit_balance");

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_exam_preferences" ADD CONSTRAINT "user_exam_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_exam_preferences" ADD CONSTRAINT "user_exam_preferences_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_papers" ADD CONSTRAINT "generated_papers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_papers" ADD CONSTRAINT "generated_papers_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_papers" ADD CONSTRAINT "generated_papers_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_papers" ADD CONSTRAINT "generated_papers_ai_prompt_template_id_fkey" FOREIGN KEY ("ai_prompt_template_id") REFERENCES "ai_prompt_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paper_attempts" ADD CONSTRAINT "paper_attempts_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "generated_papers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paper_attempts" ADD CONSTRAINT "paper_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_prompt_templates" ADD CONSTRAINT "ai_prompt_templates_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_prompt_templates" ADD CONSTRAINT "ai_prompt_templates_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_prompt_templates" ADD CONSTRAINT "ai_prompt_templates_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_config" ADD CONSTRAINT "system_config_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uploaded_content" ADD CONSTRAINT "uploaded_content_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uploaded_content" ADD CONSTRAINT "uploaded_content_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uploaded_content" ADD CONSTRAINT "uploaded_content_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uploaded_content" ADD CONSTRAINT "uploaded_content_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
