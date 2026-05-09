import { Module } from '@nestjs/common';
import { AntibioticRequestsController } from './antibiotic-requests.controller';
import { AntibioticRequestsService } from './antibiotic-requests.service';

@Module({
  controllers: [AntibioticRequestsController],
  providers: [AntibioticRequestsService],
})
export class AntibioticRequestsModule {}
