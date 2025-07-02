import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

import { LoginDto } from '../dto/login.dto';
import { LoginUseCase } from '../../application/use-cases/login.usecase';
import { RegisterUseCase } from '../../application/use-cases/register.usecase';
import { RegisterDto } from '../dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const result = await this.loginUseCase.execute(dto);
    return {
      message: 'Login berhasil',
      data: result,
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    const result = await this.registerUseCase.execute(
      dto.name,
      dto.email,
      dto.password,
      dto.roleId,
    );
    return {
      message: 'Registrasi berhasil',
      data: result,
    };
  }
}
