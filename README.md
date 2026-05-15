# AMS — Antibiotic Management System API

## Overview

AMS (Antibiotic Management System) adalah RESTful API untuk manajemen antibiotik rumah sakit berbasis PPRA (Program Pengendalian Resistensi Antimikroba). Sistem ini mengatur alur pengajuan antibiotik antara dokter (DPJP) dan admin PPRA, termasuk manajemen pasien, pengajuan data klinis, sistem claim/review admin, monitoring kondisi pasien, dan notifikasi otomatis.

**Live API**: https://crack-be-mrafiasyifaa.onrender.com/api

**API Documentation (Swagger)**: https://crack-be-mrafiasyifaa.onrender.com/docsv1

**API Reference (endpoints + request/response)**: [API_DOCS.md](./API_DOCS.md)

**ERD**: lihat di bawah

---

## Features

### Authentication
- `POST /auth/register` — Daftarkan user baru (Doctor atau Admin PPRA)
- `POST /auth/login` — Login dan dapatkan JWT token

### Patients
- `POST /patients` — Daftarkan pasien baru dengan No. RM auto-generated `[DOCTOR]`
- `POST /patients/assign` — Assign pasien existing via No. RM (hanya jika pasien nonaktif) `[DOCTOR]`
- `GET /patients` — Daftar pasien dengan filter opsional (Doctor: milik sendiri | Admin: semua)
- `GET /patients/medrec/:medRecNo` — Lookup pasien by No. RM, lintas dokter
- `GET /patients/:id` — Detail pasien + 10 log kondisi terbaru
- `PATCH /patients/:id/deactivate` — Nonaktifkan pasien `[DOCTOR]`
- `PATCH /patients/:id/condition` — Update kondisi pasien, otomatis membuat log `[DOCTOR]`
- `GET /patients/:id/condition-logs` — Riwayat perubahan kondisi pasien

### Antibiotics
- `POST /antibiotics` — Tambah antibiotik `[ADMIN_PPRA]`
- `GET /antibiotics` — Daftar antibiotik dengan pagination dan filter kategori/form
- `GET /antibiotics/:id` — Detail antibiotik
- `PATCH /antibiotics/:id` — Update antibiotik `[ADMIN_PPRA]`
- `DELETE /antibiotics/:id` — Hapus antibiotik `[ADMIN_PPRA]`

### Antibiotic Requests
- `POST /antibiotic-requests` — Buat request antibiotik beserta clinical data `[DOCTOR]`
- `GET /antibiotic-requests` — Daftar request dengan filter status, unclaimed, dan patientId
- `GET /antibiotic-requests/:id` — Detail request + clinical data lengkap
- `PATCH /antibiotic-requests/:id` — Edit request (hanya jika PENDING) `[DOCTOR]`
- `DELETE /antibiotic-requests/:id` — Hapus request (hanya jika PENDING) `[DOCTOR]`
- `PATCH /antibiotic-requests/:id/claim` — Claim request dari pool `[ADMIN_PPRA]`
- `PATCH /antibiotic-requests/:id/unclaim` — Lepas claim, kembalikan ke pool `[ADMIN_PPRA]`
- `PATCH /antibiotic-requests/:id/review` — Approve atau reject request `[ADMIN_PPRA]`

### Notifications
- `GET /notifications` — Daftar notifikasi milik user yang login
- `PATCH /notifications/:id/read` — Tandai satu notifikasi sebagai dibaca
- `PATCH /notifications/read-all` — Tandai semua notifikasi sebagai dibaca

---

## Technologies Used

| Category         | Technology                         |
|------------------|------------------------------------|
| Framework        | NestJS 11                          |
| Language         | TypeScript                         |
| ORM              | Prisma 7                           |
| Database         | PostgreSQL (Supabase)              |
| Authentication   | JWT (@nestjs/jwt), bcryptjs        |
| Validation       | class-validator, class-transformer |
| Documentation    | Swagger (@nestjs/swagger)          |
| Scheduler        | @nestjs/schedule (cron)            |
| Deployment       | Render                             |
| Database Hosting | Supabase                           |

---

## How to Run Locally

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/Revou-FSSE-Oct25/crack-be-mrafiasyifaa.git
   cd crack-be-mrafiasyifaa
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables — buat file `.env`:

   ```
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   JWT_SECRET="your-secret-key"
   JWT_EXPIRES_IN="7d"
   PORT=3000
   ```

4. Jalankan migrasi database

   ```bash
   npx prisma migrate dev
   ```

   Untuk production:
   ```bash
   npx prisma migrate deploy
   ```

5. (Opsional) Seed data antibiotik awal

   ```bash
   npx ts-node prisma/seed.ts
   ```

6. Jalankan development server

   ```bash
   npm run start:dev
   ```

7. API tersedia di `http://localhost:3000/api`
   Swagger docs di `http://localhost:3000/docsv1`

---

## Environment Variables

| Variable         | Description                               |
|------------------|-------------------------------------------|
| `DATABASE_URL`   | PostgreSQL connection string              |
| `JWT_SECRET`     | Secret key for signing JWT tokens         |
| `JWT_EXPIRES_IN` | JWT expiry duration (default: 7d)         |
| `PORT`           | Port to run the server on (default: 3000) |

---

## Entity Relationship Diagram

![ERD AMS](./ERD-Diagram-AMS.png)

---

## Notes

- Role `ADMIN_PPRA` dan `DOCTOR` diset saat registrasi. Tidak perlu intervensi DB manual.
- No. RM (nomor rekam medis) di-generate otomatis: format `YYDDMMyyXX` (10 digit).
- Sistem DPJP: satu pasien hanya bisa aktif di satu dokter. Untuk pindah dokter, pasien harus dinonaktifkan terlebih dahulu oleh dokter sebelumnya.
- `imagingResult` dan `cultureResult` pada clinical data menerima URL string — upload file dilakukan langsung dari frontend ke Supabase Storage.
- Cron job berjalan setiap tengah malam untuk mengirim notifikasi `ANTIBIOTIC_KADALUARSA` ke dokter ketika tanggal selesai antibiotik telah terlewati.
- Admin harus melakukan claim sebelum bisa approve atau reject request (sistem claim).
