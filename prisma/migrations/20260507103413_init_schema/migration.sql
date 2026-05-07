-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DOCTOR', 'ADMIN_VPRS');

-- CreateEnum
CREATE TYPE "AntibioticCategory" AS ENUM ('KOMERSIAL', 'DIAWASI', 'RISET');

-- CreateEnum
CREATE TYPE "AntibioticForm" AS ENUM ('TABLET', 'KAPSUL', 'SIRUP', 'INJEKSI', 'SALEP', 'INFUS');

-- CreateEnum
CREATE TYPE "PatientGender" AS ENUM ('LAKI_LAKI', 'PEREMPUAN');

-- CreateEnum
CREATE TYPE "PatientCondition" AS ENUM ('STABIL', 'MEMBAIK', 'MEMBURUK', 'SELESAI');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('REQUEST_BARU', 'REQUEST_DISETUJUI', 'REQUEST_DITOLAK');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "medRecNo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "PatientGender" NOT NULL,
    "address" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "condition" "PatientCondition" NOT NULL DEFAULT 'STABIL',
    "doctorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "antibiotics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "AntibioticCategory" NOT NULL,
    "form" "AntibioticForm" NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "antibiotics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "antibiotic_requests" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "antibioticId" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "notes" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "antibiotic_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinical_data" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "bloodPressure" TEXT,
    "heartRate" INTEGER,
    "temperature" DOUBLE PRECISION,
    "respiratoryRate" INTEGER,
    "oxygenSaturation" DOUBLE PRECISION,
    "generalCondition" TEXT,
    "physicalExamination" TEXT,
    "leukocytes" DOUBLE PRECISION,
    "neutrophils" DOUBLE PRECISION,
    "lymphocytes" DOUBLE PRECISION,
    "urinalysis" TEXT,
    "ureum" DOUBLE PRECISION,
    "creatinine" DOUBLE PRECISION,
    "sgot" DOUBLE PRECISION,
    "sgpt" DOUBLE PRECISION,
    "albumin" DOUBLE PRECISION,
    "imagingType" TEXT,
    "imagingResult" TEXT,
    "cultureResult" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinical_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_condition_logs" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "condition" "PatientCondition" NOT NULL,
    "notes" TEXT,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_condition_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "patients_medRecNo_key" ON "patients"("medRecNo");

-- CreateIndex
CREATE UNIQUE INDEX "clinical_data_requestId_key" ON "clinical_data"("requestId");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antibiotic_requests" ADD CONSTRAINT "antibiotic_requests_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antibiotic_requests" ADD CONSTRAINT "antibiotic_requests_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antibiotic_requests" ADD CONSTRAINT "antibiotic_requests_antibioticId_fkey" FOREIGN KEY ("antibioticId") REFERENCES "antibiotics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antibiotic_requests" ADD CONSTRAINT "antibiotic_requests_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_data" ADD CONSTRAINT "clinical_data_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "antibiotic_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_condition_logs" ADD CONSTRAINT "patient_condition_logs_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_condition_logs" ADD CONSTRAINT "patient_condition_logs_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
