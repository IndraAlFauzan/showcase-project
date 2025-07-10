import { Inject, Injectable } from '@nestjs/common';
import { IProjectRepository } from '../../infrastructure/repositories/project.repository.interface';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { ProjectResponseDto } from '../../presentation/dto/project-response.dto';

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

  private toDto(complete): ProjectResponseDto {
    return {
      id: complete.id,
      title: complete.title,
      description: complete.description,
      type: complete.type,
      semester: complete.semester,
      created_by: {
        id: complete.createdBy.id,
        email: complete.createdBy.email,
      },
      categories: complete.categories?.map((c) => c.name) || [],
      technologies: complete.technologies?.map((t) => t.name) || [],
      analysis: {
        problem_background: complete.problem_background,
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
        name: m.user.name,
        email: m.user.email,
        is_leader: m.is_leader,
      })),
      created_at: complete.created_at.toISOString(),
      updated_at: complete.updated_at.toISOString(),
    };
  }
}
