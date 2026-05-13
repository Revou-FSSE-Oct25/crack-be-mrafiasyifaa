import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { AssignPatientDto } from './dto/assign-patient.dto';
import { UpdateConditionDto } from './dto/update-condition.dto';
import { Role } from '../common/enums/role.enum';
import { PatientCondition } from '@prisma/client';

function generateMedRecNo(birthDate: Date): string {
  const yy = String(new Date().getFullYear()).slice(-2);
  const dd = String(birthDate.getDate()).padStart(2, '0');
  const mm = String(birthDate.getMonth() + 1).padStart(2, '0');
  const bdYY = String(birthDate.getFullYear()).slice(-2);
  const suffix = String(Math.floor(10 + Math.random() * 90));
  return `${yy}${dd}${mm}${bdYY}${suffix}`;
}

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(doctorId: string, dto: CreatePatientDto) {
    let medRecNo: string;
    let isUnique = false;

    const { birthDate: birthDateStr, ...rest } = dto;
    const birthDate = new Date(birthDateStr);

    while (!isUnique) {
      medRecNo = generateMedRecNo(birthDate);
      const existing = await this.prisma.patient.findUnique({ where: { medRecNo } });
      if (!existing) isUnique = true;
    }

    return this.prisma.patient.create({
      data: { ...rest, birthDate, medRecNo: medRecNo!, doctorId },
    });
  }

  async assignExisting(doctorId: string, dto: AssignPatientDto) {
    const patient = await this.prisma.patient.findUnique({
      where: { medRecNo: dto.medRecNo },
    });

    if (!patient) {
      throw new NotFoundException(`Pasien dengan No. RM ${dto.medRecNo} tidak ditemukan!`);
    }

    if (patient.doctorId === doctorId) {
      throw new ConflictException('Pasien telah terdaftar di daftar Anda!');
    }

    return this.prisma.patient.update({
      where: { id: patient.id },
      data: { doctorId },
    });
  }

  async findAll(userId: string, userRole: string, search?: string, condition?: PatientCondition) {
    const baseWhere = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { medRecNo: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(condition && { condition }),
    };

    if (userRole === Role.ADMIN_PPRA) {
      return this.prisma.patient.findMany({
        where: baseWhere,
        include: { doctor: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.patient.findMany({
      where: { ...baseWhere, doctorId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, userRole: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        doctor: { select: { id: true, name: true, email: true } },
        conditionLogs: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    if (!patient) throw new NotFoundException('Pasien tidak ditemukan!');

    if (userRole !== Role.ADMIN_PPRA && patient.doctorId !== userId) {
      throw new ForbiddenException('Akses Anda ditolak!');
    }

    return patient;
  }

  async updateCondition(patientId: string, doctorId: string, dto: UpdateConditionDto) {
    const patient = await this.prisma.patient.findFirst({
      where: { id: patientId, doctorId },
    });

    if (!patient) throw new ForbiddenException('Pasien tidak ditemukan atau bukan pasien Anda');

    const [updated] = await this.prisma.$transaction([
      this.prisma.patient.update({
        where: { id: patientId },
        data: { condition: dto.condition },
      }),
      this.prisma.patientConditionLog.create({
        data: {
          patientId,
          condition: dto.condition,
          notes: dto.notes,
          updatedBy: doctorId,
        },
      }),
    ]);

    return updated;
  }

  async getConditionLogs(patientId: string, userId: string, userRole: string) {
    const patient = await this.prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) throw new NotFoundException('Pasien tidak ditemukan!');

    if (userRole !== Role.ADMIN_PPRA && patient.doctorId !== userId) {
      throw new ForbiddenException('Akses Anda ditolak!');
    }

    return this.prisma.patientConditionLog.findMany({
      where: { patientId },
      include: { doctor: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
