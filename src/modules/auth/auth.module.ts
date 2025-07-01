import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoginUseCase } from './application/use-cases/login.usecase';
import { AuthController } from './presentation/controllers/auth.controller';
import { UserEntity } from '../user/domain/entities/user.entity';
import { RoleEntity } from '../user/domain/entities/role.entity';
import { JwtStrategy } from './infrastructure/strategies/jwt.starategy';
import { RegisterUseCase } from './application/use-cases/register.usecase';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN') || '1800s',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [LoginUseCase, RegisterUseCase, JwtStrategy],
})
export class AuthModule {}
