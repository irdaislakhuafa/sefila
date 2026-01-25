-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('PATIENT', 'ADMIN') NOT NULL DEFAULT 'PATIENT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pendaftaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `nik` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `tanggalLahir` DATETIME(3) NOT NULL,
    `alamat` TEXT NOT NULL,
    `kelurahan` VARCHAR(191) NOT NULL,
    `kecamatan` VARCHAR(191) NOT NULL,
    `noTelepon` VARCHAR(191) NULL,
    `instansi` VARCHAR(191) NOT NULL,
    `tidakHaid` BOOLEAN NOT NULL DEFAULT false,
    `tidakDouching` BOOLEAN NOT NULL DEFAULT false,
    `tidakBerhubungan` BOOLEAN NOT NULL DEFAULT false,
    `tidakPapsmear` BOOLEAN NOT NULL DEFAULT false,
    `tidakHamil` BOOLEAN NOT NULL DEFAULT false,
    `tidakMenyusui` BOOLEAN NOT NULL DEFAULT false,
    `tidakInfeksi` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `tanggalDaftar` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tanggalJadwal` DATETIME(3) NULL,
    `tanggalPemeriksaan` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pendaftaran_nik_key`(`nik`),
    INDEX `pendaftaran_userId_idx`(`userId`),
    INDEX `pendaftaran_kelurahan_idx`(`kelurahan`),
    INDEX `pendaftaran_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hasil_lab` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pendaftaranId` INTEGER NOT NULL,
    `jenisSampel` VARCHAR(191) NOT NULL,
    `epitel` VARCHAR(191) NOT NULL,
    `leukosit` VARCHAR(191) NOT NULL,
    `gramNegatif` VARCHAR(191) NULL,
    `gramPositif` VARCHAR(191) NULL,
    `bakteri` VARCHAR(191) NULL,
    `jamur` VARCHAR(191) NULL,
    `catatanDokter` TEXT NULL,
    `hasilAkhir` ENUM('NORMAL', 'ABNORMAL', 'PERLU_PEMERIKSAAN_LANJUTAN') NOT NULL DEFAULT 'NORMAL',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `hasil_lab_pendaftaranId_key`(`pendaftaranId`),
    INDEX `hasil_lab_pendaftaranId_idx`(`pendaftaranId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pendaftaran` ADD CONSTRAINT `pendaftaran_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hasil_lab` ADD CONSTRAINT `hasil_lab_pendaftaranId_fkey` FOREIGN KEY (`pendaftaranId`) REFERENCES `pendaftaran`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
