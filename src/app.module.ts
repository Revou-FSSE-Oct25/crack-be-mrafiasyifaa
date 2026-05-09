import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { AntibioticsModule } from './antibiotics/antibiotics.module';
import { AntibioticRequestsModule } from './antibiotic-requests/antibiotic-requests.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NestScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    PatientsModule,
    AntibioticsModule,
    AntibioticRequestsModule,
    NotificationsModule,
    ScheduleModule,
  ],
})
export class AppModule {}
