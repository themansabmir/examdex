-- DropForeignKey
ALTER TABLE "default_credit_config" DROP CONSTRAINT "fk_default_credit_config_updated_by";

-- DropIndex
DROP INDEX "idx_default_credit_config_active";

-- AlterTable
ALTER TABLE "default_credit_config" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(6);

-- AddForeignKey
ALTER TABLE "default_credit_config" ADD CONSTRAINT "default_credit_config_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
