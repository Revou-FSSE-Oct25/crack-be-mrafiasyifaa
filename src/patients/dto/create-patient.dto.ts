import { IsString, IsEnum, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PatientGender } from '@prisma/client';

export class CreatePatientDto {
  @ApiProperty({ example: 'Siti Rahayu' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '1990-05-07' })
  @IsDateString()
  birthDate: string;

  @ApiProperty({ enum: PatientGender, example: PatientGender.PEREMPUAN })
  @IsEnum(PatientGender)
  gender: PatientGender;

  @ApiProperty({ example: 'Jl. Merdeka No. 1' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Infeksi saluran kemih' })
  @IsString()
  @IsNotEmpty()
  diagnosis: string;
}
