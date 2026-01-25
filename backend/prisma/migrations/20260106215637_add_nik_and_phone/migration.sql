/*
  Warnings:

  - A unique constraint covering the columns `[nik]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nik` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `users_email_key` ON `users`;

-- AlterTable: Add columns as nullable first
ALTER TABLE `users` 
    ADD COLUMN `nik` VARCHAR(191) NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL;

-- Update existing users with temporary NIK (use email or generate from ID)
UPDATE `users` 
SET `nik` = CONCAT('TEMP', LPAD(id, 12, '0'))
WHERE `nik` IS NULL;

-- Now make NIK NOT NULL and UNIQUE
ALTER TABLE `users` MODIFY `nik` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_nik_key` ON `users`(`nik`);
