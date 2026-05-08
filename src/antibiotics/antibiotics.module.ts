import { Module } from '@nestjs/common';
import { AntibioticsController } from './antibiotics.controller';
import { AntibioticsService } from './antibiotics.service';

@Module({
  controllers: [AntibioticsController],
  providers: [AntibioticsService],
})
export class AntibioticsModule {}
