import { TechnologyEntity } from '../../domain/entities/technology.entity';

export interface ITechnologyRepository {
  create(data: Partial<TechnologyEntity>): Promise<TechnologyEntity>;
  findAll(): Promise<TechnologyEntity[]>;
  update(
    id: number,
    data: Partial<TechnologyEntity>,
  ): Promise<TechnologyEntity>;
  delete(id: number): Promise<void>;
  findOne(id: number): Promise<TechnologyEntity | null>;
}
