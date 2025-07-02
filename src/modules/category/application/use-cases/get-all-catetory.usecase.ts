import { Inject, Injectable } from '@nestjs/common';
import { ICategoryRepository } from '../../infrastructure/repositories/category.repository.interface';
import { CategoryEntity } from '../../domain/entities/category.entity';

@Injectable()
export class GetAllCategoryUseCase {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(): Promise<CategoryEntity[]> {
    // Fetch all categories from the repository
    const categories = await this.categoryRepository.findAll();

    // If no categories found, return an empty array
    if (!categories || categories.length === 0) {
      return [];
    }

    // Return the list of categories
    return categories;
  }
}
