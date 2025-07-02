import { Inject, Injectable } from '@nestjs/common';
import { ICategoryRepository } from '../../infrastructure/repositories/category.repository.interface';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(id: number): Promise<void> {
    // Check if the category exists
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }
    // Proceed to delete the category
    await this.categoryRepository.delete(id);
    console.log(`Category with id ${id} deleted successfully`);
    return;
  }
}
