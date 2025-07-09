// modules/student/application/use-cases/get-student-profile.usecase.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IStudentRepository } from '../../infrastructure/repositories/student.repository.interface';
import { StudentProfileResponseDto } from '../../presentation/dto/student-profile-response.dto';
import { StudentEntity } from '../../domain/entities/student.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GetStudentProfileUseCase {
  constructor(
    @Inject('IStudentRepository')
    private readonly studentRepo: IStudentRepository,
    private readonly configService: ConfigService,
  ) {}

  async byId(id: number): Promise<StudentProfileResponseDto> {
    const student = await this.studentRepo.findById(id);
    if (!student) {
      throw new NotFoundException('Belum ada Profile');
    }
    return this.toDto(student);
  }

  async byUserId(userId: number): Promise<StudentProfileResponseDto> {
    const student = await this.studentRepo.findByUserId(userId);
    if (!student) {
      throw new NotFoundException('Profil mahasiswa tidak ditemukan');
    }
    return this.toDto(student);
  }

  private toDto(student: StudentEntity): StudentProfileResponseDto {
    const baseUrl = this.configService.get<string>('PUBLIC_STORAGE_URL') || '';
    return {
      id: student.id,
      nama: student.nama,
      nim: student.nim,
      angkatan: student.angkatan,
      photo_url: student.photo_url ? `${baseUrl}${student.photo_url}` : null,
      interests: student.interests?.map((i) => i.name) || [],
      technologies: student.technologies?.map((t) => t.name) || [],
    };
  }
}
