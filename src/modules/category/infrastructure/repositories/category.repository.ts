import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { ICategoryRepository } from './category.repository.interface';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repo: Repository<CategoryEntity>,
  ) {}

  async create(data: Partial<CategoryEntity>): Promise<CategoryEntity> {
    const category = this.repo.create(data);
    return this.repo.save(category);
  }

  async findAll(): Promise<CategoryEntity[]> {
    return this.repo.find();
  }

  async update(
    id: number,
    data: Partial<CategoryEntity>,
  ): Promise<CategoryEntity> {
    await this.repo.update(id, data);
    return this.repo.findOneByOrFail({ id });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async findOne(id: number): Promise<CategoryEntity | null> {
    return this.repo.findOneBy({ id });
  }
}
