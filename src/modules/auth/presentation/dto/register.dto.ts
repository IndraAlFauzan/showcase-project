import { IsEmail, IsString, MinLength, IsInt } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsInt()
  roleId: number; // id dari role (1=admin, 2=dosen, 3=mahasiswa)
}
