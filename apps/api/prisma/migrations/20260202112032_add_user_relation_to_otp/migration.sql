-- AddForeignKey
ALTER TABLE "otp_storage" ADD CONSTRAINT "otp_storage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
