/*
  Warnings:

  - You are about to drop the column `bakteri` on the `hasil_lab` table. All the data in the column will be lost.
  - You are about to drop the column `epitel` on the `hasil_lab` table. All the data in the column will be lost.
  - You are about to drop the column `gramNegatif` on the `hasil_lab` table. All the data in the column will be lost.
  - You are about to drop the column `gramPositif` on the `hasil_lab` table. All the data in the column will be lost.
  - You are about to drop the column `hasilAkhir` on the `hasil_lab` table. All the data in the column will be lost.
  - You are about to drop the column `jamur` on the `hasil_lab` table. All the data in the column will be lost.
  - You are about to drop the column `jenisSampel` on the `hasil_lab` table. All the data in the column will be lost.
  - You are about to drop the column `leukosit` on the `hasil_lab` table. All the data in the column will be lost.
  - You are about to drop the column `tidakInfeksi` on the `pendaftaran` table. All the data in the column will be lost.
  - You are about to drop the column `tidakMenyusui` on the `pendaftaran` table. All the data in the column will be lost.
  - You are about to drop the column `tidakPapsmear` on the `pendaftaran` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `hasil_lab` DROP COLUMN `bakteri`,
    DROP COLUMN `epitel`,
    DROP COLUMN `gramNegatif`,
    DROP COLUMN `gramPositif`,
    DROP COLUMN `hasilAkhir`,
    DROP COLUMN `jamur`,
    DROP COLUMN `jenisSampel`,
    DROP COLUMN `leukosit`,
    ADD COLUMN `hasilIVA` ENUM('NEGATIF', 'POSITIF', 'CURIGA_KANKER') NOT NULL DEFAULT 'NEGATIF',
    ADD COLUMN `jenisSpesimen` VARCHAR(191) NULL,
    ADD COLUMN `noSpesimen` VARCHAR(191) NULL,
    ADD COLUMN `subType16` ENUM('NEGATIF', 'POSITIF', 'TIDAK_TERBACA') NULL,
    ADD COLUMN `subType18` ENUM('NEGATIF', 'POSITIF', 'TIDAK_TERBACA') NULL,
    ADD COLUMN `subType52` ENUM('NEGATIF', 'POSITIF', 'TIDAK_TERBACA') NULL,
    ADD COLUMN `subTypeLainnya` ENUM('NEGATIF', 'POSITIF', 'TIDAK_TERBACA') NULL,
    ADD COLUMN `tanggalPengambilan` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `pendaftaran` DROP COLUMN `tidakInfeksi`,
    DROP COLUMN `tidakMenyusui`,
    DROP COLUMN `tidakPapsmear`,
    ADD COLUMN `kecamatan` VARCHAR(191) NULL,
    MODIFY `status` ENUM('PENDING', 'ARRIVED', 'SCHEDULED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';
