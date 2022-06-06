/*
  Warnings:

  - You are about to drop the column `type` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `startDate` on the `event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endDate` on the `event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `theme` on the `event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `adminId` to the `request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `theme` to the `request` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `donation` on the `request` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `address` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `donationReceived` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('EDUCATION', 'HEALTHCARE', 'LIFESTYLE', 'LIVELIHOOD', 'CAREER_COUNSELLING', 'GENERAL_COUNSELLING', 'WELLNESS_COUNSELLING');

-- AlterTable
ALTER TABLE "event" DROP COLUMN "startDate",
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "endDate",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "theme",
ADD COLUMN     "theme" "Theme" NOT NULL;

-- AlterTable
ALTER TABLE "request" ADD COLUMN     "adminId" INTEGER NOT NULL,
ADD COLUMN     "theme" "Theme" NOT NULL,
DROP COLUMN "donation",
ADD COLUMN     "donation" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "type",
ADD COLUMN     "address" JSONB NOT NULL,
ADD COLUMN     "donationReceived" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL;

-- DropEnum
DROP TYPE "EventTheme";

-- DropEnum
DROP TYPE "UserType";

-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL DEFAULT E'',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_uid_key" ON "admin"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "request" ADD CONSTRAINT "request_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
