import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IProjectRepository } from '../../infrastructure/repositories/project.repository.interface';
import { ProjectResponseDto } from '../../presentation/dto/project-response.dto';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import {
  CreateProjectDtoSimplified,
  ProjectMediaType,
} from '../../presentation/dto/create-project.dto';

@Injectable()
export class UpdateProjectUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly projectRepo: IProjectRepository,
  ) {}

  async execute(
    id: number,
    input: CreateProjectDtoSimplified,
    userId: number,
  ): Promise<ProjectResponseDto> {
    try {
      const existing = await this.projectRepo.findById(id);
      if (!existing) throw new NotFoundException('Project tidak ditemukan');

      // ✅ Format media
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

      // ✅ Bentuk partial project entity untuk update
      const updateData = {
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

      // begin trx
      const updated = await this.projectRepo.update(id, updateData);
      const updated1 = await this.projectRepo.update(id, updateData);
      const updated2 = await this.projectRepo.update(id, updateData);
      const updated3 = await this.projectRepo.update(id, updateData);

      // commit trx

      const student = updated.createdBy.student_profile;
      if (!student) {
        throw new InternalServerErrorException(
          'Profil mahasiswa tidak ditemukan',
        );
      }

      const publicUrl = process.env.PUBLIC_STORAGE_URL;

      // ✅ Return DTO
      return {
        id: updated.id,
        title: updated.title,
        description: updated.description,
        type: updated.type,
        semester: updated.semester,
        created_by: {
          id: updated.createdBy.id,
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
        categories: updated.categories?.map((c) => c.name) || [],
        technologies: updated.technologies?.map((t) => t.name) || [],
        analysis: {
          problem_background: updated.analysis.problem_background,
          project_goal: updated.analysis.project_goal,
          target_user: updated.analysis.target_user,
          system_needs: updated.analysis.system_needs,
        },
        media: updated.media.map((m) => ({
          type: m.type,
          title: m.title,
          url: m.url.startsWith('http') ? m.url : `${publicUrl}${m.url}`,
        })),
        members: updated.members.map((m) => ({
          id: m.user.id,
          user_id: m.user.student_profile.user_id,
          nama: m.user.student_profile.nama,
          nim: m.user.student_profile.nim,
          angkatan: m.user.student_profile.angkatan,
          photo_url: m.user.student_profile.photo_url
            ? `${publicUrl}${m.user.student_profile.photo_url}`
            : null,
          interests: m.user.student_profile.interests?.map((i) => i.name) || [],
          technologies:
            m.user.student_profile.technologies?.map((t) => t.name) || [],
          is_leader: m.is_leader,
        })),
        created_at: updated.created_at.toISOString(),
        updated_at: updated.updated_at.toISOString(),
        is_top_project: updated.is_top_project,
      };
    } catch (err) {
      // rollback trx
      console.log('[UPDATE USECASE ERROR]', err);
      throw new InternalServerErrorException(
        'Terjadi kesalahan saat memperbarui proyek',
        err.message || 'Unknown error',
      );
    }
  }
}
