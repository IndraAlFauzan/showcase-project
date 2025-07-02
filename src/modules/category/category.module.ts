import { Delete, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './domain/entities/category.entity';
import { CategoryController } from './presentation/controllers/category.controller';
import { CreateCategoryUseCase } from './application/use-cases/create-catetory.usecase';
import { UpdateCategoryUseCase } from './application/use-cases/update-catetory.usecase';
import { DeleteCategoryUseCase } from './application/use-cases/delete-catetory.usecase';
import { GetAllCategoryUseCase } from './application/use-cases/get-all-catetory.usecase';
import { CategoryRepository } from './infrastructure/repositories/category.repository';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [
    CategoryRepository,
    {
      provide: 'ICategoryRepository',
      useClass: CategoryRepository,
    },
    CreateCategoryUseCase,
    DeleteCategoryUseCase,
    GetAllCategoryUseCase,
    UpdateCategoryUseCase,
  ],
  exports: [],
})
export class CategoryModule {}
