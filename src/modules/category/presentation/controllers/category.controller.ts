import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CreateCategoryUseCase } from '../../application/use-cases/create-catetory.usecase';
import { GetAllCategoryUseCase } from '../../application/use-cases/get-all-catetory.usecase';
import { UpdateCategoryUseCase } from '../../application/use-cases/update-catetory.usecase';
import { DeleteCategoryUseCase } from '../../application/use-cases/delete-catetory.usecase';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';

@Controller('categories')
@UseGuards(JwtAuthGuard, RoleGuard)
export class CategoryController {
  constructor(
    private readonly createUseCase: CreateCategoryUseCase,
    private readonly getAllUseCase: GetAllCategoryUseCase,
    private readonly updateUseCase: UpdateCategoryUseCase,
    private readonly deleteUseCase: DeleteCategoryUseCase,
  ) {}

  @Post()
  @Roles('admin', 'dosen')
  async create(@Body() dto: CreateCategoryDto) {
    const result = await this.createUseCase.execute(dto);
    return {
      status_code: 201,
      message: 'Kategori berhasil dibuat',
      data: result,
    };
  }

  @Get()
  @Roles('mahasiswa', 'admin', 'dosen')
  async findAll() {
    const result = await this.getAllUseCase.execute();
    return {
      status_code: 200,
      message: 'Daftar kategori',
      data: result,
    };
  }

  @Patch(':id')
  @Roles('admin', 'dosen')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    const result = await this.updateUseCase.execute(id, dto);
    return {
      status_code: 200,
      message: 'Kategori berhasil diperbarui',
      data: result,
    };
  }

  @Delete(':id')
  @Roles('admin', 'dosen')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteUseCase.execute(id);
    return {
      status_code: 200,
      message: 'Kategori berhasil dihapus',
      data: null,
    };
  }
}
