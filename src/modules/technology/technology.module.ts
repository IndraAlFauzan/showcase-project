import { Delete, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnologyEntity } from './domain/entities/technology.entity';
import { TechnologyController } from './presentation/controllers/technology.controller';
import { TechnologyRepository } from './infrastructure/repositories/technology.repository';
import { CreateTechnologyUseCase } from './application/use-cases/create-technology.usecase';
import { GetAllTechnologyUseCase } from './application/use-cases/get-all-technology.usecase';
import { UpdateTechnologyUseCase } from './application/use-cases/update-technology.usecase';
import { DeleteTechnologyUseCase } from './application/use-cases/delete-technology.usecase';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([TechnologyEntity])],
  controllers: [TechnologyController],
  providers: [
    TechnologyRepository,
    {
      provide: 'ITechnologyRepository',
      useClass: TechnologyRepository,
    },
    // Use Cases
    CreateTechnologyUseCase,
    GetAllTechnologyUseCase,
    UpdateTechnologyUseCase,
    DeleteTechnologyUseCase,
  ],
  exports: [],
})
export class TechnologyModule {}
