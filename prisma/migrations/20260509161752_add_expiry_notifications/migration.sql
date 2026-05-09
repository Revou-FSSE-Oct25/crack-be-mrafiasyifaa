-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'ANTIBIOTIC_KADALUARSA';

-- AlterTable
ALTER TABLE "antibiotic_requests" ADD COLUMN     "expiredNotified" BOOLEAN NOT NULL DEFAULT false;
