import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './domain/entities/user.entity';
import { RoleEntity } from './domain/entities/role.entity';
import { UserController } from './presentation/controllers/user.controller';
import { GetCurrentUserUseCase } from './application/use-cases/get-current-user.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  controllers: [UserController],
  providers: [GetCurrentUserUseCase],
  exports: [TypeOrmModule, GetCurrentUserUseCase],
})
export class UserModule {}
