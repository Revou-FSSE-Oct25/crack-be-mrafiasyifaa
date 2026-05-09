import { IsString, IsEnum, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AntibioticCategory, AntibioticForm } from '@prisma/client';

export class CreateAntibioticDto {
  @ApiProperty({ example: 'Amoxicillin' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Antibiotik spektrum luas' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: AntibioticCategory, example: AntibioticCategory.KOMERSIAL })
  @IsEnum(AntibioticCategory)
  category: AntibioticCategory;

  @ApiProperty({ enum: AntibioticForm, example: AntibioticForm.TABLET })
  @IsEnum(AntibioticForm)
  form: AntibioticForm;

  @ApiProperty({ example: 100, minimum: 0 })
  @IsInt()
  @Min(0)
  stock: number;
}
