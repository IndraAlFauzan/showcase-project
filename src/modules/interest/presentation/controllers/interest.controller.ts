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

import { Roles } from 'src/shared/decorators/roles.decorator';
import { UpdateCategoryDto } from 'src/modules/category/presentation/dto/update-category.dto';
import { CreateInterestUseCase } from '../../application/use-cases/create-interest.usecase';
import { GetAllInterestUseCase } from '../../application/use-cases/get-all-interest.usecase';
import { UpdateInterestUseCase } from '../../application/use-cases/update-interest.usecase';
import { DeleteInterestUseCase } from '../../application/use-cases/delete-interest.usecase';
import { CreateInterestDto } from '../dto/create-interest.dto';
import { UpdateInterestDto } from '../dto/update-interest.dto';

@Controller('interest')
@UseGuards(JwtAuthGuard, RoleGuard)
export class InterestController {
  constructor(
    private readonly createUseCase: CreateInterestUseCase,
    private readonly getAllUseCase: GetAllInterestUseCase,
    private readonly updateUseCase: UpdateInterestUseCase,
    private readonly deleteUseCase: DeleteInterestUseCase,
  ) {}

  @Post()
  @Roles('admin', 'dosen')
  async createInterest(@Body() dto: CreateInterestDto) {
    const result = await this.createUseCase.execute(dto);
    return {
      status_code: 201,
      message: 'Interest berhasil dibuat',
      data: result,
    };
  }

  @Get()
  @Roles('mahasiswa', 'admin', 'dosen')
  async findAllInterest() {
    const result = await this.getAllUseCase.execute();
    return {
      status_code: 200,
      message: 'Daftar Interest',
      data: result,
    };
  }

  @Patch(':id')
  @Roles('admin', 'dosen')
  async updateInterest(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInterestDto,
  ) {
    const result = await this.updateUseCase.execute(id, dto);
    return {
      status_code: 200,
      message: 'Interest berhasil diperbarui',
      data: result,
    };
  }

  @Delete(':id')
  @Roles('admin', 'dosen')
  async deleteInterest(@Param('id', ParseIntPipe) id: number) {
    await this.deleteUseCase.execute(id);
    return {
      status_code: 200,
      message: 'Interest berhasil dihapus',
    };
  }
}
