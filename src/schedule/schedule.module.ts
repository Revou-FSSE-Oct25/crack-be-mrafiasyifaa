import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [ScheduleService],
})
export class ScheduleModule {}
