-- AlterTable
ALTER TABLE "antibiotic_requests" ADD COLUMN     "assignedAdminId" TEXT;

-- AddForeignKey
ALTER TABLE "antibiotic_requests" ADD CONSTRAINT "antibiotic_requests_assignedAdminId_fkey" FOREIGN KEY ("assignedAdminId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
