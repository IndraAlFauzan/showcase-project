import { CategoryEntity } from '../../domain/entities/category.entity';

export interface ICategoryRepository {
  create(data: Partial<CategoryEntity>): Promise<CategoryEntity>;
  findAll(): Promise<CategoryEntity[]>;
  update(id: number, data: Partial<CategoryEntity>): Promise<CategoryEntity>;
  delete(id: number): Promise<void>;
  findOne(id: number): Promise<CategoryEntity | null>;
}
