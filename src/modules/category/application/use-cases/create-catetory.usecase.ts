import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ICategoryRepository } from '../../infrastructure/repositories/category.repository.interface';
import { CreateCategoryDto } from '../../presentation/dto/create-category.dto';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject('ICategoryRepository')
    private readonly repo: ICategoryRepository,
  ) {}

  async execute(dto: CreateCategoryDto) {
    try {
      return await this.repo.create(dto);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException('Kategori sudah ada');
      }
      throw error;
    }
  }
}
