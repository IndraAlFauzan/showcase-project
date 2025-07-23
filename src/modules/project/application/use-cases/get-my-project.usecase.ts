import { Inject, Injectable } from '@nestjs/common';
import { IProjectRepository } from '../../infrastructure/repositories/project.repository.interface';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { ProjectResponseDto } from '../../presentation/dto/project-response.dto';
import { ProjectEntity } from '../../domain/entities/project.entity';

@Injectable()
export class GetMyProjectsUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly projectRepo: IProjectRepository,
  ) {}

  async execute(id: number): Promise<ProjectResponseDto[]> {
    try {
      const projects = await this.projectRepo.findByUserId(id);
      return projects.map((project) => this.toDto(project));
    } catch (error) {
      console.error('[USECASE ERROR]', error);
      throw error;
    }
  }

  private toDto(complete: ProjectEntity): ProjectResponseDto {
    return {
      id: complete.id,
      title: complete.title,
      description: complete.description,
      type: complete.type,
      semester: complete.semester,
      created_by: {
        id: complete.createdBy.id,
        user_id: complete.createdBy.id,

        nama: complete.createdBy.student_profile.nama,
        nim: complete.createdBy.student_profile.nim,
        angkatan: complete.createdBy.student_profile.angkatan,
        photo_url: complete.createdBy.student_profile.photo_url
          ? `${process.env.PUBLIC_STORAGE_URL}${complete.createdBy.student_profile.photo_url}`
          : null,
        interests:
          complete.createdBy.student_profile.interests?.map((i) => i.name) ||
          [],
        technologies:
          complete.createdBy.student_profile.technologies?.map((t) => t.name) ||
          [],
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
        url: m.url.startsWith('http')
          ? m.url
          : `${process.env.PUBLIC_STORAGE_URL}${m.url}`,
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
  }
}
