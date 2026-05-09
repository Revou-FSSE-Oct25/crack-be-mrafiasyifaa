import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, type: NotificationType, title: string, message: string, referenceId?: string) {
    return this.prisma.notification.create({
      data: { userId, type, title, message, referenceId },
    });
  }

  async notifyAllAdmins(type: NotificationType, title: string, message: string, referenceId?: string) {
    const admins = await this.prisma.user.findMany({
      where: { role: 'ADMIN_VPRS' },
      select: { id: true },
    });

    await Promise.all(
      admins.map((admin) => this.create(admin.id, type, title, message, referenceId)),
    );
  }

  findAllForUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
