# AMS — Antibiotic Management System API

## Overview

AMS (Antibiotic Management System) is a RESTful API for hospital antibiotic management. It handles antibiotic request workflows between doctors and pharmacy admins (VPRS), including patient management, clinical data submission, admin claim/review system, condition monitoring, and automated expiry notifications.

**Live API**: TBD

**API Documentation (Swagger)**: TBD/docsv1

**ERD**: TBD

---

## Features

### Authentication
- `POST /auth/register` — Register as Doctor or Admin VPRS
- `POST /auth/login` — Login and receive JWT token

### Patients
- `POST /patients` — Register new patient with auto-generated No. RM (DOCTOR)
- `POST /patients/assign` — Assign existing patient via No. RM (DOCTOR)
- `GET /patients` — List patients (Doctor: own | Admin: all)
- `GET /patients/:id` — Patient detail with condition logs
- `PATCH /patients/:id/condition` — Update patient condition, auto-logs to history (DOCTOR)
- `GET /patients/:id/condition-logs` — Full condition history

### Antibiotics
- `POST /antibiotics` — Add antibiotic (ADMIN)
- `GET /antibiotics` — List all antibiotics
- `GET /antibiotics/:id` — Antibiotic detail
- `PATCH /antibiotics/:id` — Update antibiotic (ADMIN)
- `DELETE /antibiotics/:id` — Delete antibiotic (ADMIN)

### Antibiotic Requests
- `POST /antibiotic-requests` — Submit request with clinical data (DOCTOR)
- `GET /antibiotic-requests` — List requests with optional `?status=` and `?unclaimed=true` filter
- `GET /antibiotic-requests/:id` — Request detail with full clinical data
- `PATCH /antibiotic-requests/:id/claim` — Claim request from pool (ADMIN)
- `PATCH /antibiotic-requests/:id/unclaim` — Release claim back to pool (ADMIN)
- `PATCH /antibiotic-requests/:id/review` — Approve or reject request (ADMIN, must claim first)

### Notifications
- `GET /notifications` — List own notifications
- `PATCH /notifications/:id/read` — Mark one as read
- `PATCH /notifications/read-all` — Mark all as read

---

## Technologies Used

| Category         | Technology                         |
|------------------|------------------------------------|
| Framework        | NestJS 11                          |
| Language         | TypeScript                         |
| ORM              | Prisma 7                           |
| Database         | PostgreSQL (Supabase)              |
| Authentication   | JWT (@nestjs/jwt), bcrypt          |
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

4. Run database migration

   ```bash
   npx prisma migrate dev
   ```

   For production:
   ```bash
   npx prisma migrate deploy
   ```

5. Start the development server

   ```bash
   npm run start:dev
   ```

6. API is available at `http://localhost:3000/api`
   Swagger docs at `http://localhost:3000/docsv1`

---

## Environment Variables

| Variable         | Description                               |
|------------------|-------------------------------------------|
| `DATABASE_URL`   | PostgreSQL connection string              |
| `JWT_SECRET`     | Secret key for signing JWT tokens         |
| `JWT_EXPIRES_IN` | JWT expiry duration (default: 7d)         |
| `PORT`           | Port to run the server on (default: 3000) |

---

## Notes

- ADMIN_VPRS role is set at registration. No manual DB intervention needed.
- No. RM (medical record number) is auto-generated: format `YYDDMMyyXX` (10 digits).
- `imagingResult` and `cultureResult` in clinical data accept URL strings — file upload is handled directly from the frontend to Supabase Storage.
- Cron job runs daily at midnight to notify doctors when antibiotic end dates have passed.
- Admin must claim a request before being able to approve or reject it (claim system).
