import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PatientCondition } from '@prisma/client';

export class UpdateConditionDto {
  @ApiProperty({ enum: PatientCondition, example: PatientCondition.MEMBAIK })
  @IsEnum(PatientCondition)
  condition: PatientCondition;

  @ApiPropertyOptional({ example: 'Suhu turun, nafsu makan membaik' })
  @IsString()
  @IsOptional()
  notes?: string;
}
