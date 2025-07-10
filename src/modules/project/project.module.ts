// src/modules/project/project.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectEntity } from './domain/entities/project.entity';
import { ProjectAnalysisEntity } from './domain/entities/project-analysis.entity';
import { ProjectMediaEntity } from './domain/entities/project-media.entity';
import { ProjectMemberEntity } from './domain/entities/project-member.entity';

import { ProjectController } from './presentation/controllers/project.controller';

import { CreateProjectUseCase } from './application/use-cases/create-project.usecase';
import { GetMyProjectsUseCase } from './application/use-cases/get-my-project.usecase';

import { ProjectRepository } from './infrastructure/repositories/project.repository';
import { IProjectRepository } from './infrastructure/repositories/project.repository.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity,
      ProjectAnalysisEntity,
      ProjectMediaEntity,
      ProjectMemberEntity,
    ]),
  ],
  controllers: [ProjectController],
  providers: [
    {
      provide: 'IProjectRepository',
      useClass: ProjectRepository,
    },
    CreateProjectUseCase,
    GetMyProjectsUseCase,
  ],
})
export class ProjectModule {}
