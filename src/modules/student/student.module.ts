import { Delete, Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterestEntity } from '../interest/domain/entities/interest.entity';
import { TechnologyEntity } from '../technology/domain/entities/technology.entity';
import { StudentEntity } from './domain/entities/student.entity';
import { StudentRepository } from './infrastructure/repositories/student.repository';
import { CreateStudentProfileUseCase } from './application/use-cases/create-student-profile.usecase';
import { DeleteStudentProfileUseCase } from './application/use-cases/delete-student-profile.usecase';
import { GetAllStudentProfilesUseCase } from './application/use-cases/get-all-student-profiles.usecase';
import { GetStudentProfileUseCase } from './application/use-cases/get-student-profile.usecase';
import { UpdateStudentProfileUseCase } from './application/use-cases/update-student-profile.usecase';
import { StudentController } from './presentation/controllers/student.controller';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([StudentEntity, InterestEntity, TechnologyEntity]),
  ],
  controllers: [StudentController],
  providers: [
    {
      provide: 'IStudentRepository',
      useClass: StudentRepository,
    },
    // Add any use cases or services related to student here
    CreateStudentProfileUseCase,
    DeleteStudentProfileUseCase,
    GetAllStudentProfilesUseCase,
    GetStudentProfileUseCase,
    UpdateStudentProfileUseCase,
  ],
  exports: ['IStudentRepository'],
})
export class StudentModule {}
