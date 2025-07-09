import {
  Inject,
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { StudentEntity } from '../../domain/entities/student.entity';
import { IStudentRepository } from '../../infrastructure/repositories/student.repository.interface';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { StudentProfileResponseDto } from '../../presentation/dto/student-profile-response.dto';

interface CreateProfileStudentRequest {
  nama: string;
  nim: string;
  angkatan: number;
  photo_url?: string;
  interest_ids?: number[];
  technology_ids?: number[];
}

@Injectable()
export class CreateStudentProfileUseCase {
  constructor(
    @Inject('IStudentRepository')
    private readonly studentRepo: IStudentRepository,
  ) {}

  async execute(
    input: CreateProfileStudentRequest,
    user_id: number,
  ): Promise<StudentProfileResponseDto> {
    try {
      // ✅ Cek apakah sudah ada profil berdasarkan user_id
      const existingByUser = await this.studentRepo.findById(user_id);
      if (existingByUser) {
        throw new ConflictException(
          'Profil mahasiswa untuk user ini sudah ada',
        );
      }

      const user = new UserEntity();
      user.id = user_id;

      const student: Partial<StudentEntity> = {
        nama: input.nama,
        nim: input.nim,
        angkatan: input.angkatan,
        photo_url: input.photo_url,
        user,
        interests: input.interest_ids?.map((id) => ({ id })) as any,
        technologies: input.technology_ids?.map((id) => ({ id })) as any,
      };

      const createdStudent = await this.studentRepo.create(student);

      if (!createdStudent) {
        throw new InternalServerErrorException(
          'Gagal membuat profil mahasiswa',
        );
      }

      const completeStudent = await this.studentRepo.findById(
        createdStudent.id,
      );
      if (!completeStudent) {
        throw new InternalServerErrorException(
          'Profil tidak ditemukan setelah dibuat',
        );
      }

      return this.toDto(completeStudent);
    } catch (error) {
      console.error('[USECASE ERROR]', error);
      throw error;
    }
  }

  private toDto(student: StudentEntity): StudentProfileResponseDto {
    return {
      id: student.id,
      nama: student.nama,
      nim: student.nim,
      angkatan: student.angkatan,
      photo_url: student.photo_url,
      interests: student.interests?.map((i) => i.name) || [],
      technologies: student.technologies?.map((t) => t.name) || [],
    };
  }
}
