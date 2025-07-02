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

@Controller('user')
export class UserController {
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
