-- Seed default users (passwords are bcrypt-hashed)
USE `attendance_db`;

INSERT IGNORE INTO `users` (`nama`,`username`,`password`,`role`,`no_hp`,`alamat`,`aktif`) VALUES
('Administrator','admin','$2b$10$ZfxayFUfOwReBD2FqeGSyOBaptnchtmPhTcRrksfirqrIwj2r0hIm','Admin','081234567890','Admin account',1),
('Kasir Demo','kasir','$2b$10$ohM8XyUUBc8aEEUl1H7ZruC.VxZnrkSsizyQF0ruipLcMfUnd9TDm','Kasir','082233445566','Kasir account',1),
('Karyawan Demo','karyawan','$2b$10$leaVxi2.Gs8RU/AxaSJ5Cew3Lan/B0DmrISS5yrcQ33e.RSVucf16','Karyawan','083344556677','Karyawan account',1);

-- Note: Default plaintext passwords used to generate these hashes were:
-- Admin: Admin@123
-- Kasir: Kasir@123
-- Karyawan: Karyawan@123
