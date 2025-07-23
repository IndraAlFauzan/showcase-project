// src/modules/project/controller/project-public.controller.ts
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { GetAllProjectsUseCase } from '../../application/use-cases/get-all-project.usecase';

@Controller('projects')
export class ProjectPublicController {
  constructor(private readonly getAllProjects: GetAllProjectsUseCase) {}

  @Get('all')
  async getAllProjectsHandler() {
    const result = await this.getAllProjects.execute();
    return {
      status_code: HttpStatus.OK,
      message: 'All projects fetched successfully',
      data: result,
    };
  }
}
