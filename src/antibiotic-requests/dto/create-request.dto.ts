import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ClinicalDataDto {
  @ApiProperty({ example: 'Infeksi saluran kemih' })
  @IsString()
  @IsNotEmpty()
  diagnosis: string;

  @ApiPropertyOptional({ example: '120/80' })
  @IsString()
  @IsOptional()
  bloodPressure?: string;

  @ApiPropertyOptional({ example: 80 })
  @IsInt()
  @IsOptional()
  heartRate?: number;

  @ApiPropertyOptional({ example: 38.5 })
  @IsNumber()
  @IsOptional()
  temperature?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsInt()
  @IsOptional()
  respiratoryRate?: number;

  @ApiPropertyOptional({ example: 98.0 })
  @IsNumber()
  @IsOptional()
  oxygenSaturation?: number;

  @ApiPropertyOptional({ example: 'Lemah' })
  @IsString()
  @IsOptional()
  generalCondition?: string;

  @ApiPropertyOptional({ example: 'Nyeri tekan suprapubik' })
  @IsString()
  @IsOptional()
  physicalExamination?: string;

  @ApiPropertyOptional({ example: 12.5 })
  @IsNumber()
  @IsOptional()
  leukocytes?: number;

  @ApiPropertyOptional({ example: 80.0 })
  @IsNumber()
  @IsOptional()
  neutrophils?: number;

  @ApiPropertyOptional({ example: 15.0 })
  @IsNumber()
  @IsOptional()
  lymphocytes?: number;

  @ApiPropertyOptional({ example: 'Leukosit +3, nitrit positif' })
  @IsString()
  @IsOptional()
  urinalysis?: string;

  @ApiPropertyOptional({ example: 25.0 })
  @IsNumber()
  @IsOptional()
  ureum?: number;

  @ApiPropertyOptional({ example: 0.9 })
  @IsNumber()
  @IsOptional()
  creatinine?: number;

  @ApiPropertyOptional({ example: 22.0 })
  @IsNumber()
  @IsOptional()
  sgot?: number;

  @ApiPropertyOptional({ example: 18.0 })
  @IsNumber()
  @IsOptional()
  sgpt?: number;

  @ApiPropertyOptional({ example: 4.0 })
  @IsNumber()
  @IsOptional()
  albumin?: number;

  @ApiPropertyOptional({ example: 'USG Abdomen' })
  @IsString()
  @IsOptional()
  imagingType?: string;

  @ApiPropertyOptional({ example: 'https://supabase.storage/...', description: 'URL file PDF hasil imaging (upload via Supabase Storage)' })
  @IsString()
  @IsOptional()
  imagingResult?: string;

  @ApiPropertyOptional({ example: 'https://supabase.storage/...', description: 'URL file PDF hasil kultur (upload via Supabase Storage)' })
  @IsString()
  @IsOptional()
  cultureResult?: string;
}

export class CreateRequestDto {
  @ApiProperty({ example: 'cuid_patient_id' })
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ example: 'cuid_antibiotic_id' })
  @IsString()
  @IsNotEmpty()
  antibioticId: string;

  @ApiProperty({ example: '500mg' })
  @IsString()
  @IsNotEmpty()
  dosage: string;

  @ApiPropertyOptional({ example: '3x sehari' })
  @IsString()
  @IsOptional()
  frequency?: string;

  @ApiPropertyOptional({ example: '2026-05-08' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-05-15' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ example: 'Pasien alergi penisilin' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ type: ClinicalDataDto })
  @ValidateNested()
  @Type(() => ClinicalDataDto)
  clinicalData: ClinicalDataDto;
}
