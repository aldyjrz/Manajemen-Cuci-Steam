# AGENT.md

# Backend Development Guidelines - Motorbike & Car Wash Management System

jangan tanya apapun, kerjakan sekali jalan

## Project Overview

Bangun REST API Backend untuk aplikasi **Management Cuci Steam Motor & Mobil** menggunakan teknologi berikut:

- Node.js (LTS)
- Express.js
- MySQL 8+
- JWT Authentication
- bcrypt
- Sequelize ORM (lebih disarankan)
- express-validator
- dotenv
- multer (upload logo)
- dayjs
- helmet
- cors
- compression
- morgan

Project harus menggunakan arsitektur yang bersih, mudah dikembangkan, dan scalable.

---

# Folder Structure

```
src/
│
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── repositories/
├── validators/
├── helpers/
├── utils/
├── uploads/
├── migrations/
├── seeders/
└── app.js

server.js
.env
```

Gunakan pemisahan:

- Controller
- Service
- Repository

Business Logic **tidak boleh berada di Controller.**

---

# Coding Standard

Semua endpoint wajib:

- Async Await
- Try Catch
- Response JSON konsisten

Format Response

Success

```json
{
    "success": true,
    "message": "Success",
    "data": {}
}
```

Error

```json
{
    "success": false,
    "message": "Validation Error",
    "errors": []
}
```

---

# Authentication

Menggunakan JWT

Flow:

Login

↓

Generate JWT

↓

Bearer Token

↓

Middleware Auth

Role:

- Admin
- Kasir
- Karyawan

Middleware:

- authJWT
- isAdmin
- isKasir
- isKaryawan

Password menggunakan bcrypt.

---

# Login

Endpoint

POST

```
/api/auth/login
```

Input

```
username
password
```

Output

```
token
user
role
expired_at
```

---

# Master User

Fitur:

CRUD User

Field

- id
- nama
- username
- password
- role
- no_hp
- alamat
- aktif
- created_at

Role:

Admin

Kasir

Karyawan

---

# Absensi

Setiap hari user wajib melakukan absen.

Jenis

Masuk

Pulang

Data

- user_id
- tanggal
- jam_masuk
- jam_pulang
- status

Status

- Hadir
- Izin
- Sakit
- Alpha

Constraint

User hanya boleh:

- 1 kali Absen Masuk
- 1 kali Absen Pulang

per hari.

---

# Riwayat Absensi

Filter

- Tanggal
- User
- Bulan

Output

Jam masuk

Jam pulang

Status

Total Kehadiran

---

# Website Setting

Hanya 1 record.

Field

- nama_steam
- logo
- alamat
- no_hp
- footer
- updated_at

Endpoint

GET

```
/settings
```

PUT

```
/settings
```

Upload Logo menggunakan Multer.

---

# Master Produk

CRUD

Field

- id
- nama_produk
- harga
- komisi
- estimasi_waktu
- aktif

Default Product

- Cuci Motor Standar
- Cuci Motor Besar
- Detailing
- Cuci Mobil

Komisi adalah nominal yang diterima pencuci.

Contoh

Motor Standar

Harga

35.000

Komisi

10.000

---

# Jenis Kendaraan

Master

- Motor
- Motor Besar
- Mobil

---

# Transaksi Kasir

Kasir melakukan input sebelum kendaraan dicuci.

Input

- nomor_plat
- nama_pelanggan (optional)
- no_hp (optional)
- jenis_kendaraan
- produk
- harga
- diskon
- total
- metode_bayar
- catatan

Status

- Waiting
- Assigned
- Washing
- Finished
- Cancel

---

# Assign Pencuci

Setelah transaksi dibuat.

Kasir memilih siapa yang mencuci.

Yang muncul hanya user yang:

Hari itu

Sudah Absen Masuk.

Flow

Kasir

↓

Create Transaksi

↓

Assign User

↓

User mulai mencuci

↓

Finish

Field

- transaksi_id
- user_id
- assigned_at
- started_at
- finished_at

---

# Dashboard

Menampilkan

Hari ini

Jumlah

- Motor
- Mobil
- Total Pendapatan
- Total Cuci
- User Aktif
- User Absen
- Waiting
- Washing
- Finished

---

# Riwayat Cuci

Filter

- Tanggal
- Produk
- User
- Status

Menampilkan

Nomor Plat

Produk

Pencuci

Harga

Komisi

Status

Durasi

---

# Laporan Pendapatan

Filter

Tanggal

Output

Total

- Motor
- Mobil
- Omzet
- Diskon
- Pendapatan Bersih

---

# Laporan Per User

Filter

Tanggal

Output

Nama

Jumlah Kendaraan

Total Komisi

Total Pendapatan

Rata-rata per hari

Contoh

Andi

20 kendaraan

Komisi

Rp200.000

---

# Konfigurasi Bagi Hasil

Harus fleksibel.

Table

profit_setting

Field

- id
- tipe

Nilai

Flat

Persen

- nilai

Contoh

Flat

10000

atau

Persen

30

Saat transaksi selesai

Komisi dihitung otomatis.

Jika Flat

```
komisi = nilai
```

Jika Persen

```
komisi = harga * persen
```

Semua histori komisi wajib disimpan.

Tidak boleh berubah apabila setting berubah.

---

# Laporan Komisi

Filter

Tanggal

Output

Nama

Jumlah Steam

Total Komisi

Status Pembayaran

Field

- unpaid
- paid

---

# Pembayaran Komisi

Admin dapat

Mark

```
Sudah Dibayar
```

atau

```
Belum Dibayar
```

Disimpan tanggal pembayaran.

---

# Dashboard User

User login dapat melihat

Hari ini

- Total Steam
- Total Komisi Hari Ini
- Riwayat Steam
- Riwayat Komisi

---

# Database

Minimal memiliki tabel

```
users

attendance

website_settings

products

vehicle_types

transactions

transaction_workers

commission_settings

commission_history

commission_payment

login_logs
```

---

# Audit Log

Semua perubahan penting dicatat.

Contoh

Create User

Edit Produk

Delete Produk

Assign Pencuci

Finish Steam

Login

Logout

---

# Validation

Gunakan express-validator.

Semua endpoint wajib validasi.

---

# Pagination

Semua endpoint list wajib support

```
page

limit

keyword

sort

order
```

---

# Search

Minimal

LIKE

Untuk

Nama

Nomor Plat

Produk

User

---

# Security

Gunakan

Helmet

CORS

Rate Limit Login

JWT Expired

Refresh Token (opsional)

Password Hash

SQL Injection Protection

Input Validation

---

# API Documentation

Gunakan Swagger OpenAPI.

Semua endpoint harus terdokumentasi.

---

# Coding Rules

Jangan membuat query SQL di Controller.

Gunakan Repository.

Gunakan Transaction Sequelize apabila lebih dari satu insert/update.

Gunakan UUID atau BIGINT sebagai Primary Key.

Seluruh endpoint harus memiliki:

- Validation
- Error Handling
- Logging

---

# Future Ready

Struktur harus mudah dikembangkan untuk fitur:

- Membership pelanggan
- Paket langganan
- QR Check-in
- WhatsApp Notification
- Printer Thermal
- Multi Cabang
- Multi Kasir
- Promo
- Voucher
- Point Reward
- Booking Online

---

# Development Principles

- Clean Architecture
- SOLID Principle
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple)
- Repository Pattern
- Service Layer
- RESTful API
- Consistent Response
- Environment Configuration
- Migration & Seeder
- Unit-test friendly architecture

Backend harus siap digunakan sebagai API untuk Web Admin maupun Mobile App di masa mendatang.