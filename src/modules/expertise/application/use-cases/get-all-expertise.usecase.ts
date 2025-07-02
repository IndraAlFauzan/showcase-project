import { Inject, Injectable } from '@nestjs/common';
import { IExpertiseRepository } from '../../infrastructure/repositories/expertise.repository.interface';
import { CategoryEntity } from 'src/modules/category/domain/entities/category.entity';

@Injectable()
export class GetAllExpertiseUseCase {
  constructor(
    @Inject('IExpertiseRepository')
    private readonly repo: IExpertiseRepository,
  ) {}

  async execute(): Promise<CategoryEntity[]> {
    // Fetch all expertise from the repository
    const expertise = await this.repo.findAll();

    // If no expertise found, return an empty array
    if (!expertise || expertise.length === 0) {
      return [];
    }

    // Return the list of expertise
    return expertise;
  }
}
