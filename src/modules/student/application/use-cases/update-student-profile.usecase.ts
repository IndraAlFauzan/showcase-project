import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IStudentRepository } from '../../infrastructure/repositories/student.repository.interface';
import { StudentProfileResponseDto } from '../../presentation/dto/student-profile-response.dto';
import { ConfigService } from '@nestjs/config';

interface UpdateStudentProfileRequest {
  nama?: string;
  nim?: string;
  angkatan?: number;
  photo_url?: string;
  interest_ids?: number[];
  technology_ids?: number[];
}

@Injectable()
export class UpdateStudentProfileUseCase {
  constructor(
    @Inject('IStudentRepository')
    private readonly studentRepo: IStudentRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    id: number,
    input: UpdateStudentProfileRequest,
  ): Promise<StudentProfileResponseDto> {
    try {
      const updatedData = {
        ...input,
        interests: input.interest_ids?.map((id) => ({ id }) as any),
        technologies: input.technology_ids?.map((id) => ({ id }) as any),
      };

      const updated = await this.studentRepo.update(id, updatedData);
      if (!updated) {
        throw new NotFoundException('Profil mahasiswa tidak ditemukan');
      }

      const baseUrl =
        this.configService.get<string>('PUBLIC_STORAGE_URL') || '';
      return {
        id: updated.id,
        nama: updated.nama,
        nim: updated.nim,
        angkatan: updated.angkatan,
        photo_url: updated.photo_url ? `${baseUrl}${updated.photo_url}` : null,
        interests: updated.interests?.map((i) => i.name) || [],
        technologies: updated.technologies?.map((t) => t.name) || [],
      };
    } catch (error) {
      console.error('[USECASE ERROR]', error);
      throw error;
    }
  }
}
