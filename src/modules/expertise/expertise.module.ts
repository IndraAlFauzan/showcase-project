import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpertiseEntity } from './domain/entities/expertise.entity';
import { ExpertiseController } from './presentation/controllers/expertise.controller';
import { ExpertiseRepository } from './infrastructure/repositories/category.repository';
import { CreateExpertiseUseCase } from './application/use-cases/create-expertise.usecase';

import { GetAllExpertiseUseCase } from './application/use-cases/get-all-expertise.usecase';
import { DeleteExpertiseUseCase } from './application/use-cases/delete-expertise.usecase';
import { UpdateExpertiseUseCase } from './application/use-cases/update-expertise.usecase';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ExpertiseEntity])],
  controllers: [ExpertiseController],
  providers: [
    ExpertiseRepository,
    {
      provide: 'IExpertiseRepository',
      useClass: ExpertiseRepository,
    },
    CreateExpertiseUseCase,
    UpdateExpertiseUseCase,
    GetAllExpertiseUseCase,
    DeleteExpertiseUseCase,
  ],
  exports: [],
})
export class ExpertiseModule {}
