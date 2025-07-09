import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { JwtPayload } from 'src/shared/interface/jwt-payload.interface';
import { GetCurrentUserUseCase } from '../../application/use-cases/get-current-user.usecase';

@Controller('user')
export class UserController {
  constructor(
    // No dependencies needed for this controller
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase, // Placeholder for future use
  ) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: JwtPayload) {
    return {
      message: 'Profil berhasil diambil',
      data: user,
    };
  }
}
