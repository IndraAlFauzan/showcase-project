import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { CreateExpertiseUseCase } from '../../application/use-cases/create-expertise.usecase';
import { GetAllExpertiseUseCase } from '../../application/use-cases/get-all-expertise.usecase';
import { UpdateExpertiseUseCase } from '../../application/use-cases/update-expertise.usecase';
import { DeleteExpertiseUseCase } from '../../application/use-cases/delete-expertise.usecase';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UpdateCategoryDto } from 'src/modules/category/presentation/dto/update-category.dto';
import { CreateExpertiseDto } from '../dto/create-expertrise.dto';
import { UpdateExpertiseDto } from '../dto/update-expertrise.dto';

@Controller('expertise')
@UseGuards(JwtAuthGuard, RoleGuard)
export class ExpertiseController {
  constructor(
    private readonly createUseCase: CreateExpertiseUseCase,
    private readonly getAllUseCase: GetAllExpertiseUseCase,
    private readonly updateUseCase: UpdateExpertiseUseCase,
    private readonly deleteUseCase: DeleteExpertiseUseCase,
  ) {}

  @Post()
  @Roles('admin', 'dosen')
  async createExpertise(@Body() dto: CreateExpertiseDto) {
    const result = await this.createUseCase.execute(dto);
    return {
      status_code: 201,
      message: 'Expertise berhasil dibuat',
      data: result,
    };
  }

  @Get()
  @Roles('mahasiswa', 'admin', 'dosen')
  async findAllExpertise() {
    const result = await this.getAllUseCase.execute();
    return {
      status_code: 200,
      message: 'Daftar expertise',
      data: result,
    };
  }

  @Patch(':id')
  @Roles('admin', 'dosen')
  async updateExpertise(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExpertiseDto,
  ) {
    const result = await this.updateUseCase.execute(id, dto);
    return {
      status_code: 200,
      message: 'Expertise berhasil diperbarui',
      data: result,
    };
  }

  @Delete(':id')
  @Roles('admin', 'dosen')
  async deleteExpertise(@Param('id', ParseIntPipe) id: number) {
    await this.deleteUseCase.execute(id);
    return {
      status_code: 200,
      message: 'Expertise berhasil dihapus',
    };
  }
}
