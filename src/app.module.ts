import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { AntibioticsModule } from './antibiotics/antibiotics.module';
import { AntibioticRequestsModule } from './antibiotic-requests/antibiotic-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    PatientsModule,
    AntibioticsModule,
    AntibioticRequestsModule,
  ],
})
export class AppModule {}
