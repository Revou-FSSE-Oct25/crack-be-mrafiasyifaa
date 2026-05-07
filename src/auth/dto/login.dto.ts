import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Format E-mail tidak valid!' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password tidak boleh kosong!' })
  password: string;
}
