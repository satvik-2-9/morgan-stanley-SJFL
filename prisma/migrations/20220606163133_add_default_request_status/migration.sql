/*
  Warnings:

  - The values [APPROVED] on the enum `RequestStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RequestStatus_new" AS ENUM ('UNDER_REVIEW', 'PENDING_UPLOADS', 'COMPLETE', 'REJECTED');
ALTER TABLE "request" ALTER COLUMN "status" TYPE "RequestStatus_new" USING ("status"::text::"RequestStatus_new");
ALTER TYPE "RequestStatus" RENAME TO "RequestStatus_old";
ALTER TYPE "RequestStatus_new" RENAME TO "RequestStatus";
DROP TYPE "RequestStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "request" ALTER COLUMN "status" SET DEFAULT E'UNDER_REVIEW';
