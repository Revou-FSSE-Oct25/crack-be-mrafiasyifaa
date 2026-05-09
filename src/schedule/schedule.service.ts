import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkExpiredAntibiotics() {
    this.logger.log('Checking expired antibiotic requests...');

    const expired = await this.prisma.antibioticRequest.findMany({
      where: {
        status: 'APPROVED',
        expiredNotified: false,
        endDate: { lt: new Date() },
      },
      include: {
        antibiotic: { select: { name: true } },
        patient: { select: { name: true } },
      },
    });

    if (expired.length === 0) return;

    await Promise.all(
      expired.map(async (req) => {
        await this.notifications.create(
          req.doctorId,
          'ANTIBIOTIC_KADALUARSA',
          'Antibiotik Telah Berakhir',
          `Penggunaan ${req.antibiotic.name} untuk pasien ${req.patient.name} telah melewati tanggal selesai`,
          req.id,
        );

        await this.prisma.antibioticRequest.update({
          where: { id: req.id },
          data: { expiredNotified: true },
        });
      }),
    );

    this.logger.log(`Sent expiry notifications for ${expired.length} request(s)`);
  }
}
