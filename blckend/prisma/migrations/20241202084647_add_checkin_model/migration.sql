/*
  Warnings:

  - A unique constraint covering the columns `[userId,checkInDate]` on the table `CheckIn` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `CheckIn` ALTER COLUMN `checkInDate` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `CheckIn_userId_checkInDate_key` ON `CheckIn`(`userId`, `checkInDate`);
