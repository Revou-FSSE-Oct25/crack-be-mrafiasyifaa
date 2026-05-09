import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class RegisterDto {
  @ApiProperty({ example: 'Dr. Budi' })
  @IsString()
  @IsNotEmpty({ message: 'Nama tidak boleh kosong!' })
  name: string;

  @ApiProperty({ example: 'budi@rs.com' })
  @IsEmail({}, { message: 'Format E-mail tidak valid!' })
  email: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter!' })
  password: string;

  @ApiProperty({ enum: Role, example: Role.DOCTOR })
  @IsEnum(Role, { message: 'Role tidak valid!' })
  role: Role;
}
