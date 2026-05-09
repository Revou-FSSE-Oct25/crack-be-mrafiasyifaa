import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'budi@rs.com' })
  @IsEmail({}, { message: 'Format E-mail tidak valid!' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty({ message: 'Password tidak boleh kosong!' })
  password: string;
}
