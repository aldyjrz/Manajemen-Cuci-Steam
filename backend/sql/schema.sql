-- Schema for Motor & Car Wash Management System
-- Run this on MySQL 8+ (adjust database name as needed)

CREATE DATABASE IF NOT EXISTS `attendance_db` CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
USE `attendance_db`;

-- Users (master user)
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(255) NOT NULL,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('Admin','Kasir','Karyawan') NOT NULL DEFAULT 'Karyawan',
  `no_hp` VARCHAR(32),
  `alamat` TEXT,
  `aktif` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Vehicle types
CREATE TABLE IF NOT EXISTS `vehicle_types` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(100) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Products (master produk)
CREATE TABLE IF NOT EXISTS `products` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama_produk` VARCHAR(255) NOT NULL,
  `harga` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `komisi` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `estimasi_waktu` INT UNSIGNED DEFAULT NULL,
  `aktif` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Transactions (kasir)
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nomor_plat` VARCHAR(50) NOT NULL,
  `nama_pelanggan` VARCHAR(255),
  `no_hp` VARCHAR(50),
  `jenis_kendaraan_id` INT UNSIGNED,
  `total` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `diskon` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `metode_bayar` VARCHAR(50),
  `catatan` TEXT,
  `status` ENUM('Waiting','Assigned','Washing','Finished','Cancel') NOT NULL DEFAULT 'Waiting',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_transactions_vehicle_type` FOREIGN KEY (`jenis_kendaraan_id`) REFERENCES `vehicle_types` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Transaction items (products selected per transaction)
CREATE TABLE IF NOT EXISTS `transaction_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `transaksi_id` BIGINT UNSIGNED NOT NULL,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `harga` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_titems_transaction` FOREIGN KEY (`transaksi_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_titems_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Assignments (assign pencuci)
CREATE TABLE IF NOT EXISTS `assignments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `transaksi_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `assigned_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `started_at` DATETIME DEFAULT NULL,
  `finished_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_assign_transaction` FOREIGN KEY (`transaksi_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_assign_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Attendance (absensi)
CREATE TABLE IF NOT EXISTS `attendances` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `tanggal` DATE NOT NULL,
  `jam_masuk` DATETIME DEFAULT NULL,
  `jam_pulang` DATETIME DEFAULT NULL,
  `status` ENUM('Hadir','Izin','Sakit','Alpha') DEFAULT 'Hadir',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_user_date` (`user_id`,`tanggal`),
  CONSTRAINT `fk_att_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Settings (only one record expected)
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama_steam` VARCHAR(255) DEFAULT NULL,
  `logo` VARCHAR(255) DEFAULT NULL,
  `alamat` TEXT DEFAULT NULL,
  `no_hp` VARCHAR(50) DEFAULT NULL,
  `footer` TEXT DEFAULT NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default vehicle types and products (adjust prices as needed)
INSERT IGNORE INTO `vehicle_types` (`id`,`nama`) VALUES
(1,'Motor'),(2,'Motor Besar'),(3,'Mobil');

INSERT IGNORE INTO `products` (`id`,`nama_produk`,`harga`,`komisi`,`estimasi_waktu`,`aktif`) VALUES
(1,'Cuci Motor Standar',35000,10000,15,1),
(2,'Cuci Motor Besar',45000,12000,20,1),
(3,'Detailing',150000,50000,60,1),
(4,'Cuci Mobil',80000,30000,30,1);

-- Note: create admin user using application code so password is properly hashed with bcrypt.

-- End of schema
