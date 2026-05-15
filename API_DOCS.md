# CRACK — Antibiotic Management System
## Backend API Reference (untuk Frontend)

> Base URL (local): `http://localhost:3000/api`
> Base URL (production): `https://crack-be-mrafiasyifaa.onrender.com/api`

---

## Auth

Semua endpoint (kecuali register & login) butuh header:
```
Authorization: Bearer <token>
```

Token didapat dari response login (`access_token`).

---

### POST `/auth/register`
Daftarkan user baru.

**Body:**
```json
{
  "name": "Dr. Budi",
  "email": "budi@rs.com",
  "password": "password123",
  "role": "DOCTOR"
}
```
Role: `DOCTOR` | `ADMIN_PPRA`

**Response:** `201` — data user (tanpa password)

---

### POST `/auth/login`
Login dan dapatkan JWT token.

**Body:**
```json
{
  "email": "budi@rs.com",
  "password": "password123"
}
```

**Response:** `200`
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "Dr. Budi",
    "email": "budi@rs.com",
    "role": "DOCTOR"
  }
}
```

---

## Patients
> `DOCTOR` — hanya lihat & kelola pasien milik sendiri
> `ADMIN_PPRA` — lihat semua pasien

### POST `/patients` `[DOCTOR]`
Daftarkan pasien baru. `medRecNo` di-generate otomatis (format: `YYDDMMyyXX`, 10 digit).

**Body:**
```json
{
  "name": "Siti Rahayu",
  "birthDate": "1990-05-07",
  "gender": "PEREMPUAN",
  "address": "Jl. Merdeka No. 1",
  "diagnosis": "Infeksi saluran kemih"
}
```
Gender: `LAKI_LAKI` | `PEREMPUAN`

**Response:** `201` — data pasien + medRecNo

---

### POST `/patients/assign` `[DOCTOR]`
Assign pasien existing via No. RM ke diri sendiri. Hanya bisa jika pasien `isActive: false` (tidak sedang aktif di dokter lain). Dokter yang berhasil assign akan menjadi DPJP baru dan `isActive` pasien di-set `true`.

**Body:**
```json
{
  "medRecNo": "2607019993"
}
```

**Response:** `200` — data pasien terupdate

**Error:**
- `404` — No. RM tidak ditemukan
- `409` — Pasien sudah terdaftar di daftar Anda
- `409` — Pasien sedang aktif di dokter lain (harus dinonaktifkan dulu)

---

### GET `/patients` `[ALL]`
- Doctor → hanya pasien miliknya
- Admin → semua pasien + info dokter

**Query params (semua opsional):**

| Param | Type | Deskripsi |
|-------|------|-----------|
| `search` | string | Cari berdasarkan nama atau No. RM |
| `condition` | enum | Filter kondisi: `STABIL` \| `MEMBAIK` \| `MEMBURUK` \| `SELESAI` |
| `limit` | number | Batasi jumlah hasil (berguna untuk combobox/autocomplete) |
| `isActive` | boolean | Default `true`. Kirim `false` untuk lihat pasien nonaktif |

**Response:** `200` — array pasien

---

### GET `/patients/medrec/:medRecNo`
Lookup pasien berdasarkan No. RM, lintas dokter. Digunakan untuk fitur assign pasien.

**Response:** `200`
```json
{
  "id": "...",
  "medRecNo": "2607019993",
  "name": "Siti Rahayu",
  "isActive": false,
  "doctor": { "id": "...", "name": "Dr. Budi" }
}
```

**Error:** `404` — No. RM tidak ditemukan

---

### GET `/patients/:id` `[ALL]`
Detail pasien + 10 log kondisi terbaru.

**Response:** `200`
```json
{
  "id": "...",
  "medRecNo": "2607019993",
  "name": "Siti Rahayu",
  "birthDate": "1990-05-07T00:00:00.000Z",
  "gender": "PEREMPUAN",
  "address": "...",
  "diagnosis": "...",
  "condition": "STABIL",
  "isActive": true,
  "doctor": { "id": "...", "name": "...", "email": "..." },
  "conditionLogs": [...]
}
```

---

### PATCH `/patients/:id/deactivate` `[DOCTOR]`
Nonaktifkan pasien (`isActive: false`). Pasien tidak muncul di daftar aktif setelah ini. Hanya dokter pemilik pasien yang bisa melakukan ini.

**Response:** `200` — data pasien terupdate

**Error:** `403` — Bukan pasien Anda

---

### PATCH `/patients/:id/condition` `[DOCTOR]`
Update kondisi pasien. Otomatis membuat log di riwayat kondisi.

**Body:**
```json
{
  "condition": "MEMBAIK",
  "notes": "Suhu turun, nafsu makan membaik"
}
```
Condition: `STABIL` | `MEMBAIK` | `MEMBURUK` | `SELESAI`

**Response:** `200` — data pasien terupdate

---

### GET `/patients/:id/condition-logs` `[ALL]`
Riwayat perubahan kondisi pasien (journey).

**Response:** `200` — array log
```json
[
  {
    "id": "...",
    "condition": "MEMBAIK",
    "notes": "...",
    "createdAt": "...",
    "doctor": { "id": "...", "name": "..." }
  }
]
```

---

## Antibiotics
> CRUD hanya `ADMIN_PPRA`. GET boleh semua role.

### POST `/antibiotics` `[ADMIN_PPRA]`
**Body:**
```json
{
  "name": "Amoxicillin",
  "description": "Antibiotik spektrum luas golongan penisilin untuk infeksi bakteri ringan-sedang",
  "category": "KOMERSIAL",
  "form": "TABLET",
  "stock": 100
}
```
Category: `KOMERSIAL` | `DIAWASI` | `RISET`
Form: `TABLET` | `KAPSUL` | `SIRUP` | `INJEKSI` | `SALEP` | `INFUS`

**Response:** `201`

---

### GET `/antibiotics` `[ALL]`
Daftar antibiotik dengan pagination dan filter.

**Query params (semua opsional):**

| Param | Type | Deskripsi |
|-------|------|-----------|
| `search` | string | Cari berdasarkan nama |
| `category` | enum | Filter: `KOMERSIAL` \| `DIAWASI` \| `RISET` (bisa multi, kirim beberapa kali) |
| `form` | enum | Filter bentuk sediaan |
| `page` | number | Halaman (default: 1) |
| `limit` | number | Jumlah per halaman (default: 10) |

**Contoh multi-kategori:** `?category=KOMERSIAL&category=DIAWASI`

**Response:** `200`
```json
{
  "data": [
    {
      "id": "...",
      "name": "Amoxicillin",
      "description": "...",
      "category": "KOMERSIAL",
      "form": "TABLET",
      "stock": 100
    }
  ],
  "meta": {
    "total": 57,
    "page": 1,
    "limit": 10,
    "totalPages": 6
  }
}
```

---

### GET `/antibiotics/:id` `[ALL]`
Detail antibiotik.

### PATCH `/antibiotics/:id` `[ADMIN_PPRA]`
Update sebagian data antibiotik (semua field opsional).

### DELETE `/antibiotics/:id` `[ADMIN_PPRA]`
Hapus antibiotik.

---

## Antibiotic Requests
> Doctor buat request. Admin claim lalu review.

### POST `/antibiotic-requests` `[DOCTOR]`
Buat request antibiotik untuk pasien. Wajib sertakan `clinicalData`.

**Body:**
```json
{
  "patientId": "...",
  "antibioticId": "...",
  "dosage": "500mg",
  "frequency": "3x sehari",
  "startDate": "2026-05-08",
  "endDate": "2026-05-15",
  "notes": "Pasien alergi penisilin",
  "clinicalData": {
    "diagnosis": "Infeksi saluran kemih",
    "bloodPressure": "120/80",
    "heartRate": 80,
    "temperature": 38.5,
    "respiratoryRate": 20,
    "oxygenSaturation": 98.0,
    "generalCondition": "Lemah",
    "physicalExamination": "Nyeri tekan suprapubik",
    "leukocytes": 12.5,
    "neutrophils": 80.0,
    "lymphocytes": 15.0,
    "urinalysis": "Leukosit +3, nitrit positif",
    "ureum": 25.0,
    "creatinine": 0.9,
    "sgot": 22.0,
    "sgpt": 18.0,
    "albumin": 4.0,
    "imagingType": "USG Abdomen",
    "imagingResult": "https://supabase.storage/...",
    "cultureResult": "https://supabase.storage/..."
  }
}
```

> **Catatan:** `imagingResult` dan `cultureResult` berupa URL string. File PDF/gambar diupload langsung dari frontend ke Supabase Storage, lalu URL-nya dikirim ke sini.

**Response:** `201` — data request lengkap + notifikasi terkirim ke semua admin

---

### GET `/antibiotic-requests` `[ALL]`
- Doctor → request milik sendiri
- Admin → semua request

**Query params (semua opsional):**

| Param | Type | Deskripsi |
|-------|------|-----------|
| `status` | enum | Filter: `PENDING` \| `APPROVED` \| `REJECTED` |
| `unclaimed` | boolean | Kirim `true` untuk tampilkan hanya yang belum di-claim (Admin) |
| `patientId` | string | Filter request berdasarkan ID pasien |

---

### GET `/antibiotic-requests/:id` `[ALL]`
Detail request + clinical data lengkap.

---

### PATCH `/antibiotic-requests/:id` `[DOCTOR]`
Edit field utama request. Hanya bisa jika status masih `PENDING` dan request milik dokter yang login.

**Body (semua opsional, hanya field yang dikirim yang diupdate):**
```json
{
  "antibioticId": "string",
  "dosage": "500mg",
  "frequency": "3x sehari",
  "startDate": "2025-01-01",
  "endDate": "2025-01-07",
  "notes": "Catatan tambahan"
}
```

**Response:** `200` — object AntibioticRequest lengkap (sama seperti GET /:id)

**Error:**
- `403` — Bukan request Anda
- `400` — Status sudah bukan PENDING

---

### DELETE `/antibiotic-requests/:id` `[DOCTOR]`
Hapus request beserta clinical data-nya. Hanya bisa jika status masih `PENDING` dan request milik dokter yang login.

**Response:** `204 No Content`

**Error:**
- `403` — Bukan request Anda
- `400` — Status sudah bukan PENDING (sudah APPROVED atau REJECTED)

---

### PATCH `/antibiotic-requests/:id/claim` `[ADMIN_PPRA]`
Admin mengambil request dari pool untuk direview. Hanya bisa jika belum di-claim admin lain.

**Response:** `200` — request terupdate dengan `assignedAdmin`

---

### PATCH `/antibiotic-requests/:id/unclaim` `[ADMIN_PPRA]`
Admin melepas claim (kembalikan ke pool). Hanya admin yang meng-claim yang bisa unclaim.

---

### PATCH `/antibiotic-requests/:id/review` `[ADMIN_PPRA]`
Approve atau reject request. Hanya admin yang sudah claim yang bisa review.

**Body:**
```json
{
  "status": "APPROVED",
  "reviewNotes": "Disetujui, sesuai indikasi klinis"
}
```
Status: `APPROVED` | `REJECTED`

**Response:** `200` — request terupdate + notifikasi terkirim ke dokter

---

## Notifications

### GET `/notifications` `[ALL]`
Semua notifikasi milik user yang sedang login, diurutkan terbaru.

**Response:** `200`
```json
[
  {
    "id": "...",
    "type": "REQUEST_BARU",
    "title": "Request Antibiotik Baru",
    "message": "Dr. Budi mengajukan request Amoxicillin untuk pasien Siti",
    "isRead": false,
    "referenceId": "<antibioticRequestId>",
    "createdAt": "..."
  }
]
```

Type: `REQUEST_BARU` | `REQUEST_DISETUJUI` | `REQUEST_DITOLAK` | `ANTIBIOTIC_KADALUARSA`

> `referenceId` adalah ID dari `AntibioticRequest` yang terkait — gunakan untuk navigasi ke halaman detail request.

> `ANTIBIOTIC_KADALUARSA` dikirim otomatis oleh cron job setiap tengah malam ketika `endDate` request yang APPROVED telah terlewati.

---

### PATCH `/notifications/:id/read` `[ALL]`
Mark satu notifikasi sebagai sudah dibaca.

### PATCH `/notifications/read-all` `[ALL]`
Mark semua notifikasi sebagai sudah dibaca.

---

## Enums Ringkasan

| Enum | Values |
|------|--------|
| `Role` | `DOCTOR`, `ADMIN_PPRA` |
| `PatientGender` | `LAKI_LAKI`, `PEREMPUAN` |
| `PatientCondition` | `STABIL`, `MEMBAIK`, `MEMBURUK`, `SELESAI` |
| `AntibioticCategory` | `KOMERSIAL`, `DIAWASI`, `RISET` |
| `AntibioticForm` | `TABLET`, `KAPSUL`, `SIRUP`, `INJEKSI`, `SALEP`, `INFUS` |
| `RequestStatus` | `PENDING`, `APPROVED`, `REJECTED` |
| `NotificationType` | `REQUEST_BARU`, `REQUEST_DISETUJUI`, `REQUEST_DITOLAK`, `ANTIBIOTIC_KADALUARSA` |

---

## Error Responses

| Status | Artinya |
|--------|---------|
| `400` | Bad Request — validasi gagal atau logika tidak valid |
| `401` | Unauthorized — token tidak ada / tidak valid |
| `403` | Forbidden — role tidak punya akses atau bukan data milik Anda |
| `404` | Not Found — data tidak ditemukan |
| `409` | Conflict — duplikat data atau kondisi bisnis tidak terpenuhi |

Format error:
```json
{
  "statusCode": 403,
  "message": "Anda tidak memiliki akses ke request ini",
  "error": "Forbidden"
}
```

---

## Alur Kerja Utama

```
DOCTOR                              ADMIN_PPRA
  │                                      │
  ├─ Register / Login                    ├─ Register / Login
  │                                      │
  ├─ Tambah pasien baru                  ├─ Tambah / edit / hapus antibiotik
  │   (medRecNo auto-generated)          │
  │                                      │
  ├─ Atau assign pasien via No. RM       │
  │   (pasien harus isActive: false)     │
  │                                      │
  ├─ Buat antibiotic request ────────────┤ Dapat notif REQUEST_BARU
  │   (+ clinical data)                  │
  │                                      ├─ Claim request dari pool
  │                                      │
  │                                      ├─ Review: APPROVED / REJECTED
  │                                      │
  ├─ Dapat notif hasil review ◄──────────┘
  │
  ├─ Update kondisi pasien
  │   (STABIL / MEMBAIK / MEMBURUK / SELESAI)
  │   → otomatis tercatat di condition log
  │
  └─ Nonaktifkan pasien jika selesai ditangani
      → pasien bisa di-assign dokter lain

[CRON - setiap tengah malam]
  → Cek request APPROVED yang endDate-nya sudah lewat
  → Kirim notif ANTIBIOTIC_KADALUARSA ke dokter
```
