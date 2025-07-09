// modules/student/infrastructure/repositories/student.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StudentEntity } from '../../domain/entities/student.entity';
import { IStudentRepository } from './student.repository.interface';

@Injectable()
export class StudentRepository implements IStudentRepository {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly repo: Repository<StudentEntity>,
  ) {}

  async create(student: Partial<StudentEntity>): Promise<StudentEntity> {
    const created = this.repo.create(student);
    return await this.repo.save(created);
  }

  async findById(id: number): Promise<StudentEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['user', 'interests', 'technologies'],
    });
  }

  async findAll(): Promise<StudentEntity[]> {
    return await this.repo.find();
  }

  async findByUserId(userId: number): Promise<StudentEntity | null> {
    return this.repo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'interests', 'technologies'],
    });
  }

  async update(
    id: number,
    data: Partial<StudentEntity>,
  ): Promise<StudentEntity> {
    const student = await this.repo.findOne({
      where: { id },
      relations: ['interests', 'technologies'],
    });

    if (!student) {
      throw new NotFoundException('Profil mahasiswa tidak ditemukan');
    }

    // Field biasa
    student.nama = data.nama ?? student.nama;
    student.nim = data.nim ?? student.nim;
    student.angkatan = data.angkatan ?? student.angkatan;
    student.photo_url = data.photo_url ?? student.photo_url;

    await this.repo.save(student);

    // Update interests safely
    if (data.interests !== undefined) {
      const interestIds = data.interests.map((i) => i.id);
      await this.repo
        .createQueryBuilder()
        .relation(StudentEntity, 'interests')
        .of(student)
        .addAndRemove(
          interestIds,
          student.interests.map((i) => i.id),
        );
    }

    // Update technologies safely
    if (data.technologies !== undefined) {
      const techIds = data.technologies.map((t) => t.id);
      await this.repo
        .createQueryBuilder()
        .relation(StudentEntity, 'technologies')
        .of(student)
        .addAndRemove(
          techIds,
          student.technologies.map((t) => t.id),
        );
    }

    // Reload untuk response lengkap
    const updatedStudent = await this.repo.findOne({
      where: { id },
      relations: ['user', 'interests', 'technologies'],
    });

    if (!updatedStudent) {
      throw new Error('Updated student not found');
    }
    return updatedStudent;
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
