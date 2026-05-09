import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPatientDto {
  @ApiProperty({ example: '2607019993' })
  @IsString()
  @IsNotEmpty()
  medRecNo: string;
}
