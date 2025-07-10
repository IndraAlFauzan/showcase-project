import { ProjectEntity } from '../../domain/entities/project.entity';

export interface IProjectRepository {
  create(data: Partial<ProjectEntity>): Promise<ProjectEntity>;
  findById(id: number): Promise<ProjectEntity | null>;
  findAll(): Promise<ProjectEntity[]>;
  findByUserId(userId: number): Promise<ProjectEntity[]>;
  update(id: number, data: Partial<ProjectEntity>): Promise<ProjectEntity>;
  delete(id: number): Promise<void>;
}
