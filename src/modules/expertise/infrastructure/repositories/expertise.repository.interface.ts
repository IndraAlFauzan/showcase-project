import { ExpertiseEntity } from '../../domain/entities/expertise.entity';

export interface IExpertiseRepository {
  create(data: Partial<ExpertiseEntity>): Promise<ExpertiseEntity>;
  findAll(): Promise<ExpertiseEntity[]>;
  update(id: number, data: Partial<ExpertiseEntity>): Promise<ExpertiseEntity>;
  delete(id: number): Promise<void>;
  findOne(id: number): Promise<ExpertiseEntity | null>;
}
