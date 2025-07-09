// modules/student/domain/repositories/student.repository.interface.ts

import { StudentEntity } from '../../domain/entities/student.entity';

export interface IStudentRepository {
  create(student: Partial<StudentEntity>): Promise<StudentEntity>;
  findById(id: number): Promise<StudentEntity | null>;
  findAll(): Promise<StudentEntity[]>;
  update(id: number, student: Partial<StudentEntity>): Promise<StudentEntity>;
  delete(id: number): Promise<void>;
}
