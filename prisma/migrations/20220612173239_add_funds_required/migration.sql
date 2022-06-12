-- AlterTable
ALTER TABLE "request" ADD COLUMN     "fundsRequired" DOUBLE PRECISION DEFAULT 0,
ALTER COLUMN "donation" DROP NOT NULL;
