import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama tidak boleh kosong!' })
  name: string;

  @IsEmail({}, { message: 'Format E-mail tidak valid!' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter!' })
  password: string;

  @IsEnum(Role, { message: 'Role tidak valid!' })
  role: Role;
}
