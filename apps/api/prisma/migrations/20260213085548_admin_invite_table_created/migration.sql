/*
  Warnings:

  - Added the required column `subject_id` to the `user_exam_preferences` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_exam_preferences" ADD COLUMN     "subject_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_onboarded" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "admin_team_invites" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "role" "UserType" NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "invited_by" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_team_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_team_invites_email_key" ON "admin_team_invites"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_team_invites_token_key" ON "admin_team_invites"("token");
