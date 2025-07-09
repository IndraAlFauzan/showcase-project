import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IStudentRepository } from '../../infrastructure/repositories/student.repository.interface';
import { StudentProfileResponseDto } from '../../presentation/dto/student-profile-response.dto';
import { StudentEntity } from '../../domain/entities/student.entity';

@Injectable()
export class GetStudentProfileUseCase {
  constructor(
    @Inject('IStudentRepository')
    private readonly studentRepo: IStudentRepository,
  ) {}

  async execute(id: number): Promise<StudentProfileResponseDto> {
    const student = await this.studentRepo.findById(id);
    if (!student) {
      throw new NotFoundException('Profil mahasiswa tidak ditemukan');
    }

    return this.toDto(student);
  }

  private toDto(student: StudentEntity): StudentProfileResponseDto {
    return {
      id: student.id,
      nama: student.nama,
      nim: student.nim,
      angkatan: student.angkatan,
      photo_url: student.photo_url
        ? `${process.env.PUBLIC_STORAGE_URL}${student.photo_url}`
        : null,
      interests: student.interests?.map((i) => i.name) || [],
      technologies: student.technologies?.map((t) => t.name) || [],
    };
  }
}
