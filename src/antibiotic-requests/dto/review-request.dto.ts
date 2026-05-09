import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ReviewRequestDto {
  @IsEnum(['APPROVED', 'REJECTED'])
  status: 'APPROVED' | 'REJECTED';

  @IsString()
  @IsOptional()
  reviewNotes?: string;
}
