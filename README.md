# AMS — Antibiotic Management System API

## Overview

AMS (Antibiotic Management System) is a RESTful API for hospital antibiotic management based on the PPRA (Antimicrobial Resistance Control Program). It manages the antibiotic request workflow between doctors (DPJP) and PPRA admins, including patient management, clinical data submission, admin claim/review system, patient condition monitoring, and automated notifications.

**Live API**: https://crack-be-mrafiasyifaa.onrender.com/api

**API Documentation (Swagger)**: https://crack-be-mrafiasyifaa.onrender.com/docsv1

**API Reference (endpoints + request/response)**: [API_DOCS.md](./API_DOCS.md)

**ERD**: see below

---

## Features

### Authentication
- `POST /auth/register` — Register a new user (Doctor or Admin PPRA)
- `POST /auth/login` — Login and receive a JWT token

### Patients
- `POST /patients` — Register a new patient with auto-generated medical record number `[DOCTOR]`
- `POST /patients/assign` — Assign an existing patient via medical record number (only if patient is inactive) `[DOCTOR]`
- `GET /patients` — List patients with optional filters (Doctor: own patients | Admin: all)
- `GET /patients/medrec/:medRecNo` — Lookup patient by medical record number, cross-doctor
- `GET /patients/:id` — Patient detail with latest 10 condition logs
- `PATCH /patients/:id/deactivate` — Deactivate a patient `[DOCTOR]`
- `PATCH /patients/:id/condition` — Update patient condition, automatically creates a log entry `[DOCTOR]`
- `GET /patients/:id/condition-logs` — Full patient condition history

### Antibiotics
- `POST /antibiotics` — Add a new antibiotic `[ADMIN_PPRA]`
- `GET /antibiotics` — List antibiotics with pagination and category/form filters
- `GET /antibiotics/:id` — Antibiotic detail
- `PATCH /antibiotics/:id` — Update antibiotic `[ADMIN_PPRA]`
- `DELETE /antibiotics/:id` — Delete antibiotic `[ADMIN_PPRA]`

### Antibiotic Requests
- `POST /antibiotic-requests` — Submit an antibiotic request with clinical data `[DOCTOR]`
- `GET /antibiotic-requests` — List requests with status, unclaimed, and patientId filters
- `GET /antibiotic-requests/:id` — Request detail with full clinical data
- `PATCH /antibiotic-requests/:id` — Edit request (only if PENDING) `[DOCTOR]`
- `DELETE /antibiotic-requests/:id` — Delete request (only if PENDING) `[DOCTOR]`
- `PATCH /antibiotic-requests/:id/claim` — Claim a request from the pool `[ADMIN_PPRA]`
- `PATCH /antibiotic-requests/:id/unclaim` — Release claim, return to pool `[ADMIN_PPRA]`
- `PATCH /antibiotic-requests/:id/review` — Approve or reject a request `[ADMIN_PPRA]`

### Notifications
- `GET /notifications` — List notifications for the logged-in user
- `PATCH /notifications/:id/read` — Mark a single notification as read
- `PATCH /notifications/read-all` — Mark all notifications as read

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

3. Set up environment variables — create a `.env` file:

   ```
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   JWT_SECRET="your-secret-key"
   JWT_EXPIRES_IN="7d"
   PORT=3000
   ```

4. Run database migrations

   ```bash
   npx prisma migrate dev
   ```

   For production:
   ```bash
   npx prisma migrate deploy
   ```

5. (Optional) Seed initial antibiotic data

   ```bash
   npx ts-node prisma/seed.ts
   ```

6. Start the development server

   ```bash
   npm run start:dev
   ```

7. API is available at `http://localhost:3000/api`
   Swagger docs at `http://localhost:3000/docsv1`

---

## Environment Variables

| Variable       | Description                               |
|----------------|-------------------------------------------|
| `DATABASE_URL`   | PostgreSQL connection string            |
| `JWT_SECRET`     | Secret key for signing JWT tokens       |
| `JWT_EXPIRES_IN` | JWT expiry duration (default: 7d)       |
| `FRONTEND_URL`   | Allowed frontend origin for CORS        |
| `PORT`           | Port to run the server on (default: 3000) |

---

## Entity Relationship Diagram

![ERD AMS](./ERD-Diagram-AMS.png)

---

## Notes

- Roles `ADMIN_PPRA` and `DOCTOR` are set at registration — no manual database intervention needed.
- Medical record numbers are auto-generated in the format `YYDDMMyyXX` (10 digits).
- DPJP system: one patient can only be active under one doctor at a time. To transfer, the previous doctor must deactivate the patient first.
- `imagingResult` and `cultureResult` in clinical data accept URL strings — files are uploaded directly from the frontend to Supabase Storage.
- A cron job runs daily at midnight to send `ANTIBIOTIC_KADALUARSA` notifications to doctors when an antibiotic's end date has passed.
- Admins must claim a request before they can approve or reject it (claim system).
