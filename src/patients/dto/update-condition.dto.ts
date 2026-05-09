import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PatientCondition } from '@prisma/client';

export class UpdateConditionDto {
  @IsEnum(PatientCondition)
  condition: PatientCondition;

  @IsString()
  @IsOptional()
  notes?: string;
}
