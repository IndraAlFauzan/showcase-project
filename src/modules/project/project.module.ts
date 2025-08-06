// src/modules/project/project.module.ts

import { Get, Module } from '@nestjs/common';
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
import { StudentModule } from '../student/student.module';
import { GetAllProjectsUseCase } from './application/use-cases/get-all-project.usecase';
import { ProjectPublicController } from './presentation/controllers/project-public.controller';
import { UpdateProjectUseCase } from './application/use-cases/update-project.usecase';
import { SetTopProjectUseCase } from './application/use-cases/set-top-project.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity,
      ProjectAnalysisEntity,
      ProjectMediaEntity,
      ProjectMemberEntity,
    ]),
    StudentModule, // Import StudentModule to access IStudentRepository
  ],
  controllers: [ProjectController, ProjectPublicController],
  providers: [
    {
      provide: 'IProjectRepository',
      useClass: ProjectRepository,
    },
    CreateProjectUseCase,
    GetMyProjectsUseCase,
    GetAllProjectsUseCase, // Assuming you have this use case
    UpdateProjectUseCase,
    SetTopProjectUseCase,
  ],
})
export class ProjectModule {}
