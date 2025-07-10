import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IProjectRepository } from '../../infrastructure/repositories/project.repository.interface';
import { ProjectEntity } from '../../domain/entities/project.entity';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import {
  CreateProjectDtoSimplified,
  ProjectMediaType,
} from '../../presentation/dto/create-project.dto';
import { ProjectResponseDto } from '../../presentation/dto/project-response.dto';

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
    const user = new UserEntity();
    user.id = userId;

    const media: {
      type: ProjectMediaType;
      title: string;
      url: string;
    }[] = [];

    if (input.images?.length) {
      media.push(
        ...input.images.map((img) => ({
          type: ProjectMediaType.IMAGE,
          title: img.title,
          url: img.url,
        })),
      );
    }

    if (input.github) {
      media.push({
        type: ProjectMediaType.REPO,
        title: 'Github',
        url: input.github,
      });
    }

    if (input.demo) {
      media.push({
        type: ProjectMediaType.DEMO,
        title: 'Demo',
        url: input.demo,
      });
    }

    const project: Partial<ProjectEntity> = {
      title: input.title,
      description: input.description,
      type: input.type,
      semester: input.semester,
      createdBy: user,
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

    const created = await this.projectRepo.create(project);
    if (!created) {
      throw new InternalServerErrorException('Gagal membuat project');
    }

    const complete = await this.projectRepo.findById(created.id);
    if (!complete) {
      throw new InternalServerErrorException(
        'Project tidak ditemukan setelah dibuat',
      );
    }

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
        problem_background: complete.analysis.problem_background,
        project_goal: complete.analysis.project_goal,
        target_user: complete.analysis.target_user,
        system_needs: complete.analysis.system_needs,
      },
      media: complete.media.map((m) => ({
        type: m.type,
        title: m.title,
        url: `${process.env.PUBLIC_STORAGE_URL}${m.url}`,
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
