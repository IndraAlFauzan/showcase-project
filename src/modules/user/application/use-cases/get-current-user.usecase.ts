// src/modules/user/application/use-cases/get-current-user.usecase.ts
import { Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/shared/interface/jwt-payload.interface';

@Injectable()
export class GetCurrentUserUseCase {
  async execute(user: JwtPayload) {
    return {
      id: user.sub,
      email: user.email,
      role: user.role,
    };
  }
}
