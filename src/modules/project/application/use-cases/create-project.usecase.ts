import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IProjectRepository } from '../../infrastructure/repositories/project.repository.interface';
import {
  CreateProjectDtoSimplified,
  ProjectMediaType,
} from '../../presentation/dto/create-project.dto';
import { ProjectResponseDto } from '../../presentation/dto/project-response.dto';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';

@Injectable()
export class CreateProjectUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly projectRepo: IProjectRepository,
  ) {}

  async execute(
    input: CreateProjectDtoSimplified,
    userId: number,
  ): Promise<ProjectResponseDto> {
    try {
      // Buat media
      const media = [
        ...(input.images?.map((img) => ({
          type: ProjectMediaType.IMAGE,
          title: img.title,
          url: img.url,
        })) || []),
        ...(input.github
          ? [
              {
                type: ProjectMediaType.REPO,
                title: 'Github',
                url: input.github,
              },
            ]
          : []),
        ...(input.demo
          ? [{ type: ProjectMediaType.DEMO, title: 'Demo', url: input.demo }]
          : []),
      ];

      // Buat entity project
      const project = {
        title: input.title,
        description: input.description,
        type: input.type,
        semester: input.semester,
        createdBy: { id: userId } as UserEntity, // hanya butuh user.id
        categories: input.category_ids?.map((id) => ({ id })) as any,
        technologies: input.technology_ids?.map((id) => ({ id })) as any,
        analysis: {
          problem_background: input.problem_background,
          project_goal: input.project_goal,
          target_user: input.target_user,
          system_needs: input.system_needs,
        } as any,
        media: media as any,
        members: input.members.map((m) => ({
          user: { id: m.user_id },
          is_leader: m.is_leader,
        })) as any,
      };

      // Simpan project
      const created = await this.projectRepo.create(project);
      if (!created) {
        throw new InternalServerErrorException('Gagal membuat project');
      }

      // Ambil kembali project lengkap
      const complete = await this.projectRepo.findById(created.id);
      if (!complete) {
        throw new InternalServerErrorException(
          'Project tidak ditemukan setelah dibuat',
        );
      }

      const student = complete.createdBy.student_profile;
      if (!student) {
        throw new InternalServerErrorException(
          'Profil mahasiswa tidak ditemukan',
        );
      }

      const publicUrl = process.env.PUBLIC_STORAGE_URL;

      // Return DTO
      return {
        id: complete.id,
        title: complete.title,
        description: complete.description,
        type: complete.type,
        semester: complete.semester,
        created_by: {
          id: complete.createdBy.id,
          user_id: student.user_id,
          nama: student.nama,
          nim: student.nim,
          angkatan: student.angkatan,
          photo_url: student.photo_url
            ? `${publicUrl}${student.photo_url}`
            : null,
          interests: student.interests?.map((i) => i.name) || [],
          technologies: student.technologies?.map((t) => t.name) || [],
        },
        categories: complete.categories?.map((c) => c.name) || [],
        technologies: complete.technologies?.map((t) => t.name) || [],
        analysis: {
          problem_background: complete.analysis.problem_background,
          project_goal: complete.analysis.project_goal,
          target_user: complete.analysis.target_user,
          system_needs: complete.analysis.system_needs,
        },
        media: complete.media.map((m) => ({
          type: m.type,
          title: m.title,
          url: m.url.startsWith('http') ? m.url : `${publicUrl}${m.url}`,
        })),
        members: complete.members.map((m) => ({
          id: m.user.id,
          user_id: m.user.student_profile.user_id,
          nama: m.user.student_profile.nama,
          nim: m.user.student_profile.nim,
          angkatan: m.user.student_profile.angkatan,
          photo_url: m.user.student_profile.photo_url
            ? `${process.env.PUBLIC_STORAGE_URL}${m.user.student_profile.photo_url}`
            : null,
          interests: m.user.student_profile.interests?.map((i) => i.name) || [],
          technologies:
            m.user.student_profile.technologies?.map((t) => t.name) || [],
          is_leader: m.is_leader,
        })),
        created_at: complete.created_at.toISOString(),
        updated_at: complete.updated_at.toISOString(),
      };
    } catch (error) {
      console.error('[USECASE ERROR]', error);
      throw new InternalServerErrorException(
        'Terjadi kesalahan saat membuat project',
      );
    }
  }
}
