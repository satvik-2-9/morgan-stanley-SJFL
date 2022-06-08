-- AlterEnum
ALTER TYPE "RequestStatus" ADD VALUE 'APPROVAL_PENDING';

-- AlterTable
ALTER TABLE "request" ALTER COLUMN "status" DROP DEFAULT;
