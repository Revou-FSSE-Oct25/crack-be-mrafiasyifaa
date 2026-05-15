import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRequestDto {
  @ApiPropertyOptional({ example: 'cuid_antibiotic_id' })
  @IsString()
  @IsOptional()
  antibioticId?: string;

  @ApiPropertyOptional({ example: '500mg' })
  @IsString()
  @IsOptional()
  dosage?: string;

  @ApiPropertyOptional({ example: '3x sehari' })
  @IsString()
  @IsOptional()
  frequency?: string;

  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2025-01-07' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ example: 'Pasien alergi penisilin' })
  @IsString()
  @IsOptional()
  notes?: string;
}
