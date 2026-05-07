import { IsString, IsEnum, IsNotEmpty, IsDateString } from 'class-validator';
import { PatientGender } from '@prisma/client';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  birthDate: string;

  @IsEnum(PatientGender)
  gender: PatientGender;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  diagnosis: string;
}
