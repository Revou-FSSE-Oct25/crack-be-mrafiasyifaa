import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { ReviewRequestDto } from './dto/review-request.dto';
import { Role } from '../common/enums/role.enum';
import { RequestStatus } from '@prisma/client';

const requestInclude = {
  patient: { select: { id: true, name: true, medRecNo: true } },
  antibiotic: { select: { id: true, name: true, category: true, form: true } },
  doctor: { select: { id: true, name: true, email: true } },
  reviewedBy: { select: { id: true, name: true } },
  clinicalData: true,
};

@Injectable()
export class AntibioticRequestsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async create(doctorId: string, dto: CreateRequestDto) {
    const { clinicalData, startDate, endDate, ...requestData } = dto;

    const patient = await this.prisma.patient.findFirst({
      where: { id: requestData.patientId, doctorId },
    });
    if (!patient) throw new ForbiddenException('Pasien tidak ditemukan atau bukan pasien Anda');

    const antibiotic = await this.prisma.antibiotic.findUnique({
      where: { id: requestData.antibioticId },
    });
    if (!antibiotic) throw new NotFoundException('Antibiotik tidak ditemukan');

    const request = await this.prisma.antibioticRequest.create({
      data: {
        ...requestData,
        doctorId,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        clinicalData: { create: clinicalData },
      },
      include: requestInclude,
    });

    await this.notifications.notifyAllAdmins(
      'REQUEST_BARU',
      'Request Antibiotik Baru',
      `Dr. ${request.doctor.name} mengajukan request ${antibiotic.name} untuk pasien ${patient.name}`,
      request.id,
    );

    return request;
  }

  async findAll(userId: string, userRole: string, status?: RequestStatus) {
    const where: any = {};
    if (status) where.status = status;
    if (userRole !== Role.ADMIN_VPRS) where.doctorId = userId;

    return this.prisma.antibioticRequest.findMany({
      where,
      include: requestInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, userRole: string) {
    const request = await this.prisma.antibioticRequest.findUnique({
      where: { id },
      include: requestInclude,
    });

    if (!request) throw new NotFoundException('Request tidak ditemukan');

    if (userRole !== Role.ADMIN_VPRS && request.doctorId !== userId) {
      throw new ForbiddenException('Anda tidak memiliki akses ke request ini');
    }

    return request;
  }

  async review(id: string, adminId: string, dto: ReviewRequestDto) {
    const request = await this.prisma.antibioticRequest.findUnique({
      where: { id },
      include: { antibiotic: true, patient: true },
    });
    if (!request) throw new NotFoundException('Request tidak ditemukan');

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Hanya request berstatus PENDING yang dapat direview');
    }

    const updated = await this.prisma.antibioticRequest.update({
      where: { id },
      data: {
        status: dto.status,
        reviewedById: adminId,
        reviewNotes: dto.reviewNotes,
      },
      include: requestInclude,
    });

    const isApproved = dto.status === 'APPROVED';
    await this.notifications.create(
      request.doctorId,
      isApproved ? 'REQUEST_DISETUJUI' : 'REQUEST_DITOLAK',
      isApproved ? 'Request Disetujui' : 'Request Ditolak',
      `Request ${request.antibiotic.name} untuk pasien ${request.patient.name} ${isApproved ? 'telah disetujui' : 'ditolak'}`,
      request.id,
    );

    return updated;
  }
}
