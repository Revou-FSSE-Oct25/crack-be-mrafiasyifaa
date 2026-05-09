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

class ClinicalDataDto {
  @IsString()
  @IsNotEmpty()
  diagnosis: string;

  @IsString()
  @IsOptional()
  bloodPressure?: string;

  @IsInt()
  @IsOptional()
  heartRate?: number;

  @IsNumber()
  @IsOptional()
  temperature?: number;

  @IsInt()
  @IsOptional()
  respiratoryRate?: number;

  @IsNumber()
  @IsOptional()
  oxygenSaturation?: number;

  @IsString()
  @IsOptional()
  generalCondition?: string;

  @IsString()
  @IsOptional()
  physicalExamination?: string;

  @IsNumber()
  @IsOptional()
  leukocytes?: number;

  @IsNumber()
  @IsOptional()
  neutrophils?: number;

  @IsNumber()
  @IsOptional()
  lymphocytes?: number;

  @IsString()
  @IsOptional()
  urinalysis?: string;

  @IsNumber()
  @IsOptional()
  ureum?: number;

  @IsNumber()
  @IsOptional()
  creatinine?: number;

  @IsNumber()
  @IsOptional()
  sgot?: number;

  @IsNumber()
  @IsOptional()
  sgpt?: number;

  @IsNumber()
  @IsOptional()
  albumin?: number;

  @IsString()
  @IsOptional()
  imagingType?: string;

  @IsString()
  @IsOptional()
  imagingResult?: string;

  @IsString()
  @IsOptional()
  cultureResult?: string;
}

export class CreateRequestDto {
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @IsString()
  @IsNotEmpty()
  antibioticId: string;

  @IsString()
  @IsNotEmpty()
  dosage: string;

  @IsString()
  @IsOptional()
  frequency?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @ValidateNested()
  @Type(() => ClinicalDataDto)
  clinicalData: ClinicalDataDto;
}
