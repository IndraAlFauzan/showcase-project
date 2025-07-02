import { Inject, Injectable } from '@nestjs/common';
import { ICategoryRepository } from '../../infrastructure/repositories/category.repository.interface';
import { CategoryEntity } from '../../domain/entities/category.entity';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(
    id: number,
    data: Partial<CategoryEntity>,
  ): Promise<CategoryEntity> {
    // Check if the category exists
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }

    // Proceed to update the category
    return this.categoryRepository.update(id, data);
  }
}
