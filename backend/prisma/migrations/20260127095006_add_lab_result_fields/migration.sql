-- AlterTable
ALTER TABLE `hasil_lab` ADD COLUMN `keterangan` TEXT NULL,
    ADD COLUMN `tanggalPemeriksaan` DATETIME(3) NULL,
    ADD COLUMN `tindakLanjut` TEXT NULL;
