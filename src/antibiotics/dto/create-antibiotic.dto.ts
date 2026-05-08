import { IsString, IsEnum, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { AntibioticCategory, AntibioticForm } from '@prisma/client';

export class CreateAntibioticDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(AntibioticCategory)
  category: AntibioticCategory;

  @IsEnum(AntibioticForm)
  form: AntibioticForm;

  @IsInt()
  @Min(0)
  stock: number;
}
