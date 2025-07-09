import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterestEntity } from './domain/entities/interest.entity';
import { InterestController } from './presentation/controllers/interest.controller';
import { InterestRepository } from './infrastructure/repositories/interest.repository';
import { CreateInterestUseCase } from './application/use-cases/create-interest.usecase';
import { UpdateInterestUseCase } from './application/use-cases/update-interest.usecase';
import { GetAllInterestUseCase } from './application/use-cases/get-all-interest.usecase';
import { DeleteInterestUseCase } from './application/use-cases/delete-interest.usecase';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([InterestEntity])],
  controllers: [InterestController],
  providers: [
    InterestRepository,
    {
      provide: 'IInterestRepository',
      useClass: InterestRepository,
    },
    CreateInterestUseCase,
    UpdateInterestUseCase,
    GetAllInterestUseCase,
    DeleteInterestUseCase,
  ],
  exports: [],
})
export class InterestModule {}
