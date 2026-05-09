import { Module } from '@nestjs/common';
import { AntibioticRequestsController } from './antibiotic-requests.controller';
import { AntibioticRequestsService } from './antibiotic-requests.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [AntibioticRequestsController],
  providers: [AntibioticRequestsService],
})
export class AntibioticRequestsModule {}
