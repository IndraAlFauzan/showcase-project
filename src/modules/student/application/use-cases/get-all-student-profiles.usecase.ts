import { Inject, Injectable } from '@nestjs/common';
import { IStudentRepository } from '../../infrastructure/repositories/student.repository.interface';
import { StudentProfileResponseDto } from '../../presentation/dto/student-profile-response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GetAllStudentProfilesUseCase {
  constructor(
    @Inject('IStudentRepository')
    private readonly studentRepo: IStudentRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute(): Promise<StudentProfileResponseDto[]> {
    const students = await this.studentRepo.findAll();
    const baseUrl = this.configService.get<string>('PUBLIC_STORAGE_URL') || '';

    return students.map((student) => ({
      id: student.id,
      user_id: student.user.id,
      nama: student.nama,
      nim: student.nim,
      angkatan: student.angkatan,
      photo_url: student.photo_url ? `${baseUrl}${student.photo_url}` : null,
      interests: student.interests?.map((i) => i.name) || [],
      technologies: student.technologies?.map((t) => t.name) || [],
    }));
  }
}
