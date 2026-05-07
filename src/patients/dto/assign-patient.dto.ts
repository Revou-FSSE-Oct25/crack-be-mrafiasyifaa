import { IsString, IsNotEmpty } from 'class-validator';

export class AssignPatientDto {
  @IsString()
  @IsNotEmpty()
  medRecNo: string;
}
