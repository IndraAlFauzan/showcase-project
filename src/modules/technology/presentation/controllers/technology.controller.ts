import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { CreateTechnologyUseCase } from '../../application/use-cases/create-technology.usecase';
import { GetAllTechnologyUseCase } from '../../application/use-cases/get-all-technology.usecase';
import { UpdateTechnologyUseCase } from '../../application/use-cases/update-technology.usecase';
import { DeleteTechnologyUseCase } from '../../application/use-cases/delete-technology.usecase';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { CreateTechnologyDto } from '../dto/create-technology.dto';

@Controller('technology')
@UseGuards(JwtAuthGuard, RoleGuard)
export class TechnologyController {
  constructor(
    private readonly createUseCase: CreateTechnologyUseCase,
    private readonly getAllUseCase: GetAllTechnologyUseCase,
    private readonly updateUseCase: UpdateTechnologyUseCase,
    private readonly deleteUseCase: DeleteTechnologyUseCase,
  ) {}

  @Post()
  @Roles('admin', 'dosen')
  async create(@Body() dto: CreateTechnologyDto) {
    const result = await this.createUseCase.execute(dto);
    return {
      status_code: 201,
      message: 'Technology berhasil dibuat',
      data: result,
    };
  }

  @Get()
  @Roles('mahasiswa', 'admin', 'dosen')
  async findAll() {
    const result = await this.getAllUseCase.execute();
    return {
      status_code: 200,
      message: 'Daftar technology',
      data: result,
    };
  }

  @Patch(':id')
  @Roles('admin', 'dosen')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateTechnologyDto,
  ) {
    const result = await this.updateUseCase.execute(id, dto);
    return {
      status_code: 200,
      message: 'Technology berhasil diperbarui',
      data: result,
    };
  }

  @Post(':id')
  @Roles('admin', 'dosen')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteUseCase.execute(id);
    return {
      status_code: 200,
      message: 'Technology berhasil dihapus',
      data: null,
    };
  }
}
