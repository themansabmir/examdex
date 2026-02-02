-- CreateTable
CREATE TABLE "otp_storage" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "channel" VARCHAR(20) NOT NULL,
    "code_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_storage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "otp_storage_user_id_idx" ON "otp_storage"("user_id");

-- CreateIndex
CREATE INDEX "otp_storage_expires_at_idx" ON "otp_storage"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "otp_storage_user_id_channel_key" ON "otp_storage"("user_id", "channel");
