// modules/project/application/use-cases/get-all-projects.usecase.ts
import { Inject, Injectable } from '@nestjs/common';
import { IProjectRepository } from '../../infrastructure/repositories/project.repository.interface';
import { ProjectEntity } from '../../domain/entities/project.entity';
import { ProjectResponseDto } from '../../presentation/dto/project-response.dto';

@Injectable()
export class GetAllProjectsUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly projectRepo: IProjectRepository,
  ) {}

  async execute(): Promise<ProjectResponseDto[]> {
    try {
      const projects: ProjectEntity[] =
        await this.projectRepo.findAllWithDetails();
      return projects.map((project) => this.toDto(project));
    } catch (error) {
      console.error('[USECASE ERROR]', error);
      throw error;
    }
  }

  private toDto(project: ProjectEntity): ProjectResponseDto {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      type: project.type,
      semester: project.semester,
      created_at: project.created_at.toISOString(),
      updated_at: project.updated_at.toISOString(),
      created_by: {
        id: project.createdBy.id,
        user_id: project.createdBy.student_profile.user_id,
        nama: project.createdBy.student_profile.nama,
        nim: project.createdBy.student_profile.nim,
        angkatan: project.createdBy.student_profile.angkatan,
        photo_url: project.createdBy.student_profile.photo_url
          ? `${process.env.PUBLIC_STORAGE_URL}${project.createdBy.student_profile.photo_url}`
          : null,
        interests:
          project.createdBy.student_profile.interests?.map((i) => i.name) || [],
        technologies:
          project.createdBy.student_profile.technologies?.map((t) => t.name) ||
          [],
      },
      categories: project.categories?.map((c) => c.name) || [],
      technologies: project.technologies?.map((t) => t.name) || [],
      analysis: {
        problem_background: project.analysis?.problem_background || '',
        project_goal: project.analysis?.project_goal || '',
        target_user: project.analysis?.target_user || '',
        system_needs: project.analysis?.system_needs || '',
      },
      media:
        project.media?.map((m) => ({
          type: m.type,
          title: m.title,
          url: m.url?.startsWith('http')
            ? m.url
            : `${process.env.PUBLIC_STORAGE_URL}${m.url}`,
        })) || [],
      members: project.members.map((m) => ({
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
      is_top_project: project.is_top_project,
    };
  }
}
